# Implementation Plan: Accelerate Monorepo Lint Execution

**Branch**: `002-lint-speedup` | **Date**: 2025-11-26 | **Spec**: [/specs/002-lint-speedup/spec.md](./spec.md)
**Input**: Feature specification describing the need for a 10× faster lint workflow across the Nimble monorepo

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

`npm run lint` currently executes every workspace sequentially and routinely exceeds 20 minutes locally and in CI. We will introduce a repository-level task orchestrator with intelligent dependency detection, deterministic caching, and telemetry so that targeted lint runs finish ≤2 minutes locally and full-lint CI gates complete ≤5 minutes. The plan covers tooling selection, cache strategy, telemetry plumbing, developer ergonomics, and release-assurance workflows.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.4+ / Node.js 20.x (monorepo standard)  
**Primary Dependencies**: Lage task runner, ESLint 9.x, Prettier ESLint, GitHub Actions cache  
**Storage**: N/A (lint artifacts stored in repo-local caches)  
**Testing**: ESLint 9.x + Prettier ESLint integration (static analysis)  
**Target Platform**: macOS (dev), Linux (CI runners), Windows (secondary dev)  
**Project Type**: Multi-package npm workspace monorepo (~25 workspaces)  
**Performance Goals**: ≤2 min targeted lint (≤3 workspaces), ≤5 min full lint on CI (90th percentile)  
**Constraints**: Must keep packages independent, reuse npm (no pnpm), avoid leaking unpublished code, stay within GitHub Actions concurrency  
**Scale/Scope**: ~1200 linted files in `nimble-components`, 20+ additional workspaces, GitHub Actions standard runners

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Declarative-First Architecture | ✅ | Orchestrator configs (task graphs, cache metadata) remain static files committed to the repo. |
| Web Standards & Accessibility | ✅ | No runtime component impact. |
| Package Independence & Boundaries | ✅ | Lage invokes each workspace’s own `npm run lint` in-place; no cross-package imports introduced. |
| FAST Foundation Alignment | ✅ | Not implicated by lint automation. |
| Static & Explicit Philosophy | ✅ | All behavior defined in `lage.config.mjs`, `package.json` scripts, and documented CLI flags; no implicit discovery beyond npm dependency graph. |
| Comprehensive Quality Assurance | ✅ | Lint scope maintained/increased via `lint:full` workflow. |

**Gate Verdict**: Constitution gate PASSED. Research decisions ensure tooling remains declarative and per-package, so we can proceed to detailed design.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
package.json                  # npm workspace orchestrator / scripts
packages/
├── nimble-components/        # largest TS workspace; ESLint + Vitest
├── spright-components/
├── ok-components/
├── storybook/
├── angular-workspace/
├── blazor-workspace/
├── react-workspace/
├── performance/
├── site/
├── eslint-config-nimble/     # shared ESLint configs leveraged by all packages
└── ... (additional workspaces referenced by npm workspaces)

.github/workflows/            # CI definitions (lint workflow will change here)
scripts/                      # Candidate location for helper CLI wrappers
.specify/                     # Spec-driven workflow tooling
```

**Structure Decision**: Reuse existing npm-workspace topology; enhancements live in root-level configs (`package.json`, new orchestrator config file, GitHub workflows) plus optional helper scripts under `scripts/`. No new packages introduced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
