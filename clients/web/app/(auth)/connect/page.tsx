import type { Metadata } from "next"
import { ConnectWalletClient } from "./connect-client"

const _isInjective = process.env.NEXT_PUBLIC_ACTIVE_CHAIN === "injective"
const _chainLabel = _isInjective ? "Injective inEVM" : "0G mainnet"
const _chainId = _isInjective
  ? (process.env.NEXT_PUBLIC_INJECTIVE_CHAIN_ID || "1439")
  : (process.env.NEXT_PUBLIC_ZERO_G_CHAIN_ID || "16661")

export const metadata: Metadata = {
  title: "Connect Wallet — Artic",
  description: `Connect your EVM wallet on ${_chainLabel} to use Artic.`,
}

export default function ConnectPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-foreground">Connect your wallet</h1>
          <p className="mt-3 text-sm text-foreground/60">
            Sign in with an EVM wallet on {_chainLabel}.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8">
          <ConnectWalletClient />
        </div>

        <p className="mt-6 text-center text-xs text-foreground/40">
          EIP-4361 SIWE · {_chainLabel} Chain ID {_chainId}
        </p>
      </div>
    </main>
  )
}
