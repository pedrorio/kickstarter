# wallet-connection Specification

## Purpose

The app picks an Ethereum provider for contract reads and for signing transactions in the browser.

## Requirements

### Requirement: Legacy injected provider
When window.web3.currentProvider exists, the app SHALL use that provider for Ethereum calls. The app SHALL NOT call eth_requestAccounts.

#### Scenario: Legacy provider is present
- **WHEN** the page loads in a browser where window.web3.currentProvider is set
- **THEN** contract calls use that provider
- **AND** the app does not send eth_requestAccounts

### Requirement: HTTP fallback when no legacy provider
When the code is running on the server, or when window.web3 is missing, the app SHALL use an HTTP provider at NETWORK_ENDPOINT. The app SHALL NOT use window.ethereum in that case.

#### Scenario: Server render
- **WHEN** getInitialProps runs on the server
- **THEN** contract reads use NETWORK_ENDPOINT
- **AND** the app does not read window

#### Scenario: Browser without window.web3
- **WHEN** the browser has no window.web3
- **THEN** contract calls use NETWORK_ENDPOINT even if window.ethereum exists

### Requirement: Accounts read at submit time
A signing action SHALL request accounts from the active provider when the visitor submits the form or activates Approve or Finalize, and SHALL send the transaction from the first returned account. The app SHALL NOT ask for accounts when the page loads.

#### Scenario: Visitor submits a transaction
- **WHEN** the visitor submits a campaign, contribution, request, approval, or finalize action
- **THEN** the app requests accounts from the active provider
- **AND** the transaction is sent from the first account

#### Scenario: Page load
- **WHEN** a page loads
- **THEN** the app does not prompt for accounts
