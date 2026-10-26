# Tasks

## 1. Client and scripts

- [x] 1.1 Replace web3.js contract reads and writes with ethers v6 and verify `yarn test` passes on a local chain
- [x] 1.2 Point the deploy script at ethers `HDNodeWallet` and verify it refuses to run without env vars and does not print a mnemonic
- [x] 1.3 Remove `ACCOUNT_MNEMONIC` from the Next.js webpack config and verify a production build does not reference it

## 2. Network configuration

- [x] 2.1 Default `CHAIN_ID` to Sepolia and remap deprecated testnet ids, covered by `test/chains.test.js`
- [x] 2.2 Pass runtime env into server rendering through `_app` and verify `yarn build` completes on Node 24

## Workflow follow-up

- Archive this change into the living spec.
