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

### Requirement: Webpack exposes the deploy mnemonic
The Next.js webpack configuration SHALL define ACCOUNT_MNEMONIC, NETWORK_ENDPOINT, and FACTORY_ADDRESS with EnvironmentPlugin.

#### Scenario: Production build
- **WHEN** next build runs
- **THEN** EnvironmentPlugin is configured with ACCOUNT_MNEMONIC, NETWORK_ENDPOINT, and FACTORY_ADDRESS
