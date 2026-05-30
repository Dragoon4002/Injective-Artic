"""Returns the active chain config module based on ACTIVE_CHAIN env var.
ACTIVE_CHAIN=injective → chain_config_injective
ACTIVE_CHAIN=0g (default) → chain_config
"""
import os


def get_chain_config():
    chain = os.getenv("ACTIVE_CHAIN", "0g").lower()
    if chain == "injective":
        from . import chain_config_injective as cfg
    else:
        from . import chain_config as cfg
    return cfg
