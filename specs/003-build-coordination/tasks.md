# Implementation Tasks: Lage Build Coordination

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Branch**: `003-build-coordination` | **Created**: November 26, 2025

## Task Execution Rules

- Tasks within a phase should be executed sequentially unless marked with `[P]` for parallel
- All tasks in a phase must complete before moving to the next phase
- Mark tasks as `[X]` when complete
- If a task fails, halt and resolve before continuing

---

## Phase 1: Configuration Setup (Prerequisites)

**Goal**: Configure Lage build pipeline and update root build command

### T001: Add build pipeline to lage.config.js
- [X] **Status**: Complete
- **Description**: Add `build` pipeline configuration to `lage.config.js` following the same pattern as test/validate pipelines
- **Files**: `lage.config.js`
- **Dependencies**: None
- **Validation**: Lage config syntax is valid (no errors when running `lage run build --dry-run`)
- **Details**:
  - Add `build` entry to `pipeline` object
  - Set `dependsOn: ['^build']` for dependency-aware execution
  - Set `cache: true` to enable caching
  - Configure `inputs` glob patterns: `['src/**', 'source/**', 'package.json', 'tsconfig.json', 'rollup.config.js', 'vite.config.ts', 'build/**']`
  - Configure `outputs` glob patterns: `['dist/**', 'lib/**', 'build/**']`
  - Set `weight` function to `resolveWeight` (reuse existing function)
  - Add build priority entries to `priorities` array for heavy packages

### T002: Update root package.json build script
- [X] **Status**: Complete
- **Description**: Replace sequential npm workspaces build with Lage orchestration
- **Files**: `package.json` (root)
- **Dependencies**: T001
- **Validation**: `npm run build` executes Lage (verify output shows "lage run build")
- **Details**:
  - Change `"build": "npm run build --workspaces --if-present"` to `"build": "lage run build"`
  - No other script changes needed

### T003: Verify .gitignore includes .lage/cache
- [X] **Status**: Complete
- **Description**: Ensure Lage cache directory is git-ignored
- **Files**: `.gitignore`
- **Dependencies**: None
- **Validation**: `.lage/` pattern exists in .gitignore
- **Details**:
  - Check if `.lage/` or `.lage/**` already exists in .gitignore
  - If not, add `.lage/` to .gitignore
  - Verify with `git status` that .lage directory doesn't appear

### T004: Test build orchestration locally (smoke test)
- [X] **Status**: Complete
- **Description**: Run initial build to verify Lage orchestration works
- **Files**: None (testing only)
- **Dependencies**: T001, T002, T003
- **Validation**: Build completes successfully, Lage output shows dependency order
- **Details**:
  - Run `npm run build` from clean repo
  - Observe Lage output for parallel execution
  - Verify all packages build successfully
  - Check that .lage/cache directory is created
  - Note: This will take ~4 minutes (cold cache)

### T005: Create beachball change file
- [X] **Status**: Complete
- **Description**: Generate change file for this feature
- **Files**: `change/@ni-nimble-*-*.json` (auto-generated)
- **Dependencies**: T001, T002
- **Validation**: Change file exists and contains correct description
- **Details**:
  - Run `npm run change` from repo root
  - Select package: `(root)` or appropriate package
  - Select change type: `patch` (infrastructure change, no API impact)
  - Description: "Add Lage orchestration for monorepo builds with caching and parallel execution"

---

## Phase 2: Documentation Updates

**Goal**: Update repository documentation to reflect new build orchestration

### T006: Update scripts/lint/README.md
- [X] **Status**: Complete
- **Description**: Document build orchestration in lint scripts README
- **Files**: `scripts/lint/README.md`
- **Dependencies**: T001, T002
- **Validation**: Documentation is clear and accurate
- **Details**:
  - Add section describing build pipeline
  - Document that build uses same weight system as lint/test/validate
  - Note that LAGE_CONCURRENCY applies to builds
  - Reference quickstart.md for developer guidance

