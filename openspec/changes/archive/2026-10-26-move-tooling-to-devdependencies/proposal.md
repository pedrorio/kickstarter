# Proposal

## Why

Contract compilation, the local chain, Mocha, ESLint, and solhint are installed as runtime dependencies. A production Next.js install should not need them, and the production image should not download them.

## What Changes

- Move `eslint`, `fs-extra`, `ganache`, `mocha`, `solc`, and `solhint` from `dependencies` to `devDependencies`.
- Keep `next`, `react`, `react-dom`, `ethers`, `semantic-ui-react`, and `next-routes` as runtime dependencies.
- Install production image dependencies with `yarn install --frozen-lockfile --production` so `next build` runs without the contract toolchain.

## Capabilities

### New Capabilities

- `development-tooling`: which packages are required to run the app, and which exist only for tests, compilation, and lint.

### Modified Capabilities

- None.

## Impact

- `kickstarter/package.json`, the lockfile, and the production Dockerfile install line.
- Contract tests still install those tools in a full development install.
