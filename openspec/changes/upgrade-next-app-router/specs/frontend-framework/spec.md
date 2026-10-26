# Spec Delta

## Purpose

The frontend framework is the Next.js runtime that server-renders campaign pages and serves the wallet UI.

## ADDED Requirements

### Requirement: Current Next.js App Router
The app SHALL run on the current Next.js 16.x release using the App Router. The campaign list, a campaign summary, and that campaign's spend requests SHALL be loaded on the server for each request. The app SHALL NOT depend on `next-routes` or a custom Node server. The production build SHALL complete on Node.js 24 without `NODE_OPTIONS=--openssl-legacy-provider`.

#### Scenario: Campaign page request
- **WHEN** a visitor requests a campaign URL
- **THEN** the server reads that campaign's summary before sending HTML
- **AND** the build does not set the OpenSSL legacy provider

#### Scenario: Routes
- **WHEN** the app is started
- **THEN** Next.js serves it without `server.js` and without `next-routes`