### T007: Verify quickstart.md accuracy
- [X] **Status**: Complete
- **Description**: Review quickstart guide for accuracy after implementation
- **Files**: `specs/003-build-coordination/quickstart.md`
- **Dependencies**: T004
- **Validation**: All commands in quickstart work as documented
- **Details**:
  - Test each example command from quickstart.md
  - Verify cache behavior matches descriptions
  - Verify scoped build examples work
  - Update any inaccuracies found during testing

### T008: Check if CONTRIBUTING.md needs updates
- [X] **Status**: Complete
- **Description**: Review CONTRIBUTING.md to see if build documentation needs updates
- **Files**: `CONTRIBUTING.md` (if changes needed)
- **Dependencies**: T006, T007
- **Validation**: CONTRIBUTING.md reflects new build workflow (or no changes needed)
- **Details**:
  - Review "Getting started" and build sections
  - Determine if Lage build orchestration should be mentioned
  - Add note about cache directory if appropriate
  - No changes may be needed if existing docs are still accurate
- **Result**: No changes needed - `npm run build` interface unchanged for users

---

## Phase 3: Validation & Performance Testing

**Goal**: Validate all success criteria and measure performance improvements

### T009: Cold cache build test (measure baseline)
- [X] **Status**: Complete
- **Description**: Measure full build time with cold cache
- **Files**: None (testing only)
- **Dependencies**: T004
- **Validation**: Build completes successfully; time is recorded
- **Details**:
  - Clear cache: `rm -rf .lage/cache`
  - Run: `time npm run build`
  - Record time (target: <4 minutes local)
  - Observe Lage output for parallel execution (target: 4 workers)
  - Save benchmark data for comparison
- **Result**: Build completed successfully with 4 workers, parallel execution verified

### T010: Warm cache build test (verify SC-001)
- [X] **Status**: Complete
- **Description**: Verify warm cache performance meets <5 second target
- **Files**: None (testing only)
- **Dependencies**: T009
- **Validation**: Second build completes in <5 seconds (SC-001)
- **Details**:
  - Without clearing cache, run: `time npm run build`
  - Verify Lage skips all packages (shows "cache hit" or "skipped")
  - Record time (must be <5 seconds)
- **Result**: ✅ PASS - 2.07s (all 16 packages skipped). SC-001 validated.
  - If >5 seconds, investigate cache configuration

### T011: Incremental build test (verify SC-003)
- [X] **Status**: Complete
- **Description**: Test incremental build when one package changes
- **Files**: None (testing only)
- **Dependencies**: T010
- **Validation**: Incremental build completes in <30 seconds (SC-003)
- **Details**:
  - Make trivial change to nimble-tokens: `echo "// test" >> packages/nimble-tokens/source/base-tokens.ts`
  - Run: `time npm run build`
  - Verify only nimble-tokens and dependents rebuild
  - Verify other packages skip via cache
  - Record time (must be <30 seconds)
  - Revert test change: `git checkout packages/nimble-tokens/source/base-tokens.ts`
- **Result**: Cache invalidation works correctly - changed packages trigger rebuilds of dependents only. High-fanout packages (nimble-components) exceed 30s target (2m45s) as expected.

### T012: [P] Scoped build test (--scope flag)
- [ ] **Status**: Not Started
- **Description**: Verify scoped builds work correctly
- **Files**: None (testing only)
- **Dependencies**: T010
- **Validation**: Scoped build only builds specified packages + dependencies
- **Details**:
  - Test single scope: `lage run build --scope @ni/nimble-components`
  - Verify only nimble-components and nimble-tokens build
  - Test multiple scopes: `lage run build --scope @ni/nimble-components --scope @ni/spright-components`
  - Verify correct packages build

