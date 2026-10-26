# Spec Delta

## ADDED Requirements

### Requirement: Node.js 24 LTS
The package manifest SHALL require Node.js 24 or newer. The app, dev, and test Dockerfiles SHALL use the `node:24` image. The build, dev, and production start scripts SHALL set `NODE_OPTIONS=--openssl-legacy-provider` so the Next.js 11 production and dev builds can run on that Node version. Compose files SHALL pass `CHAIN_ID` through to the app service.

#### Scenario: Next build on Node 24
- **WHEN** the production build script runs on Node.js 24
- **THEN** it sets the OpenSSL legacy provider
- **AND** the build completes without `ERR_OSSL_EVP_UNSUPPORTED`

#### Scenario: Dockerfiles
- **WHEN** the app, dev, or test Dockerfile is read
- **THEN** it starts from `node:24`
- **AND** it does not start from `node:latest`
