# Proposal

## Why

Nothing runs the contract tests or the Next.js build when a change is pushed. The showcase needs that check on the current Node LTS, including a production install that omits the contract toolchain.

## What Changes

- Add a GitHub Actions workflow that checks out the repo, installs with a frozen lockfile on Node 24, runs the Mocha contract tests, runs `next build`, then repeats the build from production dependencies only.
- Do not add a lint or typecheck step. The repo has no TypeScript project, and ESLint cannot run because `eslint-config-airbnb` is not installed.
- Use placeholder public env values in CI. Do not provide `ACCOUNT_MNEMONIC`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `development-tooling`: continuous integration covers install, contract tests, and the production build.

## Impact

- `.github/workflows/ci.yml`.
- No application runtime change and no contract deployment.
