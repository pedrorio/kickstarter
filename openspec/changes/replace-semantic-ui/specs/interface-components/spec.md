# Spec Delta

## Purpose

Interface components are the visual building blocks for the campaign pages and the wallet status.

## ADDED Requirements

### Requirement: No Semantic UI dependency
The app SHALL NOT depend on `semantic-ui-react` and SHALL NOT load a Semantic UI stylesheet from a CDN. Header, forms, lists, and the request table SHALL be rendered with maintained local components or another maintained library that supports the app's React version. Connect, Try again, and Switch network SHALL remain keyboard-focusable buttons.

#### Scenario: Production page
- **WHEN** a campaign page is rendered
- **THEN** it does not request the Semantic UI stylesheet
- **AND** `semantic-ui-react` is not installed

#### Scenario: Wallet actions
- **WHEN** a wallet action is shown
- **THEN** it is a native button that can be reached with the keyboard
