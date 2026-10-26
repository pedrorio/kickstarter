# Design

## Context

See proposal.md for why `window.web3` cannot stay. React 16.6 has no hooks, so wallet session state lives in a class component and context. Reads already go through ethers `JsonRpcProvider`. Writes need a signer from the browser provider.

## Goals / Non-Goals

**Goals:**

- Discover a wallet without prompting, then request accounts only from a visitor action.
- Keep signing unavailable until the wallet is connected on the expected chain.
- Render the same shell on the server, where no wallet exists.

**Non-Goals:**

- Supporting multiple simultaneous wallets or a wallet picker beyond the first EIP-6963 announcement.
- Upgrading Next.js, React, or the contract toolchain.
- Deploying contracts or storing a mnemonic in the browser.

## Decisions

- Prefer the first EIP-6963 provider that exposes `request`. If none is announced, use `window.ethereum` when it exposes `request`. Ignore `window.web3`.
- Do not call `eth_requestAccounts` from discovery. Discovery uses `eth_accounts` and `eth_chainId`. Connect, Try again, and a signing action call `eth_requestAccounts`.
- Treat chain mismatch as its own state. Switch with `wallet_switchEthereumChain`. On error 4902, call `wallet_addEthereumChain` only when `NETWORK_ENDPOINT` is set.
- User rejection is error code 4001 or `ACTION_REJECTED`. That is a rejected state, not a generic failure.
- Reads stay on the read-only JSON-RPC endpoint, including in the browser, so a missing wallet does not blank the campaign pages.
- Map transport failures to one readable alert. Leave other read errors, such as a missing factory address, as their own messages.
- Status text and actions are native controls inside a `role="status"` region with `aria-live="polite"`.

## Risks / Trade-offs

- [EIP-6963 announcements can arrive after the first paint] → Wait briefly for announcements, and the first server HTML says the app is still checking.
- [A wallet may not implement `wallet_addEthereumChain`] → Show the wallet error and leave the visitor on the wrong-chain state.
- [The first announced wallet may not be the one the visitor wanted] → Acceptable for this showcase; a picker is out of scope.
- [Real MetaMask prompts cannot be exercised in CI] → Cover discovery, rejection, chain mismatch, and events with a fake EIP-1193 provider in unit tests.

## Migration Plan

Replace submit-time account lookup with the session from the wallet status. No data migration. Rollback is reverting the client provider selection; contracts are unchanged.
