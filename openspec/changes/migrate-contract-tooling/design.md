# Design

## Context

See proposal.md. The current tests are JavaScript, use ethers v6, and talk to an in-process Ganache provider. They assert balances with `eth_getBalance` at `latest` because a cached balance was wrong.

## Goals / Non-Goals

**Goals:**

- One maintained toolchain compiles the contracts and runs the local-chain tests on Node 24 without a µWS warning.

**Non-Goals:**

- Changing campaign rules.
- Deploying. The deploy script can later call the same toolchain, still reading `ACCOUNT_MNEMONIC` from the environment and still refusing to print it.

## Decisions

- Prefer Hardhat if the owner wants to keep the tests in JavaScript with ethers. Prefer Foundry if the owner wants Solidity tests and a faster runner. Either meets this proposal. Pick one when implementing; do not keep both.
- Hardhat is the smaller move from the current Mocha tests. Foundry replaces the test language as well as the chain.
- CI should run the new test command instead of `yarn test` via Mocha. The production Next.js build stays a separate step and still must not need the toolchain.

## Risks / Trade-offs

- [Hardhat 3 and the current Next.js 11 app do not share a toolchain] → The contract project can live beside the Next app. Do not bundle Hardhat into the client.
- [Foundry is not a Node dependency] → CI would install Foundry explicitly. That is fine, and it should be pinned.

## Migration Plan

Add the new runner, port the existing assertions, then delete Ganache and Mocha in the same change. Until then, `yarn test` remains the suite CI runs.
