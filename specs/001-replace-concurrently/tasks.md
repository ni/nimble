# Tasks: Replace Concurrently with Lage

**Input**: Design documents from `/specs/001-replace-concurrently/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: No automated tests needed - validation via manual workflow testing

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Prerequisites

**Purpose**: Validate prerequisites and prepare for migration

- [ ] T001 Verify Lage 2.14.15+ is installed (check package.json and package-lock.json)
- [ ] T002 Verify existing lint pipeline is functional (run `npm run lint` from repo root)
- [ ] T003 Document current concurrently usage patterns (grep for concurrently in package.json files)
- [ ] T004 Backup current package.json files (root and packages/nimble-components/package.json)

**Checkpoint**: Prerequisites verified, ready for configuration changes

---

## Phase 2: Foundational Configuration

**Purpose**: Core Lage configuration that MUST be complete before ANY user story workflow can function

**⚠️ CRITICAL**: No user story workflows (validate/test) will work until this phase is complete

- [ ] T005 Update lage.config.js: Add test pipeline configuration with cache, inputs, outputs, weight function
- [ ] T006 Update lage.config.js: Add validate pipeline configuration with dependsOn for lint and test
- [ ] T007 Review scripts/lint/workspaces.json: Verify weight annotations are appropriate for test tasks (heavy packages = nimble-components)
- [ ] T008 Test Lage test pipeline locally: Run `lage run test` to verify basic test orchestration works

**Checkpoint**: Lage pipelines configured and functional - user story workflow implementation can now begin

---

## Phase 3: User Story 1 - Validation Pipeline Orchestration (Priority: P1) 🎯 MVP

**Goal**: Contributors can run `npm run validate` to execute all validation tasks (lint + test) in parallel with caching

**Independent Test**: 
1. Run `npm run validate` from repo root - all packages lint and test
2. Run `npm run validate` again - see cached results complete in <5s
3. Change one file, run `npm run validate` - only affected packages re-validate

### Implementation for User Story 1

- [ ] T009 [P] [US1] Update root package.json: Replace `"validate": "concurrently..."` with `"validate": "lage run validate"`
- [ ] T010 [P] [US1] Update root package.json: Replace `"test": "concurrently..."` with `"test": "lage run test"`
- [ ] T011 [US1] Remove validate:lint:sequential and validate:test:sequential scripts from root package.json (no longer needed)
- [ ] T012 [US1] Run npm install to update package-lock.json with new scripts
- [X] T013 [US1] Test validate workflow with clean cache: Run `rm -rf .lage/cache && npm run validate`
- [X] T014 [US1] Test validate workflow with warm cache: Run `npm run validate` again immediately
- [X] T015 [US1] Test partial change scenario: Modify one file in nimble-components, run `npm run validate`, verify only affected packages execute
- [X] T016 [US1] Test failure scenario: Introduce lint error, run `npm run validate`, verify it fails fast with exit code 1
- [X] T017 [US1] Measure and document performance: Compare validate timing with cache vs without cache

**Checkpoint**: `npm run validate` and `npm run test` work correctly with Lage, showing caching benefits

---

## Phase 4: User Story 2 - Test Suite Orchestration (Priority: P2)

**Goal**: Contributors can run `npm run test` to execute all test suites in parallel with caching, including browser-specific tests

**Independent Test**:
1. Run `npm run test` from repo root - all package tests execute in parallel
2. Verify browser-specific tests still work: `npm run test:vitest:webkit -w @ni/nimble-components`
3. Run `npm run test` again - see cached results for unchanged packages

### Implementation for User Story 2

- [X] T018 [US2] Verify test pipeline handles packages without test scripts gracefully (check packages that don't have "test" in package.json)
- [X] T019 [US2] Test browser-specific tests are NOT orchestrated by Lage: Verify `npm run test:vitest:webkit -w @ni/nimble-components` still works
- [X] T020 [US2] Test browser-specific tests: Run `npm run test:vitest:firefox -w @ni/nimble-components` to verify firefox tests work
- [X] T021 [US2] Test cross-browser in CI context: Set LAGE_CONCURRENCY=8 and run `npm run test` to verify higher concurrency
- [X] T022 [US2] Document test execution in quickstart.md: Add examples of running tests for specific packages

**Checkpoint**: All test orchestration works correctly, browser tests confirmed functional

---

## Phase 5: User Story 3 - Package-Specific Validation (Priority: P3)

**Goal**: Contributors can run validation for specific packages using Lage's --scope flag

**Independent Test**:
1. Run `lage run lint --scope @ni/nimble-components` - only that package lints
2. Run `lage run test --scope @ni/nimble-components` - only that package tests
3. Verify cache works for scoped commands

### Implementation for User Story 3

- [X] T023 [P] [US3] Remove validate:lint-concurrent:nimble-components script from root package.json
- [X] T024 [P] [US3] Remove validate:test-concurrent:nimble-components script from root package.json
- [X] T025 [P] [US3] Remove lint-concurrent script from packages/nimble-components/package.json
- [X] T026 [P] [US3] Remove test-concurrent script from packages/nimble-components/package.json
- [X] T027 [US3] Update root package.json: Verify lint:pkg script exists for package-specific linting (should already exist from 002-lint-speedup)
- [X] T028 [US3] Test scoped lint command: Run `npm run lint:pkg -- @ni/nimble-components` and verify only that package lints
- [X] T029 [US3] Test scoped test command: Run `lage run test --scope @ni/nimble-components` and verify only that package tests
- [X] T030 [US3] Test multiple scope: Run `lage run test --scope @ni/nimble-components --scope @ni/jasmine-extensions`

**Checkpoint**: Package-specific validation commands work, redundant concurrent scripts removed

---

## Phase 6: Cleanup & Dependency Removal

**Purpose**: Remove concurrently dependency and finalize migration

- [X] T031 [P] Remove concurrently devDependency from root package.json devDependencies
- [X] T032 [P] Remove concurrently devDependency from packages/nimble-components/package.json devDependencies (if present)
- [X] T033 Run `npm install` to update package-lock.json and remove concurrently from lock file
- [X] T034 Verify concurrently is completely removed: Run `grep -r "concurrently" package.json package-lock.json packages/*/package.json`
- [X] T035 Test that no broken scripts remain: Run `npm run validate` to ensure nothing tries to invoke concurrently

**Checkpoint**: Concurrently completely removed from repository

---

## Phase 7: Documentation & Communication

**Purpose**: Document migration and help contributors adopt new workflows

- [X] T036 [P] Update scripts/lint/README.md: Add section documenting test and validate orchestration (similar to existing lint section)
- [X] T037 [P] Review CONTRIBUTING.md: Check if any updates needed for validate/test workflow changes (likely none needed)
- [X] T038 [P] Update .github/workflows/*.yml: Review CI files to ensure they use correct commands (likely no changes needed)
- [X] T039 Create beachball change file: Run `npm run change` and document concurrently removal and Lage migration (type: patch)
- [X] T040 Add migration notes to change file: Document command equivalents for contributors (old → new command mapping)

**Checkpoint**: All documentation updated, change file created

---

## Phase 8: Validation & Performance Testing

**Purpose**: Comprehensive validation of migration before PR submission

- [X] T041 Benchmark cold cache performance: Clear cache, time `npm run validate`, compare to research.md expectations
- [X] T042 Benchmark warm cache performance: Run `npm run validate` again, verify completes in <5s per SC-001
- [X] T043 Test changed package scenario: Modify 2-3 packages, run validate, verify cache hit rate >70% per SC-004
- [X] T044 Test CI concurrency: Set `LAGE_CONCURRENCY=8` and run validate to verify higher concurrency works
- [X] T045 Test error scenarios: Introduce failures in different packages, verify fail-fast behavior and clear error output per SC-007
- [X] T046 Verify all success criteria: Review spec.md SC-001 through SC-007 and confirm each is met
- [X] T047 Run full repository validation: Execute `npm run build && npm run validate` to ensure no regressions
- [X] T048 Document performance results: Update quickstart.md or create performance.md with actual benchmark data

**Checkpoint**: All success criteria validated, performance meets expectations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - Core validation workflow
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3) - Extends test orchestration
- **User Story 3 (Phase 5)**: Depends on User Story 1 (Phase 3) - Package-specific commands
- **Cleanup (Phase 6)**: Depends on User Story 3 (Phase 5) - All concurrent scripts must be removed first
- **Documentation (Phase 7)**: Can run in parallel with Phases 3-6 (marked [P])
- **Validation (Phase 8)**: Depends on all previous phases - Final verification

### User Story Dependencies

- **User Story 1 (P1)**: Foundation for validate workflow - MUST complete first
- **User Story 2 (P2)**: Extends US1 with test-specific validation - Depends on US1
- **User Story 3 (P3)**: Depends on US1 for scoped commands - Independent of US2

### Within Each User Story

**User Story 1**:
- T009-T010 can run in parallel [P] (different scripts in same file - be careful with merge conflicts)
- T011 depends on T009-T010 (cleanup after main changes)
- T012 depends on T011 (npm install after package.json changes)
- T013-T017 are sequential validation tests

**User Story 2**:
- T018-T021 can run in parallel (different test scenarios)
- T022 is documentation (can run anytime in parallel)

**User Story 3**:
- T023-T026 can ALL run in parallel [P] (different files)
- T027 is verification (depends on T023-T026)
- T028-T030 are sequential tests (build on each other)

**Cleanup Phase**:
- T031-T032 can run in parallel [P] (different files)
- T033 depends on T031-T032
- T034-T035 are sequential verification

**Documentation Phase**:
- T036-T038 can ALL run in parallel [P] (different files)
- T039-T040 are sequential (beachball workflow)

**Validation Phase**:
- All tasks are sequential (each builds on previous)

### Parallel Opportunities

**Phase 1 Setup**: All tasks sequential (verification tasks)

**Phase 2 Foundational**: T007 can run in parallel with T005-T006, T008 sequential

**Phase 3 User Story 1**: 
- T009 and T010 can run in parallel
- T013-T017 validation tasks are sequential

**Phase 5 User Story 3**:
```bash
# Launch all script removals together:
Task T023: "Remove validate:lint-concurrent:nimble-components from root package.json"
Task T024: "Remove validate:test-concurrent:nimble-components from root package.json"
Task T025: "Remove lint-concurrent from nimble-components package.json"
Task T026: "Remove test-concurrent from nimble-components package.json"
```

**Phase 6 Cleanup**:
```bash
# Remove dependencies in parallel:
Task T031: "Remove concurrently from root package.json"
Task T032: "Remove concurrently from nimble-components package.json"
```

**Phase 7 Documentation**:
```bash
# All documentation updates in parallel:
Task T036: "Update scripts/lint/README.md"
Task T037: "Review CONTRIBUTING.md"
Task T038: "Review CI workflows"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Fastest Path to Value)

1. ✅ Complete Phase 1: Setup (T001-T004)
2. ✅ Complete Phase 2: Foundational (T005-T008) - **CRITICAL GATE**
3. ✅ Complete Phase 3: User Story 1 (T009-T017)
4. **STOP and VALIDATE**: Test `npm run validate` workflow independently
5. **DECISION POINT**: Ship US1 as MVP or continue to US2/US3

**Rationale**: User Story 1 delivers the core value proposition - fast, cached validation workflow. This is what most contributors use daily.

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Lage pipelines ready
2. **Deliver US1** → Test validate workflow → Validate performance gains (SC-001, SC-002, SC-004)
3. **Deliver US2** → Test browser test orchestration → Validate test execution (SC-003)
4. **Deliver US3** → Remove redundant scripts → Simplify package.json files
5. Complete Cleanup → Remove concurrently entirely (SC-005)
6. Complete Documentation → Help contributors migrate (T036-T040)
7. Complete Validation → Verify all success criteria (SC-001 through SC-007)

Each phase adds value and can be validated independently.

### Parallel Team Strategy

With multiple developers:

1. **Everyone**: Complete Setup + Foundational together (T001-T008)
2. **Once Foundational is done**:
   - **Developer A**: User Story 1 implementation (T009-T017)
   - **Developer B**: Documentation tasks in parallel (T036-T038)
   - **Developer C**: Prepare test scenarios for validation (T041-T048 prep)
3. **After US1 complete**:
   - **Developer A**: User Story 2 (T018-T022)
   - **Developer B**: User Story 3 (T023-T030)
4. **Everyone**: Cleanup + Validation (T031-T048)

---

## Notes

- **[P] tasks**: Different files, safe to run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **File path guidelines**: Always include full absolute or relative paths from repo root
- **Checkpoints**: Stop and validate independently after each user story phase
- **Cache management**: Use `rm -rf .lage/cache` to clear cache when testing cold scenarios
- **Performance targets**: SC-001 (<60s cached), SC-004 (>70% cache hit rate)
- **Browser tests**: NOT orchestrated by Lage - run manually via `npm run test:vitest:webkit -w <package>`
- **Rollback**: Keep backup package.json files from T004 for emergency rollback

---

## Success Criteria Mapping

| Success Criterion | Validated By Tasks | Phase |
|-------------------|-------------------|-------|
| SC-001: Cached validate <60s | T042 | Phase 8 |
| SC-002: Clear grouped output | T013, T014 | Phase 3 |
| SC-003: ≥4 concurrent workers | T021 | Phase 4 |
| SC-004: >70% cache hit rate | T043 | Phase 8 |
| SC-005: Zero concurrently instances | T034 | Phase 6 |
| SC-006: CI pipeline functional | T038, T044 | Phases 7-8 |
| SC-007: Clear error output | T016, T045 | Phases 3, 8 |
