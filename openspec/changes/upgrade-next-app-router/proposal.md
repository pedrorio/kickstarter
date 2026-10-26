# Proposal

## Why

The UI is stuck on Next.js 11.1 with the pages router, `getInitialProps`, `next-routes`, and a custom server. Node 24 cannot build that webpack version without `NODE_OPTIONS=--openssl-legacy-provider`. The current Next.js release is 16.4, which supports the App Router and does not need that workaround.

## What Changes

- **BREAKING**: Upgrade Next.js to the current 16.x release and move pages to the App Router.
- Replace `getInitialProps` data loading with server rendering that still loads the campaign list, campaign summary, and spend requests before paint.
- Remove the custom `server.js` and the `next-routes` package.
- Remove `NODE_OPTIONS=--openssl-legacy-provider` once the production build no longer needs it.
- Keep the wallet and contract behavior in the living spec. This change does not upgrade Solidity or replace Semantic UI.

## Capabilities

### New Capabilities

- `frontend-framework`: which Next.js runtime the UI uses and how campaign pages are server-rendered.

### Modified Capabilities

- None.

## Impact

- `kickstarter/pages/**`, `kickstarter/server.js`, `kickstarter/routes.js`, `kickstarter/next.config.js`, and the build scripts.
- React must move to a version current Next.js accepts. That is part of this upgrade, not a separate UI-library rewrite.
- Not implemented in the current showcase PR.
