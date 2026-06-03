"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, X } from "lucide-react";

const INK = "#0E141A";
const ACCENT = "#6FCAA0";

const resources = [
  { label: "Agent Framework", href: "/docs" },
  { label: "Strategy Catalog", href: "/docs/strategies" },
  { label: "Hub API", href: "/docs/hub-api" },
  { label: "Smart Contracts", href: "/docs/architecture" },
];

const socials = [
  { label: "Twitter / X", href: "https://x.com/artic_trade", Icon: X },
  { label: "GitHub", href: "https://github.com/Dragoon4002/artic-trader", Icon: GitBranch },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  return (
    <footer className="relative overflow-hidden" style={{ background: "#CCD2D6" }}>
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ borderColor: `${INK}20` }}
      >
        {/* col 1 — resources */}
        <div
          className="px-8 md:px-12 pt-10 pb-12 md:border-r"
          style={{ borderColor: `${INK}20` }}
        >
          <p
            className="text-[10px] tracking-[2.5px] uppercase font-mono mb-6"
            style={{ color: `${INK}55` }}
          >
            Resources (coming soon)
          </p>
          <ul className="space-y-3">
            {resources.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[14px] transition-opacity hover:opacity-100"
                  style={{ color: `${INK}99` }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* col 2 — socials */}
        <div
          className="px-8 md:px-12 pt-10 pb-12 md:border-r"
          style={{ borderColor: `${INK}20` }}
        >
          <p
            className="text-[10px] tracking-[2.5px] uppercase font-mono mb-6"
            style={{ color: `${INK}55` }}
          >
            Socials
          </p>
          <ul className="space-y-3">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center gap-3 text-[14px] transition-opacity hover:opacity-100"
                  style={{ color: `${INK}99` }}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: `${INK}55` }} />}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* col 3 — waitlist (hero-style heading + CTA) */}
        <div className="px-8 md:px-12 pt-10 pb-12 flex flex-col justify-between gap-8">
          <div>
            <p
              className="text-[10px] tracking-[2.5px] uppercase font-mono mb-5"
              style={{ color: `${INK}55` }}
            >
              Waitlist
            </p>
            {/* heading — heading font + Framer-style underline accent */}
            <h2
              className="text-[clamp(24px,2.6vw,36px)] font-semibold leading-[1.05] tracking-[-0.02em] mb-3"
              style={{ color: INK }}
            >
              Be first on
              <br />
              the{" "}
              <span className="relative inline-block">
                rate curve.
                <motion.svg
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 w-full"
                  height="12"
                  viewBox="0 0 220 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M3 8 C 55 3, 130 3, 217 6"
                    stroke={ACCENT}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.svg>
              </span>
            </h2>
            <p className="text-[13px] mb-6 leading-relaxed" style={{ color: `${INK}80` }}>
              Early access to the platform, strategy updates, and launch news.
            </p>

            {/* CTA — hero-style: rounded input + accent pill button */}
            {sent ? (
              <p
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium"
                style={{ background: `${ACCENT}26`, color: INK }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                You&apos;re on the list — invites roll out weekly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your work email"
                  className="flex-1 rounded-xl border border-[#0E141A]/12 bg-white px-4 py-3 text-[13px] outline-none transition-colors focus:border-[#6FCAA0]"
                  style={{ color: INK }}
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-xl px-5 py-3 text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ background: ACCENT, color: "#08120D" }}
                >
                  Join the waitlist →
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] font-mono" style={{ color: `${INK}50` }}>
            © 2026 Silone Labs
          </p>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="overflow-hidden leading-none select-none pointer-events-none" aria-hidden>
        <p
          className="font-bold tracking-tighter text-center whitespace-nowrap"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(80px, 18vw, 260px)",
            lineHeight: 0.82,
            marginBottom: "-0.12em",
            color: `${INK}18`,
          }}
        >
          ARTIC
        </p>
      </div>
    </footer>
  );
}
