# Tasks

## 1. Wallet session

- [x] 1.1 Discover an EIP-6963 provider, else `window.ethereum`, and ignore `window.web3`, covered by `test/walletState.test.js` and `test/prepareSigner.test.js`
- [x] 1.2 Request accounts only from Connect, Try again, or a signing action, and cover rejection and wrong-chain handling in `test/prepareSigner.test.js`
- [x] 1.3 Show pending, no-wallet, disconnected, rejected, wrong-chain, and connected status with keyboard-focusable controls

## 2. Reads and signing

- [x] 2.1 Keep contract reads on the read-only endpoint and show a readable alert when it is unreachable, covered by `test/readErrors.test.js`
- [x] 2.2 Send create, contribute, request, approve, and finalize from the connected account and show the reason when it is not connected

## Workflow follow-up

- Archive this change into the living spec.
