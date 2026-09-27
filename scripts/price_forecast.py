"""
Short-horizon price forecaster for BTC/SOL (t+5min, t+10min).

Ridge regression on lagged 1-minute returns. Walk-forward backtest.
Every result is reported AGAINST the naive random-walk baseline
("next price == current price"), because at a 5-10 minute crypto horizon
the random walk is a genuinely hard baseline — a model that only ties it
on RMSE has learned nothing. The number that matters is directional
accuracy above 50%.

Data: Binance public klines API (no key). Deps: numpy only (Ridge is
closed-form). Standalone — does not touch the trading engine.

Run:  python3 scripts/price_forecast.py
"""
from __future__ import annotations

import sys
import time
import urllib.request
import json
from dataclasses import dataclass

import numpy as np

BINANCE_KLINES = "https://api.binance.com/api/v3/klines"
SYMBOLS = ["BTCUSDT", "SOLUSDT"]
HORIZONS = [5, 10]          # minutes ahead to predict
N_LAGS = 15                 # lagged 1m returns used as features
LIMIT = 1000                # candles per request (Binance max)
N_REQUESTS = 3              # -> ~3000 minutes (~2 days) of 1m data
TRAIN_FRAC = 0.7            # walk-forward split
RIDGE_LAMBDA = 1.0


def fetch_klines(symbol: str, limit: int = LIMIT, n_requests: int = N_REQUESTS) -> np.ndarray:
    """Fetch close prices as float array, oldest->newest, paging backwards."""
    closes: list[float] = []
    end_time = None
    for _ in range(n_requests):
        url = f"{BINANCE_KLINES}?symbol={symbol}&interval=1m&limit={limit}"
        if end_time is not None:
            url += f"&endTime={end_time}"
        with urllib.request.urlopen(url, timeout=15) as resp:
            rows = json.loads(resp.read())
        if not rows:
            break
        # row[0]=openTime, row[4]=close
        batch = [(int(r[0]), float(r[4])) for r in rows]
        closes = batch + closes if not closes else batch + closes  # prepend older
        end_time = batch[0][0] - 1  # step back before this batch's first open
        time.sleep(0.2)
    # dedupe + sort by time
    closes.sort(key=lambda x: x[0])
    seen = set()
    out = []
    for t, c in closes:
        if t not in seen:
            seen.add(t)
            out.append(c)
    return np.asarray(out, dtype=float)


def build_dataset(prices: np.ndarray, n_lags: int, horizon: int):
    """
    Features: last `n_lags` log-returns. Target: log-return over next `horizon` bars.
    Returns X, y, and the base prices aligned to each sample (for directional check).
    """
    logp = np.log(prices)
    rets = np.diff(logp)                      # length N-1
    X, y, base_idx = [], [], []
    # sample i uses rets[i-n_lags+1 .. i] (most recent return included) to predict
    # cumulative return over the next `horizon` bars: rets[i+1 .. i+horizon].
    for i in range(n_lags - 1, len(rets) - horizon):
        X.append(rets[i - n_lags + 1:i + 1])
        y.append(logp[i + 1 + horizon] - logp[i + 1])
        base_idx.append(i + 1)               # price index we forecast FROM
    return np.asarray(X), np.asarray(y), np.asarray(base_idx)


def build_dataset_cross(prices: np.ndarray, lead_prices: np.ndarray,
                        n_lags: int, horizon: int):
    """
    Same as build_dataset but appends the lead asset's recent returns as extra
    features (e.g. BTC returns to help predict SOL). SOL tracks BTC hard on big
    BTC moves, so BTC's last n_lags returns carry signal for SOL's next move.

    `prices` and `lead_prices` must be time-aligned, equal length (same 1m grid).
    Feature vector = [own last n_lags returns | lead last n_lags returns].
    """
    assert len(prices) == len(lead_prices), "series must be time-aligned, equal length"
    logp = np.log(prices)
    lead_logp = np.log(lead_prices)
    rets = np.diff(logp)
    lead_rets = np.diff(lead_logp)
    X, y, base_idx = [], [], []
    for i in range(n_lags - 1, len(rets) - horizon):
        own = rets[i - n_lags + 1:i + 1]
        lead = lead_rets[i - n_lags + 1:i + 1]   # BTC info known at same time
        X.append(np.concatenate([own, lead]))
        y.append(logp[i + 1 + horizon] - logp[i + 1])
        base_idx.append(i + 1)
    return np.asarray(X), np.asarray(y), np.asarray(base_idx)


def ridge_fit(X: np.ndarray, y: np.ndarray, lam: float):
    """
    Closed-form ridge on standardized features (returns ~1e-3, so raw lambda would
    swamp the fit — standardizing makes lambda scale-free). Returns (weights, mu, sd).
    """
    mu = X.mean(axis=0)
    sd = X.std(axis=0)
    sd[sd == 0] = 1.0
    Xs = (X - mu) / sd
    Xb = np.hstack([np.ones((len(Xs), 1)), Xs])
    d = Xb.shape[1]
    A = Xb.T @ Xb + lam * np.eye(d)
    A[0, 0] -= lam                            # don't regularize the intercept
    return np.linalg.solve(A, Xb.T @ y), mu, sd


def ridge_predict(model, X: np.ndarray) -> np.ndarray:
    w, mu, sd = model
    Xs = (X - mu) / sd
    return np.hstack([np.ones((len(Xs), 1)), Xs]) @ w


@dataclass
class Result:
    symbol: str
    horizon: int
    model_rmse: float
    naive_rmse: float
    model_dir_acc: float


