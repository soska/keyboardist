# Contributing to Keyboardist

Thanks for your interest in contributing! This document covers how the repo is
set up and how to get a change merged.

## Prerequisites

- Node.js 24 (see `.nvmrc`; `nvm use` / `fnm use` will pick it up)
- [pnpm](https://pnpm.io) 10 (`corepack enable` will give you the version
  pinned in `package.json`)

## Repository layout

This is a pnpm workspace monorepo:

| Path | What it is |
| --- | --- |
| `packages/keyboardist` | The `keyboardist` npm package — core (`src/`) + React subpath (`src/react/`) |
| `apps/website` | The demo/docs website (Vite, deployed to Netlify) |

## Getting started

```sh
pnpm install
pnpm check   # lint + typecheck + test + build + export validation, same as CI
```

`pnpm install` also points git at `.githooks/`, which installs a **pre-commit
hook that runs the same checks as CI**. A commit that succeeds locally should
mean a green CI run.

The hook checks your working tree, not the staged snapshot — if you stage only
part of your changes it will say so. To commit without running it:

```sh
git commit --no-verify
```

Useful commands:

```sh
pnpm test                                # run all tests once
pnpm --filter keyboardist test:watch     # TDD watch mode for the library
pnpm --filter @keyboardist/website dev   # run the demo site locally
pnpm lint:fix                            # auto-fix lint/format issues (Biome)
```

## Development workflow

Keyboardist is developed **test-first**. For features and bug fixes:

1. Write a failing test in `packages/keyboardist/test/` that describes the
   behavior you want (for a bug, a test that reproduces it).
2. Make it pass with the smallest reasonable change.
3. Refactor with the tests green.

PRs that change library behavior without tests will be asked to add them.

## Changesets

Any change that affects the published `keyboardist` package needs a changeset:

```sh
pnpm changeset
```

Pick the bump type (patch/minor/major) and write a short, user-facing
description — it becomes the changelog entry. Website-only or repo-tooling
changes don't need one.

## Releases (maintainers)

Releases are automated with [Changesets](https://github.com/changesets/changesets):
merged changesets accumulate in a "Version Packages" PR, and merging that PR
publishes to npm (with provenance) from GitHub Actions.

## Code of Conduct

By participating you agree to uphold our
[Code of Conduct](CODE_OF_CONDUCT.md).
