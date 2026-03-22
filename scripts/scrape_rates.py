import json
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
    "Pragma": "no-cache",
}

# City config — name, and ordered list of URLs to try
CITIES = {
    "chennai": {
        "name": "Chennai",
        "urls": [
            "https://www.goodreturns.in/gold-rates/chennai.html",
            "https://www.bankbazaar.com/gold-rate/chennai.html",
        ],
    },
    "hyderabad": {
        "name": "Hyderabad",
        "urls": [
            "https://www.goodreturns.in/gold-rates/hyderabad.html",
            "https://www.bankbazaar.com/gold-rate/hyderabad.html",
            "https://www.bankbazaar.com/gold-rate-telangana.html",
        ],
    },
    "bangalore": {
        "name": "Bangalore",
        "urls": [
            "https://www.goodreturns.in/gold-rates/bangalore.html",
            "https://www.bankbazaar.com/gold-rate/bangalore.html",
        ],
    },
    "ahmedabad": {
        "name": "Ahmedabad",
        "urls": [
            "https://www.goodreturns.in/gold-rates/ahmedabad.html",
            "https://www.bankbazaar.com/gold-rate/ahmedabad.html",
        ],
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


def parse_price(text: str) -> Optional[float]:
    import re
    cleaned = text.replace(",", "")
    matches = re.findall(r"(\d+(?:\.\d+)?)", cleaned)
    if not matches:
        return None
    values = []
    for token in matches:
        try:
            values.append(float(token))
        except ValueError:
            continue
    plausible = [v for v in values if v >= 1000]
    return max(plausible) if plausible else None


def fetch_url(url: str) -> Optional[str]:
    for attempt in range(1, 4):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)
            if resp.text:
                print(f"  {url} -> {resp.status_code} (attempt {attempt})")
                return resp.text
        except Exception as e:
            print(f"  {url} -> error: {e} (attempt {attempt})")
    return None


def extract_rates_from_text(text: str) -> Dict[str, float]:
    import re
    patterns = {
        "22k": [
            r"(?:22\s*(?:carat|karat|k|kt)[^0-9₹]{0,50}₹?\s*([0-9,]+(?:\.[0-9]+)?))",
            r"(?:₹?\s*([0-9,]+(?:\.[0-9]+)?)\s*[^a-zA-Z]{0,8}(?:22\s*(?:carat|karat|k|kt)))",
        ],
        "24k": [
            r"(?:24\s*(?:carat|karat|k|kt)[^0-9₹]{0,50}₹?\s*([0-9,]+(?:\.[0-9]+)?))",
            r"(?:₹?\s*([0-9,]+(?:\.[0-9]+)?)\s*[^a-zA-Z]{0,8}(?:24\s*(?:carat|karat|k|kt)))",
        ],
        "18k": [
            r"(?:18\s*(?:carat|karat|k|kt)[^0-9₹]{0,50}₹?\s*([0-9,]+(?:\.[0-9]+)?))",
            r"(?:₹?\s*([0-9,]+(?:\.[0-9]+)?)\s*[^a-zA-Z]{0,8}(?:18\s*(?:carat|karat|k|kt)))",
        ],
    }
    out: Dict[str, float] = {}
    collapsed = " ".join(text.split())
    for key, key_patterns in patterns.items():
        for pattern in key_patterns:
            m = re.search(pattern, collapsed, flags=re.IGNORECASE)
            if not m:
                continue
            value = parse_price(m.group(1))
            if value:
                out[key] = value
                break
    return out


def scrape_city(urls: List[str]) -> Optional[Dict[str, float]]:
    """Try each URL until we get valid 22k + 24k rates."""
    for url in urls:
        html = fetch_url(url)
        if not html:
            continue
        soup = BeautifulSoup(html, "lxml")
        rates: Dict[str, float] = {}

        for table in soup.find_all("table"):
            table_text = table.get_text(" ", strip=True).lower()
            if "carat" not in table_text and "karat" not in table_text and "22k" not in table_text:
                continue
            for row in table.find_all("tr"):
                cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
                if not cells:
                    continue
                label = cells[0].lower()
                if ("22" in label and ("carat" in label or "karat" in label)) or "22k" in label:
                    price = parse_price(" ".join(cells[1:]))
                    if price:
                        rates["22k"] = price
                elif ("24" in label and ("carat" in label or "karat" in label)) or "24k" in label:
                    price = parse_price(" ".join(cells[1:]))
                    if price:
                        rates["24k"] = price
                elif ("18" in label and ("carat" in label or "karat" in label)) or "18k" in label:
                    price = parse_price(" ".join(cells[1:]))
                    if price:
                        rates["18k"] = price

        # Fallback to full text regex if table parsing missed keys
        if "22k" not in rates or "24k" not in rates:
            rates.update(extract_rates_from_text(soup.get_text(" ", strip=True)))

        if "22k" in rates and "24k" in rates:
            return rates

    return None


def normalize(raw: Dict[str, float]) -> Dict[str, float]:
    """Convert per-10g values to per-gram if needed."""
    return {k: v / 10.0 if v >= 50000 else v for k, v in raw.items()}


def derive(per_gram: Dict[str, float]) -> Dict[str, float]:
    result = dict(per_gram)
    if "22k" in result and "18k" not in result:
        result["18k"] = (result["22k"] / 22.0) * 18.0
    if "24k" in result:
        result["silver"] = result["24k"] * 0.019
    return result


def enforce_sanity(per_gram: Dict[str, float], old_rates: Dict[str, Any]) -> Dict[str, float]:
    safe = dict(per_gram)
    for key in ("22k", "24k", "18k"):
        value = safe.get(key)
        if value is not None and value < 1000:
            try:
                fallback = float(old_rates.get(key, {}).get("perGram", 0))
                if fallback >= 1000:
                    safe[key] = fallback
                    print(f"  WARNING: Suspicious {key}={value}, using existing {fallback}")
            except Exception:
                pass
    return safe


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

    # Replace today's entry if re-running same day
    if labels and labels[-1] == date_label:
        labels.pop()
        if arr_22: arr_22.pop()
        if arr_24: arr_24.pop()
        if arr_18: arr_18.pop()

    labels.append(date_label)
    arr_22.append(round(per_gram.get("22k", 0)))
    arr_24.append(round(per_gram.get("24k", 0)))
    arr_18.append(round(per_gram.get("18k", 0)))

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
    rates_block = {
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
            "perGram": int(round(per_gram.get("silver", 0))),
            "perKg": int(round(per_gram.get("silver", 0) * 1000)),
            "change": compute_change(per_gram.get("silver", 0), old_pg(old_rates, "silver")),
        },
    }
    return {
        "name": city_name,
        "rates": rates_block,
        "monthlyTrend": update_trend(existing_trend, date_label, per_gram),
    }


