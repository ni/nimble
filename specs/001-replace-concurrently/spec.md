# Feature Specification: Replace Concurrently with Lage

**Feature Branch**: `001-replace-concurrently`  
**Created**: November 26, 2025  
**Status**: Draft  
**Input**: User description: "I'd like to completely replace concurrently in the project with lage"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validation Pipeline Orchestration (Priority: P1)

Contributors run `npm run validate` to execute all validation tasks (lint, test, format checks) in parallel before submitting pull requests. The command should execute quickly, show clear progress, utilize task caching to avoid redundant work, and fail fast when any validation fails.

**Why this priority**: Most critical workflow - every contributor uses this multiple times daily. Must be reliable and fast to maintain developer productivity.

**Independent Test**: Can be fully tested by running `npm run validate` from repo root and verifying:
- All validation tasks execute in parallel
- Task output is clearly labeled and grouped
- Execution completes faster than sequential approach
- Failed tasks are immediately visible
- Cache is utilized for unchanged packages

**Acceptance Scenarios**:

1. **Given** a clean repository, **When** contributor runs `npm run validate`, **Then** all validation tasks execute in parallel with clear progress output
2. **Given** no source changes, **When** contributor runs `npm run validate` again, **Then** cached results are used and execution completes in under 5 seconds
3. **Given** one package fails validation, **When** contributor runs `npm run validate`, **Then** the command exits with error status and shows which package failed
4. **Given** multiple packages changed, **When** contributor runs `npm run validate`, **Then** only changed packages execute validation tasks

---

### User Story 2 - Test Suite Orchestration (Priority: P2)

Contributors run `npm run test` to execute all test suites across all packages in parallel. The command should execute tests efficiently, utilize caching for unchanged test suites, and provide clear feedback on which tests passed or failed.

**Why this priority**: Second most common workflow - run before every commit and in CI. Critical for maintaining code quality.

**Independent Test**: Can be fully tested by running `npm run test` from repo root and verifying:
- All test suites execute in parallel
- Browser-specific tests (webkit, firefox) run correctly
- Test results are clearly reported
- Cache speeds up unchanged test execution

**Acceptance Scenarios**:

1. **Given** a clean repository, **When** contributor runs `npm run test`, **Then** all test suites execute in parallel across all packages
2. **Given** unchanged test files, **When** contributor runs `npm run test` again, **Then** cached test results are used where applicable
3. **Given** tests fail in one package, **When** contributor runs `npm run test`, **Then** the command shows clear failure details and exits with error status
4. **Given** browser-specific tests (webkit, chrome, firefox), **When** running tests, **Then** each browser test executes correctly with proper environment setup

---

### User Story 3 - Package-Specific Validation (Priority: P3)

Contributors working on a specific package (e.g., nimble-components) can run package-specific validation tasks that execute lint and test in parallel for just that package, with proper caching and dependency awareness.

**Why this priority**: Improves developer experience when working on isolated packages, but less critical than full repository validation.

**Independent Test**: Can be fully tested by running package-specific commands and verifying isolated execution with caching.

**Acceptance Scenarios**:

1. **Given** working in nimble-components package, **When** contributor runs validation for just that package, **Then** only nimble-components lint and test execute in parallel
2. **Given** package dependencies haven't changed, **When** running package validation again, **Then** cached results speed up execution
3. **Given** package has both lint and test tasks, **When** running validation, **Then** both execute in parallel with clear output separation

---

### Edge Cases

