# Spec Delta

## ADDED Requirements

### Requirement: Page shell survives a failed read
When a server-rendered campaign read fails, the page SHALL still render the site header and a readable alert. A transport failure SHALL say that campaign data could not be loaded from the read-only network. The page SHALL NOT present a raw connection error as the only message.

#### Scenario: Read-only endpoint is unreachable
- **WHEN** getInitialProps cannot reach the configured read-only endpoint
- **THEN** the page shows the site header
- **AND** the page shows an alert that campaign data could not be loaded

## MODIFIED Requirements

### Requirement: Create a campaign from the form
The new-campaign page SHALL submit createCampaign with the entered minimum contribution in wei from the connected wallet account, then navigate to the home page. A failed send SHALL show the error and SHALL leave the visitor on the form. The page SHALL NOT send the transaction when no wallet is installed, the visitor has not connected, the visitor rejected the connection, or the wallet is on the wrong chain, and SHALL show that reason.

#### Scenario: Create succeeds
- **WHEN** the visitor submits a minimum contribution and the wallet is connected on the expected chain
- **THEN** the app sends createCampaign from the connected account
- **AND** the app navigates to the home page

#### Scenario: Create fails
- **WHEN** the send fails
- **THEN** the page shows the error message
- **AND** the visitor stays on the form

#### Scenario: Wallet is not connected
- **WHEN** the visitor submits the form and the wallet is not connected on the expected chain
- **THEN** the page shows why the transaction was not sent
- **AND** the app does not send createCampaign

### Requirement: Contribute from the campaign page
The campaign page SHALL send contribute with the entered amount converted from ether to wei, from the connected wallet account, then reload the campaign page. The page SHALL NOT send the transaction when the wallet is not connected on the expected chain, and SHALL show that reason.

#### Scenario: Contribution succeeds
- **WHEN** the visitor submits an ether amount and the wallet is connected on the expected chain
- **THEN** the app sends contribute with that amount in wei from the connected account
- **AND** the app reloads the campaign page

#### Scenario: Contribution fails
- **WHEN** the send fails
- **THEN** the page shows the error message

#### Scenario: Wallet is not connected
- **WHEN** the visitor submits a contribution and the wallet is not connected on the expected chain
- **THEN** the page shows why the transaction was not sent
- **AND** the app does not send contribute

### Requirement: Create a spend request from the form
The new-request page SHALL send createRequest with the description, the ether amount converted to wei, and the recipient, from the connected wallet account, then navigate back to the requests list. The page SHALL NOT send the transaction when the wallet is not connected on the expected chain, and SHALL show that reason.

#### Scenario: Request creation succeeds
- **WHEN** the visitor submits a description, ether value, and recipient and the wallet is connected on the expected chain
- **THEN** the app sends createRequest from the connected account
- **AND** the app navigates to the campaign's requests list

#### Scenario: Request creation fails
- **WHEN** the send fails
- **THEN** the page shows the error message

#### Scenario: Wallet is not connected
- **WHEN** the visitor submits the form and the wallet is not connected on the expected chain
- **THEN** the page shows why the transaction was not sent
- **AND** the app does not send createRequest

### Requirement: Approve or finalize from a request row
Each incomplete request SHALL offer Approve and Finalize actions that send approveRequest or finalizeRequest for that row's index from the connected wallet account. A completed request SHALL NOT show those actions. When the wallet is not connected on the expected chain, the row SHALL show why the transaction was not sent and SHALL NOT send it.

#### Scenario: Visitor approves
- **WHEN** the visitor activates Approve on an incomplete request and the wallet is connected on the expected chain
- **THEN** the app sends approveRequest for that row index

#### Scenario: Visitor finalizes
- **WHEN** the visitor activates Finalize on an incomplete request and the wallet is connected on the expected chain
- **THEN** the app sends finalizeRequest for that row index

#### Scenario: Request is complete
- **WHEN** a request is complete
- **THEN** the row does not show Approve or Finalize

#### Scenario: Wallet is not connected
- **WHEN** the visitor activates Approve or Finalize and the wallet is not connected on the expected chain
- **THEN** the row shows why the transaction was not sent
- **AND** the app does not send the transaction
