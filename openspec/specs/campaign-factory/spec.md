# campaign-factory Specification

## Purpose

CampaignFactory deploys Campaign contracts and lists every campaign address it has created.

## Requirements

### Requirement: Create a campaign
The factory SHALL deploy a new Campaign for a caller-supplied minimum contribution in wei and SHALL record that campaign's address. The Campaign manager SHALL be the caller.

#### Scenario: Account creates a campaign
- **WHEN** an account calls createCampaign with a minimum contribution
- **THEN** a Campaign exists whose manager is that account and whose minimum contribution equals the submitted value
- **AND** getDeployedCampaigns includes the new campaign address

### Requirement: List deployed campaigns
The factory SHALL return every campaign address it has deployed from getDeployedCampaigns, in creation order.

#### Scenario: Factory has no campaigns
- **WHEN** getDeployedCampaigns is called on a factory that has not created a campaign
- **THEN** the result is an empty list

#### Scenario: Factory has created several campaigns
- **WHEN** createCampaign has succeeded more than once
- **THEN** getDeployedCampaigns returns each deployed address
