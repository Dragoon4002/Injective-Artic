"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "I",
    title: "Configure your desk.",
    description:
      "Set token pair, model, risk limits, leverage, and strategy overrides. Under two minutes — zero boilerplate.",
    code: `{
  "name": "snowdrift",
  "symbol": "BTC/USDT",
  "model": "auto",
  "leverage": 3,
  "risk_profile": "balanced",
  "tp_pct": 4.5,
  "sl_pct": 2.0,
  "auto_start": true
}`,
  },
  {
    number: "II",
    title: "Deploy anywhere.",
    description:
      "Launch locally or push to the cloud. The hub tracks heartbeats, persists state, and isolates every agent in its own process.",
    code: `POST /agents
→ 201 Created

{
  "id": "agt_8xKp2mNq",
  "name": "snowdrift",
  "status": "starting",
  "symbol": "BTC/USDT"
}

# Hub spawned agent
# Heartbeat: ✓ alive`,
  },
  {
    number: "III",
    title: "Review & profit.",
    description:
      "Watch trades stream in real time. Agents auto-rebalance on the supervisor interval. Pause, reconfigure, or scale with one command.",
    code: `[14:22:01] [TICK]   BTC/USDT 97,420.00
[14:22:01] [MODEL]  decision → momentum-v3
[14:22:02] [ACTION] open long 0.12 BTC
[14:22:03] [TRADE]  filled @ 97,418.50
[14:22:03] [PROOF]  receipt sealed ✓
[14:22:03] [PNL]    unrealised +0.24%
[14:23:01] [SUPER]  approve · hold`,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 text-foreground lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 lg:mb-24">
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-foreground/50">
            <span className="h-px w-8 bg-foreground/30" />
            How it works
          </span>
          <h2
            className={`text-4xl font-light tracking-tight transition-all duration-700 lg:text-6xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Three steps.
            <br />
            <em className="font-serif not-italic text-foreground/50">
              Infinite desk capacity.
            </em>
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-0">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`group w-full border-b border-foreground/10 py-8 text-left transition-all duration-500 ${
                  activeStep === index ? "opacity-100" : "opacity-35 hover:opacity-65"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="w-8 shrink-0 pt-0.5 font-serif text-3xl text-foreground/30">
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-light tracking-tight transition-transform duration-300 group-hover:translate-x-1 lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-foreground/60">
                      {step.description}
                    </p>
                    {activeStep === index && (
                      <div className="mt-4 h-px overflow-hidden bg-foreground/15">
                        <div
                          className="h-full bg-background"
                          style={{ animation: "hiw-progress 5s linear forwards" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="self-start lg:sticky lg:top-32">
            <div className="overflow-hidden rounded-2xl border border-foreground/10">
              <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                </div>
                <span className="font-mono text-[11px] text-foreground/35">
                  {activeStep === 0
                    ? "agent.config.json"
                    : activeStep === 1
                      ? "hub · spawn"
                      : "artic · live tape"}
                </span>
              </div>

              <div className="min-h-[260px] p-7 font-mono text-[13px]">
                <pre className="leading-loose text-foreground/65">
                  {steps[activeStep].code.split("\n").map((line, li) => (
                    <div
                      key={`${activeStep}-${li}`}
                      className="code-line-reveal"
                      style={{ animationDelay: `${li * 60}ms` }}
                    >
                      <span className="mr-4 inline-block w-6 select-none text-right tabular-nums text-foreground/20">
                        {li + 1}
                      </span>
                      <span className="inline-flex flex-wrap">
                        {line.split("").map((char, ci) => (
                          <span
                            key={`${activeStep}-${li}-${ci}`}
                            className="code-char-reveal"
                            style={{ animationDelay: `${li * 60 + ci * 10}ms` }}
                          >
                            {char === " " ? " " : char}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              <div className="flex items-center gap-2.5 border-t border-foreground/10 px-5 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-teal" />
                <span className="font-mono text-[11px] text-foreground/40">
                  {activeStep === 0
                    ? "valid · ready to spawn"
                    : activeStep === 1
                      ? "agent alive · heartbeat ✓"
                      : "streaming · receipted ✓"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hiw-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .code-line-reveal {
          opacity: 0;
          transform: translateX(-8px);
          animation: lineReveal 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes lineReveal {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .code-char-reveal {
          opacity: 0;
          filter: blur(6px);
          animation: charReveal 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes charReveal {
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
