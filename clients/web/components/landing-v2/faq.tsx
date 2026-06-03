"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    q: "Is live trading enabled?",
    a: "Paper trading is the default. Live execution on supported exchanges is rolling out per account in alpha — request access in your settings panel.",
  },
  {
    q: "Who custodies my funds?",
    a: "You. Artic never holds keys. Live execution uses an exchange API key you provision; logging signs from your own revocable session — never us.",
  },
  {
    q: "Where do my model keys live?",
    a: "Encrypted at rest, injected into agents only at runtime, never written to disk inside the agent.",
  },
  {
    q: "Can I bring my own strategy?",
    a: "Yes. Strategies are plain Python that emit signals through a stable contract. Drop a file in your strategies repo and the supervisor picks it up.",
  },
  {
    q: "What about slippage and exchange outages?",
    a: "The supervisor halts on max session loss, drift, and stale price data. Each agent enforces its own kill switches independent of the planner.",
  },
  {
    q: "How do I know the AI isn't lying?",
    a: "Every decision is sealed at the moment of inference and cryptographically signed; the signature is published as a tamper-proof receipt. The record can't be edited after the fact — replay why an agent did what, months later, line by line.",
  },
  {
    q: "Do I have to watch it?",
    a: "No. That's the point. The desk runs 24/7 and enforces its own risk limits. You review performance from one dashboard whenever you want — no babysitting.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-28 md:px-12 md:py-36">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[2.5px] text-foreground/35">
        §11 — Questions
      </p>
      <h2 className="mb-12 max-w-[18ch] text-[clamp(36px,4.6vw,60px)] font-light leading-[0.95] tracking-tight text-foreground">
        Things people
        <br />
        <em className="font-serif not-italic text-foreground/80">tend to ask.</em>
      </h2>

      <div className="border-t border-foreground/10">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.q} className="border-b border-foreground/10">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="flex items-baseline gap-5">
                  <span className="pt-1 font-mono text-[10px] tabular-nums text-foreground/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[18px] tracking-tight text-foreground transition-colors group-hover:text-foreground/85 md:text-[22px]">
                    {it.q}
                  </span>
                </span>
                <span
                  className="shrink-0 font-mono text-2xl text-foreground/40 transition-transform"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[60ch] pb-6 pl-12 pr-12 text-[14px] leading-relaxed text-foreground/60 md:text-[15px]">
                      {it.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
