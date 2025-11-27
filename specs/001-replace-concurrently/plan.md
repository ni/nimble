# Implementation Plan: Replace Concurrently with Lage

**Branch**: `001-replace-concurrently` | **Date**: November 26, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-replace-concurrently/spec.md`

## Summary

Replace all usage of the `concurrently` npm package with Lage task orchestration to consolidate on a single build tool with superior caching capabilities, dependency management, and parallel execution. This migration extends the existing Lage infrastructure (already configured for lint) to also handle validation and test workflows, eliminating the need for two separate task orchestration tools in the monorepo.

## Technical Context

**Language/Version**: TypeScript 5.6, Node.js 22.14.0  
**Primary Dependencies**: Lage 2.14.15 (already installed), npm workspaces  
**Storage**: N/A (build tool configuration)  
**Testing**: Existing package test scripts (Vitest, Jasmine, Karma, Playwright, bUnit)  
**Target Platform**: macOS/Linux/Windows development environments, GitHub Actions CI  
**Project Type**: Monorepo infrastructure (23 workspace packages)  
**Performance Goals**: 
- Validation completes in <60s with cache hits
- Test suite utilizes ≥4 concurrent workers locally, 8 in CI
- Cache hit rate >70% for 1-3 package changes  
**Constraints**: 
- Must preserve existing command semantics (`npm run validate`, `npm run test`)
- Must maintain cross-browser test support (Chrome, Firefox, WebKit)
- Must work in both local dev and CI without environment-specific changes  
**Scale/Scope**: 
- 23 workspace packages
- ~6 scripts using concurrently (root validate/test + nimble-components lint-concurrent/test-concurrent)
- Existing CI pipeline must continue functioning

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Declarative-First Architecture
**Status**: PASS  
**Analysis**: Lage configuration is declarative (lage.config.js defines static pipeline). No runtime code generation involved. Task definitions and dependencies are statically analyzable.

### ✅ II. Web Standards & Accessibility Compliance  
**Status**: N/A  
**Analysis**: This is build tooling infrastructure, not component code. No accessibility requirements apply.

### ✅ III. Package Independence & Boundaries
**Status**: PASS  
**Analysis**: Lage configuration lives at repo root (appropriate for orchestration). Individual packages maintain their own scripts (lint, test). No cross-package imports introduced. Build tool is shared infrastructure (acceptable pattern for monorepos).

### ✅ IV. FAST Foundation Alignment
**Status**: N/A  
**Analysis**: This is build tooling, not component implementation. FAST Foundation principles don't apply.

### ✅ V. Static & Explicit Philosophy
**Status**: PASS  
**Analysis**: Lage configuration is explicit and static. Pipeline definitions clearly show task dependencies. No clever abstractions - straightforward task orchestration. Weight calculation is simple lookup, not complex dynamic logic.

### ✅ VI. Comprehensive Quality Assurance
**Status**: PASS  
**Analysis**: 
- Testing strategy: Validate migration by running existing test suites through new Lage orchestration
- Cross-browser: Lage will invoke existing cross-browser test scripts unchanged
- Beachball change file: Required (FR-004 impacts package.json files)
- Manual validation: Run validate/test workflows locally before CI integration

**Constitution Verdict**: ✅ ALL GATES PASS - No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-replace-concurrently/
├── plan.md              # This file
├── research.md          # Phase 0: Research Lage test/validate pipeline patterns
├── data-model.md        # Phase 1: N/A (no data entities in build tooling)
├── quickstart.md        # Phase 1: Migration guide for contributors
├── contracts/           # Phase 1: N/A (no API contracts for build tools)
└── tasks.md             # Phase 2: Detailed implementation tasks
```

### Source Code (repository root)

```text
nimble-worktrees/lint-plan-worktree/
├── lage.config.js                    # MODIFY: Add validate + test pipelines
├── package.json                      # MODIFY: Replace concurrently scripts with Lage
├── package-lock.json                 # AUTO-UPDATE: Remove concurrently dependency
├── scripts/
│   └── lint/
│       ├── workspaces.json           # REVIEW: May need test/validate weight annotations
│       └── README.md                 # UPDATE: Document new validate/test orchestration
├── packages/
│   └── nimble-components/
│       └── package.json              # MODIFY: Remove lint-concurrent/test-concurrent scripts
└── .github/
    └── workflows/
        └── *.yml                     # REVIEW: Update CI if needed (likely no changes)
```

**Structure Decision**: Infrastructure-only changes. No new source code. Configuration updates to existing build orchestration files. Leverages existing Lage installation from 002-lint-speedup feature.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations detected.

---

## Phase 0: Research & Unknowns

