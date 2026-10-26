# Design

## Context

See proposal.md. Next.js stays on 11. Node 24's OpenSSL 3 rejects the MD4 hash webpack 5 uses inside that Next.js release. The build and start scripts already set `NODE_OPTIONS=--openssl-legacy-provider`; this change records that as the supported runtime instead of treating it as an accident.

## Goals / Non-Goals

**Goals:**

- `yarn install`, `yarn test`, and `yarn build` succeed on Node 24.
- App containers use the same major version.

**Non-Goals:**

- Upgrading Next.js, React, or webpack. That is a separate proposal.
- Changing the nginx image.

## Decisions

- `engines.node` is `>=24` because 24 is the active LTS. The OpenSSL flag remains the smallest patch that lets Next.js 11 build there.
- Docker tags use `node:24`, not `node:latest` and not a digest, so rebuilds stay on this LTS line.
- Nodemon 1.x already starts under Node 24. It does not need a major bump for the dev script to launch.
- Compose files gain `CHAIN_ID` as a passthrough name only. No default value is committed.

## Risks / Trade-offs

- [Node 25 and later may still need the legacy provider until Next.js is upgraded] → The engine range allows newer Node, and the flag stays on the scripts. The Next.js upgrade proposal is the real fix.
- [The legacy provider weakens the hash used by old webpack] → Acceptable until the framework upgrade. It is not used to handle secrets.
