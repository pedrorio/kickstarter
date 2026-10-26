# Spec Delta

## Purpose

The contract toolchain compiles CampaignFactory and Campaign and runs their tests on a local chain.

## ADDED Requirements

### Requirement: Maintained local-chain tests
Contract tests SHALL run on a local chain from Hardhat or Foundry, not from Ganache and Mocha. The suite SHALL still show that a factory deploys a campaign, contribution records an approver only above the minimum, only the manager creates a request, an approver approves once, and finalize pays the recipient only after the majority check. The Next.js production install SHALL still be able to build without that toolchain.

#### Scenario: Local test run
- **WHEN** the contract test command runs
- **THEN** it uses Hardhat or Foundry
- **AND** it does not start Ganache
- **AND** the factory, contribute, request, approve, and finalize cases pass

#### Scenario: Production app install
- **WHEN** production dependencies are installed
- **THEN** the Next.js build does not require Hardhat, Foundry, Ganache, or Mocha