def _backtest_xy(symbol: str, X: np.ndarray, y: np.ndarray, horizon: int) -> Result:
    split = int(len(X) * TRAIN_FRAC)
    Xtr, ytr = X[:split], y[:split]
    Xte, yte = X[split:], y[split:]
    model = ridge_fit(Xtr, ytr, RIDGE_LAMBDA)
    pred = ridge_predict(model, Xte)
    model_rmse = float(np.sqrt(np.mean((pred - yte) ** 2)))
    naive_rmse = float(np.sqrt(np.mean(yte ** 2)))
    mask = yte != 0
    dir_acc = float(np.mean(np.sign(pred[mask]) == np.sign(yte[mask]))) if mask.any() else float("nan")
    return Result(symbol, horizon, model_rmse, naive_rmse, dir_acc)


def backtest(symbol: str, prices: np.ndarray, horizon: int) -> Result:
    X, y, _ = build_dataset(prices, N_LAGS, horizon)
    return _backtest_xy(symbol, X, y, horizon)


def _align(a: np.ndarray, b: np.ndarray):
    """Trim both to equal length from the tail (same 1m grid, newest-aligned)."""
    n = min(len(a), len(b))
    return a[-n:], b[-n:]


def backtest_cross(symbol: str, prices: np.ndarray, lead_prices: np.ndarray, horizon: int) -> Result:
    X, y, _ = build_dataset_cross(prices, lead_prices, N_LAGS, horizon)
    return _backtest_xy(symbol + "+lead", X, y, horizon)


def main() -> int:
    print(f"Fetching ~{LIMIT * N_REQUESTS} 1m candles for {', '.join(SYMBOLS)} from Binance...\n")
    results: list[Result] = []
    price_map: dict[str, np.ndarray] = {}
    for sym in SYMBOLS:
        try:
            prices = fetch_klines(sym)
        except Exception as e:
            print(f"  {sym}: fetch failed ({e}) — skipping")
            continue
        price_map[sym] = prices
        print(f"  {sym}: {len(prices)} candles, last={prices[-1]:.2f}")
        for h in HORIZONS:
            results.append(backtest(sym, prices, h))

    # Cross-asset: does adding BTC's recent returns help predict SOL?
    if "BTCUSDT" in price_map and "SOLUSDT" in price_map:
        btc, sol = _align(price_map["BTCUSDT"], price_map["SOLUSDT"])
        for h in HORIZONS:
            results.append(backtest_cross("SOLUSDT", sol, btc, h))

    if not results:
        print("No data fetched. Check network / Binance reachability.")
        return 1

    print(f"\n{'symbol':<9}{'horizon':<9}{'model RMSE':<14}{'naive RMSE':<14}{'dir.acc':<9}{'verdict'}")
    print("-" * 72)
    for r in results:
        beats = r.model_rmse <= r.naive_rmse * 1.001
        edge = r.model_dir_acc > 0.5
        verdict = "edge" if (beats and edge) else ("ties naive" if beats else "worse")
        print(f"{r.symbol:<9}{r.horizon:<9}{r.model_rmse:<14.6f}{r.naive_rmse:<14.6f}"
              f"{r.model_dir_acc*100:<8.1f}%{verdict}")

    print("\nNote: 5-10min crypto price is near random-walk. 'ties naive' on RMSE is")
    print("expected; the real signal is dir.acc > 50%. Small edge is normal, huge edge = bug/overfit.")
    return 0


def _selfcheck() -> None:
    """Synthetic AR(1) series: model MUST beat naive RMSE and exceed 50% dir.acc."""
    rng = np.random.default_rng(0)
    n = 4000
    rets = np.zeros(n)
    for i in range(1, n):
        rets[i] = 0.6 * rets[i - 1] + 0.001 * rng.standard_normal()  # autocorrelated -> predictable
    prices = 100 * np.exp(np.cumsum(rets))
    r = backtest("SYNTH", prices, horizon=1)  # h=1: where AR(1) edge is strongest
    assert r.model_rmse < r.naive_rmse, f"model should beat naive on AR(1): {r.model_rmse} vs {r.naive_rmse}"
    assert r.model_dir_acc > 0.5, f"dir acc should exceed 0.5 on AR(1): {r.model_dir_acc}"
    # shape sanity
    X, y, base = build_dataset(prices, N_LAGS, 5)
    assert X.shape[0] == y.shape[0] == base.shape[0]
    assert X.shape[1] == N_LAGS

    # Cross-asset: SOL_ret[t] = 0.8*BTC_ret[t-1] + noise. BTC leads SOL by 1 bar,
    # so a SOL model WITH BTC features must beat SOL-only.
    btc_rets = 0.001 * rng.standard_normal(n)
    sol_rets = np.zeros(n)
    for i in range(1, n):
        sol_rets[i] = 0.8 * btc_rets[i - 1] + 0.0003 * rng.standard_normal()
    btc_p = 100 * np.exp(np.cumsum(btc_rets))
    sol_p = 50 * np.exp(np.cumsum(sol_rets))
    own = backtest("SOL_only", sol_p, horizon=1)
    cross = backtest_cross("SOL", sol_p, btc_p, horizon=1)
    assert cross.model_rmse < own.model_rmse, \
        f"cross-asset should beat own-only when BTC leads SOL: {cross.model_rmse} vs {own.model_rmse}"
    Xc, yc, _ = build_dataset_cross(sol_p, btc_p, N_LAGS, 5)
    assert Xc.shape[1] == 2 * N_LAGS, "cross features = own + lead lags"
    print("selfcheck OK: model beats naive on AR(1); cross-asset beats own-only on lead-lag.")


if __name__ == "__main__":
    if "--selfcheck" in sys.argv:
        _selfcheck()
    else:
        sys.exit(main())
