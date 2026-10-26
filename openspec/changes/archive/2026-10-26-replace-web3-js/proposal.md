# Proposal

## Why

`web3` 1.0.0-beta.37 is pinned, upstream web3.js is sunset, and that beta does not install on current Node. The webpack config also offered the deploy mnemonic to the client bundle. There is no chain id, so a deprecated testnet in the environment would be followed silently.

## What Changes

- Replace web3.js in the Next.js client, the contract tests, and the deploy script with ethers v6.
- Stop defining `ACCOUNT_MNEMONIC` in the client webpack build.
- Treat Ropsten, Rinkeby, Goerli, and Kovan chain ids as Sepolia. When `CHAIN_ID` is unset, use Sepolia (`11155111`).
- Keep local chain ids such as `1337` unchanged.
- Keep the deploy script reading `ACCOUNT_MNEMONIC` from the environment and never printing it. Do not deploy.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `network-config`: the client build no longer receives the deploy mnemonic, and deprecated testnet ids resolve to Sepolia.

## Impact

- `kickstarter/ethereum/*`, `kickstarter/next.config.js`, pages that send transactions, and `kickstarter/test/*`.
- Removes dependencies `web3` and `truffle-hdwallet-provider`. Adds `ethers`.
- Contract tests run against Ganache through ethers. No contracts are deployed to a public network.
