# campaign-pages Specification

## Purpose

The Next.js pages load campaign data on the server and submit factory and campaign transactions from the browser.

## Requirements

### Requirement: Server-render the campaign list
The home page SHALL load deployed campaign addresses during getInitialProps from the configured factory and SHALL render a link to each campaign.

#### Scenario: Factory returns campaigns
- **WHEN** the home page getInitialProps runs and the factory returns campaign addresses
- **THEN** the page shows each address with a link to that campaign

### Requirement: Server-render a campaign summary
The campaign page SHALL load the campaign summary for the address in the route during getInitialProps. The page SHALL show the minimum contribution in wei, the balance in ether, the request count, the approver count, and the manager address.

#### Scenario: Campaign summary is available
- **WHEN** a visitor requests /campaigns/:address
- **THEN** getInitialProps reads that campaign's summary
- **AND** the page shows the minimum contribution, ether balance, request count, approver count, and manager

### Requirement: Server-render spend requests
The requests page SHALL load every spend request and the approver count during getInitialProps. Each row SHALL show the description, the amount in ether, the recipient, and the approval count compared with the approver count.

#### Scenario: Campaign has requests
- **WHEN** a visitor requests /campaigns/:address/requests
- **THEN** getInitialProps reads each request
- **AND** the page shows the description, ether amount, recipient, and approval count for each request

### Requirement: Create a campaign from the form
The new-campaign page SHALL submit createCampaign with the entered minimum contribution in wei from the first account returned by the provider, then navigate to the home page. A failed send SHALL show the error and SHALL leave the visitor on the form.

#### Scenario: Create succeeds
- **WHEN** the visitor submits a minimum contribution and the provider returns an account
- **THEN** the app sends createCampaign from the first account
- **AND** the app navigates to the home page

#### Scenario: Create fails
- **WHEN** the send fails
- **THEN** the page shows the error message
- **AND** the visitor stays on the form

### Requirement: Contribute from the campaign page
The campaign page SHALL send contribute with the entered amount converted from ether to wei, from the first account returned by the provider, then reload the campaign page.

#### Scenario: Contribution succeeds
- **WHEN** the visitor submits an ether amount and the provider returns an account
- **THEN** the app sends contribute with that amount in wei from the first account
- **AND** the app reloads the campaign page

#### Scenario: Contribution fails
- **WHEN** the send fails
- **THEN** the page shows the error message

### Requirement: Create a spend request from the form
The new-request page SHALL send createRequest with the description, the ether amount converted to wei, and the recipient, from the first account returned by the provider, then navigate back to the requests list.

#### Scenario: Request creation succeeds
- **WHEN** the visitor submits a description, ether value, and recipient
- **THEN** the app sends createRequest from the first account
- **AND** the app navigates to the campaign's requests list

#### Scenario: Request creation fails
- **WHEN** the send fails
- **THEN** the page shows the error message

### Requirement: Approve or finalize from a request row
Each incomplete request SHALL offer Approve and Finalize actions that send approveRequest or finalizeRequest for that row's index from the first account returned by the provider. A completed request SHALL NOT show those actions.

#### Scenario: Visitor approves
- **WHEN** the visitor activates Approve on an incomplete request
- **THEN** the app sends approveRequest for that row index

#### Scenario: Visitor finalizes
- **WHEN** the visitor activates Finalize on an incomplete request
- **THEN** the app sends finalizeRequest for that row index

#### Scenario: Request is complete
- **WHEN** a request is complete
- **THEN** the row does not show Approve or Finalize
