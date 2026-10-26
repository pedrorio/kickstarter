# Proposal

## Why

The repository has no README. A reviewer cannot see what the contracts do, how to run the UI against a local chain, which env names exist, or where the OpenSpec files live.

## What Changes

- Add a root README for the showcase, the factory and campaign flow, local Ganache, and OpenSpec.
- Add `.env.example` with the public variable names and empty values. Do not include `ACCOUNT_MNEMONIC` or any secret.

## Capabilities

### New Capabilities

- `repository-docs`: what the repository tells a reader about behavior, setup, and spec location.

### Modified Capabilities

- None.

## Impact

- `README.md` and `.env.example`. No runtime change.
