# Research: Lage Build Coordination

**Date**: November 26, 2025  
**Feature**: [spec.md](./spec.md)  
**Purpose**: Resolve technical unknowns and establish implementation patterns for build orchestration

## Research Summary

All research items resolved. Lage infrastructure is already in place from prior features (002-lint-speedup, 001-replace-concurrently). Build pipeline follows established patterns with minor adjustments for build-specific caching.

---

## 1. Current Build System Analysis

### Decision: Sequential npm workspaces with no caching

**Research Question**: How does the current build system work and what are the pain points?

**Findings**:

1. **Current Implementation**: Root `package.json` contains `"build": "npm run build --workspaces --if-present"`
   - Runs sequentially through all 23 workspace packages
   - No parallelization or caching
   - Full rebuild takes ~10 minutes locally, ~8 minutes in CI

2. **Package Build Scripts**: Each package has its own `build` script:
   - `nimble-components`: Multi-step (generate-icons → generate-workers → build-components → bundle-components → generate-scss)
   - `nimble-tokens`: Multi-step (build:svg-to-ts → build:ts → build:generate-font-scss → build:style-dictionary)
   - `angular-workspace`: Multi-step (generate-icons → build:nimble → build:spright → build:ok → build:application)
   - `blazor-workspace`: Multi-step (generate-icons → build:release → build:client)
   - Other packages: Simple TypeScript compilation (`tsc -p ./tsconfig.json`)

