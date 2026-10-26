# Spec Delta

## Purpose

Solidity source is the CampaignFactory and Campaign implementation and the compiler that produces their artifacts.

## ADDED Requirements

### Requirement: Current Solidity 0.8 compiler
`CampaignFactory` and `Campaign` SHALL compile with solc 0.8.38 or a newer 0.8 release. A contribution SHALL still be rejected unless it is strictly greater than the minimum. Only the manager SHALL create or finalize a request. An approver SHALL approve a request at most once. Finalize SHALL pay the recipient only when `approvalCount > approversCount / 2` using integer division, and SHALL mark the request complete. The build artifacts SHALL be the output of that compiler.

#### Scenario: Compiler upgrade tests
- **WHEN** the contract tests run against artifacts from the 0.8 compiler
- **THEN** the minimum, manager, single-approval, and majority-finalize cases pass
- **AND** no public network deployment is required
