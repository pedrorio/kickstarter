# campaign-contribution Specification

## Purpose

A campaign accepts ether contributions above its minimum and records each new contributor as an approver.

## Requirements

### Requirement: Reject a contribution that is not above the minimum
The campaign SHALL reject a contribution whose value is less than or equal to the minimum contribution. A rejected contribution SHALL NOT mark the sender as an approver.

#### Scenario: Contribution below the minimum
- **WHEN** an account sends contribute with a value less than the minimum contribution
- **THEN** the transaction reverts
- **AND** that account is not an approver

#### Scenario: Contribution equal to the minimum
- **WHEN** an account sends contribute with a value equal to the minimum contribution
- **THEN** the transaction reverts

### Requirement: Record a new contributor as an approver
The campaign SHALL mark a first-time contributor as an approver and SHALL increment the approver count by one. A later contribution from the same account SHALL NOT increment the approver count again.

#### Scenario: First contribution above the minimum
- **WHEN** an account that is not yet an approver sends contribute with a value greater than the minimum
- **THEN** that account is an approver
- **AND** the approver count increases by one

#### Scenario: Existing approver contributes again
- **WHEN** an existing approver sends another contribution greater than the minimum
- **THEN** the approver count stays the same

### Requirement: Hold contributed ether
The campaign SHALL add a successful contribution to its balance.

#### Scenario: Balance increases by the contribution
- **WHEN** a contribution succeeds
- **THEN** the campaign balance increases by the contributed value
