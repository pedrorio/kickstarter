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
