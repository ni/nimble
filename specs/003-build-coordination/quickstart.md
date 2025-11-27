# Quick Start: Lage Build Coordination

**Audience**: Nimble contributors  
**Feature**: Faster builds with intelligent caching and parallel execution  
**Status**: Implementation in progress

## What's Changing?

Your `npm run build` command now uses Lage for faster, smarter builds:

- **Warm cache**: <5 seconds (vs minutes with old system)
- **Cold cache**: ~3-4 minutes (vs ~10 minutes sequential)
- **Incremental builds**: Only changed packages rebuild (+ their dependents)
- **Parallel execution**: Up to 4 packages build simultaneously

## Getting Started

### Basic Usage (No Changes!)

```bash
# Full monorepo build (same command as before)
npm run build

# First run: Builds everything (~4 minutes)
# Subsequent runs: Uses cache (<5 seconds if nothing changed)
```

### Advanced: Scoped Builds

Build specific packages when you know what you're working on:

```bash
# Build one package + its dependencies
lage run build --scope @ni/nimble-components

# Build multiple packages + dependencies
lage run build --scope @ni/nimble-components --scope @ni/spright-components

# Build only changed packages since main
lage run build --since origin/main
```

### Troubleshooting

**Q: Build fails with "cache corrupted" or unexpected errors?**

Clear the cache and rebuild:

```bash
rm -rf .lage/cache
npm run build
```

**Q: Build seems slow despite caching?**

Check if cache is working:

```bash
# Run build twice - second run should be <5s
npm run build
npm run build  # Should skip all packages via cache
```

**Q: Want more verbose output to debug?**

```bash
lage run build --verbose
```

**Q: Want to see what packages would build without actually building?**

```bash
lage run build --dry-run
```

## Understanding Cache Behavior

Lage rebuilds a package when:

1. **Source files change**: `src/**`, `source/**`
2. **Config changes**: `tsconfig.json`, `rollup.config.js`, `vite.config.ts`, `package.json`
3. **Dependencies change**: `package-lock.json`, dependency package rebuilds
4. **Build scripts change**: Files in `build/` directory

Lage skips a package when:
- No inputs changed since last successful build
- Cache entry exists and is valid

## Parallel Execution

Lage runs builds in parallel based on package weight:

- **Light packages** (jasmine-extensions, jasmine-parameterized): 4 can run concurrently
- **Standard packages** (nimble-components, angular-workspace): 2 can run concurrently  
- **Heavy packages** (storybook, site, performance): 1 at a time

This prevents out-of-memory errors while maximizing speed.

### Adjusting Concurrency

```bash
# Low-memory machine? Reduce workers:
LAGE_CONCURRENCY=2 npm run build

# High-memory machine? Increase workers:
LAGE_CONCURRENCY=8 npm run build
```

## Watch Mode (No Changes)

Watch mode scripts remain package-specific and unchanged:

```bash
# Watch nimble-components (TypeScript incremental compilation)
npm run build-components:watch -w @ni/nimble-components

# Watch nimble-tokens
npm run build:ts:watch -w @ni/nimble-tokens

# Watch Angular packages
npm run watch-nimble -w angular-workspace
```

**Why not use Lage for watch mode?**

TypeScript's `tsc -w` provides faster incremental compilation (recompiles only changed files). Lage would rebuild entire packages on every change, which is slower.

## Dependency Graph

Understanding what rebuilds when:

```
nimble-tokens (base)
  ├─> nimble-components
  │     ├─> nimble-angular
  │     ├─> nimble-react
  │     └─> storybook
  ├─> spright-components
  │     ├─> spright-angular
  │     └─> spright-react
  └─> ok-components
        ├─> ok-angular
        └─> ok-react
```

**Example**: Change `nimble-tokens` → Lage rebuilds:
1. `nimble-tokens` (changed)
2. `nimble-components` (depends on tokens)
3. `spright-components` (depends on tokens)
4. `ok-components` (depends on tokens)
5. All wrapper packages (depend on components)

**Example**: Change `nimble-components` → Lage rebuilds:
1. `nimble-components` (changed)
2. `nimble-angular` (depends on components)
3. `nimble-react` (depends on components)
4. `storybook` (depends on components)

Skips: `nimble-tokens`, `spright-components`, `ok-components` (not affected)

## CI Usage

In GitHub Actions, builds automatically use 8 concurrent workers (vs 4 locally) via the `LAGE_CONCURRENCY=8` environment variable.

No workflow changes needed. Just faster builds! 🎉

## Performance Tips

1. **Use scoped builds** when working on specific packages:
   ```bash
   lage run build --scope @ni/nimble-components
   ```

2. **Use --since for PR validation**:
   ```bash
   lage run build --since origin/main
   ```

3. **Don't clear cache unnecessarily** - Lage is smart about invalidation

4. **Watch mode for active development** - Use package-specific watch scripts for faster feedback

## Common Workflows

### Developing a New Component

```bash
# Initial setup
npm install
npm run build

# Active development (incremental compilation)
npm run build-components:watch -w @ni/nimble-components
npm run storybook

# Before creating PR
lage run build --since origin/main  # Build only changed packages
npm run lint  # Lint changed packages
npm run test  # Test changed packages
```

### Reviewing a PR

```bash
# Checkout PR branch
git fetch origin pull/<pr-number>/head:pr-<pr-number>
git checkout pr-<pr-number>

# Install dependencies (if package.json changed)
npm install

# Build only changed packages
lage run build --since origin/main

# Run full validation
npm run validate
```

### After Pulling Latest Main

```bash
git pull origin main
npm install  # If package-lock.json changed

# Lage automatically rebuilds only what changed
npm run build  # Fast thanks to cache!
```

## Getting Help

**Cache issues?** Clear and rebuild:
```bash
rm -rf .lage/cache && npm run build
```

**Want to see what Lage is doing?**
```bash
lage run build --verbose
```

**Build failing?** Check error output - Lage shows which package failed and why.

**Questions?** Ask in #systemlink-design-system Slack channel or check [Lage documentation](https://microsoft.github.io/lage/).

## Migration Notes

If you encounter issues after the migration:

1. **Clear cache**: `rm -rf .lage/cache`
2. **Verify Node version**: `node --version` (should be 22+)
3. **Reinstall dependencies**: `rm -rf node_modules package-lock.json && npm install`
4. **Check for uncommitted changes**: `git status` (may affect cache keys)

Still having issues? Post in Slack with:
- Error message
- `npm run build --verbose` output
- Output of `lage run build --verbose`
