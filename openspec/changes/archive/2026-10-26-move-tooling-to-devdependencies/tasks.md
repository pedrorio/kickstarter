# Tasks

## 1. Dependency split

- [x] 1.1 Move eslint, fs-extra, ganache, mocha, solc, and solhint to devDependencies and cover the manifest in a unit test
- [x] 1.2 Install production dependencies only and verify `yarn build` completes without those packages
- [x] 1.3 Point the production Dockerfile at `yarn install --frozen-lockfile --production`

## Workflow follow-up

- Archive this change into the living spec.
