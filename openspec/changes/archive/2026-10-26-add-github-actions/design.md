# Design

## Context

See proposal.md. Tests start Ganache in process, so CI does not need a separate chain service. The Next.js build reads public env at build time and again per request.

## Goals / Non-Goals

**Goals:**

- One workflow job runs install, contract tests, a full build, and a production-only build on Node 24.

**Non-Goals:**

- Deploying contracts or publishing images.
- Making ESLint pass. That waits on a config that exists.
- Adding a typecheck for a JavaScript codebase.

## Decisions

- `ubuntu-latest` with `actions/setup-node` node 24 and the Yarn lockfile cache.
- Build env uses a loopback `NETWORK_ENDPOINT`, a zero factory address, and Sepolia's chain id. Those values are not secrets.
- The production step deletes `node_modules` and `.next` before `yarn install --frozen-lockfile --production` so the second build cannot reuse the development install.
- Lint stays out of the workflow until a script exists. The workflow test asserts `yarn lint` and `tsc` are absent.

## Risks / Trade-offs

- [Ganache prints a µWS fallback warning on Node 24] → Tests still pass on the JavaScript transport. The warning is not a failure.
- [CI cannot sign with MetaMask] → Wallet behavior stays covered by unit tests and local screenshots.