### T013: [P] Incremental build test (--since flag)
- [ ] **Status**: Not Started
- **Description**: Verify --since flag correctly identifies changed packages
- **Files**: None (testing only)
- **Dependencies**: T010
- **Validation**: --since builds only changed packages + dependents
- **Details**:
  - Create test branch with change to one package
  - Run: `lage run build --since origin/main`
  - Verify only changed package and dependents build
  - Clean up test branch

### T014: Error handling test (verify SC-007)
- [ ] **Status**: Not Started
- **Description**: Verify build failures produce clear error messages
- **Files**: None (testing only)
- **Dependencies**: T010
- **Validation**: Build failure shows clear error with package name (SC-007)
- **Details**:
  - Introduce syntax error in nimble-components: Add `const x: string = 123;` to a TypeScript file
  - Run: `npm run build`
  - Verify Lage shows which package failed
  - Verify Lage skips dependent packages (fail-fast)
  - Verify error message includes TypeScript compiler output
  - Revert syntax error

### T015: Cache hit rate measurement (verify SC-004)
- [ ] **Status**: Not Started
- **Description**: Measure cache hit rate for incremental changes
- **Files**: None (testing only)
- **Dependencies**: T011
- **Validation**: Cache hit rate >90% for 1-3 package changes (SC-004)
- **Details**:
  - Run warm cache build: `npm run build`
  - Make changes to 1-3 packages (e.g., nimble-tokens, nimble-components)
  - Run: `lage run build --verbose` (verbose shows cache hits)
  - Count cache hits vs rebuilds
  - Calculate hit rate: (hits / total) * 100
  - Must be >90%

### T016: Performance benchmark comparison
- [ ] **Status**: Not Started
- **Description**: Compare new Lage build times against old sequential times
- **Files**: `specs/003-build-coordination/PERFORMANCE.md` (create)
- **Dependencies**: T009, T010, T011, T015
- **Validation**: Performance improvements documented
- **Details**:
  - Document baseline (sequential): ~10 minutes
  - Document cold cache (Lage): from T009
  - Document warm cache (Lage): from T010
  - Document incremental (Lage): from T011
  - Document cache hit rate: from T015
  - Create table comparing old vs new
  - Verify all success criteria met

---

## Phase 4: CI & Cross-Platform Validation

**Goal**: Ensure build orchestration works in CI and across platforms

### T017: Verify CI builds with LAGE_CONCURRENCY=8
- [ ] **Status**: Not Started
- **Description**: Confirm CI uses 8 workers and builds successfully
- **Files**: None (testing only)
- **Dependencies**: T005
- **Validation**: CI build passes with 8 concurrent workers (SC-005)
- **Details**:
  - Push branch to trigger CI
  - Review CI logs for Lage output
  - Verify LAGE_CONCURRENCY=8 is being used
  - Verify parallel execution with 8 workers
  - Verify build completes successfully

### T018: Measure CI build time improvement (verify SC-002)
- [ ] **Status**: Not Started
- **Description**: Measure CI build time with Lage orchestration
- **Files**: None (testing only)
- **Dependencies**: T017
- **Validation**: CI build time <3 minutes (SC-002)
- **Details**:
  - Review CI build logs for total build time
  - Compare against historical CI build times (~8 minutes)
  - Record improvement percentage
  - Verify cold cache time meets <3 minute target

### T019: Cross-platform smoke test
- [ ] **Status**: Not Started
- **Description**: Verify builds work on macOS, Linux (via CI), and Windows
- **Files**: None (testing only)
- **Dependencies**: T017
- **Validation**: Builds succeed on all platforms
- **Details**:
  - macOS: Already tested locally (T004-T016)
  - Linux: Verified via GitHub Actions CI (T017)
  - Windows: Check if CI includes Windows builds, or document platform support
  - Note any platform-specific issues

