# Proposal

## Why

Contract tests run on Mocha plus Ganache 7. Ganache's native websocket binding does not ship for current Node, so it falls back to a slower JavaScript transport and warns on every run. The compiler script calls `solc` 0.5 directly. Hardhat 3 and Foundry are the maintained replacements.

## What Changes

- Move local-chain tests and compilation to Hardhat or Foundry.
- Keep coverage of factory deployment, contribute, the minimum, manager-only requests, approval, and finalize.
- Remove `ganache` and `mocha` from the test path once the new runner is in place. `solc` 0.5 goes with the compiler upgrade, not before the sources can be compiled.
- Do not deploy to a public network as part of the migration.

## Capabilities

### New Capabilities

- `contract-toolchain`: how contracts are compiled and tested on a local chain.

### Modified Capabilities

- None.

## Impact

- `kickstarter/test/**`, `kickstarter/ethereum/compile.js`, and the CI test step.
- Not implemented in the current showcase PR.
