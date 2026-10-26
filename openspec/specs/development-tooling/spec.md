# development-tooling Specification

## Purpose
Development tooling covers which packages the running app needs and which packages exist only to compile contracts, run tests, or lint.

## Requirements

### Requirement: Contract and lint tools are development dependencies
`eslint`, `fs-extra`, `ganache`, `mocha`, `solc`, and `solhint` SHALL be declared in devDependencies and SHALL NOT be declared in dependencies. `next`, `react`, `react-dom`, `ethers`, `semantic-ui-react`, and `next-routes` SHALL remain dependencies.

#### Scenario: Package manifest is read
- **WHEN** the package manifest is inspected
- **THEN** the contract, test, and lint packages listed above are devDependencies
- **AND** the Next.js runtime packages listed above are dependencies

### Requirement: Production install can build the app
An install that omits devDependencies SHALL be able to run the Next.js production build. That build SHALL NOT require `ganache`, `mocha`, `solc`, `solhint`, `eslint`, or `fs-extra`.

#### Scenario: Production dependencies only
- **WHEN** dependencies are installed with production mode and the Next.js build runs
- **THEN** the build completes
- **AND** the contract test runner is not required for that build

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

### Requirement: Continuous integration
A GitHub Actions workflow SHALL install dependencies with a frozen lockfile on Node.js 24, run the contract tests, and run the Next.js production build. It SHALL also install production dependencies only and run that build again. The workflow SHALL NOT require a secret, and it SHALL NOT run a lint or typecheck command while the repository has no runnable lint script and no TypeScript project.

#### Scenario: Pull request
- **WHEN** a pull request runs the workflow
- **THEN** it installs from the lockfile, runs the contract tests, and completes the Next.js build
- **AND** it completes a second build after a production-only install
- **AND** it does not read `ACCOUNT_MNEMONIC`
