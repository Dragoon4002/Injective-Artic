// chain-active.ts — consumers import from here for chain-agnostic access.
// Switch active chain via NEXT_PUBLIC_ACTIVE_CHAIN env var.
// Default: 0g (chain.ts). Set to "injective" for inEVM (chain-injective.ts).

import * as zeroG from "./chain"
import * as injective from "./chain-injective"

const active = process.env.NEXT_PUBLIC_ACTIVE_CHAIN === "injective" ? injective : zeroG

export const CHAIN_ID = active.CHAIN_ID
export const EVM_CHAIN_ID = active.EVM_CHAIN_ID
export const AUTH_CHAIN_NAME = active.AUTH_CHAIN_NAME
export const NATIVE_SYMBOL = active.NATIVE_SYMBOL
export const RPC_URL = active.RPC_URL
export const CONTRACTS = active.CONTRACTS
export const explorerTxUrl = active.explorerTxUrl
export const explorerAddressUrl = active.explorerAddressUrl
export const shortHash = active.shortHash
