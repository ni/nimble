# Migration Guide: Replacing Concurrently with Lage

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)  
**Phase**: 1 - Design & Contracts  
**Audience**: Nimble contributors

## Overview

This guide helps you migrate from `concurrently` to Lage for all validation and test orchestration in the Nimble monorepo. After this migration, Lage will be the single task orchestration tool, providing better caching, dependency management, and parallel execution.

## Prerequisites

- Lage 2.14.15+ already installed (from 002-lint-speedup feature)
- Node.js 22.14.0+
- Familiarity with npm workspaces

## What's Changing

### Before (Concurrently)

```bash
# Run all validation tasks
npm run validate

# Run all tests
npm run test

# Run package-specific validation
npm run validate:lint-concurrent:nimble-components
npm run validate:test-concurrent:nimble-components
```

### After (Lage)

```bash
# Run all validation tasks (lint + test across all packages)
npm run validate
# Internally: lage run validate

# Run just lint across all packages
npm run lint
# Internally: lage run lint

# Run just tests across all packages
npm run test
# Internally: lage run test

# Run lint for specific package
npm run lint:pkg -- @ni/nimble-components
# Or directly: lage run lint --scope @ni/nimble-components

# Run tests for specific package
lage run test --scope @ni/nimble-components
```

## Command Migration Table

| Old Command | New Command | Notes |
|------------|-------------|-------|
| `npm run validate` | `npm run validate` | Same interface, Lage backend |
| `npm run test` | `npm run test` | Same interface, Lage backend |
| `npm run lint` | `npm run lint` | Already migrated (002-lint-speedup) |
| `npm run validate:lint-concurrent:nimble-components` | `npm run lint:pkg -- @ni/nimble-components` | Use existing Lage lint scope |
| `npm run validate:test-concurrent:nimble-components` | `lage run test --scope @ni/nimble-components` | Direct Lage invocation |
| `npm run lint-concurrent -w @ni/nimble-components` | `npm run lint -w @ni/nimble-components` | Concurrently script removed |
| `npm run test-concurrent -w @ni/nimble-components` | `npm run test -w @ni/nimble-components` | Concurrently script removed |

## New Lage Commands

### Run Changed Packages Only

```bash
# Run tests only for packages changed since origin/main
lage run test --since origin/main

# Run validation only for changed packages
lage run validate --since origin/main
```

### Scope to Specific Packages

```bash
# Run tests for specific package
lage run test --scope @ni/nimble-components

# Run tests for multiple packages
lage run test --scope @ni/nimble-components --scope @ni/jasmine-extensions
```

### Cache Management

```bash
# Clear all Lage cache
rm -rf .lage/cache

# Clear cache for specific package (rare - usually not needed)
rm -rf .lage/cache/@ni/nimble-components

# Run without cache (useful for debugging)
lage run test --no-cache
```

### Browser-Specific Tests

Browser-specific tests (WebKit, Firefox) are **not orchestrated by Lage**. Run them directly via workspace commands:

```bash
# Run WebKit tests for nimble-components
npm run test:vitest:webkit -w @ni/nimble-components

# Run Firefox tests for nimble-components
npm run test:vitest:firefox -w @ni/nimble-components

# Run WebKit tests in watch mode
npm run test:vitest:webkit:watch -w @ni/nimble-components
```

The default `npm run test` command (orchestrated by Lage) runs Chrome tests only. Browser-specific tests are typically run manually for debugging or in separate CI jobs.

## Lage Configuration

### lage.config.js Structure

```javascript
module.exports = {
  npmClient: 'npm',
  concurrency: Number(process.env.LAGE_CONCURRENCY ?? 4), // 4 local, 8 CI
  pipeline: {
    lint: {
      dependsOn: ['^lint'],
      cache: true,
      // ... (existing configuration)
    },
    test: {
      dependsOn: ['^test'],
      cache: true,
      inputs: ['package-lock.json', 'lage.config.js'],
      outputs: [],
      weight: (target, maxWorkers = 4) => {
        const resolvedWeight = resolveWeight(target.packageName);
        return Math.min(resolvedWeight ?? 2, maxWorkers);
      }
    },
    validate: {
      dependsOn: ['^lint', '^test'],
      cache: false  // Composite task
    }
  },
  // ... cache options, priorities
};
```

### Weight Configuration

Packages can specify test execution weight in `scripts/lint/workspaces.json`:

```json
{
  "workspaces": [
    {
      "name": "@ni/nimble-components",
      "weight": "heavy"  // Gets 4 workers (heavy = 4x standard)
    },
    {
      "name": "@ni/jasmine-extensions",
      "weight": "light"  // Gets 1 worker (light = 1x standard)
    }
  ]
}
```

