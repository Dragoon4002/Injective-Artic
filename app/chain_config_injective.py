"""Chain config — Injective inEVM (chain 2525).

Resolves RPC URL / private key / chain ID / explorer base from env.
"""
import os
from typing import Optional


def get_rpc_url() -> Optional[str]:
    return os.getenv("INJECTIVE_RPC_URL") or "https://inevm.calderachain.xyz/http"


def get_private_key() -> Optional[str]:
    return os.getenv("PRIVATE_KEY") or None


def get_chain_id() -> Optional[str]:
    """EVM chain ID. Injective inEVM = 2525."""
    return os.getenv("INJECTIVE_CHAIN_ID") or "2525"


def get_explorer_base() -> str:
    """Injective inEVM explorer."""
    return os.getenv("INJECTIVE_EXPLORER_BASE", "https://inevm.calderaexplorer.xyz").rstrip("/")


def explorer_tx_url(tx_hash: str) -> str:
    if not tx_hash:
        return ""
    h = tx_hash if tx_hash.startswith("0x") else f"0x{tx_hash}"
    return f"{get_explorer_base()}/tx/{h}"


def explorer_address_url(address: str) -> str:
    if not address:
        return ""
    return f"{get_explorer_base()}/address/{address}"
