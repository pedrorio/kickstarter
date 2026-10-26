# Proposal

## Why

The UI is built on `semantic-ui-react` 0.83 and a Semantic UI 2.4 stylesheet loaded from a CDN. That React binding targets React 16, and the CDN stylesheet is a runtime dependency the app does not control. A Next.js upgrade cannot keep this stack.

## What Changes

- Remove `semantic-ui-react` and the Semantic UI CDN stylesheet.
- Rebuild the header, campaign list, campaign summary, contribution form, and request table with maintained local components.
- Keep the wallet status keyboard-accessible, including Connect, Try again, and Switch network.
- Do this after, or together with, the Next.js upgrade so the components target current React.

## Capabilities

### New Capabilities

- `interface-components`: the component library the pages use.

### Modified Capabilities

- None.

## Impact

- `kickstarter/components/**` and the campaign pages.
- Not implemented in the current showcase PR.
