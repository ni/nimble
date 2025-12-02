# Vitest CI Debugging History

## Problem
Vitest browser tests fail intermittently in CI with absolute filesystem path URLs like:
```
http://localhost:63317/home/runner/work/nimble/nimble/packages/nimble-components/src/...
```

Instead of relative URLs like:
```
http://localhost:63317/src/...
```

This causes "Failed to fetch dynamically imported module" errors.

## Root Cause Analysis
- **Primary Issue**: When `npm run test --workspaces` executes from monorepo root, Vite/Vitest uses absolute filesystem paths instead of relative paths
- **Secondary Issue**: Iframe connection failures under load in CI
- **Context**: Tests pass locally because `process.cwd()` matches package root; CI exposes the mismatch

## Fix Attempts Chronology

### Attempt 1: Explicit `root` and `setupFiles` paths (Commit d0c0ce55a)
**What**: Set `root: packageRoot` and used `resolve()` for setupFiles
```typescript
const packageRoot = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    root: packageRoot,
    setupFiles: [resolve(packageRoot, 'src/utilities/tests/setup-vitest.ts')]
});
```
**Result**: Partial improvement, but absolute paths still appeared in CI

### Attempt 2: Add `server.fs.allow` (Commit d892daa47)
**What**: Added filesystem allow list
```typescript
server: {
    fs: {
        allow: [packageRoot]
    }
}
```
**Result**: No improvement, still seeing absolute paths

### Attempt 3: Multiple server config options (Commit 191b7de27)
**What**: Added base path, strict fs, isolate, and retry
```typescript
base: './',
server: {
    fs: {
        strict: true,
        allow: [packageRoot]
    }
}
test: {
    browser: { isolate: true },
    retry: process.env.CI ? 1 : 0
}
```
**Result**: Still had absolute path errors, but added useful stability features

### Attempt 4: Force working directory with `process.chdir()` (Commit c2f88b482)
**What**: Changed working directory before config loads
```typescript
if (process.cwd() !== packageRoot) {
    process.chdir(packageRoot);
}
```
**Result**: Tests passed locally when run from repo root, but CI still failed

### Attempt 5: Simplified server.fs config (Commit a4a52562a)
**What**: Removed base path, simplified fs config
```typescript
server: {
    fs: { strict: false }
}
```
**Result**: No improvement

### Attempt 6: Add playwright timeout and warmup (Commit 1e7eaaea5 - REVERTED)
**What**: Tried adding timeout to playwright provider and warmup config
```typescript
provider: playwright({ timeout: 60000 }),
server: {
    warmup: { clientFiles: ['src/**/*.spec.ts'] }
}
```
**Result**: TypeScript errors - these options don't exist in the API

### Attempt 7: Add GitHub Actions artifacts and workflow timeout (Commit 01152a8f3 & 3d7af7a99)
**What**: 
- Added artifact upload for failure screenshots
- Added 30-minute workflow timeout
- Changed base back to './' and added parent directory access
```typescript
base: './',
server: {
    fs: {
        strict: false,
        allow: ['..']
    }
}
```
**Result**: Still seeing absolute path failures in CI

### Attempt 8: Remove base path and disable HMR (Commit bbfd1ad7e)
**What**: Removed base config, disabled HMR in CI
```typescript
server: {
    hmr: process.env.CI ? false : undefined
}
```
**Result**: Still seeing absolute path failures in CI - HMR wasn't the issue

### Attempt 9: Change base back to '/' (Current)
**What**: Set explicit `base: '/'` instead of './' or undefined
```typescript
base: '/'
```
**Hypothesis**: The issue might be that Vite needs an explicit base of '/' to properly construct URLs from the root, not from a relative path

## Current Configuration State
```typescript
const packageRoot = dirname(fileURLToPath(import.meta.url));

if (process.cwd() !== packageRoot) {
    process.chdir(packageRoot);
}

export default defineConfig({
    root: packageRoot,
    base: '/',
    server: {
        fs: {
            strict: false,
            allow: ['..']
        },
        hmr: process.env.CI ? false : undefined,
        warmup: {
            clientFiles: ['src/**/*.spec.ts']
        }
    },
    test: {
        browser: {
            isolate: true,
            screenshotFailures: true
        },
        testTimeout: 10000,
        hookTimeout: 10000,
        retry: process.env.CI ? 1 : 0,
        setupFiles: [resolve(packageRoot, 'src/utilities/tests/setup-vitest.ts')]
    }
});
```

## What Hasn't Been Tried Yet

1. **Setting explicit `server.origin`** - Force Vite to use a specific origin
2. **Removing `base` entirely** - Let Vite auto-detect
3. **Using `@fs` prefix in setupFiles** - Vite's filesystem protocol
4. **Setting `server.preTransformRequests: false`** - Disable pre-transform
5. **Configuring `resolve.alias`** - Create aliases for src paths
6. **Using environment variable in config** - `process.env.VITEST_BROWSER_API`
7. **Setting `server.hmr: false`** - Disable HMR in CI
8. **Investigating if the issue is with parallel execution** - Though local concurrent test passed

## Observations

### Works Locally
- Running `npm run test-concurrent` (Chromium + WebKit in parallel) works perfectly
- 5416 tests pass in Chromium, 5405 in WebKit
- No absolute path errors when run from monorepo root

### Fails in CI
- Intermittent failures with absolute paths
- Both sequential and concurrent test runs affected
- Errors appear random - different files each time
- Suggests race condition or resource constraint issue

## Key Insight
The `process.chdir()` fix should have worked since it forces the working directory. The fact that it doesn't suggests:
1. Vite's dev server might be starting before the chdir takes effect
2. The issue might be with how Vite resolves paths in the browser context, not Node
3. There might be caching or pre-transformation happening
