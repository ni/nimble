# Tasks: Accelerate Monorepo Lint Execution

**Feature Branch**: `002-lint-speedup`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup & Infrastructure
*Goal: Introduce Lage tooling scaffolding and repo-level directories needed by all stories.*

- [x] T001 Update lint orchestration devDependencies and placeholder npm scripts in `package.json`/`package-lock.json`.
- [x] T002 [P] Add `.lage/` and `.lint-timings/` entries to `.gitignore` and scaffold the `scripts/lint/.gitkeep` placeholder.
- [x] T003 [P] Create `scripts/lint/README.md` describing the new lint architecture and linking to quickstart notes.

---

## Phase 2: Foundational (Blocking Prerequisites)
*Goal: Define the declarative Lage pipeline and metadata all user stories rely on.*

- [x] T004 Author `scripts/lint/workspaces.json` enumerating every lintable workspace (name, path, weight, dependsOn fields).
- [x] T005 Implement `lage.config.mjs` to load `workspaces.json`, register the `lint` pipeline, and set default concurrency/cache options.
- [x] T006 [P] Add `scripts/lint/types.ts` exporting the `WorkspaceLintTask`, `TelemetrySnapshot`, and `LintManifest` interfaces used by downstream scripts.

**Checkpoint**: Lage can discover all workspaces and run `lint` sequentially; no user-story tasks start until this phase is complete.

---

## Phase 3: User Story 1 - Fast Local Feedback (Priority: P1) 🎯 MVP
**Goal**: Give developers a targeted `npm run lint` experience that only touches impacted workspaces and finishes ≤2 minutes.
**Independent Test**: Modify one workspace, run `npm run lint:changed`, and ensure only dependent packages execute with cached ESLint runs completing within the SLA.

### Implementation
- [x] T007 [US1] Wire `lint`, `lint:changed`, and `lint:pkg` npm scripts in `package.json` to call `lage run lint` with local-friendly defaults (`--since origin/main`, `--scope`).
- [x] T008 [P] [US1] Implement `scripts/lint/run-eslint.mjs` to invoke ESLint with `--cache` and per-workspace `--cache-location` under `packages/<pkg>/.eslintcache`.
- [x] T009 [P] [US1] Create `scripts/lint/update-eslint-scripts.ts` codemod that rewrites each workspace's `package.json` `lint` script to call `run-eslint.mjs`.
- [x] T010 [US1] Execute the codemod and commit updates across `packages/**/package.json`, verifying `.eslintcache` files land in the intended directories.
- [x] T011 [US1] Document the new local lint workflow and troubleshooting tips in `packages/nimble-components/CONTRIBUTING.md` (and reference it from the root `README.md`).

**Checkpoint**: Targeted lint runs are fully usable locally; developers can work without waiting for the entire repo.

---

## Phase 4: User Story 2 - Parallel CI Coverage (Priority: P1)
**Goal**: Ensure CI runs lint in parallel with caching so PR gates finish ≤5 minutes while preserving full coverage.
**Independent Test**: Trigger `.github/workflows/main.yml` on a PR and observe `npm run lint:ci` running only affected workspaces, restoring/saving caches, and reporting consolidated results.

### Implementation
- [x] T012 [US2] Add a `lint:ci` npm script in `package.json` that runs `lage run lint --since $BASE_SHA --concurrency=8 --continue` for CI environments.
- [x] T013 [US2] Update `.github/workflows/main.yml` to restore `.lage/cache` and `packages/**/.eslintcache`, run `npm run lint:ci`, and save the cache when successful.
- [ ] T014 [P] [US2] Implement `scripts/lint/ci-cache.mjs` to bundle/unbundle cache directories referenced by the workflow steps.
- [ ] T015 [US2] Create `scripts/lint/ci-summary.ts` that parses Lage output and writes a GitHub Actions summary (per-workspace duration + status) consumed by the workflow.

**Checkpoint**: CI lint job meets the SLA and surfaces failures clearly without re-running unaffected workspaces.

---

## Phase 5: User Story 3 - Lint Telemetry & Health (Priority: P2)
**Goal**: Capture runtimes, cache hits, and machine data for every lint run so regressions are visible.
**Independent Test**: Run `npm run lint:changed` locally and `lint:ci` in CI; verify `.lint-timings/lage-lint.jsonl` is produced and uploaded, and telemetry records appear in the service defined by the contract.

