# wallet-connection Specification

## Purpose

The app picks an Ethereum provider for contract reads and for signing transactions in the browser.

## Requirements

### Requirement: Discover an EIP-1193 provider
On the client, the app SHALL choose the first announced EIP-6963 provider that exposes `request`. When none is announced, the app SHALL use `window.ethereum` when it exposes `request`. The app SHALL ignore `window.web3`. When no such provider exists, the app SHALL report that no wallet is installed and SHALL offer a link to install one.

#### Scenario: EIP-6963 wallet is announced
- **WHEN** the browser announces an EIP-6963 provider
- **THEN** the app uses that provider
- **AND** it does not use `window.web3`

#### Scenario: Only window.ethereum is present
- **WHEN** no EIP-6963 provider is announced and `window.ethereum.request` exists
- **THEN** the app uses `window.ethereum`

#### Scenario: No wallet is installed
- **WHEN** the browser has neither an EIP-6963 provider nor `window.ethereum.request`
- **THEN** the status says no Ethereum wallet was found
- **AND** the status links to a wallet install page
- **AND** the app does not call `eth_requestAccounts`

### Requirement: Explicit account request
The app SHALL NOT call `eth_requestAccounts` while discovering a wallet or during server rendering. The app MAY call `eth_accounts` and `eth_chainId` during discovery. Connect, Try again, and a signing action SHALL call `eth_requestAccounts`.

#### Scenario: Page load with a disconnected wallet
- **WHEN** a wallet is installed and has not granted accounts
- **THEN** the status says the wallet is available and shows a Connect wallet control
- **AND** the app does not call `eth_requestAccounts` until the visitor activates Connect or a signing action

#### Scenario: Visitor rejects the connection
- **WHEN** the wallet rejects `eth_requestAccounts`
- **THEN** the status says the connection was rejected
- **AND** the status offers Try again

### Requirement: Wrong chain
When the wallet's chain id differs from the expected chain id, the app SHALL say the wallet is on the wrong network, SHALL name the expected network, and SHALL offer a Switch network control. That control SHALL ask the wallet to switch. When the wallet reports that the chain is unknown and a read-only endpoint is configured, the app SHALL ask the wallet to add that chain. A rejected switch SHALL remain on the wrong-chain status and SHALL say the switch was rejected.

#### Scenario: Wallet is on another chain
- **WHEN** the connected wallet reports a chain id other than the expected chain id
- **THEN** the status names the expected network
- **AND** activating Switch network asks the wallet to switch

#### Scenario: Wallet does not know the chain
- **WHEN** the switch reports an unknown chain and a read-only endpoint is configured
- **THEN** the app asks the wallet to add the expected chain

### Requirement: Account and chain changes
After a provider is selected, the app SHALL update the status when the wallet emits `accountsChanged` or `chainChanged`. An empty account list SHALL return the status to disconnected. A chain id that no longer matches SHALL return the status to wrong-chain.

#### Scenario: Accounts are cleared
- **WHEN** the wallet emits `accountsChanged` with no accounts
- **THEN** the status returns to disconnected

#### Scenario: Chain changes away from the expected network
- **WHEN** the wallet emits `chainChanged` for a different chain id
- **THEN** the status returns to wrong-chain

### Requirement: Visible wallet status
The wallet status SHALL be exposed as a polite live region. Before discovery finishes, including in server HTML, it SHALL say it is checking for a wallet. A connected wallet SHALL show a shortened account and the expected network name. A configured deprecated-network warning SHALL be shown with the status. Connect, Try again, and Switch network SHALL be keyboard-focusable buttons.

#### Scenario: Server HTML
- **WHEN** the server renders a page
- **THEN** the wallet status says it is checking for an Ethereum wallet
- **AND** the server HTML does not include a Connect wallet control

#### Scenario: Connected on the expected chain
- **WHEN** the wallet has an account and the wallet chain matches the expected chain
- **THEN** the status shows a shortened account and the expected network name

### Requirement: Server reads use a read-only endpoint
Contract reads SHALL use the configured read-only endpoint. They SHALL NOT require a browser wallet. When that endpoint cannot be reached, the page SHALL show a readable alert that campaign data could not be loaded and SHALL NOT show the raw transport error.

#### Scenario: Server has no window
- **WHEN** getInitialProps runs on the server
- **THEN** contract reads use the configured read-only endpoint
- **AND** the app does not read `window`