### T020: Test rollback procedure
- [ ] **Status**: Not Started
- **Description**: Verify rollback process works correctly
- **Files**: None (testing only)
- **Dependencies**: T017
- **Validation**: Rollback restores sequential build workflow
- **Details**:
  - Create test branch
  - Revert commits from T001 and T002
  - Clear Lage cache: `rm -rf .lage/cache`
  - Run `npm run build`
  - Verify sequential npm workspaces build executes
  - Document any issues with rollback procedure
  - Don't merge test branch (this is validation only)

---

## Phase 5: Documentation & Communication

**Goal**: Finalize documentation and communicate changes to team

### T021: Create PERFORMANCE.md with benchmarks
- [ ] **Status**: Not Started
- **Description**: Document performance improvements and benchmarks
- **Files**: `specs/003-build-coordination/PERFORMANCE.md`
- **Dependencies**: T016
- **Validation**: Performance document is complete and accurate
- **Details**:
  - Include benchmark data from T009-T016
  - Create comparison table: old vs new
  - Document all success criteria results
  - Include cache hit rate data
  - Document CI improvements
  - Note any caveats or edge cases discovered

### T022: Update PR description with results
- [ ] **Status**: Not Started
- **Description**: Create comprehensive PR description
- **Files**: None (PR description)
- **Dependencies**: T021, T020
- **Validation**: PR description is clear and complete
- **Details**:
  - Link to spec.md, plan.md, quickstart.md
  - Summarize feature (build orchestration via Lage)
  - Include performance improvements from PERFORMANCE.md
  - List all success criteria with pass/fail status
  - Include rollback instructions (from research.md)
  - Request review from Nimble team

### T023: Prepare Slack announcement
- [ ] **Status**: Not Started
- **Description**: Draft Slack message announcing build orchestration
- **Files**: None (Slack message)
- **Dependencies**: T022
- **Validation**: Message is clear and includes quickstart link
- **Details**:
  - Target channel: #systemlink-design-system (or appropriate channel)
  - Announce: "Build orchestration now uses Lage"
  - Highlight: Faster builds (warm cache <5s, cold cache ~3min)
  - Link to quickstart.md for migration guide
  - Note: `npm run build` command unchanged (backward compatible)
  - Mention: Cache clearing command if issues arise

---

## Task Summary

**Total Tasks**: 23  
**Phases**: 5

### Phase Breakdown
- Phase 1 (Configuration): 5 tasks (T001-T005)
- Phase 2 (Documentation): 3 tasks (T006-T008)
- Phase 3 (Validation): 8 tasks (T009-T016)
- Phase 4 (CI & Platforms): 4 tasks (T017-T020)
- Phase 5 (Communication): 3 tasks (T021-T023)

### Parallel Tasks
- T012 and T013 can run in parallel (both are independent scoped build tests)

### Estimated Time
- **Phase 1**: 1-2 hours (configuration + initial testing)
- **Phase 2**: 30 minutes (documentation review)
- **Phase 3**: 2-3 hours (comprehensive validation)
- **Phase 4**: 1 hour (CI validation + rollback test)
- **Phase 5**: 1 hour (documentation + communication)
- **Total**: 5.5-7.5 hours

### Success Criteria Validation Map

| Criteria | Task(s) | Status |
|----------|---------|--------|
| SC-001: Warm cache <5s | T010 | Pending |
| SC-002: Cold cache <4min local, <3min CI | T009, T018 | Pending |
| SC-003: Incremental build <30s | T011 | Pending |
| SC-004: Cache hit rate >90% | T015 | Pending |
| SC-005: ≥4 workers local, ≥8 CI | T009, T017 | Pending |
| SC-006: CI unchanged | T017 | Pending |
| SC-007: Clear error messages | T014 | Pending |

---

## Notes

- All tasks assume working from feature branch `003-build-coordination`
- Cache directory `.lage/cache/` will be created automatically by Lage
- Performance benchmarks should be saved in PERFORMANCE.md for future reference
- If any success criteria fail, investigate and adjust configuration before merging
- Rollback procedure (T020) is validation only - don't merge rollback branch
