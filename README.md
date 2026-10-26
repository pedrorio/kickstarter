# CrowdCoin

CrowdCoin is a small Ethereum crowdfunding showcase. A manager creates a campaign with a minimum contribution. People who contribute at least that amount become approvers. The manager can ask to spend the balance, and the campaign pays the recipient only after a majority of approvers agree.

The web app is a Next.js 11 pages-router frontend. It reads campaign data on the server and sends transactions from a browser wallet. Contract tests run against a local chain. Nothing in this repository deploys to a public network.

## Contracts

`kickstarter/ethereum/contracts/Campaign.sol` (Solidity 0.4.25) has two contracts.

`CampaignFactory` stores every campaign it creates. `createCampaign(minimum)` deploys a `Campaign` whose manager is the caller, and `getDeployedCampaigns()` returns those addresses.

`Campaign` holds the contributed ether.

- `contribute()` requires `msg.value` to be strictly greater than `minimumContribution`. The sender is recorded as an approver once.
- `createRequest(description, value, recipient)` can be called only by the manager. It records a spend request and does not move ether.
- `approveRequest(index)` can be called only by an approver, and only once per request.
- `finalizeRequest(index)` can be called only by the manager, and only when `approvalCount > approversCount / 2` using integer division. It then transfers `value` wei to the recipient and marks the request complete.

The compiled ABI and bytecode used by the app and the tests are in `kickstarter/ethereum/build/`. Do not regenerate them unless you mean to change the compiler output. `yarn sol:compile` deletes that directory first.

## Run locally

Use Node.js 24, the current LTS. From `kickstarter/`:

```bash
yarn install
yarn test
```

`yarn test` starts Ganache inside the test process. It does not need a separate chain or a mnemonic.

To click through the UI against a local chain, start Ganache from `kickstarter/` in one terminal:

```bash
yarn ganache
```

Ganache 7 listens on port 8545 and uses chain id 1337. It prints a mnemonic for the funded accounts it created. That value stays in your shell. Do not commit it, and do not paste it into a file in this repo.

In another shell, from `kickstarter/`, point the deploy script at that chain. Set `NETWORK_ENDPOINT` to `http://127.0.0.1:8545` and set `ACCOUNT_MNEMONIC` to the mnemonic Ganache just printed. Do not write that mnemonic into a file.

```bash
yarn sol:deploy
```

The script derives the first account, deploys `CampaignFactory`, and prints the account address and the factory address. It refuses to run when either variable is missing, and it does not print the mnemonic. This is a local chain only. Do not point it at a public network from this showcase.

Then start the app with the printed factory address:

```bash
export NETWORK_ENDPOINT=http://127.0.0.1:8545
export FACTORY_ADDRESS=0x...   # address printed by sol:deploy
export CHAIN_ID=1337
yarn start:dev
```

Open http://127.0.0.1:3000. Connect a browser wallet that is on chain id 1337. For a one-off production build, `yarn build` and `yarn start:prod` use the same variables. Next.js 11 needs `NODE_OPTIONS=--openssl-legacy-provider` on Node 24; the scripts set that already.

`yarn start:dev` reloads the server. The first dev compile on Node 24 can take a while.

## Environment variables

Names only. No secret values belong in the repo. Public names are listed in `.env.example`. Next.js reads a `.env` file from `kickstarter/` if you create one locally; `kickstarter/.gitignore` ignores it.

| Name | Who reads it |
| --- | --- |
| `NETWORK_ENDPOINT` | Server-side reads, and the deploy script. Use a URL you are willing to expose to the browser. |
| `FACTORY_ADDRESS` | The app, to find campaigns created by the factory. |
| `CHAIN_ID` | Expected wallet chain. Unset means Sepolia (`11155111`). `1337` and `31337` stay local. Ropsten `3`, Rinkeby `4`, Goerli `5`, and Kovan `42` are rewritten to Sepolia and the UI names the rejected network. |
| `ACCOUNT_MNEMONIC` | `kickstarter/ethereum/deploy.js` only. It is not part of the client bundle. |

## OpenSpec

The living spec is `openspec/specs/`. It describes campaign creation, contributions, spend requests, server-rendered campaign pages, wallet connection, network configuration, and development tooling.

Completed changes are archived under `openspec/changes/archive/`. Open proposals that are not implemented stay in `openspec/changes/`:

- `upgrade-next-app-router` — move off Next.js 11 and the pages router
- `replace-semantic-ui` — drop Semantic UI
- `migrate-contract-tooling` — move tests off Ganache and Mocha
- `upgrade-solidity-compiler` — compile with a current Solidity 0.8 release

## Tests and CI

`yarn test` in `kickstarter/` runs the contract flow and the unit tests. GitHub Actions (`.github/workflows/ci.yml`) installs on Node 24, runs those tests, and runs the Next.js build twice: once with the full install and once with production dependencies only. There is no lint or typecheck script. ESLint is installed, but `eslint-config-airbnb` is not, so `yarn` has nothing to lint.