def main() -> int:
    project_root = Path(__file__).resolve().parents[1]
    rates_path = project_root / "public" / "rates.json"

    existing = load_existing(rates_path)
    existing_cities = existing.get("cities", {})

    ist_now = now_ist()
    date_label = ist_now.strftime("%b %d")
    last_updated = ist_now.isoformat()

    new_cities: Dict[str, Any] = {}
    failed: List[str] = []

    for city_key, city_config in CITIES.items():
        city_name = city_config["name"]
        print(f"\nScraping {city_name}...")

        raw = scrape_city(city_config["urls"])
        if raw is None:
            print(f"  FAILED: Could not scrape {city_name}, keeping existing rates.")
            failed.append(city_name)
            # Keep existing data if scrape fails
            if city_key in existing_cities:
                new_cities[city_key] = existing_cities[city_key]
            continue

        per_gram = normalize(raw)
        per_gram = derive(per_gram)

        old_rates = existing_cities.get(city_key, {}).get("rates", {})
        per_gram = enforce_sanity(per_gram, old_rates)

        if not all(k in per_gram for k in ("22k", "24k", "18k", "silver")):
            print(f"  FAILED: Missing keys for {city_name} after processing.")
            failed.append(city_name)
            if city_key in existing_cities:
                new_cities[city_key] = existing_cities[city_key]
            continue

        existing_trend = existing_cities.get(city_key, {}).get("monthlyTrend", {})
        new_cities[city_key] = build_city_block(
            per_gram, old_rates, existing_trend, date_label, city_name
        )

        r = new_cities[city_key]["rates"]
        print(f"  22K: ₹{r['22k']['perGram']}/g  24K: ₹{r['24k']['perGram']}/g  18K: ₹{r['18k']['perGram']}/g")

    if not new_cities:
        print("\nERROR: All cities failed.", file=sys.stderr)
        return 1

    payload = {
        "lastUpdated": last_updated,
        "cities": new_cities,
    }

    rates_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"\nrates.json updated. Failed cities: {failed if failed else 'none'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())