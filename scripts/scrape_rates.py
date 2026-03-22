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
    "https://www.bankbazaar.com/gold-rate-telangana.html",
]
POLICYBAZAAR_URLS = [
    "https://www.policybazaar.com/gold-rate/hyderabad/",
]

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
FETCH_LOG: List[str] = []


def now_ist() -> datetime:
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
    for attempt in range(1, 4):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT_SECONDS)
            FETCH_LOG.append(f"{url} -> {resp.status_code} (attempt {attempt})")
            if resp.text:
                return resp.text
        except Exception as e:
            FETCH_LOG.append(f"{url} -> request_error: {e} (attempt {attempt})")
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


def scrape_policybazaar() -> Optional[Dict[str, float]]:
    html = None
    for url in POLICYBAZAAR_URLS:
        html = fetch_url(url)
        if html:
            break
    if not html:
        return None
    soup = BeautifulSoup(html, "lxml")
    rates = extract_rates_from_text(soup.get_text(" ", strip=True))
    if "22k" not in rates or "24k" not in rates:
        for table in soup.find_all("table"):
            txt = table.get_text(" ", strip=True).lower()
            if "22" not in txt and "24" not in txt:
                continue
            for row in table.find_all("tr"):
                cells = [c.get_text(" ", strip=True) for c in row.find_all(["td", "th"])]
                if not cells:
                    continue
                label = cells[0].lower()
                value = parse_price(" ".join(cells[1:]))
                if not value:
                    continue
                if "22" in label and ("k" in label or "carat" in label or "karat" in label):
                    rates["22k"] = value
                if "24" in label and ("k" in label or "carat" in label or "karat" in label):
                    rates["24k"] = value
                if "18" in label and ("k" in label or "carat" in label or "karat" in label):
                    rates["18k"] = value
    if "22k" in rates and "24k" in rates:
        return rates
    return None


def normalize_to_per_gram(raw_rates: Dict[str, float]) -> Dict[str, float]:
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
            old_value = old_rates.get(key, {}).get("perGram")
            if old_value and float(old_value) > 0:
                merged[key] = float(old_value)
        except Exception:
            continue
    return merged


def derive_missing_and_silver(per_gram: Dict[str, float]) -> Dict[str, float]:
    result = dict(per_gram)
    if "22k" in result and "18k" not in result:
        result["18k"] = (result["22k"] / 22.0) * 18.0
    if "24k" in result:
        result["silver"] = result["24k"] * 0.019
    return result


def enforce_price_sanity(per_gram: Dict[str, float], existing: Dict[str, Any]) -> Dict[str, float]:
    safe = dict(per_gram)
    old_rates = (existing or {}).get("rates") or {}
    for key in ("22k", "24k", "18k"):
        value = safe.get(key)
        if value is None:
            continue
        if value >= 1000:
            continue
        try:
            fallback = old_rates.get(key, {}).get("perGram")
            if fallback and float(fallback) >= 1000:
                safe[key] = float(fallback)
                print(f"WARNING: Suspicious value {value} for {key}, using existing {fallback}")
        except Exception:
            pass
    return safe


def old_per_gram(existing: Dict[str, Any], key: str) -> Optional[float]:
    """Safely retrieve previous per-gram price. Returns None on first run."""
    try:
        value = existing.get("rates", {}).get(key, {}).get("perGram")
        if value is not None:
            return float(value)
    except Exception:
        pass
    return None


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
        labels.pop(); arr_22.pop() if arr_22 else None
        arr_24.pop() if arr_24 else None; arr_18.pop() if arr_18 else None

    labels.append(date_label)
    arr_22.append(round(per_gram.get("22k", 0)))
    arr_24.append(round(per_gram.get("24k", 0)))
    arr_18.append(round(per_gram.get("18k", 0)))

    if len(labels) > max_points:
        labels = labels[-max_points:]
        arr_22 = arr_22[-max_points:]
        arr_24 = arr_24[-max_points:]
        arr_18 = arr_18[-max_points:]

    return {"labels": labels, "22k": arr_22, "24k": arr_24, "18k": arr_18}


def build_payload(existing: Dict[str, Any], per_gram: Dict[str, float]) -> Dict[str, Any]:
    ist_now = now_ist()
    last_updated = ist_now.isoformat()
    date_label = ist_now.strftime("%b %d")

    rates_block = {
        "22k": {
            "perGram": int(round(per_gram["22k"])),
            "per10g": int(round(per_gram["22k"] * 10)),
            "change": compute_change(per_gram["22k"], old_per_gram(existing, "22k")),
        },
        "24k": {
            "perGram": int(round(per_gram["24k"])),
            "per10g": int(round(per_gram["24k"] * 10)),
            "change": compute_change(per_gram["24k"], old_per_gram(existing, "24k")),
        },
        "18k": {
            "perGram": int(round(per_gram["18k"])),
            "per10g": int(round(per_gram["18k"] * 10)),
            "change": compute_change(per_gram["18k"], old_per_gram(existing, "18k")),
        },
        "silver": {
            "perGram": int(round(per_gram.get("silver", 0))),
            "perKg": int(round(per_gram.get("silver", 0) * 1000)),
            "change": compute_change(per_gram.get("silver", 0), old_per_gram(existing, "silver")),
        },
    }

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

    print("Attempting GoodReturns...")
    raw = scrape_goodreturns()
    if raw is None:
        print("GoodReturns failed. Trying BankBazaar...")
        raw = scrape_bankbazaar()
    if raw is None:
        print("BankBazaar failed. Trying PolicyBazaar...")
        raw = scrape_policybazaar()
    if raw is None:
        print("ERROR: All sources failed.", file=sys.stderr)
        for line in FETCH_LOG:
            print(f"  {line}", file=sys.stderr)
        return 1

    raw = merge_with_existing_if_partial(raw, existing)
    per_gram = normalize_to_per_gram(raw)
    per_gram = derive_missing_and_silver(per_gram)
    per_gram = enforce_price_sanity(per_gram, existing)

    if not all(k in per_gram for k in ("22k", "24k", "18k", "silver")):
        print("ERROR: Missing required rates after processing.", file=sys.stderr)
        return 1

    payload = build_payload(existing, per_gram)

    if existing == payload:
        print("No changes detected. Skipping update.")
        return 0

    rates_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    r = payload["rates"]
    print(f"rates.json updated successfully.")
    print(f"  22K: ₹{r['22k']['perGram']}/g  (change: {r['22k']['change']:+d})")
    print(f"  24K: ₹{r['24k']['perGram']}/g  (change: {r['24k']['change']:+d})")
    print(f"  18K: ₹{r['18k']['perGram']}/g  (change: {r['18k']['change']:+d})")
    print(f"  Silver: ₹{r['silver']['perGram']}/g  (change: {r['silver']['change']:+d})")
    return 0


if __name__ == "__main__":
    sys.exit(main())