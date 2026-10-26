# Spec Delta

## REMOVED Requirements

### Requirement: Webpack exposes the deploy mnemonic
**Reason**: The client bundle must not be able to receive the deploy mnemonic.
**Migration**: Signing uses the browser wallet. `ACCOUNT_MNEMONIC` is read only by the deploy script.

## ADDED Requirements

### Requirement: Client bundle excludes the deploy mnemonic
The Next.js client bundle SHALL NOT contain `ACCOUNT_MNEMONIC` or the mnemonic value. The deploy script SHALL remain the only application entry point that reads `ACCOUNT_MNEMONIC`.

#### Scenario: Production build
- **WHEN** `next build` runs
- **THEN** the client JavaScript does not reference `ACCOUNT_MNEMONIC`
- **AND** the webpack configuration does not define that variable

### Requirement: Deprecated testnets resolve to Sepolia
An unset `CHAIN_ID` SHALL mean Sepolia (chain id 11155111). Ropsten (3), Rinkeby (4), Goerli (5), and Kovan (42) SHALL be replaced with Sepolia and SHALL surface a warning that names the rejected network. Any other positive integer chain id SHALL be kept, including local ids 1337 and 31337.

#### Scenario: Chain id is unset
- **WHEN** `CHAIN_ID` is missing or blank
- **THEN** the app expects chain id 11155111
- **AND** it does not report a deprecated-network warning

#### Scenario: Rinkeby is configured
- **WHEN** `CHAIN_ID` is 4
- **THEN** the app expects Sepolia (11155111)
- **AND** the warning names Rinkeby

#### Scenario: Local chain id
- **WHEN** `CHAIN_ID` is 1337
- **THEN** the app expects chain id 1337
- **AND** it does not replace it with Sepolia

### Requirement: JSON-RPC does not use web3.js beta
The application, contract tests, and deploy script SHALL perform Ethereum JSON-RPC calls without the `web3` package at version 1.0.0-beta.37.

#### Scenario: Dependencies are installed
- **WHEN** production or development dependencies are installed from the lockfile
- **THEN** the `web3` package is not installed
- **AND** contract tests can deploy the factory to a local chain and run the contribute, request, approve, and finalize flow
