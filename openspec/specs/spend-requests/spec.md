# spend-requests Specification

## Purpose

The campaign manager proposes payments, approvers vote, and a majority lets the manager send the requested ether once.

## Requirements

### Requirement: Only the manager can create a spend request
The manager SHALL be able to create a spend request with a description, a value in wei, and a recipient. Any other account SHALL NOT be able to create a request. A new request SHALL start incomplete with an approval count of zero.

#### Scenario: Manager creates a request
- **WHEN** the manager calls createRequest with a description, value, and recipient
- **THEN** that request is stored with those fields, complete set to false, and an approval count of zero

#### Scenario: Non-manager creates a request
- **WHEN** an account other than the manager calls createRequest
- **THEN** the transaction reverts

### Requirement: An approver can approve a request once
An approver SHALL be able to approve a request they have not already approved, increasing its approval count by one. An account that is not an approver SHALL NOT be able to approve. A second approval from the same approver SHALL revert.

#### Scenario: Approver approves a request
- **WHEN** an approver calls approveRequest for a request they have not approved
- **THEN** that request's approval count increases by one

#### Scenario: Account that has not contributed
- **WHEN** an account that is not an approver calls approveRequest
- **THEN** the transaction reverts

#### Scenario: Approver approves the same request again
- **WHEN** an approver calls approveRequest for a request they have already approved
- **THEN** the transaction reverts

### Requirement: Manager finalizes a request that has a majority
The manager SHALL be able to finalize a request only when it is not complete and its approval count is greater than the approver count divided by two, using integer division. Finalizing SHALL transfer the request value to the recipient and mark the request complete. A non-manager SHALL NOT be able to finalize.

#### Scenario: Majority has approved
- **WHEN** the manager finalizes an incomplete request whose approval count is greater than the approver count divided by two
- **THEN** the recipient's balance increases by the request value
- **AND** the request is complete

#### Scenario: Not enough approvals
- **WHEN** the manager finalizes a request that does not have that majority
- **THEN** the transaction reverts

#### Scenario: Request is already complete
- **WHEN** the manager finalizes a completed request
- **THEN** the transaction reverts

#### Scenario: Non-manager finalizes
- **WHEN** an account other than the manager calls finalizeRequest
- **THEN** the transaction reverts
