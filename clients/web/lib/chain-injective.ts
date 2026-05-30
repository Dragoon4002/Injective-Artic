// Injective inEVM (chain 2525).
export const CHAIN_ID = "injective-inevm"
export const RPC_URL =
  (process.env.NEXT_PUBLIC_INJECTIVE_RPC_URL as string | undefined) ||
  "https://inevm.calderachain.xyz/http"
export const EVM_CHAIN_ID = Number(
  (process.env.NEXT_PUBLIC_INJECTIVE_CHAIN_ID as string | undefined) || "2525",
)
export const AUTH_CHAIN_NAME = "injective-inevm"

const EXPLORER_BASE =
  (process.env.NEXT_PUBLIC_INJECTIVE_EXPLORER_BASE as string | undefined) ||
  "https://inevm.calderaexplorer.xyz"

export function explorerTxUrl(txHash: string | null | undefined): string | null {
  if (!txHash) return null
  const h = txHash.startsWith("0x") ? txHash : `0x${txHash}`
  return `${EXPLORER_BASE.replace(/\/+$/, "")}/tx/${h}`
}

export function explorerAddressUrl(address: string | null | undefined): string | null {
  if (!address) return null
  return `${EXPLORER_BASE.replace(/\/+$/, "")}/address/${address}`
}

/** Injective inEVM contract addresses (not yet deployed — set via env). */
export const CONTRACTS = {
  decisionLogger:
    (process.env.NEXT_PUBLIC_INJECTIVE_DECISION_LOGGER_ADDRESS as string | undefined) || "",
  tradeLogger:
    (process.env.NEXT_PUBLIC_INJECTIVE_TRADE_LOGGER_ADDRESS as string | undefined) || "",
  strategyINFT:
    (process.env.NEXT_PUBLIC_INJECTIVE_STRATEGY_INFT_ADDRESS as string | undefined) || "",
} as const

export function shortHash(txHash: string | null | undefined): string {
  if (!txHash) return ""
  const h = txHash.startsWith("0x") ? txHash : `0x${txHash}`
  if (h.length <= 12) return h
  return `${h.slice(0, 6)}…${h.slice(-4)}`
}
