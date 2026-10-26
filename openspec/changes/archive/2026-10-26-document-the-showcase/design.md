# Design

## Context

See proposal.md. The app reads env from the process and from Next.js env files in `kickstarter/`. The root `.gitignore` ignores `.env` only, so a root `.env.example` can be committed. `kickstarter/.gitignore` ignores `.env*`, which is why the example does not live there.

## Goals / Non-Goals

**Goals:**

- A reader can install, test, start a local chain, deploy only to that chain, and start the app without a secret in git.

**Non-Goals:**

- Deploying to Sepolia or any public network.
- Documenting a sample mnemonic. Ganache prints one locally; the README tells the reader not to commit it.

## Decisions

- The README names `ACCOUNT_MNEMONIC` and says only the deploy script reads it. `.env.example` omits that name so a copied file cannot grow a committed mnemonic by accident.
- Local chain instructions use Ganache's defaults: port 8545 and chain id 1337. `CHAIN_ID` must be set to 1337 or the UI will expect Sepolia.
- Open proposals are listed by change id so the README points at work that is intentionally not done.

## Risks / Trade-offs

- [A reader pastes the Ganache mnemonic into a tracked file] → The README says not to, and `.env.example` has nowhere to put it. `kickstarter/.gitignore` ignores `.env*`.
