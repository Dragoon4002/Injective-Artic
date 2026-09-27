"""
One live forward-test tick for BTC/SOL 5-min forecast.

Each run:
  1. SCORE: any prior prediction now >=5 min old -> fetch actual price at its
     target time, record predicted-vs-actual (price err + direction hit).
  2. PREDICT: train Ridge on recent 1m history, forecast price 5 min ahead,
     append to the log as 'pending'.

State persists in scripts/forecast_live_log.json so the /loop driver can call
this every 5 min for 4 hours and accumulate a scorecard. Reuses the model from
price_forecast.py — no duplicated logic.

Run:  python3 scripts/forecast_live_tick.py
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from datetime import datetime, timezone

import numpy as np

from price_forecast import (
    fetch_klines, build_dataset, ridge_fit, ridge_predict, N_LAGS,
)

SYMBOLS = ["BTCUSDT", "SOLUSDT"]
HORIZON = 5  # minutes ahead
LOG = Path(__file__).parent / "forecast_live_log.json"


def now_ms() -> int:
    return int(time.time() * 1000)


def load_log() -> dict:
    if LOG.exists():
        return json.loads(LOG.read_text())
    return {"predictions": []}


def save_log(d: dict) -> None:
    LOG.write_text(json.dumps(d, indent=2))


def price_at(symbol: str, target_ms: int) -> float | None:
    """Close of the 1m candle covering target_ms. None if not yet available."""
    url_ms = target_ms + 60_000  # endTime just past target so the bar is closed
    import urllib.request
    from price_forecast import BINANCE_KLINES
    url = f"{BINANCE_KLINES}?symbol={symbol}&interval=1m&limit=2&endTime={url_ms}"
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            rows = json.loads(r.read())
    except Exception:
        return None
    for row in rows:
        open_ms = int(row[0])
        if open_ms <= target_ms < open_ms + 60_000:
            return float(row[4])
    return float(rows[-1][4]) if rows else None


def score_matured(log: dict) -> int:
    """Fill actual price for any pending prediction whose target time has passed."""
    scored = 0
    for p in log["predictions"]:
        if p["status"] != "pending":
            continue
        if now_ms() < p["target_ms"] + 60_000:
            continue  # target bar not closed yet
        actual = price_at(p["symbol"], p["target_ms"])
        if actual is None:
            continue
        p["actual_price"] = actual
        p["abs_pct_err"] = abs(actual - p["pred_price"]) / p["base_price"] * 100
        pred_dir = np.sign(p["pred_price"] - p["base_price"])
        act_dir = np.sign(actual - p["base_price"])
        p["dir_hit"] = bool(pred_dir == act_dir and act_dir != 0)
        p["status"] = "scored"
        scored += 1
    return scored


def predict(symbol: str, lead_prices: np.ndarray | None = None) -> dict:
    prices = fetch_klines(symbol)
    if lead_prices is not None:
        # cross-asset: SOL model uses BTC's recent returns too (BTC leads SOL)
        from price_forecast import build_dataset_cross, _align
        own, lead = _align(prices, lead_prices)
        X, y, _ = build_dataset_cross(own, lead, N_LAGS, HORIZON)
        model = ridge_fit(X, y, 1.0)
        own_r = np.diff(np.log(own))[-N_LAGS:]
        lead_r = np.diff(np.log(lead))[-N_LAGS:]
        x_now = np.concatenate([own_r, lead_r]).reshape(1, -1)
        prices = own
    else:
        X, y, _ = build_dataset(prices, N_LAGS, HORIZON)
        model = ridge_fit(X, y, 1.0)         # train on all available history
        x_now = np.diff(np.log(prices))[-N_LAGS:].reshape(1, -1)
    pred_ret = float(ridge_predict(model, x_now)[0])
    base = float(prices[-1])
    pred_price = base * float(np.exp(pred_ret))
    return {
        "symbol": symbol,
        "model": "cross" if lead_prices is not None else "own",
        "made_ms": now_ms(),
        "made_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "target_ms": now_ms() + HORIZON * 60_000,
        "base_price": base,
        "pred_price": pred_price,
        "pred_dir": "up" if pred_price > base else "down",
        "status": "pending",
    }


def scorecard(log: dict) -> None:
    scored = [p for p in log["predictions"] if p["status"] == "scored"]
    print(f"\n{'='*60}\nSCORECARD  ({len(scored)} matured predictions)")
    if not scored:
        print("  none matured yet (need >=5 min elapsed).")
        return
    for sym in SYMBOLS:
        s = [p for p in scored if p["symbol"] == sym]
        if not s:
            continue
        mape = np.mean([p["abs_pct_err"] for p in s])
        hits = np.mean([p["dir_hit"] for p in s]) * 100
        print(f"  {sym:<9} n={len(s):<3} mean abs err={mape:.3f}%  dir.acc={hits:.1f}%")
    print(f"{'='*60}")


def main() -> None:
    log = load_log()
    n_scored = score_matured(log)
    stamp = datetime.now(timezone.utc).strftime("%H:%M:%S")
    print(f"[{stamp}] scored {n_scored} matured prediction(s)")
    btc_prices = None
    try:
        btc_prices = fetch_klines("BTCUSDT")  # fetched once; SOL reuses as lead
    except Exception:
        pass
    for sym in SYMBOLS:
        try:
            lead = btc_prices if sym == "SOLUSDT" else None  # SOL: cross-asset w/ BTC lead
            p = predict(sym, lead_prices=lead)
            log["predictions"].append(p)
            print(f"  {sym:<9}[{p['model']}] base={p['base_price']:.2f} -> pred(+5m)={p['pred_price']:.2f} ({p['pred_dir']})")
        except Exception as e:
            print(f"  {sym}: predict failed ({e})")
    save_log(log)
    scorecard(log)


if __name__ == "__main__":
    main()
