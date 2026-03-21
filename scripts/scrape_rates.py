import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List

import requests
from bs4 import BeautifulSoup


GOODRETURNS_URLS = [
    "https://www.goodreturns.in/gold-rates/hyderabad.html",
    "https://www.goodreturns.in/gold-rates//hyderabad.html",
]
BANKBAZAAR_URLS = [
    "https://msn.bankbazaar.com/gold-rate-hyderabad.html",
    "https://www.bankbazaar.com/gold-rate/hyderabad.html",
]

IST_OFFSET_MINUTES = 5 * 60 + 30  # UTC+5:30
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
    # Extract plausible price token from strings like "₹ 5,123 / 10 gram".
    # Avoid tiny numbers (e.g., "22" from "22 carat") by thresholding.
    import re

    cleaned = text.replace(",", "")
    matches = re.findall(r"(\d+(?:\.\d+)?)", cleaned)
    if not matches:
        return None

    values: List[float] = []
    for token in matches:
        try:
            values.append(float(token))
        except ValueError:
            continue

    if not values:
        return None

    plausible = [v for v in values if v >= 1000]
    if plausible:
        return max(plausible)

    return None


def fetch_url(url: str) -> Optional[str]:
    for _ in range(2):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)
            if resp.status_code == 200 and resp.text:
                return resp.text
        except Exception:
            continue
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


def parse_one_gram_today_from_table_text(table_text: str) -> Optional[float]:
    import re

    compact = " ".join(table_text.replace(",", "").split())
    m = re.search(r"1\s*gram\s*₹?\s*([0-9]+(?:\.[0-9]+)?)", compact, flags=re.IGNORECASE)
    if not m:
        return None
    try:
        return float(m.group(1))
    except ValueError:
        return None


def scrape_goodreturns() -> Optional[Dict[str, float]]:
    html = None
    for url in GOODRETURNS_URLS:
        html = fetch_url(url)
        if html:
            break
    if not html:
        return None

    soup = BeautifulSoup(html, "lxml")

    # GoodReturns typically has a table with headings like "22 Carat Gold Rate"
    rates: Dict[str, float] = {}

    for table in soup.find_all("table"):
        table_text = table.get_text(" ", strip=True).lower()
        if "carat" not in table_text and "karat" not in table_text and "22k" not in table_text:
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

    if "22k" not in rates or "24k" not in rates:
        rates.update(extract_rates_from_text(soup.get_text(" ", strip=True)))

    return rates or None


def scrape_bankbazaar() -> Optional[Dict[str, float]]:
    html = None
    for url in BANKBAZAAR_URLS:
        html = fetch_url(url)
        if html:
            break
    if not html:
        return None

    soup = BeautifulSoup(html, "lxml")
    rates: Dict[str, float] = {}

    # Primary path for BankBazaar: first two summary tables are usually 22K and 24K.
    summary_tables: List[str] = []
    for table in soup.find_all("table"):
        txt = table.get_text(" ", strip=True)
        if "Gram" in txt and "Today" in txt and "Yesterday" in txt:
            summary_tables.append(txt)
    if len(summary_tables) >= 2:
        p22 = parse_one_gram_today_from_table_text(summary_tables[0])
        p24 = parse_one_gram_today_from_table_text(summary_tables[1])
        if p22:
            rates["22k"] = p22
        if p24:
            rates["24k"] = p24

    for table in soup.find_all("table"):
        table_text = table.get_text(" ", strip=True).lower()
        if "karat" not in table_text and "carat" not in table_text and "22k" not in table_text:
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

    if "22k" not in rates or "24k" not in rates:
        rates.update(extract_rates_from_text(soup.get_text(" ", strip=True)))

    return rates or None


def normalize_to_per_gram(raw_rates: Dict[str, float]) -> Dict[str, float]:
    # Heuristic: some sources expose per-10g values; convert only when very large.
    # For this project, normal per-gram values are around 10k-20k.
    normalized = {}
    for key, value in raw_rates.items():
        if value >= 50000:
            normalized[key] = value / 10.0
        else:
            normalized[key] = value
    return normalized


def merge_with_existing_if_partial(raw_rates: Dict[str, float], existing: Dict[str, Any]) -> Dict[str, float]:
    merged = dict(raw_rates)
    old_rates = (existing or {}).get("rates") or {}

    for key in ("22k", "24k"):
        if key in merged:
            continue
        try:
            old_value = float(old_rates.get(key, {}).get("perGram"))
            if old_value > 0:
                merged[key] = old_value
        except Exception:
            continue
    return merged


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


def enforce_price_sanity(per_gram: Dict[str, float], existing: Dict[str, Any]) -> Dict[str, float]:
    safe = dict(per_gram)
    old_rates = (existing or {}).get("rates") or {}

    # Guard against bad parses like 22/24/18 from carat labels.
    for key in ("22k", "24k", "18k"):
        value = safe.get(key)
        if value is None:
            continue
        if value >= 1000:
            continue
        try:
            fallback = float(old_rates.get(key, {}).get("perGram"))
            if fallback >= 1000:
                safe[key] = fallback
        except Exception:
            pass
    return safe


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

    if labels and labels[-1] == date_label:
        labels.pop()
        if arr_22:
            arr_22.pop()
        if arr_24:
            arr_24.pop()
        if arr_18:
            arr_18.pop()

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

    raw = merge_with_existing_if_partial(raw, existing)
    per_gram_raw = normalize_to_per_gram(raw)
    per_gram = derive_missing_and_silver(per_gram_raw)
    per_gram = enforce_price_sanity(per_gram, existing)

    # Ensure we have at least 22k and 24k to proceed
    if "22k" not in per_gram or "24k" not in per_gram or "18k" not in per_gram or "silver" not in per_gram:
        print("ERROR: Missing required rate(s) after normalization / derivation.", file=sys.stderr)
        return 1

    payload = build_payload(existing, per_gram)

    # Only overwrite if the payload is different to avoid noisy commits.
    if existing == payload:
        print("No changes in rates; not updating rates.json")
        return 0

    next_json = json.dumps(payload, indent=2)
    rates_path.write_text(next_json + "\n", encoding="utf-8")
    print(f"Updated {rates_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