Weight values:
- `"light"`: 1 worker (small test suites)
- `"standard"`: 2 workers (default)
- `"heavy"`: 4 workers (large test suites like nimble-components)

## Cache Behavior

### What Gets Cached

Lage caches task outputs based on input hashes:

**Lint tasks**:
- Inputs: Source files, ESLint config, package-lock.json
- Outputs: `.eslintcache` files
- Cache hit: Instant completion (~0.1s)

**Test tasks**:
- Inputs: Test files, source files, package-lock.json
- Outputs: None (console output only)
- Cache hit: Skip test execution, show cached success (~0.1s)

### Cache Invalidation

Cache is invalidated when:
- Any source file changes in package
- package-lock.json changes
- lage.config.js changes
- Dependency package changes (via `dependsOn: ['^test']`)

### Cache Troubleshooting

**Symptom**: Tests show as cached but should re-run

**Solution**:
```bash
# Clear cache for specific package
rm -rf .lage/cache/@ni/nimble-components

# Or clear all cache
rm -rf .lage/cache

# Then re-run
npm run test
```

**Symptom**: Cache not being used (always re-running)

**Possible causes**:
1. Files changing between runs (check `git status`)
2. Timestamps changing without content changes (rare)
3. Cache folder permissions issue

**Debug**:
```bash
# Run with verbose logging
lage run test --verbose

# Check cache folder exists and is writable
ls -la .lage/cache
```

## Browser-Specific Tests

Browser-specific tests (webkit, firefox) are **NOT orchestrated by Lage**. Run them directly:

```bash
# Run webkit tests for nimble-components
npm run test:vitest:webkit -w @ni/nimble-components

# Run firefox tests
npm run test:vitest:firefox -w @ni/nimble-components

# Run with watch mode
npm run test:vitest:firefox:watch -w @ni/nimble-components
```

**Rationale**: Browser tests use environment variables (BROWSER=webkit) and are typically run manually for debugging, not in automated validation workflows.

## CI Configuration

### GitHub Actions

Increase concurrency in CI by setting environment variable:

```yaml
- name: Run validation
  env:
    LAGE_CONCURRENCY: 8  # Use 8 workers in CI (more resources)
  run: npm run validate
```

### Cache Strategy

CI should cache Lage's cache folder between runs:

```yaml
- uses: actions/cache@v4
  with:
    path: .lage/cache
    key: lage-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      lage-${{ runner.os }}-
```

## Performance Expectations

Based on lint migration benchmarks:

**Cold cache** (first run):
- Similar performance to concurrently
- Slight overhead from cache generation (~5-10%)

**Warm cache** (no changes):
- **~60-70% faster** than concurrently
- Most tasks show cached status instantly

**Partial changes** (1-3 packages):
- **~50-60% faster** than full validation
- Only changed packages execute, rest are cached

## Removed Scripts

The following scripts are removed in this migration:

**Root package.json**:
- ❌ `validate:lint-concurrent:nimble-components`
- ❌ `validate:test-concurrent:nimble-components`

**packages/nimble-components/package.json**:
- ❌ `lint-concurrent` (use `npm run lint` instead)
- ❌ `test-concurrent` (use `npm run test` instead)

**Dependencies**:
- ❌ `concurrently` devDependency (removed from all package.json files)

## Rollback Procedure

If critical issues arise, rollback by:

1. Revert package.json changes (restore concurrently scripts)
2. Run `npm install` to restore concurrently dependency
3. Revert lage.config.js changes (remove test/validate pipelines)
4. Clear Lage cache: `rm -rf .lage/cache`

The lint pipeline will continue to work with Lage regardless of test/validate rollback.

## FAQ

**Q: Can I still run tests in watch mode?**  
A: Yes. Individual package test:watch scripts are unchanged. Run them directly:
```bash
npm run test:vitest:watch -w @ni/nimble-components
```

**Q: What if a test fails due to cache issues?**  
A: Clear cache and re-run. If problem persists, file issue with steps to reproduce.

**Q: Will this affect my local development workflow?**  
A: Minimal impact. Commands stay the same, but you'll see faster validation with cache hits.

**Q: How do I know if cache was used?**  
A: Lage output shows `[cached]` status and very short duration (~0.1s) for cached tasks.

**Q: Can I disable caching for specific tests?**  
A: Yes, but not recommended. Instead, fix flaky tests or skip them with `#SkipBrowser` tags per Nimble conventions.

## Next Steps

After migration:
1. Run `npm run validate` to verify everything works
2. Check cache performance with second `npm run validate` run
3. Test package-specific commands with `--scope`
4. Update any custom scripts or aliases you have

For issues or questions, reach out to the Nimble team or file a GitHub issue.