### Implementation
- [ ] T016 [P] [US3] Implement `scripts/lint/lage-reporter.ts` as a custom Lage reporter that appends JSONL entries to `.lint-timings/lage-lint.jsonl`.
- [ ] T017 [P] [US3] Build `scripts/lint/upload-telemetry.ts` to POST telemetry payloads to the `/v1/lint-runs` endpoint defined in `contracts/lint-telemetry.openapi.yaml`.
- [ ] T018 [US3] Update `package.json` lint scripts to export `LINT_TELEMETRY=1`, execute Lage, and then call `upload-telemetry.ts` when telemetry is enabled.
- [ ] T019 [US3] Extend `.github/workflows/main.yml` with steps that upload `.lint-timings/lage-lint.jsonl` as an artifact and run `node scripts/lint/upload-telemetry.ts` using the CI token.
- [ ] T020 [US3] Document telemetry schema, storage location, and troubleshooting in `docs/tooling/lint-telemetry.md`.

**Checkpoint**: Telemetry is collected for every lint run, enabling dashboards and regression tracking.

---

## Phase 6: User Story 4 - Full Repo Assurance (Priority: P3)
**Goal**: Provide a one-click workflow that lints every workspace (no cache) and emits a manifest for release sign-off.
**Independent Test**: Run `npm run lint:full` on a clean checkout and verify it produces `lint-manifest.json` listing every workspace’s result, duration, and checksum.

### Implementation
- [ ] T021 [US4] Add a `lint:full` npm script in `package.json` that runs `lage run lint --no-cache --concurrency=4` and sets a `LINT_FULL=1` flag.
- [ ] T022 [P] [US4] Enhance `scripts/lint/lage-reporter.ts` to generate `lint-manifest.json` (per the data model) when `LINT_FULL=1` is set.
- [ ] T023 [US4] Update the release job in `.github/workflows/main.yml` to execute `npm run lint:full`, upload the manifest artifact, and fail the release if any workspace reports a non-pass status.
- [ ] T024 [US4] Amend `CONTRIBUTING.md` (release section) with instructions for running `lint:full`, verifying the manifest, and storing evidence.

**Checkpoint**: Release managers can certify lint coverage for every workspace with auditable logs.

---

## Phase 7: Polish & Cross-Cutting Concerns
*Goal: Final documentation, tooling integration, and change tracking across the repo.*

- [ ] T025 [P] Add `docs/tooling/lint.md` describing command matrix, cache behavior, and linking to telemetry docs/quickstart.
- [ ] T026 [P] Update `.vscode/tasks.json` to add a task entry for `npm run lint:changed` so developers can launch it from VS Code.
- [x] T027 [P] Refresh the root `README.md` lint section to reference Lage commands and link to `docs/tooling/lint.md` and `quickstart.md`.
- [x] T028 Generate the required beachball change file under `change/` summarizing the lint orchestration overhaul.

---

## Phase 8: Performance Validation & Guardrails
*Goal: Prove the ≤2 min / ≤5 min runtime targets, enforce them in CI, and keep historical records up to date.*

- [x] T029 [US1] Capture pre- and post-Lage lint benchmarks (local + CI) and document results in `docs/tooling/lint-benchmarks.md` for future comparisons.
- [ ] T030 [P] [US2] Implement `scripts/lint/assert-runtime.ts` that parses the telemetry JSONL file, compares durations/cache-hit rates against SC-001‒SC-003 thresholds, and exits non-zero on regression.
- [ ] T031 [US2] Extend `.github/workflows/main.yml` to invoke `node scripts/lint/assert-runtime.ts` after `npm run lint:ci`, posting failures to the workflow summary and blocking merges when SLAs are exceeded.

---

## Dependencies & Execution Order
- **Phase 1 → Phase 2**: Setup must complete before defining the task graph.
- **Phase 2 → Stories**: All user stories depend on the Lage pipeline and metadata from Phase 2.
- **Story Order**: US1 (local feedback) unlocks the base scripts; US2 (CI) depends on US1 scripts; US3 builds on telemetry hooks added in US2; US4 depends on telemetry + CI flows to reuse reporters.
- **Polish** begins after the targeted user stories you plan to ship in this iteration are complete.
- **Performance Validation (Phase 8)** waits until telemetry + CI flows exist (Phases 3–5) and then enforces the success criteria continuously.

## Parallel Execution Examples
- Once Phase 2 lands, different engineers can pick up US1–US4 in parallel because each story touches distinct files (`package.json` vs `.github/workflows/main.yml` vs telemetry scripts vs release docs).
- Within US1, tasks T008 and T009 (helper + codemod) can progress simultaneously before applying changes in T010.
- Within US2, T014 and T015 run in parallel while T013 integrates them into the workflow.

## Implementation Strategy
1. **MVP (US1)**: Land Phases 1–3 to give developers fast local feedback.
2. **Incremental Upgrades**: Layer in US2 for CI, then US3 telemetry, then US4 for release assurance.
3. **Polish**: Update docs, IDE tasks, and release notes only after the targeted user stories have been validated.
4. **MVP Scope Suggestion**: Shipping through US1 already delivers a material productivity boost; subsequent stories enhance CI, observability, and governance.
```}