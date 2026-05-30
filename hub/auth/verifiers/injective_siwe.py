"""EVM personal_sign verifier for Injective inEVM (chain 2525).
inEVM is EVM-compatible — EIP-191 signature math is identical to 0G.
"""
from .evm_siwe import verify_evm_siwe as verify_injective_siwe

__all__ = ["verify_injective_siwe"]
