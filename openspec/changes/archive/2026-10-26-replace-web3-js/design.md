# Design

## Context

See proposal.md. The app is Next.js 11 with a pages router. A framework upgrade is out of scope, so the Ethereum library has to load from CommonJS as well as from the browser bundle.

## Goals / Non-Goals

**Goals:**

- One maintained library for reads, writes, tests, and the deploy script.
- Explicit HTTP reads from `NETWORK_ENDPOINT`, separate from signing.
- No deploy secret in the client build.

**Non-Goals:**

- Replacing Next.js, Semantic UI, Ganache, or the Solidity compiler.
- Deploying contracts.

## Decisions

- Use ethers v6 (`6.17.0`) rather than viem. ethers v6 still publishes a CommonJS build, so Next.js 11, Mocha, and `node ethereum/deploy.js` can load it without a transpile plugin. viem is ESM-only; using it here means transpiling viem and its dependency tree or upgrading Next, which this change does not do. viem is the better fit after an App Router upgrade.
- Reads use `JsonRpcProvider` with `staticNetwork` so server rendering does not wait on chain detection and does not touch `window`.
- Writes use `BrowserProvider` around an EIP-1193 provider. `eth_requestAccounts` runs when the visitor submits, not when the page loads. The wallet-status UI is a separate change.
- `HDNodeWallet.fromPhrase` derives the same first account the old HD wallet provider used (`m/44'/60'/0'/0/0`). The script redacts the mnemonic if an error message contains it.
- Chain id resolution lives in `ethereum/chains.js`, shared by `next.config.js` and runtime config. Deprecated ids 3, 4, 5, and 42 become Sepolia. `1337` and `31337` stay local.
- `eslint.ignoreDuringBuilds` is set because Next.js 11 refuses ESLint 5 during `next build`, and the checked-in config extends `airbnb` without that package installed. Lint is not claimed as passing.

## Risks / Trade-offs

- [ethers v6 is larger than a tree-shaken viem import] → Acceptable for this showcase. Revisit with the Next.js upgrade.
- [Public runtime config can be baked at build time] → `_app` reads `process.env` on the server and passes the result to the client so SSR follows the process environment.
- [`BrowserProvider.getBalance` can return a cached block] → Contract tests read `eth_getBalance` at `latest`.

## Migration Plan

- Install and build on Node 24 with `NODE_OPTIONS=--openssl-legacy-provider` because Next.js 11's webpack build hits OpenSSL 3.
- Do not run the deploy script.
- Rollback is reverting this change; no on-chain migration.
