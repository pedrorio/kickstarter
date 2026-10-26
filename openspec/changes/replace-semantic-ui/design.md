# Design

## Context

See proposal.md. Semantic UI currently provides the menu, buttons, forms, table, cards, and message styles. Wallet status already uses a native button or link inside that menu.

## Goals / Non-Goals

**Goals:**

- No request to `cdn.jsdelivr.net` for Semantic UI CSS.
- The same pages and the same wallet states, without the old component package.

**Non-Goals:**

- A visual redesign beyond what is required to leave Semantic UI.
- Changing contract calls or copy for transaction errors.

## Decisions

- Prefer a small set of local components and plain CSS over adopting another large unmaintained kit. A current maintained library is acceptable if it supports the React version from `upgrade-next-app-router`.
- Do not upgrade `semantic-ui-react` in place. The proposal is to remove it.
- Keep buttons as real `<button>` elements and links as real `<a>` elements. Several actions today are buttons nested in anchors; the replacement should not repeat that.

## Risks / Trade-offs

- [Layout will change] → Match the current information hierarchy (header, list, summary, requests) rather than pixel-matching Semantic UI.
- [Doing this on React 16 first would be thrown away by the Next upgrade] → Sequence it with `upgrade-next-app-router`.
