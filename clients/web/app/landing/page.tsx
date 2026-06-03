"use client";

import { Navbar } from "@/components/newlanding/navbar";
import { StrategyCatalog } from "@/components/newlanding/strategy-catalog";
import { Waitlist } from "@/components/newlanding/waitlist";
import { LandingSnapContainer } from "@/components/newlanding/landing-snap-container";
import { LandingThemeProvider, useLandingTheme } from "@/components/newlanding/theme-context";

import { Hero } from "@/components/landing-v2/hero";
import { StatStrip } from "@/components/landing-v2/stat-strip";
import { FeaturesBento } from "@/components/landing-v2/features-bento";
import { HowItWorksSection } from "@/components/landing-v2/how-it-works";
import { LlmMatrix } from "@/components/landing-v2/llm-matrix";
import { OnchainProof } from "@/components/landing-v2/onchain-proof";
import { LivePnlFeed } from "@/components/landing-v2/live-pnl-feed";
import { Faq } from "@/components/landing-v2/faq";
import { CtaBanner } from "@/components/landing-v2/cta-banner";
import { Footer } from "@/components/landing-v2/footer";

function LandingShell() {
  const ctx = useLandingTheme();
  const isLight = ctx?.theme === "light";

  return (
    <div className={isLight ? "landing-light" : ""}>
      <div className="bg-background text-foreground">
        <Navbar />
        <LandingSnapContainer
          top={[<Hero key="hero" />]}
          middle={[
            <StatStrip key="stats" />,
            <FeaturesBento key="bento" />,
            <StrategyCatalog key="strat" />,
            <HowItWorksSection key="hiw" />,
            <LlmMatrix key="llm" />,
            <OnchainProof key="oc" />,
            <LivePnlFeed key="pnl" />,
          ]}
          bottom={[
            <Faq key="faq" />,
            <Waitlist key="wait" />,
            <CtaBanner key="cta" />,
            <Footer key="foot" />,
          ]}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <LandingThemeProvider>
      <LandingShell />
    </LandingThemeProvider>
  );
}