**Objective**: Resolve all NEEDS CLARIFICATION items and establish implementation patterns.

### Research Tasks

1. **Lage test pipeline configuration**
   - Question: How should test tasks be configured in Lage pipeline to support browser-specific tests (webkit, firefox, chrome)?
   - Research: Review Lage documentation for task variants, environment variables, and parallel browser test orchestration
   - Output: Document test pipeline configuration pattern in research.md

2. **Cache strategy for test tasks**
   - Question: What inputs/outputs should be configured for test task caching? Test caching is more complex than lint (flaky tests, browser state, etc.)
   - Research: Investigate Lage cache configuration for test suites, review best practices for deterministic test caching
   - Output: Document test caching strategy in research.md

3. **Validate vs. test pipeline relationship**
   - Question: Should validate and test be separate Lage pipelines, or should validate depend on test?
   - Research: Analyze current concurrently workflow, determine optimal dependency graph
   - Output: Document pipeline architecture decision in research.md

4. **Package-specific validation migration**
   - Question: How should `validate:lint-concurrent:nimble-components` and `validate:test-concurrent:nimble-components` be handled? Remove entirely or convert to Lage scope?
   - Research: Review current usage patterns, propose migration strategy
   - Output: Document migration approach for package-specific scripts in research.md

5. **Output formatting parity**
   - Question: Does Lage output formatting match concurrently's grouped, labeled output? Do we need custom reporters?
   - Research: Compare Lage vs concurrently output, test with actual validate/test runs
   - Output: Document any output formatting gaps and solutions in research.md

### Success Criteria for Phase 0

- [ ] All research questions answered with concrete recommendations
- [ ] research.md contains test pipeline configuration pattern
- [ ] research.md contains test caching strategy
- [ ] research.md contains validate/test pipeline architecture
- [ ] research.md contains package-specific script migration plan
- [ ] research.md contains output formatting comparison and any needed adjustments

---

## Phase 1: Design & Contracts

**Objective**: Design the Lage pipeline configuration and migration approach.

### 1.1 Data Model

**N/A for this feature** - Build tooling has no persistent data entities. Skip data-model.md creation.

### 1.2 Lage Pipeline Design

**Output**: Document in `quickstart.md` (repurposed as migration guide)

**Content**:
- Updated lage.config.js structure with validate + test pipelines
- Script migration mapping:
  - `npm run validate` → `lage run validate`
  - `npm run test` → `lage run test`
  - `npm run validate:lint-concurrent:nimble-components` → `lage run validate --scope @ni/nimble-components`
  - `npm run validate:test-concurrent:nimble-components` → `lage run test --scope @ni/nimble-components`
- Package.json changes for root and nimble-components
- Cache configuration for validate/test tasks
- Weight assignments for test-heavy packages
- CI environment variable for concurrency (LAGE_CONCURRENCY=8)

### 1.3 API Contracts

**N/A for this feature** - Build tools don't expose APIs. No contracts/ directory needed.

### 1.4 Migration Quickstart

Create `quickstart.md` with:
- Prerequisites (Lage already installed from 002-lint-speedup)
- Step-by-step migration procedure
- Before/after command comparison table
- Cache troubleshooting guide
- Rollback procedure if needed

### Success Criteria for Phase 1

- [ ] quickstart.md created with complete migration guide
- [ ] lage.config.js design documented (validate + test pipeline configuration)
- [ ] All package.json script changes documented
- [ ] Cache strategy documented for test tasks
- [ ] CI concurrency configuration documented

---

## Phase 2: Task Breakdown

**Note**: Detailed tasks will be generated in Phase 2 using `/speckit.tasks`. Preview of major task categories:

### Task Categories (High-Level)

**T001-T005: Configuration Updates**
- Update lage.config.js with validate + test pipelines
- Update root package.json scripts
- Update nimble-components package.json scripts
- Remove concurrently devDependency
- Run npm install to update lock file

**T006-T010: Validation & Testing**
- Test validate workflow locally with cache
- Test test workflow locally across browsers
- Test package-specific scope commands
- Benchmark performance vs concurrently baseline
- Validate CI pipeline integration

**T011-T015: Documentation & Cleanup**
- Update scripts/lint/README.md with validate/test info
- Update CONTRIBUTING.md if needed
- Create beachball change file
- Remove lint-concurrent/test-concurrent scripts
- Add troubleshooting guide to quickstart.md

**T016-T020: Optional Enhancements**
- Telemetry for validate/test pipelines (optional, matches 002-lint-speedup spec)
- Remote cache strategy (optional, out of scope per spec)
- Custom Lage reporter for output formatting (only if needed)
- Weight optimization for test-heavy packages (if performance issues)
- CI matrix optimization (optional)
