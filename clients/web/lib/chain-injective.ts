// Injective inEVM (chain 1439).
export const CHAIN_ID = "injective-inevm"
export const RPC_URL =
  (process.env.NEXT_PUBLIC_INJECTIVE_RPC_URL as string | undefined) ||
  "https://k8s.testnet.json-rpc.injective.network/"
export const EVM_CHAIN_ID = Number(
  (process.env.NEXT_PUBLIC_INJECTIVE_CHAIN_ID as string | undefined) || "1439",
)
export const AUTH_CHAIN_NAME = "injective-inevm"
export const NATIVE_SYMBOL = "INJ"

const EXPLORER_BASE =
  (process.env.NEXT_PUBLIC_INJECTIVE_EXPLORER_BASE as string | undefined) ||
  "https://testnet.blockscout.injective.network"

export function explorerTxUrl(txHash: string | null | undefined): string | null {
  if (!txHash) return null
  const h = txHash.startsWith("0x") ? txHash : `0x${txHash}`
  return `${EXPLORER_BASE.replace(/\/+$/, "")}/tx/${h}`
}

export function explorerAddressUrl(address: string | null | undefined): string | null {
  if (!address) return null
  return `${EXPLORER_BASE.replace(/\/+$/, "")}/address/${address}`
}

/** Injective inEVM testnet contract addresses. */
export const CONTRACTS = {
  decisionLogger:
    (process.env.NEXT_PUBLIC_INJECTIVE_DECISION_LOGGER_ADDRESS as string | undefined) ||
    "0x70a15Db526104abC2f021b7c690cd89a07EDE49C",
  tradeLogger:
    (process.env.NEXT_PUBLIC_INJECTIVE_TRADE_LOGGER_ADDRESS as string | undefined) ||
    "0xeeb56334152D6bDB62aacF56f8DbCceA5210b78D",
  strategyINFT:
    (process.env.NEXT_PUBLIC_INJECTIVE_STRATEGY_INFT_ADDRESS as string | undefined) || "",
} as const

export function shortHash(txHash: string | null | undefined): string {
  if (!txHash) return ""
  const h = txHash.startsWith("0x") ? txHash : `0x${txHash}`
  if (h.length <= 12) return h
  return `${h.slice(0, 6)}…${h.slice(-4)}`
}
