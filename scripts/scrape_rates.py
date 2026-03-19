import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, List

import requests
from bs4 import BeautifulSoup


GOODRETURNS_URL = "https://www.goodreturns.in/gold-rates/hyderabad.html"
BANKBAZAAR_URL = "https://www.bankbazaar.com/gold-rate/hyderabad.html"

IST_OFFSET_MINUTES = 5 * 60 + 30  # UTC+5:30


def now_ist() -> datetime:
    # Avoid needing pytz; manually apply fixed IST offset.
    from datetime import timezone, timedelta

    ist = timezone(timedelta(minutes=IST_OFFSET_MINUTES))
    return datetime.now(ist)


def load_existing_rates(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def parse_price(text: str) -> Optional[float]:
    # Extract first numeric token from a string like "₹ 5,123 / 10 gram"
    import re

    cleaned = text.replace(",", "")
    m = re.search(r"(\d+(\.\d+)?)", cleaned)
    if not m:
        return None
    try:
        return float(m.group(1))
    except ValueError:
        return None


def scrape_goodreturns() -> Optional[Dict[str, float]]:
    try:
        resp = requests.get(GOODRETURNS_URL, timeout=20)
        resp.raise_for_status()
    except Exception:
        return None

    soup = BeautifulSoup(resp.text, "lxml")

    # GoodReturns typically has a table with headings like "22 Carat Gold Rate"
    rates: Dict[str, float] = {}

    # Try to find any table that has "22 Carat", "24 Carat", etc.
    for table in soup.find_all("table"):
        headings = [th.get_text(strip=True).lower() for th in table.find_all("th")]
        if not any("22" in h and "carat" in h for h in headings):
            continue

        # Look for rows containing "22 Carat", "24 Carat", "18 Carat"
        for row in table.find_all("tr"):
            cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
            if not cells:
                continue
            label = cells[0].lower()
            if ("22" in label and "carat" in label) or "22k" in label:
                price = parse_price(" ".join(cells[1:]))
                if price:
                    rates["22k"] = price
            elif ("24" in label and "carat" in label) or "24k" in label:
                price = parse_price(" ".join(cells[1:]))
                if price:
                    rates["24k"] = price
            elif ("18" in label and "carat" in label) or "18k" in label:
                price = parse_price(" ".join(cells[1:]))
                if price:
                    rates["18k"] = price

    # Interpret scraped price as per 10g if it looks large, per-gram if small.
    # We'll normalize to per-gram in the final builder.
    return rates or None


def scrape_bankbazaar() -> Optional[Dict[str, float]]:
    try:
        resp = requests.get(BANKBAZAAR_URL, timeout=20)
        resp.raise_for_status()
    except Exception:
        return None

    soup = BeautifulSoup(resp.text, "lxml")
    rates: Dict[str, float] = {}

    # BankBazaar usually has a table with "24 Karat Gold Rate", etc.
    for table in soup.find_all("table"):
        headings = [th.get_text(strip=True).lower() for th in table.find_all("th")]
        if not any("karat" in h or "carat" in h for h in headings):
            continue

        for row in table.find_all("tr"):
            cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
            if not cells:
                continue
            label = cells[0].lower()
            if ("22" in label and ("karat" in label or "carat" in label)) or "22k" in label:
                price = parse_price(" ".join(cells[1:]))
                if price:
                    rates["22k"] = price
            elif ("24" in label and ("karat" in label or "carat" in label)) or "24k" in label:
                price = parse_price(" ".join(cells[1:]))
                if price:
                    rates["24k"] = price
            elif ("18" in label and ("karat" in label or "carat" in label)) or "18k" in label:
                price = parse_price(" ".join(cells[1:]))
                if price:
                    rates["18k"] = price

    return rates or None


def normalize_to_per_gram(raw_rates: Dict[str, float]) -> Dict[str, float]:
    # Heuristic: if the value is > 2000, assume it's per 10g, convert to per gram.
    normalized = {}
    for key, value in raw_rates.items():
        if value > 2000:
            normalized[key] = value / 10.0
        else:
            normalized[key] = value
    return normalized


def derive_missing_and_silver(per_gram: Dict[str, float]) -> Dict[str, float]:
    # Ensure we have 22k and 24k if at all possible, then derive 18k and silver.
    # Derive 18k if missing: (22K / 22) * 18
    result = dict(per_gram)

    if "22k" in result and "18k" not in result:
        result["18k"] = (result["22k"] / 22.0) * 18.0

    if "24k" in result:
        # Silver ≈ 1.9% of 24K per gram
        silver_per_gram = result["24k"] * 0.019
        result["silver"] = silver_per_gram

    return result


def compute_change(new_price: float, old_price: Optional[float]) -> int:
    if old_price is None:
        return 0
    return int(round(new_price - old_price))


def update_monthly_trend(
    existing: Dict[str, Any],
    date_label: str,
    per_gram: Dict[str, float],
    max_points: int = 30,
) -> Dict[str, Any]:
    trend = existing.get("monthlyTrend") or {}
    labels: List[str] = list(trend.get("labels") or [])
    arr_22: List[float] = list(trend.get("22k") or [])
    arr_24: List[float] = list(trend.get("24k") or [])
    arr_18: List[float] = list(trend.get("18k") or [])

    labels.append(date_label)
    arr_22.append(round(per_gram.get("22k", 0)))
    arr_24.append(round(per_gram.get("24k", 0)))
    arr_18.append(round(per_gram.get("18k", 0)))

    # Keep only last max_points entries
    if len(labels) > max_points:
        labels = labels[-max_points:]
        arr_22 = arr_22[-max_points:]
        arr_24 = arr_24[-max_points:]
        arr_18 = arr_18[-max_points:]

    return {
        "labels": labels,
        "22k": arr_22,
        "24k": arr_24,
        "18k": arr_18,
    }


def build_payload(existing: Dict[str, Any], per_gram: Dict[str, float]) -> Dict[str, Any]:
    ist_now = now_ist()
    last_updated = ist_now.isoformat()
    date_label = ist_now.strftime("%b %d")

    old_rates = (existing or {}).get("rates") or {}

    def old_pg(key: str) -> Optional[float]:
        try:
            return float(old_rates.get(key, {}).get("perGram"))
        except Exception:
            return None

    rates_block = {
        "22k": {
            "perGram": int(round(per_gram["22k"])),
            "per10g": int(round(per_gram["22k"] * 10)),
            "change": compute_change(per_gram["22k"], old_pg("22k")),
        },
        "24k": {
            "perGram": int(round(per_gram["24k"])),
            "per10g": int(round(per_gram["24k"] * 10)),
            "change": compute_change(per_gram["24k"], old_pg("24k")),
        },
        "18k": {
            "perGram": int(round(per_gram["18k"])),
            "per10g": int(round(per_gram["18k"] * 10)),
            "change": compute_change(per_gram["18k"], old_pg("18k")),
        },
    }

    silver_old = old_rates.get("silver", {}) if old_rates else {}
    old_silver_pg = None
    try:
        old_silver_pg = float(silver_old.get("perGram"))
    except Exception:
        old_silver_pg = None

    silver_pg = per_gram.get("silver", 0.0)
    silver_block = {
        "perGram": int(round(silver_pg)),
        "perKg": int(round(silver_pg * 1000)),
        "change": compute_change(silver_pg, old_silver_pg),
    }
    rates_block["silver"] = silver_block

    monthly_trend = update_monthly_trend(existing or {}, date_label, per_gram)

    return {
        "lastUpdated": last_updated,
        "city": "Hyderabad",
        "rates": rates_block,
        "monthlyTrend": monthly_trend,
    }


def main() -> int:
    project_root = Path(__file__).resolve().parents[1]
    rates_path = project_root / "public" / "rates.json"

    existing = load_existing_rates(rates_path)

    raw = scrape_goodreturns()
    if raw is None:
        raw = scrape_bankbazaar()
    if raw is None:
        # Both sources failed
        print("ERROR: Failed to fetch rates from both GoodReturns and BankBazaar.", file=sys.stderr)
        return 1

    per_gram_raw = normalize_to_per_gram(raw)
    per_gram = derive_missing_and_silver(per_gram_raw)

    # Ensure we have at least 22k and 24k to proceed
    if "22k" not in per_gram or "24k" not in per_gram or "18k" not in per_gram or "silver" not in per_gram:
        print("ERROR: Missing required rate(s) after normalization / derivation.", file=sys.stderr)
        return 1

    payload = build_payload(existing, per_gram)

    # Only overwrite if the payload is different to avoid noisy commits.
    prev_json = json.dumps(existing, sort_keys=True) if existing else ""
    next_json = json.dumps(payload, indent=2, sort_keys=True)

    if prev_json == next_json:
        print("No changes in rates; not updating rates.json")
        return 0

    rates_path.write_text(next_json + "\n", encoding="utf-8")
    print(f"Updated {rates_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

