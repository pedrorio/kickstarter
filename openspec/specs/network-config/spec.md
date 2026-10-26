# network-config Specification

## Purpose

Runtime configuration supplies the RPC endpoint, the factory address, and the deploy-script credential.

## Requirements

### Requirement: Public runtime endpoints
The Next.js app SHALL read NETWORK_ENDPOINT and FACTORY_ADDRESS from the environment through public runtime configuration. Those values SHALL be available to server rendering.

#### Scenario: Environment is set
- **WHEN** NETWORK_ENDPOINT and FACTORY_ADDRESS are set
- **THEN** server-rendered pages can read both values

### Requirement: Deploy script reads the mnemonic from the environment
The deploy script SHALL read ACCOUNT_MNEMONIC and NETWORK_ENDPOINT from the environment, derive the first account, deploy CampaignFactory, and print the account address and the contract address. The script SHALL NOT print the mnemonic.

#### Scenario: Both variables are set
- **WHEN** the deploy script runs with ACCOUNT_MNEMONIC and NETWORK_ENDPOINT set
- **THEN** it deploys CampaignFactory from the first derived account
- **AND** it prints the account address and the contract address
- **AND** it does not print the mnemonic

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