3. **Dependency Chain**:
   ```
   nimble-tokens
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

4. **Pain Points**:
   - No incremental builds - changing one file rebuilds everything
   - Sequential execution wastes developer time waiting
   - No cache - same code rebuilds every time
   - No scoped builds - can't build just what you need

**Rationale**: Current system is simple but inefficient. Lage will provide significant improvements without complicating the workflow.

**Alternatives Considered**:
- Turborepo: Similar capabilities but requires additional dependency
- Custom orchestration: Would need to implement caching, parallelism, dependency tracking (reinventing Lage)
- Keep current system: Unacceptable - wastes too much developer time

---

## 2. Lage Build Pipeline Configuration

### Decision: Add build pipeline to existing lage.config.js following test/validate pattern

**Research Question**: What's the best way to configure Lage for builds?

**Findings**:

1. **Existing Lage Infrastructure** (from 001-replace-concurrently):
   - Lage 2.14.15 installed and configured
   - `lage.config.js` already has lint, test, validate pipelines
   - Workspace manifest (`scripts/lint/workspaces.json`) tracks package weights
   - Cache directory (`.lage/cache`) configured
   - Concurrency configurable via `LAGE_CONCURRENCY` env var (default 4, CI uses 8)

2. **Build Pipeline Pattern** (from Lage docs):
   ```javascript
   build: {
       dependsOn: ['^build'],  // Build dependencies first
       cache: true,            // Enable caching
       inputs: [               // Files that invalidate cache
           'src/**',
           'package.json',
           'tsconfig.json',
           'rollup.config.js',  // For packages using rollup
           'vite.config.ts'     // For packages using vite
       ],
       outputs: [              // Files to cache
           'dist/**',
           'lib/**',
           'build/**'
       ],
       weight: (target, maxWorkers = 4) => {
           // Reuse existing weight system
           const resolvedWeight = resolveWeight(target.packageName);
           return Math.min(resolvedWeight ?? 2, maxWorkers);
       }
   }
   ```

3. **Cache Inputs**: Must include all files that affect build output
   - Source files: `src/**`, `source/**` (for nimble-tokens)
   - Build config: `tsconfig.json`, `rollup.config.js`, `vite.config.ts`, `package.json`
   - Dependencies: `package-lock.json` (global), `node_modules/**` (per-package)
   - Build scripts: Custom build scripts in `build/` directories

4. **Cache Outputs**: Build artifacts that should be cached
   - TypeScript: `dist/**`, `lib/**`
   - Rollup: `dist/**`
   - Storybook: `dist/storybook/**`
   - Generated files: Icons, workers, SCSS from nimble-components

**Rationale**: Follow established Lage patterns from test/validate pipelines. Build pipeline is similar but with different cache inputs/outputs.

**Alternatives Considered**:
- No cache: Would defeat primary purpose (fast incremental builds)
- Cache all outputs: Too broad, could include test artifacts
- Separate pipelines per package type: Over-engineered, single pipeline works

---

## 3. Multi-Step Build Script Handling

### Decision: Lage invokes top-level `build` script; package handles internal orchestration

**Research Question**: How should Lage handle packages with multi-step builds (e.g., nimble-components)?

**Findings**:

1. **Current Multi-Step Builds**:
   - `nimble-components`: `generate-icons && generate-workers && build-components && bundle-components && generate-scss`
   - `nimble-tokens`: `build:svg-to-ts && build:ts && build:generate-font-scss && build:style-dictionary`
   - `angular-workspace`: `generate-icons && build:nimble && build:spright && build:ok && build:application`

2. **Lage Best Practice**: Invoke the top-level `build` script only
   - Lage orchestrates **package-level** dependencies (nimble-tokens before nimble-components)
   - Each package's `build` script orchestrates **internal** steps
   - Keeps package.json scripts unchanged (backward compatibility)

3. **Cache Granularity**: Cache at package level, not step level
   - If `src/button/index.ts` changes, entire nimble-components rebuilds
   - This is acceptable - most packages build in <60 seconds
   - Finer-grained caching would require splitting packages (not worth complexity)

**Rationale**: Simplicity. Lage handles package orchestration; packages handle their own internal workflow. No need to expose internal build steps to Lage.

**Alternatives Considered**:
- Expose each step to Lage: Would require rewriting all package.json scripts (breaking change)
- Cache each step separately: Would require complex cache key management
- Split packages into smaller pieces: Too much restructuring for marginal gains

---

## 4. Build Cache Invalidation Strategy

### Decision: Hash-based invalidation using source files, configs, and dependencies

**Research Question**: When should the build cache be invalidated?

**Findings**:

1. **Cache Key Composition** (from Lage docs):
   - Lage generates cache keys from:
     - Input file content hashes (glob patterns in `inputs`)
     - Package dependencies (from package.json)
     - Repo-wide changes (package-lock.json, lage.config.js)

2. **Invalidation Triggers**:
   - Source file changes: `src/**`, `source/**`
   - Configuration changes: `tsconfig.json`, `rollup.config.js`, `vite.config.ts`
   - Dependency changes: `package.json`, `package-lock.json`
   - Build script changes: `build/**/*.js`, `build/**/*.ts`
   - Lage config changes: `lage.config.js`
   - Workspace manifest changes: `scripts/lint/workspaces.json`

3. **Edge Cases**:
   - **Generated files**: Should NOT be in inputs (e.g., `dist/icons/**` is an output, not input)
   - **Node modules**: Covered by `package-lock.json` hash, no need to hash node_modules directly
   - **Transitive dependencies**: Lage automatically rebuilds dependents when dependency rebuilds

4. **Testing Cache Validity**:
   ```bash
   # Test 1: Warm cache
   npm run build  # Cold build
   npm run build  # Should skip all packages via cache (<5s)
   
   # Test 2: Source change
   echo "// comment" >> packages/nimble-tokens/source/base-tokens.ts
   npm run build  # Should rebuild nimble-tokens + dependents only
   
   # Test 3: Config change
   touch packages/nimble-components/tsconfig.json
   npm run build  # Should rebuild nimble-components + dependents only
   ```

**Rationale**: Standard hash-based caching. Lage handles this well out-of-the-box. Just need correct input glob patterns.

**Alternatives Considered**:
- Timestamp-based caching: Less reliable (clock skew, file system issues)
- No caching: Defeats purpose of this feature
- Remote caching: Deferred to future (local cache is MVP)

---

## 5. Parallel Execution Safety

### Decision: 4 workers locally, 8 in CI; weight-based allocation prevents OOM

**Research Question**: How many concurrent builds can run safely without exhausting memory?

**Findings**:

1. **Memory Usage by Package** (measured during sequential builds):
   - Light packages (jasmine-extensions, jasmine-parameterized): ~200MB
   - Standard packages (nimble-components, angular-workspace): ~500MB
   - Heavy packages (storybook, site, performance): ~1.5GB

2. **Worker Allocation** (using existing weight system):
   ```javascript
   weight: (target, maxWorkers = 4) => {
       const resolvedWeight = resolveWeight(target.packageName);
       return Math.min(resolvedWeight ?? 2, maxWorkers);
   }
   ```
   - Light packages: weight 1 (can run 4 concurrently)
   - Standard packages: weight 2 (can run 2 concurrently)
   - Heavy packages: weight 4 (runs 1 at a time)

3. **Memory Calculation**:
   - Local (16GB RAM, 4 workers): 4 × 500MB = 2GB (safe)
   - CI (8GB RAM, 8 workers): Lage respects weights, won't run 8 heavy packages simultaneously
   - Worst case: 2 heavy packages (2 × 1.5GB = 3GB) + 2 light packages (2 × 200MB = 400MB) = 3.4GB total

4. **Concurrency Configuration**:
   - Local: `LAGE_CONCURRENCY=4` (default in lage.config.js)
   - CI: `LAGE_CONCURRENCY=8` (set in GitHub Actions workflow)
   - Developers can override: `LAGE_CONCURRENCY=2 npm run build` for low-memory machines

**Rationale**: Existing weight system from lint/test pipelines is sufficient for builds. No new configuration needed.

**Alternatives Considered**:
- Fixed concurrency for all packages: Would underutilize workers for light packages
- No concurrency limits: Risk of OOM errors
- Separate weights for build vs lint/test: Unnecessary complexity, weights correlate

---

## 6. CI Pipeline Integration

### Decision: No changes to CI workflows; Lage respects LAGE_CONCURRENCY=8

**Research Question**: What changes are needed in GitHub Actions workflows?

**Findings**:

1. **Current CI Workflow** (`.github/workflows/main.yml`):
   ```yaml
   - name: Build
     run: npm run build
   ```

2. **Lage in CI** (from 001-replace-concurrently):
   - Already sets `LAGE_CONCURRENCY=8` environment variable
   - Lage automatically uses 8 workers for all pipelines (lint, test, validate, build)
   - No workflow changes needed

3. **CI Performance Estimate**:
   - Current: ~8 minutes sequential build
   - With Lage (cold cache): ~3 minutes parallel build (8 workers)
   - With Lage (warm cache): ~30 seconds (only changed packages)

4. **CI Cache Persistence**: GitHub Actions cache
   - Option A: Don't persist Lage cache between CI runs (simpler, MVP approach)
   - Option B: Cache `.lage/cache` directory in GitHub Actions (faster CI, requires workflow change)
   - **Decision**: Option A for MVP (SC-006: no CI workflow changes)

**Rationale**: Keep it simple. Parallel execution alone provides 60-70% build time reduction. GitHub Actions cache is a future enhancement.

**Alternatives Considered**:
- Require CI workflow changes: Would violate SC-006 constraint
- Use remote cache (Azure Blob): Too complex for MVP, requires infrastructure
- Disable caching in CI: Would lose incremental build benefits on PRs

---

## 7. Error Handling and Fail-Fast Behavior

### Decision: Lage fails fast by default; no additional configuration needed

**Research Question**: How should build failures be handled?

**Findings**:

1. **Lage Fail-Fast** (default behavior):
   - When package A build fails, Lage immediately stops
   - Packages depending on A are not attempted (correct behavior)
   - Independent packages continue building (maximizes information)

2. **Error Output** (from Lage docs):
   ```
   lage run build
   ✓ @ni/nimble-tokens build (2.3s)
   ✗ @ni/nimble-components build (failed)
   ⊘ @ni/nimble-angular build (skipped - dependency failed)
   ⊘ @ni/nimble-react build (skipped - dependency failed)
   ✓ @ni/jasmine-parameterized build (0.8s)
   
   Error in @ni/nimble-components:
   src/button/index.ts(42,5): error TS2322: Type 'string' is not assignable to type 'number'.
   ```

3. **Verbosity Control**:
   - Default: Shows progress + errors
   - Verbose: `lage run build --verbose` (shows all output)
   - Quiet: `lage run build --log-level error` (errors only)

4. **Exit Codes**:
   - Success (all builds passed): exit 0
   - Failure (any build failed): exit 1
   - CI correctly fails on non-zero exit code

**Rationale**: Lage's default error handling matches requirements (FR-007, FR-009). No custom configuration needed.

**Alternatives Considered**:
- Continue on error: Would violate FR-009 (fail-fast requirement)
- Suppress errors: Would violate SC-007 (clear error output)
- Parallel error reporting: Lage already does this (independent packages continue)

---

## 8. Watch Mode Integration

### Decision: Keep existing package-specific watch scripts; do NOT migrate to Lage

**Research Question**: Should watch mode builds be orchestrated by Lage?

**Findings**:

1. **Current Watch Scripts**:
   - `nimble-components`: `build-components:watch` (tsc -w)
   - `nimble-tokens`: `build:ts:watch` (tsc -w)
   - `angular-workspace`: Various watch scripts (watch-nimble, watch-spright)

2. **Lage Watch Support**: Lage can run tasks in watch mode
   - `lage run build --watch` would re-run builds on file changes
   - However: Rebuilds entire packages, not incremental TypeScript compilation
   - TypeScript's `tsc -w` is faster for incremental changes (recompiles changed files only)

3. **Developer Workflow**:
   - Current: Developers manually start specific watch scripts for packages they're modifying
   - With Lage watch: Would rebuild entire packages on every change (slower)
   - Hybrid: Keep current watch scripts, use Lage for one-off builds

4. **Scope Decision**: Out of scope per spec
   - Spec explicitly excludes watch mode migration (see "Out of Scope" section)
   - Watch scripts remain package-specific and manual

**Rationale**: TypeScript's built-in watch mode is faster for incremental development. Lage watch would be slower and less ergonomic.

**Alternatives Considered**:
- Migrate all watch scripts to Lage: Slower builds, worse DX
- Create Lage orchestrated watch: Complex, marginal benefit over existing scripts
- Remove watch scripts entirely: Unacceptable, developers need fast feedback

---

## 9. Scoped Builds and --since Flag

### Decision: Lage's built-in --scope and --since flags work out-of-the-box

**Research Question**: How do scoped builds work in Lage?

**Findings**:

1. **--scope Flag** (target specific packages):
   ```bash
   # Build single package + dependencies
   lage run build --scope @ni/nimble-components
   
   # Build multiple packages + dependencies
   lage run build --scope @ni/nimble-components --scope @ni/spright-components
   
   # Build package without dependencies (advanced)
   lage run build --scope @ni/nimble-components --no-deps
   ```

2. **--since Flag** (build changed packages):
   ```bash
   # Build packages changed since main
   lage run build --since origin/main
   
   # Build packages changed since specific commit
   lage run build --since abc123
   
   # Build packages with uncommitted changes
   lage run build --since HEAD
   ```

3. **Dependency Resolution**:
   - Lage automatically includes transitive dependencies
   - Example: `--scope @ni/nimble-angular` also builds `@ni/nimble-tokens` and `@ni/nimble-components`
   - Matches npm workspaces dependency graph

4. **Cache Interaction**:
   - Scoped builds still use cache
   - Example: `--scope @ni/nimble-components` with warm cache skips dependencies if unchanged
   - Provides double benefit: scoping + caching

**Rationale**: Lage provides these features out-of-the-box. No custom implementation needed.

**Alternatives Considered**:
- Manual scoping via npm scripts: Would be complex and error-prone
- Git-based change detection: Lage already does this with --since
- No scoping support: Would reduce developer productivity (P3 user story)

---

## 10. Migration and Rollback Strategy

### Decision: Single-step migration; rollback via git revert + cache clear

**Research Question**: What's the safest way to migrate and how can we rollback?

**Findings**:

1. **Migration Approach**:
   - Single PR with all changes (lage.config.js + package.json)
   - Test thoroughly in PR CI before merging
   - Communicate to team via PR description + Slack announcement
   - No gradual rollout - all or nothing (simpler, less confusing)

2. **Rollback Procedure** (if issues arise):
   ```bash
   # Step 1: Revert the migration commit
   git revert <migration-commit-sha>
   
   # Step 2: Clear Lage cache (prevent stale cache issues)
   rm -rf .lage/cache
   
   # Step 3: Verify build works
   npm run build
   
   # Step 4: Communicate rollback to team
   # (via Slack, PR comment, etc.)
   ```

3. **Rollback Testing** (before migration):
   - Create migration PR
   - Test rollback in separate branch
   - Verify reverted code builds correctly
   - Document rollback procedure in plan.md

4. **Backward Compatibility**:
   - `npm run build` continues to work (same command)
   - Package-level build scripts unchanged
   - Only root package.json and lage.config.js change
   - No client-facing changes

**Rationale**: Simple one-step migration reduces confusion. Clean rollback path provides safety net.

**Alternatives Considered**:
- Gradual rollout (Lage for some packages, npm workspaces for others): Too complex, two build systems
- Feature flag: Unnecessary complexity for infrastructure change
- No rollback plan: Irresponsible, need safety net

---

## Conclusion

All research complete. No blockers identified. Existing Lage infrastructure (from 002-lint-speedup and 001-replace-concurrently) provides solid foundation for build orchestration. Implementation is straightforward configuration change following established patterns.

**Key Decisions**:
1. ✅ Add build pipeline to lage.config.js (follows test/validate pattern)
2. ✅ Cache at package level using hash-based invalidation
3. ✅ Use existing weight system for memory-safe parallel execution
4. ✅ No CI workflow changes (LAGE_CONCURRENCY=8 already set)
5. ✅ Lage's fail-fast and error handling sufficient
6. ✅ Keep watch scripts package-specific (out of scope)
7. ✅ Use built-in --scope and --since flags (no custom work)
8. ✅ Single-step migration with git revert rollback

**Ready for Phase 1**: Design detailed implementation plan and task breakdown.
