"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Entry = {
  hash: string;
  kind: "DECISION" | "TRADE" | "HALT";
  symbol: string;
  detail: string;
  block: number;
  age: string;
};

const seed: Entry[] = [
  { hash: "0x9f3ae21c4b88…d1a2", kind: "DECISION", symbol: "BTC/USDT", detail: "supervisor approve · momentum-v3", block: 18420115, age: "12s" },
  { hash: "0x4c12bb87fe1a…77c3", kind: "TRADE", symbol: "ETH/USDT", detail: "open long 0.42 ETH @ 3,420.18", block: 18420112, age: "31s" },
  { hash: "0x77ad06bd29ea…0ef9", kind: "HALT", symbol: "SOL/USDT", detail: "max session loss reached · halt", block: 18420108, age: "1m" },
  { hash: "0x231ec55da714…ba48", kind: "DECISION", symbol: "AVAX/USDT", detail: "switch strategy · vol-target", block: 18420101, age: "2m" },
  { hash: "0xab76f0c33e92…2b90", kind: "TRADE", symbol: "BTC/USDT", detail: "close short 0.18 BTC · pnl +1.42%", block: 18420090, age: "3m" },
  { hash: "0x05de91478af2…f6ce", kind: "DECISION", symbol: "LINK/USDT", detail: "skip · low confidence", block: 18420077, age: "4m" },
];

const kindColor: Record<Entry["kind"], string> = {
  DECISION: "#8FB1E8",
  TRADE: "#6FCAA0",
  HALT: "#F0C561",
};

export function OnchainProof() {
  const [entries, setEntries] = useState(seed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setEntries((prev) => {
        const head = prev[0];
        return [
          {
            ...head,
            hash:
              "0x" +
              Math.random().toString(16).slice(2, 14) +
              "…" +
              Math.random().toString(16).slice(2, 6),
            block: head.block + 1 + Math.floor(Math.random() * 4),
            age: "0s",
          },
          ...prev.slice(0, -1),
        ];
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #8FB1E8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[2.5px] text-foreground/35">
            §07 — Proof
          </p>
          <h2 className="mb-6 text-[clamp(36px,4.6vw,60px)] font-light leading-[0.95] tracking-tight text-foreground">
            Every decision.
            <br />
            <em className="font-serif not-italic text-foreground/80">
              Cryptographically receipted.
            </em>
          </h2>
          <p className="mb-8 max-w-md text-[14px] leading-relaxed text-foreground/55">
            Supervisor verdicts, strategy switches, and trade fills are signed
            and receipted. Full reasoning and trade detail are{" "}
            <strong className="font-normal text-foreground/80">
              sealed and bound by hash
            </strong>{" "}
            — only the fingerprint is published. Replay any decision, three
            months later.
          </p>
          <div className="mb-8 flex flex-wrap gap-2">
            {["Decisions", "Trades", "Strategies"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-foreground/15 px-3 py-1.5 font-mono text-[11px] text-foreground/70"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-blue-accent" />
            <span className="font-mono text-[11px] tabular-nums text-foreground/35">
              receipt #{entries[0].block.toLocaleString()} · live audit stream
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/1.5">
          <div className="flex items-center justify-between border-b border-foreground/10 bg-blue-accent/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-accent" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-blue-accent/70">
                audit-stream · live
              </span>
            </div>
            <span className="font-mono text-[11px] text-foreground/30">
              #{entries[0].block}
            </span>
          </div>

          <div className="flex items-center gap-4 border-b border-foreground/5 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground/20">
            <span className="w-20 shrink-0">type</span>
            <span className="w-24 shrink-0">symbol</span>
            <span className="flex-1">detail</span>
            <span className="hidden w-32 md:inline">receipt</span>
            <span className="w-10 shrink-0 text-right">age</span>
          </div>

          <div className="divide-y divide-white/5">
            {entries.slice(0, 6).map((e, i) => (
              <motion.div
                key={`${e.hash}-${i}`}
                initial={{ opacity: 0, y: -8, backgroundColor: "rgba(143,177,232,0.06)" }}
                animate={{ opacity: 1, y: 0, backgroundColor: "rgba(143,177,232,0)" }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 px-4 py-3 font-mono text-[12px] hover:bg-foreground/2"
              >
                <span
                  className="w-20 shrink-0 text-[10px] uppercase tracking-[1.5px]"
                  style={{ color: kindColor[e.kind] }}
                >
                  {e.kind}
                </span>
                <span className="w-24 shrink-0 text-foreground/50">{e.symbol}</span>
                <span className="flex-1 truncate text-foreground/75">{e.detail}</span>
                <span className="hidden w-32 truncate text-foreground/25 md:inline">{e.hash}</span>
                <span className="w-10 shrink-0 text-right text-foreground/35">{e.age}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
