# Design

## Context

See proposal.md. Campaign reads already go through a small ethers module, and wallet state is a React 16.6 class plus context because that React has no hooks. Next.js 16.4 requires a modern React.

## Goals / Non-Goals

**Goals:**

- `next build` and `next start` work on Node 24 with default OpenSSL settings.
- Server-rendered campaign data and the wallet states stay as specified.

**Non-Goals:**

- Replacing Semantic UI. That is `replace-semantic-ui`.
- Changing contract bytecode or the local-chain test runner.

## Decisions

- Target the current Next.js 16.4 line and the App Router, not a patch of Next.js 11.
- Use the default Next.js server. Route helpers in `next-routes` become file-system routes under `app/`.
- Wallet state can become a client component with hooks after React is upgraded. The class component is only a Next 11 / React 16 constraint.
- Do this upgrade before any large UI rewrite so the replacement components target one React version.

## Risks / Trade-offs

- [App Router server and client boundaries can leak the wallet provider into a server bundle] → Keep the EIP-1193 discovery in a client component. Reads stay in server code that only sees `NETWORK_ENDPOINT`.
- [Next.js 16 may change caching of `getInitialProps` replacements] → Campaign pages must still reflect a fresh chain read on each request, because balances change after contributions.

## Migration Plan

Land the upgrade in its own PR after this showcase. Roll back by reverting that PR. No data migration.
