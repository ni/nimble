# Lint Orchestration Scripts

This directory contains the Lage-based lint pipeline that provides fast, cached, and parallelized linting across the Nimble monorepo.

## Why Lage?

[Lage](https://microsoft.github.io/lage/) is a task orchestration tool that brings several key benefits to our monorepo:

1. **Parallel Execution**: Runs lint tasks concurrently across multiple workspaces (up to 4 by default)
2. **Smart Caching**: Skips re-linting packages when files haven't changed, dramatically speeding up subsequent runs
3. **Dependency-Aware**: Respects package dependencies to ensure correct execution order
4. **Incremental Linting**: `npm run lint:changed` only lints packages modified since `origin/main`

This reduces local lint time from ~2 minutes to seconds for typical changes, and CI lint time from ~5 minutes to ~1.5 minutes.

## How It Works

### Architecture Overview

```
Developer runs: npm run lint
       ↓
Lage orchestrator (lage.config.js)
       ↓
For each workspace in workspaces.json:
  - Check cache (local or CI)
  - If cache miss → run lint script
       ↓
Package lint script (package.json)
       ↓
run-eslint.mjs wrapper
       ↓
ESLint with incremental cache
```

### Key Components

- **`lage.config.js`** (repo root): Lage task pipeline configuration
  - Reads workspace metadata from `workspaces.json`
  - Configures caching strategy and parallelism
  - Sets task weights for intelligent scheduling

- **`workspaces.json`**: Central registry of all lintable packages
  - Lists workspace name, path, lint script, and dependencies
  - Used by Lage to build the execution graph
  - Determines task weights (heavy vs standard) for scheduling

- **`run-eslint.mjs`**: ESLint wrapper script
  - Standardizes ESLint invocation across workspaces
  - Enables per-package `.eslintcache` for faster incremental lints
  - Provides consistent CLI interface and error handling

### Why the Wrapper Script?

Before Lage, each workspace had varying ESLint commands:
```json
"lint": "eslint . --ext .js,.ts"
"lint": "ng lint"
"lint": "eslint src --cache --cache-location .eslintcache"
```

The `run-eslint.mjs` wrapper provides:
- **Consistency**: Same ESLint configuration and flags everywhere
- **Caching**: Automatic `.eslintcache` per workspace for faster re-runs
- **Maintainability**: Change ESLint behavior once, apply everywhere
- **Lage Integration**: Predictable output for cache invalidation

## Available Commands

From the repo root:

```bash
# Lint all workspaces (respects cache)
npm run lint

# Lint only packages changed since origin/main
npm run lint:changed

# Lint a specific package
npm run lint:pkg -- @ni/nimble-components

# Auto-fix issues across all workspaces
npm run format
```

## Cache Behavior

- **Local Development**: Cache stored in `.cache/lage/` (gitignored)
- **CI**: Cache restored from GitHub Actions cache, shared across builds
- **Invalidation**: Cache invalidates when:
  - Source files change
  - ESLint config changes
  - Package dependencies change

## Performance Targets

- **Local (changed packages)**: ≤ 30 seconds
- **Local (full lint)**: ≤ 2 minutes
- **CI (full lint)**: ≤ 1.5 minutes

## Troubleshooting

**Stale cache issues**: Delete the cache directory and re-run
```bash
rm -rf .cache/lage
npm run lint
```

**Missing workspace**: Verify the package is listed in `workspaces.json` with correct path and lint script.

**Lage not finding tasks**: Ensure the workspace's `package.json` has a `lint` script matching what's declared in `workspaces.json`.

## Adding a New Workspace

When creating a new package that needs linting:

1. Add a `lint` script to the package's `package.json`:
   ```json
   {
     "scripts": {
       "lint": "node ../../scripts/lint/run-eslint.mjs ."
     }
   }
   ```

2. Register the workspace in `scripts/lint/workspaces.json`:
   ```json
   {
     "name": "@ni/my-new-package",
     "path": "packages/my-new-package",
     "script": "lint",
     "weight": "standard",
     "dependsOn": []
   }
   ```

3. Test it works:
   ```bash
   npm run lint:pkg -- @ni/my-new-package
   ```

## References

- [Lage Documentation](https://microsoft.github.io/lage/)
- [Original Spec](../../specs/002-lint-speedup/README.md)
- [Root CONTRIBUTING.md](../../CONTRIBUTING.md#linting) for developer guidelines