- What happens when Lage cache becomes corrupted or stale?
- How does the system handle tasks that fail intermittently?
- What happens when a contributor cancels task execution mid-run?
- How are task dependencies handled when one validation depends on another?
- What happens when disk space is exhausted during task execution?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace all `concurrently` usage in root package.json with Lage equivalents
- **FR-002**: System MUST replace all `concurrently` usage in nimble-components package.json with Lage equivalents  
- **FR-003**: System MUST define Lage pipelines for `validate` and `test` tasks in lage.config.js
- **FR-004**: System MUST remove `concurrently` as a devDependency from all package.json files
- **FR-005**: System MUST preserve existing task execution semantics (parallel execution, fail-fast, grouped output)
- **FR-006**: System MUST utilize Lage caching to avoid redundant task execution
- **FR-007**: System MUST maintain task output clarity with proper labeling and grouping
- **FR-008**: System MUST execute validation tasks in dependency order when dependencies exist
- **FR-009**: System MUST provide clear error messages when tasks fail
- **FR-010**: System MUST work correctly in both local development and CI environments
- **FR-011**: Lage configuration MUST define appropriate concurrency limits (4 local, 8 CI)
- **FR-012**: System MUST handle package-specific validation commands (validate:lint-concurrent:nimble-components, validate:test-concurrent:nimble-components)

### Key Entities

- **Validation Pipeline**: Orchestrates parallel execution of lint, format check, and test tasks across all packages
- **Test Pipeline**: Orchestrates parallel execution of test suites including browser-specific tests (webkit, firefox, chrome)
- **Lage Configuration**: Defines task pipelines, caching strategies, and concurrency limits for all orchestrated tasks
- **Package Scripts**: Individual package.json scripts that execute validation and test tasks, invoked by Lage
- **Task Cache**: Stores task execution results to avoid redundant work when inputs haven't changed

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm run validate` completes in under 60 seconds for unchanged repository (utilizing cache)
- **SC-002**: `npm run validate` shows clear, grouped output for each validation task with task names and statuses
- **SC-003**: `npm run test` executes all test suites across all packages with at least 4 concurrent workers locally
- **SC-004**: Contributors can run `npm run validate` after making changes to 1-3 packages and see only those packages execute validation (cache hit rate > 70%)
- **SC-005**: Zero instances of `concurrently` package remain in package.json files or package-lock.json
- **SC-006**: CI pipeline continues to function correctly with new Lage-based orchestration
- **SC-007**: Failed validation tasks are immediately visible with exit code 1 and clear error output

## Assumptions

1. **Task caching**: Lage's caching mechanism will properly detect unchanged inputs and reuse cached results without false positives
2. **Browser test support**: Lage can properly orchestrate browser-specific test tasks (webkit, firefox) without environment conflicts
3. **Output formatting**: Lage's default output formatting is acceptable or can be configured to match current `concurrently` output style
4. **Migration path**: Existing CI/CD workflows using `npm run validate` and `npm run test` will work without modification after switching to Lage
5. **Concurrency limits**: Current concurrency limits (4 local, 8 CI) are appropriate for validation and test tasks
6. **Package scripts**: Individual package scripts (lint, test) will continue to work without modification when invoked by Lage

## Out of Scope

- Migrating other task orchestration to Lage beyond validate and test workflows
- Creating new validation or test tasks not currently using concurrently
- Optimizing individual package lint or test performance
- Implementing telemetry or monitoring for Lage task execution
- Remote or cloud-based caching for Lage

## Dependencies

- **Lage 2.14.15+**: Already installed and configured for lint orchestration
- **Existing package scripts**: All packages must have working `lint` and `test` scripts
- **CI environment**: Must support Lage execution (Node.js 22+, npm workspaces)

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Task caching false negatives | Medium | Low | Test thoroughly with various change scenarios; document cache troubleshooting |
| Browser test environment conflicts | High | Medium | Test each browser configuration; ensure Lage doesn't interfere with test environment setup |
| CI pipeline breakage | High | Low | Test in feature branch CI before merging; maintain rollback capability |
| Output format regression | Low | Low | Compare Lage output with concurrently output; configure if needed |
| Performance regression | Medium | Low | Benchmark before/after; ensure cache and parallelism work correctly |

## Open Questions

None - specification is complete based on existing Lage implementation for lint orchestration.
