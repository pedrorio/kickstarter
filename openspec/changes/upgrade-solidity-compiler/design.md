# Design

## Context

See proposal.md. Solidity 0.4.25 lets `createRequest` build a memory struct that also contains a mapping. Later compilers reject a mapping inside a memory struct. `recipient.transfer` in 0.8 requires `address payable`.

## Goals / Non-Goals

**Goals:**

- The same four contract behaviors, compiled by a current 0.8 compiler, with tests on a local chain.

**Non-Goals:**

- Changing the majority formula, adding tokens, or deploying.
- Switching the test runner. That is `migrate-contract-tooling`, and it can land before or with this change. The compiler upgrade still has to pass whichever runner is current.

## Decisions

- Set the pragma to the 0.8.38 line (or the current 0.8 release at implementation time). Do not jump to an experimental compiler.
- Assign request fields on a storage reference instead of a memory struct, because of the `approvals` mapping.
- Keep `transfer` rather than a full-gas `call`, so finalize still forwards the 2300-gas stipend. Mark the recipient `address payable`.
- Return arrays and strings with the memory location 0.8 requires. Keep `approversCount / 2` as integer division.
- Regenerate both build JSON files from the compiler. The app reads `interface` and bytecode from those files today; the artifact adapter has to follow whatever shape the new compiler emits, or the compile script has to keep writing the shape the app already reads. Prefer teaching the compile script to emit the shape the app reads so the client change stays small.

## Risks / Trade-offs

- [0.8 checked arithmetic can revert on overflow that 0.4 wrapped] → The campaign math is counts and wei amounts. Tests should cover a normal finalize payment. Do not silence overflow checks.
- [New bytecode will not match contracts already deployed from the 0.4 artifacts] → This showcase does not ship a public deployment. A local chain is redeployed after the compiler change.

## Migration Plan

Implement beside the existing tests. Replace artifacts only when those tests pass. Do not run the deploy script against a public endpoint.
