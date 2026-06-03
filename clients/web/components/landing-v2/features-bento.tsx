"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    title: "Tamper-proof reasoning",
    tag: "Sealed",
    description:
      "Every model decision runs in a sealed environment and is cryptographically signed — so you can prove the AI reasoned exactly as recorded.",
    icon: "/assets/landing/icons/fox-brain.svg",
    accent: "#6FCAA0",
    pills: ["Sealed", "Signed", "Verifiable"],
  },
  {
    title: "One agent per symbol",
    tag: "Agents",
    description:
      "Each market gets its own isolated agent with its own position, config, and context. They run in parallel and can't interfere.",
    icon: "/assets/landing/icons/paw-pack.svg",
    accent: "#F3E4D1",
    pills: ["Per-symbol", "Isolated", "Parallel"],
  },
  {
    title: "30+ quant strategies",
    tag: "Strategies",
    description:
      "Momentum, mean-rev, stat-arb, volatility, smart-money and more — battle-tested on live markets.",
    icon: "/assets/landing/icons/glacier-chart.svg",
    accent: "#8FB1E8",
    pills: ["Momentum", "Mean-rev", "Stat-arb"],
  },
  {
    title: "Risk-first by default",
    tag: "Safety",
    description:
      "Per-agent drawdown caps and kill switches. A supervisor enforces limits — no agent exceeds its mandate.",
    icon: "/assets/landing/icons/ice-shield.svg",
    accent: "#B3C9EE",
    pills: ["Kill switch", "Drawdown cap", "Guardrails"],
  },
  {
    title: "Every move, receipted",
    tag: "Proof",
    description:
      "Each decision and fill is receipted and replayable. Audit why an agent did what — months later, line by line.",
    icon: "/assets/landing/icons/frozen-globe.svg",
    accent: "#6FCAA0",
    pills: ["Logged", "Replayable", "Yours"],
  },
  {
    title: "Own & trade strategies",
    tag: "Markets",
    description:
      "Publish a strategy as an encrypted, tradable asset. Buyers run it without ever seeing the config.",
    icon: "/assets/landing/icons/aurora-pulse.svg",
    accent: "#F0C561",
    pills: ["Encrypted", "Tradable", "Private"],
  },
];

const COL_TPLS = ["2fr 0.75fr 0.75fr", "0.75fr 2fr 0.75fr", "0.75fr 0.75fr 2fr"];
const ROW_TPLS = ["2fr 0.75fr", "0.75fr 2fr"];
const BASE_COLS = "1fr 1fr 1fr";
const BASE_ROWS = "1fr 1fr";

export function FeaturesBento() {
  const [active, setActive] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function setGrid(col: number | null, row: number | null) {
    const el = gridRef.current;
    if (!el) return;
    el.style.gridTemplateColumns = col !== null ? COL_TPLS[col] : BASE_COLS;
    el.style.gridTemplateRows = row !== null ? ROW_TPLS[row] : BASE_ROWS;
  }

  function enter(i: number) {
    if (timer.current) clearTimeout(timer.current);
    setActive(i);
    setGrid(i % 3, Math.floor(i / 3));
  }

  function leave() {
    timer.current = setTimeout(() => {
      setActive(null);
      setGrid(null, null);
    }, 80);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[2.5px] text-foreground/35">
          Capabilities
        </p>
        <h2 className="text-[clamp(36px,5vw,64px)] font-light leading-[0.95] tracking-tight text-foreground">
          Everything your desk needs.
        </h2>
      </motion.div>

      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: BASE_COLS,
          gridTemplateRows: BASE_ROWS,
          gap: "10px",
          height: "490px",
          transition:
            "grid-template-columns 0.55s cubic-bezier(0.4,0,0.2,1), grid-template-rows 0.55s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {features.map((f, i) => (
          <BentoCell
            key={f.title}
            feature={f}
            isActive={active === i}
            onEnter={() => enter(i)}
            onLeave={leave}
          />
        ))}
      </div>
    </section>
  );
}

function BentoCell({
  feature: f,
  isActive,
  onEnter,
  onLeave,
}: {
  feature: (typeof features)[0];
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        borderRadius: "16px",
        border: `1px solid ${isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)"}`,
        background: "#0A0E12",
        overflow: "hidden",
        cursor: "default",
        position: "relative",
        transition: "border-color 0.3s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(70% 60% at 90% 10%, ${f.accent}, transparent)`,
          opacity: isActive ? 0.14 : 0.07,
          transition: "opacity 0.4s ease",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "1.25rem 1.4rem",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: "20px",
              background: `${f.accent}1a`,
              color: f.accent,
              border: `0.5px solid ${f.accent}33`,
              fontFamily: "var(--font-mono, monospace)",
              whiteSpace: "nowrap",
            }}
          >
            {f.tag}
          </span>
          <div
            style={{
              width: isActive ? 44 : 34,
              height: isActive ? 44 : 34,
              position: "relative",
              flexShrink: 0,
              transition:
                "width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <Image src={f.icon} alt={f.title} fill className="object-contain" />
          </div>
        </div>

        <p
          style={{
            fontSize: isActive ? "20px" : "15px",
            fontWeight: 300,
            color: "rgba(242,240,235,1)",
            margin: "0 0 6px",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            transition: "font-size 0.55s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {f.title}
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(242,240,235,0.5)",
            lineHeight: 1.6,
            margin: 0,
            opacity: isActive ? 1 : 0,
            maxHeight: isActive ? "120px" : "0px",
            overflow: "hidden",
            transition:
              "opacity 0.35s ease 0.12s, max-height 0.5s cubic-bezier(0.4,0,0.2,1) 0.05s",
          }}
        >
          {f.description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginTop: "auto",
            paddingTop: "10px",
            opacity: isActive ? 1 : 0,
            maxHeight: isActive ? "60px" : "0px",
            overflow: "hidden",
            transition:
              "opacity 0.3s ease 0.2s, max-height 0.5s cubic-bezier(0.4,0,0.2,1) 0.05s",
          }}
        >
          {f.pills.map((p) => (
            <span
              key={p}
              style={{
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "20px",
                border: "0.5px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.55)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
