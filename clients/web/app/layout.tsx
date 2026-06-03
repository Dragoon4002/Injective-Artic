import type { Metadata } from "next";
import { Days_One, Karma, Geist_Mono, Poppins, Inter } from "next/font/google";
import { Web3Providers } from "@/components/providers/web3-providers";
import { LoadingScreen } from "@/components/shared/loading-screen";
import "./globals.css";

// ── Site fonts ──────────────────────────────────────────────────────────
// Swap the Google font on either line to restyle the whole site.
//   headingFont → drives every h1–h6
//   bodyFont    → drives all body / UI text
// (Pick any next/font/google family; keep the `variable` name unchanged.)
const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400", // Days One ships a single weight
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artic — AI-Powered Multi-Agent Trading",
  description:
    "Deploy AI trading agents on any market at any scale. Artic is the orchestration hub for AI-powered trading with 30+ quant strategies.",
  icons: {
    icon: [
      { url: "/artic-logo.png", type: "image/png" },
      { url: "/artic-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/artic-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/artic-logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/artic-logo.png",
  },
  keywords: [
    "AI trading",
    "quantitative trading",
    "algorithmic trading",
    "multi-agent systems",
    "crypto trading",
    "stock trading",
    "forex trading",
    "trading bots",
  ],
  authors: [{ name: "Silonelabs" }],
  openGraph: {
    title: "Artic — AI-Powered Multi-Agent Trading",
    description:
      "Deploy AI trading agents on any market at any scale. Artic is the orchestration hub for AI-powered trading with 30+ quant strategies.",
    images: [
      {
        url: "/artic-logo.png",
        width: 800,
        height: 600,
        alt: "Artic Logo",
      },
    ],
    siteName: "Artic",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <LoadingScreen />
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
