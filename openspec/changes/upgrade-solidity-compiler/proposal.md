# Proposal

## Why

`Campaign.sol` is pinned to Solidity 0.4.25 and compiled with `solc` 0.5.3. That compiler is far behind current language checks. The current `solc` release is 0.8.38. The checked-in JSON artifacts were produced by the old compiler.

## What Changes

- Recompile `CampaignFactory` and `Campaign` with solc 0.8.38, or the current 0.8 release when the work is done.
- Update the source so it compiles there while keeping the same crowdfunding outcomes: strict minimum, manager-only requests and finalize, one approval per approver, and `approvalCount > approversCount / 2`.
- Replace `kickstarter/ethereum/build/*.json` from that compiler output. Do not hand-edit bytecode.
- Do not deploy the new bytecode anywhere. The frontend must read the new artifacts only after this change is implemented and the tests pass.

## Capabilities

### New Capabilities

- `solidity-source`: which compiler the campaign contracts use and which outcomes must survive the upgrade.

### Modified Capabilities

- None.

## Impact

- `kickstarter/ethereum/contracts/Campaign.sol`, the compile script, and `kickstarter/ethereum/build/`.
- Not implemented in the current showcase PR. The running app keeps the 0.4.25 artifacts.
