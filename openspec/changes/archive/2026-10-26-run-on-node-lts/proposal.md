# Proposal

## Why

The current Node.js LTS is 24. Next.js 11's webpack build fails on that runtime with `ERR_OSSL_EVP_UNSUPPORTED` unless OpenSSL's legacy provider is enabled, and the Dockerfiles follow `node:latest`, which will not stay on this LTS.

## What Changes

- Declare `engines.node` as `>=24`.
- Pin the app, dev, and test Dockerfiles to `node:24`.
- Keep `NODE_OPTIONS=--openssl-legacy-provider` on the build, dev, and production start scripts. Do not upgrade Next.js.
- Pass `CHAIN_ID` through the compose files so a container can select the same chain the app now expects.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `development-tooling`: the supported runtime is Node.js 24 LTS, including the Docker images.

## Impact

- `kickstarter/package.json`, the three kickstarter Dockerfiles, and the compose files.
- No framework upgrade and no contract deployment.
