"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

type Stat = {
  num: string;
  target: number | null; // null = no count-up (e.g. ∞)
  suffix?: string;
  label: string;
  note: string;
};

const stats: Stat[] = [
  { num: "30", target: 30, suffix: "+", label: "proven strategies", note: "momentum · mean-rev · stat-arb" },
  { num: "24/7", target: null, label: "always-on", note: "agents never sleep" },
  { num: "100", target: 100, suffix: "%", label: "decisions logged", note: "signed · replayable" },
  { num: "∞", target: null, label: "agents per account", note: "isolated, parallel" },
];

function Counter({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v).toString());
  const [text, setText] = useState("0");

  useEffect(() => {
    if (inView) mv.set(target);
  }, [inView, target, mv]);

  useEffect(() => rounded.on("change", setText), [rounded]);

  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}

export function StatStrip() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-36">
      <div className="mb-12 flex items-end justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[2.5px] text-foreground/35">
          §01 — In numbers
        </p>
        <div className="mx-6 hidden h-px flex-1 bg-foreground/10 md:block" />
        <p className="font-mono text-[10px] uppercase tracking-[2px] text-foreground/35">
          live · paper · supervised
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-10 gap-y-16 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="relative"
          >
            <div
              className="font-serif font-light leading-[0.85] text-foreground"
              style={{ fontSize: "clamp(64px, 8vw, 132px)" }}
            >
              {s.target !== null ? (
                <Counter target={s.target} suffix={s.suffix} />
              ) : (
                s.num
              )}
            </div>
            <div className="mt-4">
              <p className="mb-1 text-[13px] tracking-tight text-foreground/85">
                {s.label}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[1.2px] text-foreground/35">
                {s.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
