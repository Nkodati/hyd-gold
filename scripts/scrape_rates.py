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
    "Referer": "https://www.google.com/",
}

CITY_CONFIG = {
    "chennai":   { "name": "Chennai",   "url": "https://www.policybazaar.com/gold-rate/chennai/" },
    "hyderabad": { "name": "Hyderabad", "url": "https://www.policybazaar.com/gold-rate/hyderabad/" },
    "bangalore": { "name": "Bangalore", "url": "https://www.policybazaar.com/gold-rate/bangalore/" },
    "ahmedabad": { "name": "Ahmedabad", "url": "https://www.policybazaar.com/gold-rate/ahmedabad/" },
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


def scrape_policybazaar(url: str, city_name: str) -> Optional[Dict[str, float]]:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)
        resp.raise_for_status()
    except Exception as e:
        print(f"  ERROR fetching {city_name}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "lxml")
    text = soup.get_text(" ", strip=True)

    rates: Dict[str, float] = {}

    # Primary: "Rs. 13,620 per gram for 22 karat gold"
    p22 = re.search(r"Rs\.?\s*([\d,]+)\s*per gram for 22 karat", text, re.IGNORECASE)
    p24 = re.search(r"Rs\.?\s*([\d,]+)\s*per gram for 24 karat", text, re.IGNORECASE)

    # Fallback 1: "22 karat gold rate...Rs. X per gram"
    if not p22:
        p22 = re.search(r"22.karat.gold.rate[^R]{0,50}Rs\.?\s*([\d,]+)\s*per gram", text, re.IGNORECASE)
    if not p24:
        p24 = re.search(r"24.karat.gold[^R]{0,50}Rs\.?\s*([\d,]+)\s*per gram", text, re.IGNORECASE)

    # Fallback 2: "Rs. X per gram...22 karat"
    if not p22:
        p22 = re.search(r"Rs\.?\s*([\d,]+)\s*per gram[^.]*22 karat", text, re.IGNORECASE)
    if not p24:
        p24 = re.search(r"Rs\.?\s*([\d,]+)\s*per gram[^.]*24 karat", text, re.IGNORECASE)

    if p22:
        rates["22k"] = float(p22.group(1).replace(",", ""))
    if p24:
        rates["24k"] = float(p24.group(1).replace(",", ""))

    if "22k" not in rates or "24k" not in rates:
        print(f"  ERROR: Could not extract rates for {city_name}")
        return None

    # Sanity check
    for key in ("22k", "24k"):
        if not (5000 < rates[key] < 100000):
            print(f"  ERROR: Suspicious {key} rate {rates[key]} for {city_name}")
            return None

    # Derive 18K and silver
    rates["18k"] = round((rates["22k"] / 916) * 750, 2)
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


def get_yesterday_price(existing_trend: Dict[str, Any], date_label: str) -> Optional[float]:
    labels: List[str] = list(existing_trend.get("labels") or [])
    arr_22: List[float] = list(existing_trend.get("22k") or [])
    if not labels or not arr_22:
        return None

    if labels[-1] == date_label and len(arr_22) >= 2:
        return float(arr_22[-2])
    if labels[-1] != date_label:
        return float(arr_22[-1])
    return None


def generate_market_update(today_22k: int, yesterday_22k: Optional[float]) -> str:
    if yesterday_22k is None:
        return (
            f"India 22K gold was quoted around Rs. {today_22k:,} per gram today as domestic bullion markets tracked global cues. "
            "Traders continued to watch rupee movement and near-term retail demand for direction."
        )

    change = today_22k - int(round(yesterday_22k))
    if change > 0:
        direction = "moved higher"
        move_text = f"up by Rs. {change:,} per gram from yesterday"
    elif change < 0:
        direction = "eased"
        move_text = f"down by Rs. {abs(change):,} per gram from yesterday"
    else:
        direction = "held steady"
        move_text = "unchanged from yesterday"

    return (
        f"India 22K gold {direction} today, with indicative prices near Rs. {today_22k:,} per gram and {move_text}. "
        "Currency trends, international bullion cues, and local jewellery demand remained the main factors in trade sentiment."
    )


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
    market_update = ""

    for city_key, config in CITY_CONFIG.items():
        print(f"\nScraping {config['name']} from PolicyBazaar...")
        per_gram = scrape_policybazaar(config["url"], config["name"])

        if per_gram is None:
            print(f"  FAILED: Keeping existing rates for {config['name']}")
            failed.append(config["name"])
            if city_key in existing_cities:
                new_cities[city_key] = existing_cities[city_key]
            continue

        old_rates = existing_cities.get(city_key, {}).get("rates", {})
        existing_trend = existing_cities.get(city_key, {}).get("monthlyTrend", {})
        yesterday_22k = get_yesterday_price(existing_trend, date_label)

        new_cities[city_key] = build_city_block(
            per_gram, old_rates, existing_trend, date_label, config["name"]
        )
        if not market_update:
            market_update = generate_market_update(int(round(per_gram["22k"])), yesterday_22k)

    if not new_cities:
        print("\nERROR: All cities failed.", file=sys.stderr)
        return 1

    payload = {
        "lastUpdated": last_updated,
        "marketUpdate": market_update or existing.get("marketUpdate", ""),
        "cities": new_cities,
    }
    rates_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"\nrates.json updated successfully. Failed: {failed if failed else 'none'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
