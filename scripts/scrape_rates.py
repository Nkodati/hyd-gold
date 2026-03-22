import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List

import requests
from bs4 import BeautifulSoup

IST_OFFSET_MINUTES = 5 * 60 + 30
REQUEST_TIMEOUT_SECONDS = 25
IBJA_URL = "https://ibjarates.com/index.aspx"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
    "Cache-Control": "no-cache",
}

# City premiums over IBJA 22K benchmark (per gram)
CITY_CONFIG = {
    "chennai":   { "name": "Chennai",   "premium": 170 },
    "hyderabad": { "name": "Hyderabad", "premium": 0   },
    "bangalore": { "name": "Bangalore", "premium": 60  },
    "ahmedabad": { "name": "Ahmedabad", "premium": 30  },
}


def now_ist() -> datetime:
    from datetime import timezone, timedelta
    ist = timezone(timedelta(minutes=IST_OFFSET_MINUTES))
    return datetime.now(ist)


def is_weekend() -> bool:
    """IBJA does not publish on Saturday (5) or Sunday (6)."""
    return now_ist().weekday() >= 5


def load_existing(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def fetch_ibja() -> Optional[Dict[str, float]]:
    """
    Fetch IBJA rates page and extract purity rates from h3 tags.
    IBJA shows rates like:
      999 Purity  → h3: "14722 (1 Gram)"   ← 24K
      916 Purity  → h3: "13485 (1 Gram)"   ← 22K
      750 Purity  → h3: "11041 (1 Gram)"   ← 18K
      Silver 999  → historical table, per 10g
    """
    try:
        resp = requests.get(IBJA_URL, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)
        resp.raise_for_status()
    except Exception as e:
        print(f"ERROR: Could not fetch IBJA page: {e}", file=sys.stderr)
        return None

    soup = BeautifulSoup(resp.text, "lxml")

    # Extract purity rates from h3 tags — format: "14722 (1 Gram)"
    purity_rates: Dict[str, float] = {}
    purity_map = {"999": "24k", "995": None, "916": "22k", "750": "18k", "585": None}

    # Find all purity headings and their associated h3 rate values
    page_text = soup.get_text(" ", strip=True)

    for purity, karat_key in purity_map.items():
        if karat_key is None:
            continue
        # Match pattern like "13485 (1 Gram)" near purity text
        pattern = rf"{purity}\s*Purity[\s\S]{{0,100}}?(\d{{4,6}})\s*\(1\s*Gram\)"
        m = re.search(pattern, page_text, re.IGNORECASE)
        if m:
            purity_rates[karat_key] = float(m.group(1))
            print(f"  IBJA {purity} ({karat_key}): ₹{m.group(1)}/g")

    # If regex on full text fails, try h3 tags directly
    if len(purity_rates) < 2:
        purity_rates = {}
        h3_tags = soup.find_all("h3")
        rate_values = []
        for h3 in h3_tags:
            m = re.search(r"(\d{4,6})\s*\(1\s*Gram\)", h3.get_text())
            if m:
                rate_values.append(float(m.group(1)))

        # IBJA shows in order: 999, 995, 916, 750, 585
        karat_order = ["24k", None, "22k", "18k", None]
        for i, karat in enumerate(karat_order):
            if karat and i < len(rate_values):
                purity_rates[karat] = rate_values[i]
                print(f"  IBJA fallback {karat}: ₹{rate_values[i]}/g")

    if "22k" not in purity_rates or "24k" not in purity_rates:
        print("ERROR: Could not extract 22K/24K rates from IBJA.", file=sys.stderr)
        return None

    # Extract silver from historical table — "Silver 999" column, per 10g
    silver_per_gram = None
    tables = soup.find_all("table")
    for table in tables:
        headers = [th.get_text(strip=True).lower() for th in table.find_all("th")]
        if not any("silver" in h for h in headers):
            continue
        # Find silver column index
        silver_idx = next((i for i, h in enumerate(headers) if "silver" in h), None)
        if silver_idx is None:
            continue
        # Get first data row
        rows = table.find_all("tr")
        for row in rows:
            cells = [td.get_text(strip=True) for td in row.find_all("td")]
            if len(cells) > silver_idx:
                raw = cells[silver_idx].replace(",", "")
                m = re.search(r"(\d{4,7})", raw)
                if m:
                    # Silver is per 10g in IBJA table — divide by 10
                    silver_per_gram = float(m.group(1)) / 10.0
                    print(f"  IBJA Silver: ₹{silver_per_gram}/g")
                    break
        if silver_per_gram:
            break

    # Fallback silver: ~1.9% of 24K per gram
    if not silver_per_gram:
        silver_per_gram = purity_rates["24k"] * 0.019
        print(f"  Silver fallback (derived): ₹{silver_per_gram:.0f}/g")

    purity_rates["silver"] = silver_per_gram
    return purity_rates


def apply_city_premium(ibja_rates: Dict[str, float], premium: int) -> Dict[str, float]:
    """
    Apply city premium to 22K and derive other karats proportionally.
    24K = (22K + premium) / 916 * 999
    18K = (22K + premium) / 916 * 750
    """
    base_22k = ibja_rates["22k"] + premium
    base_24k = (base_22k / 916) * 999
    base_18k = (base_22k / 916) * 750

    return {
        "22k": round(base_22k, 2),
        "24k": round(base_24k, 2),
        "18k": round(base_18k, 2),
        "silver": round(ibja_rates["silver"], 2),
    }


def old_pg(old_rates: Dict[str, Any], key: str) -> Optional[float]:
    try:
        v = old_rates.get(key, {}).get("perGram")
        return float(v) if v is not None else None
    except Exception:
        return None


def compute_change(new: float, old: Optional[float]) -> int:
    return int(round(new - old)) if old is not None else 0


def update_trend(
    existing_trend: Dict[str, Any],
    date_label: str,
    per_gram: Dict[str, float],
    max_points: int = 30,
) -> Dict[str, Any]:
    labels: List[str] = list(existing_trend.get("labels") or [])
    arr_22: List[float] = list(existing_trend.get("22k") or [])
    arr_24: List[float] = list(existing_trend.get("24k") or [])
    arr_18: List[float] = list(existing_trend.get("18k") or [])

    if labels and labels[-1] == date_label:
        labels.pop()
        if arr_22: arr_22.pop()
        if arr_24: arr_24.pop()
        if arr_18: arr_18.pop()

    labels.append(date_label)
    arr_22.append(round(per_gram["22k"]))
    arr_24.append(round(per_gram["24k"]))
    arr_18.append(round(per_gram["18k"]))

    return {
        "labels": labels[-max_points:],
        "22k": arr_22[-max_points:],
        "24k": arr_24[-max_points:],
        "18k": arr_18[-max_points:],
    }


def build_city_block(
    per_gram: Dict[str, float],
    old_rates: Dict[str, Any],
    existing_trend: Dict[str, Any],
    date_label: str,
    city_name: str,
) -> Dict[str, Any]:
    return {
        "name": city_name,
        "rates": {
            "22k": {
                "perGram": int(round(per_gram["22k"])),
                "per10g": int(round(per_gram["22k"] * 10)),
                "change": compute_change(per_gram["22k"], old_pg(old_rates, "22k")),
            },
            "24k": {
                "perGram": int(round(per_gram["24k"])),
                "per10g": int(round(per_gram["24k"] * 10)),
                "change": compute_change(per_gram["24k"], old_pg(old_rates, "24k")),
            },
            "18k": {
                "perGram": int(round(per_gram["18k"])),
                "per10g": int(round(per_gram["18k"] * 10)),
                "change": compute_change(per_gram["18k"], old_pg(old_rates, "18k")),
            },
            "silver": {
                "perGram": int(round(per_gram["silver"])),
                "perKg": int(round(per_gram["silver"] * 1000)),
                "change": compute_change(per_gram["silver"], old_pg(old_rates, "silver")),
            },
        },
        "monthlyTrend": update_trend(existing_trend, date_label, per_gram),
    }


def main() -> int:
    project_root = Path(__file__).resolve().parents[1]
    rates_path = project_root / "public" / "rates.json"
    existing = load_existing(rates_path)

    ist_now = now_ist()
    date_label = ist_now.strftime("%b %d")
    last_updated = ist_now.isoformat()

    # IBJA does not publish on weekends — keep existing rates, exit cleanly
    if is_weekend():
        print(f"Today is a weekend. IBJA does not publish rates. Keeping existing rates.")
        return 0

    print("Fetching IBJA rates...")
    ibja_rates = fetch_ibja()

    if ibja_rates is None:
        print("ERROR: Could not fetch IBJA rates.", file=sys.stderr)
        return 1

    existing_cities = existing.get("cities", {})
    new_cities: Dict[str, Any] = {}

    for city_key, config in CITY_CONFIG.items():
        print(f"\nBuilding {config['name']} rates (premium: +₹{config['premium']}/g)...")
        per_gram = apply_city_premium(ibja_rates, config["premium"])

        old_rates = existing_cities.get(city_key, {}).get("rates", {})
        existing_trend = existing_cities.get(city_key, {}).get("monthlyTrend", {})

        new_cities[city_key] = build_city_block(
            per_gram, old_rates, existing_trend, date_label, config["name"]
        )

        r = new_cities[city_key]["rates"]
        print(f"  22K: ₹{r['22k']['perGram']}/g  "
              f"24K: ₹{r['24k']['perGram']}/g  "
              f"18K: ₹{r['18k']['perGram']}/g  "
              f"Silver: ₹{r['silver']['perGram']}/g")

    payload = {
        "lastUpdated": last_updated,
        "cities": new_cities,
    }

    rates_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"\nrates.json updated successfully at {last_updated}")
    return 0


if __name__ == "__main__":
    sys.exit(main())