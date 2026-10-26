# Design

## Context

See proposal.md. `solc` and `fs-extra` are imported only by the compile script. `ganache` is imported only by the contract tests. ESLint and solhint are not imported by the Next.js pages. `next build` already ignores ESLint during the build.

## Goals / Non-Goals

**Goals:**

- A production install can build and start the Next.js app.
- A full install can still run Mocha against a local chain and the compile script.

**Non-Goals:**

- Replacing Ganache, Mocha, or solc. That stays a separate proposal.
- Adding an ESLint config that can actually run. `eslint-config-airbnb` is not installed, and this change does not add a lint script.

## Decisions

- Move the six packages as a group. `fs-extra` stays with `solc` because only the compile script uses it.
- The production Dockerfile uses `yarn install --frozen-lockfile --production` before `yarn build`. Development and test Dockerfiles keep a full install.
- Do not delete the packages from the lockfile. Development installs still need them.

## Risks / Trade-offs

- [A future page import of `solc` or `ganache` would break the production build] → Those imports stay in the compile script and the tests. The production-install build is the check.
- [ESLint 5 remains installed for developers but cannot load the Airbnb config] → Left as-is. The build does not invoke it.
