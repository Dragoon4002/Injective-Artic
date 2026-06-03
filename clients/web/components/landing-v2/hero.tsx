"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroVideoBackground } from "@/components/landing/hero-video-background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCENT = "#6FCAA0";

// faded proof-strip ticker — Better Stack "logo cloud" equivalent, but
// proves liveness instead of social proof (we're early access, no logos yet)
const TICKER = [
  "BTC +0.24%",
  "ETH long 0.42",
  "momentum-v3 approved",
  "SOL receipt sealed",
  "AVAX vol-target",
  "ARB +1.42%",
  "drawdown cap held",
  "LINK skip · low conf",
];

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* HLS video background (CodeNest spec §1) — video + gradients + grid + glow */}
      <HeroVideoBackground />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center"
      >
        {/* eyebrow */}
        <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/5 px-3.5 py-1.5 text-[12px] text-foreground/70 backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
          Artic · now in early access
        </div>

        {/* headline — type is the design; each line stays single on sm+ */}
        <h1 className="text-[clamp(40px,7.5vw,92px)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
          <span className="block sm:whitespace-nowrap">Hands off the charts.</span>
          <span className="block text-white/90 sm:whitespace-nowrap">
            Eyes on the{" "}
            <span className="relative inline-block">
              receipts.
              {/* Framer-style hand-drawn underline accent */}
              <svg
                aria-hidden
                className="underline-draw absolute -bottom-2 left-0 w-full"
                height="14"
                viewBox="0 0 300 14"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9 C 70 3, 150 3, 297 7"
                  stroke={ACCENT}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
        </h1>

        {/* subtitle — tight, one idea per clause */}
        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-foreground/60 md:text-[19px]">
          An AI trading desk that trades for you 24/7. Every move signed and
          replayable — you just review the results.
        </p>

        {/* actions — accent primary + glassy secondary, tied to the page */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connect"
            className={cn(
              buttonVariants(),
              "h-auto rounded-xl px-7 py-3.5 text-[15px] font-semibold text-[#08120D] transition-all hover:-translate-y-0.5"
            )}
            style={{
              background: ACCENT,
              boxShadow: `0 0 0 1px ${ACCENT}66, 0 10px 32px -10px ${ACCENT}99`,
            }}
          >
            Launch app
          </Link>
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto rounded-xl border-foreground/15 bg-white/5 px-7 py-3.5 text-[15px] font-medium text-foreground/80 backdrop-blur-md transition-colors hover:border-foreground/30 hover:bg-white/10 hover:text-foreground"
            )}
          >
            Read the docs
          </Link>
        </div>
      </motion.div>

      {/* proof strip — faded auto-scroll ticker */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-foreground/8 bg-black/20 py-4 backdrop-blur-sm"
      >
        <div className="ticker-mask relative overflow-hidden">
          <div className="ticker-track flex w-max gap-12 whitespace-nowrap font-mono text-[12px] text-foreground/30">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center gap-12">
                {t}
                <span className="h-1 w-1 rounded-full bg-foreground/20" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .underline-draw path {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: draw 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .underline-draw path {
            stroke-dashoffset: 0;
            animation: none;
          }
        }
        .ticker-mask {
          mask-image: linear-gradient(
            90deg,
            transparent,
            black 12%,
            black 88%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            black 12%,
            black 88%,
            transparent
          );
        }
        .ticker-track {
          animation: ticker-scroll 32s linear infinite;
        }
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
