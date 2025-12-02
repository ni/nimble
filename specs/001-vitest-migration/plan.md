# Implementation Plan: Replace Karma/Webpack/Jasmine with Vite/Vitest

**Branch**: `001-vitest-migration` | **Date**: 2025-11-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-vitest-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Replace the legacy Karma/Webpack/Jasmine testing stack in `nimble-components` with a modern Vite/Vitest setup. This involves configuring Vitest with `@vitest/browser` to run tests in Chrome, Firefox, and WebKit via Playwright, migrating existing Jasmine-based tests to Vitest syntax (or using compatibility layers), and ensuring all CI/CD workflows are updated.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Vite, Vitest, @vitest/browser, Playwright, FAST Foundation
**Storage**: N/A
**Testing**: Vitest (replacing Karma/Jasmine)
**Target Platform**: Web (Chrome, Firefox, WebKit)
**Project Type**: Monorepo (NPM workspaces)
**Performance Goals**: Test execution speed >= current Karma setup
**Constraints**: Must support Shadow DOM and Custom Elements correctly; must run on macOS/Linux/Windows; must support existing browser matrix.
**Scale/Scope**: ~1000+ unit tests in `nimble-components`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Declarative-First Architecture**: N/A (Infrastructure change).
- **II. Web Standards & Accessibility**: Vitest browser mode must support Shadow DOM and AOM.
- **III. Package Independence**: Vitest config must be scoped to `nimble-components` or shared via a config package if appropriate, but `nimble-components` must remain independent.
- **IV. FAST Foundation Alignment**: Test environment must support FAST's observable system.
- **V. Static & Explicit Philosophy**: Configuration (vitest.config.ts) should be explicit and static.
- **VI. Comprehensive Quality Assurance**: This feature *enables* this principle. Must ensure no loss of coverage.

## Project Structure

### Documentation (this feature)

```text
specs/001-vitest-migration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/nimble-components/
├── vitest.config.ts      # New configuration file
├── package.json          # Updated dependencies and scripts
└── src/
    └── ...               # Existing source and test files (migrated syntax)
```

**Structure Decision**: We are modifying the existing `nimble-components` package structure by adding `vitest.config.ts` and modifying `package.json`. No new packages are strictly required, though a shared config package could be considered later.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No violations.


| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
