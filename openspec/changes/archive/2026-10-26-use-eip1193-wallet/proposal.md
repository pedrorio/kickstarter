# Proposal

## Why

Browser signing still depends on `window.web3`, which current wallets do not inject, so in-browser transactions cannot be signed. Account access also has to be an explicit visitor action, and server rendering has no `window`.

## What Changes

- **BREAKING**: Stop treating `window.web3` as a wallet. Discover an EIP-1193 provider, preferring an EIP-6963 announcement, and fall back to `window.ethereum`.
- Ask for accounts with `eth_requestAccounts` only after the visitor chooses Connect, Try again, or a signing action. Page load may call `eth_accounts` and `eth_chainId` only.
- Show a keyboard-accessible status for pending discovery, no wallet, disconnected, connecting, rejected, other connection errors, wrong chain, and connected.
- Prompt the wallet to switch to the configured chain, and to add that chain when the wallet does not know it and a public RPC URL is configured.
- Follow `accountsChanged` and `chainChanged`.
- On the server, and for contract reads, use the read-only endpoint from public env. A failed read keeps the page shell and shows a readable alert.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `wallet-connection`: replace the legacy injected provider with explicit EIP-1193 connection and visible wallet states.
- `campaign-pages`: send transactions from the connected account, and keep the page shell when a read fails.

## Impact

- Header wallet status, campaign and request forms, and the provider used for reads versus writes.
- No contract deployment and no new secret env vars. `NETWORK_ENDPOINT` stays the public read endpoint.
