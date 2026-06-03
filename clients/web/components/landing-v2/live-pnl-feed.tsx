"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type Trade = {
  id: number;
  symbol: string;
  side: "LONG" | "SHORT";
  size: string;
  pnlPct: number;
  agent: string;
  ts: string;
};

const symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT", "LINK/USDT", "MATIC/USDT", "ARB/USDT"];
const agents = ["snowdrift", "permafrost", "tundra", "blizzard", "icefall", "glacier", "fjord", "cairn"];

function genTrade(id: number): Trade {
  const side: Trade["side"] = Math.random() > 0.5 ? "LONG" : "SHORT";
  return {
    id,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    side,
    size: (0.05 + Math.random() * 1.2).toFixed(3),
    pnlPct: parseFloat(((Math.random() - 0.4) * 4).toFixed(2)),
    agent: agents[Math.floor(Math.random() * agents.length)],
    ts: new Date().toLocaleTimeString("en-GB", { hour12: false }),
  };
}

// Deterministic seed so server-render === first client-render (no hydration
// mismatch). Live randomness kicks in client-side via the interval below.
const SEED: Trade[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  symbol: symbols[i % symbols.length],
  side: i % 2 === 0 ? "LONG" : "SHORT",
  size: (0.1 + (i % 9) * 0.13).toFixed(3),
  pnlPct: parseFloat((((i % 7) - 3) * 0.41).toFixed(2)),
  agent: agents[i % agents.length],
  ts: `14:${String(22 - i).padStart(2, "0")}:0${i % 10}`,
}));

function Sparkline({ data }: { data: number[] }) {
  const W = 300;
  const H = 48;
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const cumulative = data.reduce<number[]>((acc, v) => {
      acc.push((acc[acc.length - 1] ?? 0) + v);
      return acc;
    }, []);
    const min = Math.min(...cumulative);
    const max = Math.max(...cumulative);
    const range = max - min || 1;
    return cumulative
      .map((v, i) => {
        const x = (i / (cumulative.length - 1)) * W;
        const y = H - 4 - ((v - min) / range) * (H - 8);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data]);

  const isPositive = useMemo(() => {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum >= 0;
  }, [data]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="h-12 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spark-fill-v2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? "#6FCAA0" : "#E85F5F"} stopOpacity="0.25" />
          <stop offset="100%" stopColor={isPositive ? "#6FCAA0" : "#E85F5F"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill="url(#spark-fill-v2)" />
      <path
        d={path}
        fill="none"
        stroke={isPositive ? "#6FCAA0" : "#E85F5F"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LivePnlFeed() {
  const [trades, setTrades] = useState<Trade[]>(SEED);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let counter = trades.length;
    const id = setInterval(() => {
      counter += 1;
      setTrades((prev) => [genTrade(counter), ...prev].slice(0, 12));
    }, 2400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sessionTotal = trades.reduce((s, t) => s + t.pnlPct, 0);
  const isUp = sessionTotal >= 0;

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-36">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/1.5">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: isUp ? "#6FCAA0" : "#E85F5F" }}
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/55">
                desk · live tape
              </span>
            </div>
            <span
              className="font-mono text-[11px] tabular-nums"
              style={{ color: isUp ? "#6FCAA0" : "#E85F5F" }}
            >
              session {isUp ? "+" : ""}
              {sessionTotal.toFixed(2)}%
            </span>
          </div>

          <div className="border-b border-foreground/5 px-2 pb-1 pt-2">
            <Sparkline data={trades.map((t) => t.pnlPct)} />
          </div>

          <div className="max-h-80 divide-y divide-white/5 overflow-hidden">
            {trades.slice(0, 8).map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
                className="flex items-center gap-4 px-5 py-2.5 font-mono text-[12px] hover:bg-foreground/2"
              >
                <span className="w-14 shrink-0 tabular-nums text-foreground/25">{t.ts}</span>
                <span className="w-20 shrink-0 truncate text-foreground/50">{t.agent}</span>
                <span className="w-20 shrink-0 text-foreground/80">{t.symbol}</span>
                <span
                  className="w-12 shrink-0 text-[11px] tracking-wide"
                  style={{ color: t.side === "LONG" ? "#6FCAA0" : "#E85F5F" }}
                >
                  {t.side}
                </span>
                <span className="flex-1 truncate text-foreground/40">{t.size}</span>
                <span
                  className="w-14 shrink-0 text-right tabular-nums"
                  style={{ color: t.pnlPct >= 0 ? "#6FCAA0" : "#E85F5F" }}
                >
                  {t.pnlPct >= 0 ? "+" : ""}
                  {t.pnlPct.toFixed(2)}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:pl-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[2.5px] text-foreground/35">
            §08 — Live tape
          </p>
          <h2 className="mb-6 text-[clamp(32px,4vw,52px)] font-light leading-[0.95] tracking-tight text-foreground">
            See your desk
            <br />
            <em className="font-serif not-italic text-foreground/80">
              trade in real time.
            </em>
          </h2>
          <p className="mb-8 max-w-md text-[14px] leading-relaxed text-foreground/55">
            Every fill from every agent streams to one tape. Filter by symbol,
            side, or agent. Replay any window. Export to CSV.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "agents active", value: "8" },
              { label: "fills / min", value: "~24" },
              { label: "symbols tracked", value: "7" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-foreground/10 bg-foreground/2 px-4 py-2.5"
              >
                <p className="text-[18px] font-light tabular-nums text-foreground">{value}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/35">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
