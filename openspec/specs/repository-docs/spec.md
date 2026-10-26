# repository-docs Specification

## Purpose
Repository docs tell a reader what the showcase does, how the contracts behave, how to run it against a local chain, which environment variable names exist, and where OpenSpec lives.

## Requirements

### Requirement: README covers the showcase
The repository root SHALL contain a README that describes the crowdfunding flow, the factory and campaign contracts, the request approval rule, how to run the app against a local chain, the environment variable names, and the OpenSpec directories. The README SHALL NOT contain a mnemonic or a filled-in secret.

#### Scenario: Reader opens the README
- **WHEN** the root README is read
- **THEN** it names CampaignFactory, the contribute and finalize rules, a local Ganache command, `NETWORK_ENDPOINT`, `FACTORY_ADDRESS`, `CHAIN_ID`, `ACCOUNT_MNEMONIC`, and `openspec/specs/`
- **AND** it does not assign a value to `ACCOUNT_MNEMONIC`

### Requirement: Example env lists public names only
A committed env example SHALL list `NETWORK_ENDPOINT`, `FACTORY_ADDRESS`, and `CHAIN_ID` with empty values. It SHALL NOT name `ACCOUNT_MNEMONIC` and SHALL NOT contain a secret.

#### Scenario: Example file is read
- **WHEN** `.env.example` is read
- **THEN** the three public names are present with empty values
- **AND** `ACCOUNT_MNEMONIC` is absent
