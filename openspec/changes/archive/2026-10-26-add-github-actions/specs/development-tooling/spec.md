# Spec Delta

## ADDED Requirements

### Requirement: Continuous integration
A GitHub Actions workflow SHALL install dependencies with a frozen lockfile on Node.js 24, run the contract tests, and run the Next.js production build. It SHALL also install production dependencies only and run that build again. The workflow SHALL NOT require a secret, and it SHALL NOT run a lint or typecheck command while the repository has no runnable lint script and no TypeScript project.

#### Scenario: Pull request
- **WHEN** a pull request runs the workflow
- **THEN** it installs from the lockfile, runs the contract tests, and completes the Next.js build
- **AND** it completes a second build after a production-only install
- **AND** it does not read `ACCOUNT_MNEMONIC`
