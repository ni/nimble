# Feature Specification: Accelerate Monorepo Lint Execution

**Feature Branch**: `002-lint-speedup`  
**Created**: 2025-11-26  
**Status**: Draft  
**Input**: User description: "Make a plan to speed up linting; npm run lint takes too long and I want to explore orchestration options or tools to speed it up 10x"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Fast Local Feedback (Priority: P1)

As a Nimble developer, I want `npm run lint` (or an equivalent targeted command) to finish within a couple of minutes for the workspaces I touched so that lint errors never block my iteration loop.

**Why this priority**: Slow lint feedback currently stalls day-to-day development (>20 minutes). Delivering rapid local validation directly improves productivity for everyone in the monorepo.

**Independent Test**: Run the new "lint changed" command after modifying a single workspace; it should execute only impacted packages, finish ≤2 minutes on a baseline laptop, and clearly report failures.

**Acceptance Scenarios**:

1. **Given** a developer modifies files in `packages/nimble-components`, **When** they run the targeted lint command, **Then** only dependent workspaces execute and the run completes within the agreed time budget with parallel workers fully utilized.
2. **Given** a lint error in one workspace, **When** the targeted command completes, **Then** the exit code is non-zero and the console output highlights the failing package without hiding other logs.

---

### User Story 2 - Parallel CI Coverage (Priority: P1)

As a CI pipeline maintainer, I need a deterministic lint job that runs all required workspaces in parallel with caching so that PR gates finish ≤5 minutes without skipping coverage.

**Why this priority**: CI is the enforcement point for code quality; if it remains slow, the organization still waits 20+ minutes per PR regardless of local improvements.

**Independent Test**: Trigger the CI lint workflow on a clean PR; the job fans out using the new orchestrator, respects cache hits, and reports aggregate status back to GitHub within the target SLA.

**Acceptance Scenarios**:

1. **Given** a PR with changes in three packages, **When** CI runs lint, **Then** only the affected packages run, their artifacts are cached, and the workflow finishes under the SLA.
2. **Given** a cache miss (e.g., cache invalidated), **When** CI runs lint, **Then** all packages execute in parallel according to dependency order and the log clearly shows per-package duration for troubleshooting.

---

### User Story 3 - Lint Telemetry & Health (Priority: P2)

As a tooling engineer, I want to capture lint runtime telemetry (per workspace, environment, cache hit rate) so I can surface regressions and prioritize future optimizations.

**Why this priority**: Without observability, the team cannot prove the 10× improvement, detect regressions, or justify future investments.

**Independent Test**: Run the lint command with telemetry enabled; it produces structured output (e.g., JSON) that records runtimes, queue depth, and cache statistics and can be uploaded to the existing metrics store.

**Acceptance Scenarios**:

1. **Given** a local lint run, **When** it finishes, **Then** an artifact (file or stdout block) lists each workspace's duration and whether it was cached.
2. **Given** a CI run, **When** telemetry is pushed to storage, **Then** dashboards (or simple CSV exports) can be generated without manual log scraping.

---

### User Story 4 - Full Repo Assurance (Priority: P3)

As a release manager, I need an easy way to run the "full lint everything" workflow (even if it takes longer) so I can certify releases and ensure no workspaces silently skipped lint.

**Why this priority**: Targeted lint is great for daily work, but releases require auditable proof that every published package passed lint recently.

**Independent Test**: Execute the full lint command on a clean checkout; it should enumerate every workspace once, respect concurrency limits, and produce a manifest proving completion.

**Acceptance Scenarios**:

1. **Given** a release branch, **When** the full lint command runs, **Then** each workspace's result is logged along with the commit hash and timestamp.
2. **Given** a workspace added after the last release, **When** full lint runs, **Then** the new workspace is automatically detected and linted without extra configuration.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- How does the orchestrator behave when a brand-new workspace has no prior cache entries or telemetry (cold start behavior must stay within the full-run SLA)?
- What happens if the dependency graph changes mid-run (e.g., a package adds a new dependency) — does the tool re-resolve safely or fail fast with guidance?
- How are Windows vs. macOS vs. Linux path differences handled when storing cache artifacts (to avoid cache poisoning across platforms)?
- What happens when lint scripts produce more logs than the orchestrator buffer can handle (ensure log streaming without truncation)?

## Assumptions

- Node.js 20.x and npm 10.x remain the mandated toolchain for the Nimble repo; no pnpm-only solutions are allowed.
- GitHub Actions remains the CI provider, and runners allow at least 4 concurrent lint jobs without throttling.
- Every workspace already exposes an `npm run lint` script that can be invoked independently; the feature will orchestrate them without rewriting lint rules.
- A 10× improvement equates to ≤2 minutes for targeted lint on a typical laptop and ≤5 minutes for a full repo lint on CI.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Provide a repo-level lint orchestrator (e.g., Lage, Nx, Turborepo, or custom) that discovers workspace dependency graphs and schedules lint scripts in parallel while respecting declared `dependsOn` relationships.
- **FR-002**: Offer a "lint changed" entry point that detects touched workspaces via Git diff (with an override to specify paths manually) and executes only the impacted tasks plus their dependents.
- **FR-003**: Implement deterministic caching for lint outputs (hashing package lockfiles + lint configs) so that unchanged workspaces can be skipped locally and in CI.
- **FR-004**: Capture runtime telemetry (duration, cache hit/miss, exit status, machine type) for every lint run and persist it to a structured artifact consumers can analyze.
- **FR-005**: Provide a `--full` or equivalent flag that forces every workspace to lint regardless of cache state and produces a manifest suitable for release sign-off.
- **FR-006**: Integrate the orchestrator with GitHub Actions so CI lint jobs run via the new tooling, publish artifacts, and fail the workflow on the first error while still surfacing all failing workspaces.
- **FR-007**: Document developer workflows (VS Code tasks, CLI usage, troubleshooting) in `CONTRIBUTING.md` and update any scripts (`npm run lint`, watch tasks) to point to the new orchestration.
- **FR-008**: Provide configuration hooks to limit concurrency for resource-heavy packages (so a single package can opt out of parallel execution if needed) without editing the orchestrator core.

### Key Entities *(include if feature involves data)*

- **Workspace Lint Task**: Represents an individual workspace's lint script, including metadata such as package name, relative path, declared dependencies, and resource needs.
- **Lint Orchestrator Config**: Declarative description (JSON/JS) of the task graph, concurrency ceilings, environment variables, and cache keys used by the orchestration tool.
- **Lint Cache Artifact**: Stored output (e.g., `.cache/lint/<hash>`) containing lint results or memoized states keyed by content hashes to allow quick skips on subsequent runs.
- **Telemetry Snapshot**: Structured log or JSON file capturing per-task duration, cache stats, platform info, and command flags for each lint invocation.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Targeted lint runs touching ≤3 workspaces complete in ≤2 minutes on standard developer hardware (MacBook Pro M3 / 32 GB) measured over 5 consecutive runs.
- **SC-002**: Full-repo lint on CI completes in ≤5 minutes at the 90th percentile, including cache restore/upload overhead.
- **SC-003**: CI cache hit rate for lint tasks reaches ≥80% on incremental PRs after the first warm-up run, as reported by telemetry snapshots.
- **SC-004**: 100% of published workspaces produce at least one lint result artifact per release branch cut, providing auditable evidence for release managers.
- **SC-005**: Tooling dashboards (or reports) expose the top 5 slowest lint tasks within 24 hours of a regression, enabling follow-up without manual log parsing.
