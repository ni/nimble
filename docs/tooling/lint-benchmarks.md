# Lint Performance Benchmarks

This document tracks lint execution performance before and after the Lage orchestration migration (spec `002-lint-speedup`).

## Benchmark Environment

**Hardware**: MacBook Pro (Apple M-series), 16GB RAM  
**Architecture**: arm64  
**Node Version**: v22.14.0  
**Test Date**: November 26, 2025  
**Branch**: `002-lint-speedup`  
**Workspaces**: 23 packages

## ⚠️ Pre-Lage Baseline Not Yet Collected

**Status**: Post-Lage benchmarks collected below. Pre-Lage baseline measurements still needed from `main` branch for comparison.

**TODO**: 
1. Measure pre-Lage baseline on `main` branch (different worktree)
2. Calculate actual speedup metrics
3. Validate against success criteria SC-001, SC-002, SC-003

## Success Criteria (from spec.md)

- **SC-001**: Local lint on changed packages completes in ≤2 minutes (120s)
- **SC-002**: CI lint completes in ≤5 minutes (300s) with parallelism + caching
- **SC-003**: Cache hit rate ≥80% on incremental runs

---

## Post-Lage Performance (Measured)

### Test 1: Full Lint (Cold Cache)

**Command**: `npm run lint` after clearing `.cache/lage/` and all `.eslintcache` files

| Metric | Value |
|--------|-------|
| **Real Time** | **17.79s** ⚡ |
| **User CPU Time** | 44.97s |
| **System CPU Time** | 6.38s |
| **Packages Linted** | 23 workspaces |
| **Parallelism** | 4 workers (default) |
| **Lage Cache** | Cold (cleared) |
| **ESLint Cache** | Cold (cleared) |

**Observations**:
- Multi-core parallelism visible: User CPU (44.97s) >> Real time (17.79s), ratio ~2.5x
- Lint errors present in Angular packages (pre-existing, not related to Lage)
- All packages linted despite errors (Lage continued execution)

### Test 2: Full Lint (Warm Cache)

**Command**: `npm run lint` (second run, no changes, all caches warm)

| Metric | Value |
|--------|-------|
| **Real Time** | **15.82s** ⚡⚡ |
| **User CPU Time** | 21.87s |
| **System CPU Time** | 2.59s |
| **Cache Status** | Both Lage and ESLint caches warm |

**Observations**:
- ~11% faster than cold cache (17.79s → 15.82s)
- Lower CPU usage indicates cache hits reducing actual lint work
- Still re-running lints due to existing errors preventing full cache benefit

### Test 3: Lint Changed Packages

**Command**: `npm run lint:changed` (after modifying one package)

| Metric | Value |
|--------|-------|
| **Real Time** | **16.47s** |
| **User CPU Time** | 43.52s |
| **System CPU Time** | 5.72s |

**Note**: This ran all packages because there were unstaged changes in the working directory. The `--since` comparison detected all modified files. In a clean git state with only committed changes, this would be significantly faster.

### Test 4: Lint Specific Package

**Command**: `npm run lint:pkg -- @ni/nimble-tokens`

| Metric | Value |
|--------|-------|
| **Real Time** | **4.04s** ⚡⚡⚡ |
| **User CPU Time** | 10.31s |
| **System CPU Time** | 2.14s |
| **✅ Meets SC-001** | Yes (well under 120s) |

**Observations**:
- Very fast single-package lint
- Ideal for focused development workflow
- 2.5x CPU parallelism ratio maintained

---

## Performance Summary

### Post-Lage (Measured)

| Scenario | Real Time | Status |
|----------|-----------|--------|
| Full lint (cold cache) | **17.79s** | ⚡ Very Fast |
| Full lint (warm cache) | **15.82s** | ⚡⚡ Even Faster |
| Changed packages | 16.47s* | *Measured with dirty git state |
| Single package | **4.04s** | ⚡⚡⚡ Excellent |

**Success Criteria Validation** (partial):
- ✅ **SC-001**: Specific package lint (4.04s) << 120s target
- ❓ **SC-002**: CI benchmarks not yet collected
- ❓ **SC-003**: Cache hit rate not yet measured (need telemetry)

### Pre-Lage Baseline

**Status**: Not yet measured. Need to run benchmarks on `main` branch.

**Expected baseline** (from spec projections):
- Full lint: 120-300s (sequential execution)
- No task-level caching
- Manual package-by-package workflow

---

## Benchmark Collection Procedure (Remaining Work)

To populate this document with real data, run the following tests:

### 1. Pre-Lage Baseline (on `main` branch)

```bash
# Checkout main branch
git checkout main
npm install
npm run build

# Clear all caches
find packages -name ".eslintcache" -delete
rm -rf .cache/lage

# Measure full lint (cold cache)
time npm run lint

# Measure full lint (warm cache)
time npm run lint

# Document results including:
# - Total duration
# - Per-package breakdown (if visible)
# - Hardware specs
# - Node version
```

### 2. Post-Lage Performance (on `002-lint-speedup` branch)

```bash
# Checkout feature branch
git checkout 002-lint-speedup
npm install
npm run build

# Test 1: Full lint (cold cache)
rm -rf .cache/lage
find packages -name ".eslintcache" -delete
time npm run lint

# Test 2: Full lint (warm Lage cache, cold ESLint cache)
find packages -name ".eslintcache" -delete
time npm run lint

# Test 3: Full lint (warm both caches)
time npm run lint

# Test 4: Changed packages only
# (make a small change to one package)
time npm run lint:changed

# Test 5: Specific package
time npm run lint:pkg -- @ni/nimble-components
```

### 3. CI Performance

```bash
# Trigger CI builds on both branches and compare:
# - Total lint job duration
# - Cache restore/save times
# - Parallel execution logs
# - Overall workflow time
```

### 4. Cache Hit Rate Analysis

```bash
# On feature branch, measure across multiple runs:
# 1. First run after cache clear (establish baseline)
# 2. No changes, re-run (100% cache hit expected)
# 3. One file change, re-run (high cache hit expected)
# 4. One package change, re-run (partial cache hit)
```

---

## Actual Results Section

**To be completed after running benchmarks above.**

Replace this placeholder with tables documenting:
- Environment details (hardware, Node version, date)
- Pre-Lage measurements
- Post-Lage measurements  
- Speedup calculations
- Cache hit rate observations
- Success criteria validation (✅ or ❌ for SC-001, SC-002, SC-003)

---

## Recommendations (Preliminary)

Based on implementation and spec projections:

1. **For Developers**:
   - Use `npm run lint:changed` during development for fast feedback
   - Run `npm run lint` before submitting PRs
   - Clear `.cache/lage/` if experiencing stale cache issues

2. **For CI**:
   - Monitor cache hit rates to ensure ≥80% target
   - Adjust parallelism if runner capacity changes
   - Track trends over time once telemetry is implemented

3. **For Benchmark Collection**:
   - Run tests on representative hardware (MacBook Pro or similar)
   - Test with realistic code changes, not empty commits
   - Collect multiple samples to account for variance
   - Document exact ESLint version and configuration used
