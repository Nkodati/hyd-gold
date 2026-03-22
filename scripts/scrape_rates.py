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
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
    "Cache-Control": "no-cache",
    "Referer": "https://groww.in/",
}

CITY_CONFIG = {
    "chennai": {
        "name": "Chennai",
        "url": "https://groww.in/gold-rates/gold-rate-today-in-chennai",
    },
    "hyderabad": {
        "name": "Hyderabad",
        "url": "https://groww.in/gold-rates/gold-rate-today-in-hyderabad",
    },
    "bangalore": {
        "name": "Bangalore",
        "url": "https://groww.in/gold-rates/gold-rate-today-in-bangalore",
    },
    "ahmedabad": {
        "name": "Ahmedabad",
        "url": "https://groww.in/gold-rates/gold-rate-today-in-ahmedabad",
    },
}


def now_ist() -> datetime:
    from datetime import timezone, timedelta
    ist = timezone(timedelta(minutes=IST_OFFSET_MINUTES))
    return datetime.now(ist)


def load_existing(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def parse_inr(text: str) -> Optional[float]:
    cleaned = re.sub(r"[₹,\s]", "", text)
    try:
        return float(cleaned)
    except ValueError:
        return None


def scrape_groww_city(url: str, city_name: str) -> Optional[Dict[str, float]]:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)
        resp.raise_for_status()
    except Exception as e:
        print(f"  ERROR fetching {city_name}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "lxml")
    rates: Dict[str, float] = {}
    found_prices = []

    # Primary: find exactly "1 Gram" rows in tables
    # Filter price to 1000–50000 to exclude per-10g values
    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cells = [td.get_text(strip=True) for td in row.find_all("td")]
            if not cells:
                continue
            if cells[0].strip().lower() == "1 gram" and len(cells) >= 2:
                price = parse_inr(cells[1])
                if price and 1000 < price < 50000:
                    found_prices.append(price)

    # Fallback: regex on full page text
    if len(found_prices) < 2:
        page_text = soup.get_text(" ", strip=True)
        matches = re.findall(r"1\s*Gram\s*₹\s*([\d,]+\.?\d*)", page_text)
        for m in matches:
            p = parse_inr(m)
            if p and 1000 < p < 50000:
                found_prices.append(p)

    # Deduplicate
    found_prices = list(dict.fromkeys(found_prices))

    if len(found_prices) >= 2:
        found_prices_sorted = sorted(found_prices, reverse=True)
        rates["24k"] = found_prices_sorted[0]
        rates["22k"] = found_prices_sorted[1]
    elif len(found_prices) == 1:
        rates["24k"] = found_prices[0]
        rates["22k"] = round((found_prices[0] / 999) * 916, 2)

    if "22k" not in rates or "24k" not in rates:
        print(f"  ERROR: Could not extract rates for {city_name}")
        return None

    # Derive 18K from 22K using purity ratio
    rates["18k"] = round((rates["22k"] / 916) * 750, 2)

    # Derive silver (~1.9% of 24K per gram)
    rates["silver"] = round(rates["24k"] * 0.019, 2)

    print(f"  {city_name}: 22K=₹{rates['22k']:.0f}  "
          f"24K=₹{rates['24k']:.0f}  "
          f"18K=₹{rates['18k']:.0f}  "
          f"Silver=₹{rates['silver']:.2f}")
    return rates


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

    existing_cities = existing.get("cities", {})
    new_cities: Dict[str, Any] = {}
    failed: List[str] = []

    for city_key, config in CITY_CONFIG.items():
        print(f"\nScraping {config['name']} from Groww...")
        per_gram = scrape_groww_city(config["url"], config["name"])

        if per_gram is None:
            print(f"  FAILED: Keeping existing rates for {config['name']}")
            failed.append(config["name"])
            if city_key in existing_cities:
                new_cities[city_key] = existing_cities[city_key]
            continue

        old_rates = existing_cities.get(city_key, {}).get("rates", {})
        existing_trend = existing_cities.get(city_key, {}).get("monthlyTrend", {})

        new_cities[city_key] = build_city_block(
            per_gram, old_rates, existing_trend, date_label, config["name"]
        )

    if not new_cities:
        print("\nERROR: All cities failed.", file=sys.stderr)
        return 1

    payload = {
        "lastUpdated": last_updated,
        "cities": new_cities,
    }

    rates_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"\nrates.json updated successfully. Failed: {failed if failed else 'none'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())