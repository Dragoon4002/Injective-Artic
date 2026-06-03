"use client";

import { motion } from "framer-motion";

const OpenAIGlyph = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <circle cx="20" cy="20" r="14" />
    <circle cx="20" cy="20" r="6" />
    <line x1="20" y1="6" x2="20" y2="14" />
    <line x1="20" y1="26" x2="20" y2="34" />
    <line x1="6" y1="20" x2="14" y2="20" />
    <line x1="26" y1="20" x2="34" y2="20" />
  </svg>
);

const AnthropicGlyph = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8 L34 32 H6 Z" />
    <path d="M20 18 L26 30 H14 Z" fill="currentColor" fillOpacity="0.25" stroke="none" />
  </svg>
);

const GoogleGlyph = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M33 20 A13 13 0 1 0 20 33" />
    <path d="M22 20 H33" />
    <line x1="33" y1="17" x2="33" y2="23" />
  </svg>
);

const DeepSeekGlyph = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <circle cx="15" cy="20" r="9" />
    <circle cx="25" cy="20" r="9" />
    <path d="M28 14 L34 8 M28 26 L34 32" strokeOpacity="0.5" />
  </svg>
);

const SealedGlyph = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="13" />
    <path d="M13 20 L20 27 L27 13" />
    <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
  </svg>
);

const providers = [
  { name: "Artic Sealed", model: "sealed · default", Glyph: SealedGlyph },
  { name: "OpenAI", model: "gpt-4o · o1 · o3", Glyph: OpenAIGlyph },
  { name: "Anthropic", model: "claude opus · sonnet", Glyph: AnthropicGlyph },
  { name: "Google", model: "gemini 2.5 · flash", Glyph: GoogleGlyph },
  { name: "DeepSeek", model: "v3 · r1", Glyph: DeepSeekGlyph },
];

export function LlmMatrix() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[2.5px] text-foreground/35">
            §06 — Models
          </p>
          <h2 className="max-w-[22ch] text-[clamp(28px,3.6vw,44px)] font-light leading-none tracking-tight text-foreground">
            Bring your own key.
            <br />
            <em className="font-serif not-italic text-foreground/70">
              Swap models any time.
            </em>
          </h2>
        </div>
        <p className="max-w-sm text-[12px] leading-relaxed text-foreground/50">
          Default runs through Artic&apos;s sealed inference — signed and
          verifiable. Or bring your own key; planner and supervisor can be
          different models.
        </p>
      </div>

      <div className="grid grid-cols-2 border-l border-t border-foreground/10 lg:grid-cols-5">
        {providers.map(({ name, model, Glyph }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative border-b border-r border-foreground/10 px-6 py-10 transition-colors hover:bg-foreground/2 md:px-10 md:py-14"
          >
            <span className="absolute right-4 top-3 font-mono text-[10px] tabular-nums text-foreground/20">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="mb-6 text-foreground/25 transition-colors group-hover:text-foreground/55">
              <Glyph />
            </div>
            <p className="mb-1 text-[16px] tracking-tight text-foreground">{name}</p>
            <p className="font-mono text-[11px] tracking-wide text-foreground/40">{model}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
