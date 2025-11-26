# Research Log – Accelerate Monorepo Lint Execution

**Date**: 2025-11-26  
**Author**: GitHub Copilot (GPT-5.1-Codex)  
**Scope**: Resolve tooling and process unknowns identified in the implementation plan.

## Decision 1: Task Orchestrator (Lage)
- **Decision**: Adopt [Lage](https://github.com/microsoft/lage) as the repo-level task orchestrator for lint workloads.
- **Rationale**:
  - Native support for npm workspaces with minimal repo restructuring; aligns with Constitution (explicit config via `lage.config.mjs`).
  - Provides deterministic task graph resolution based on dependency relationships declared in `package.json` (`dependencies`, `devDependencies`, `workspaceDependencies`).
  - Built-in hashing/caching uses task inputs (package lockfiles + environment) and integrates cleanly with GitHub Actions cache without a proprietary SaaS.
  - Supports `--since` and `--scope` flags to run tasks only for changed packages plus dependents—exactly what "lint changed" requires.
  - Concurrency controls per task plus `priority` hooks satisfy FR-008 (throttling heavyweight packages) while keeping configuration declarative.
  - Previous internal experience on Nimble with FAST tooling means onboarding cost is low compared to Nx/Turbo.
- **Alternatives Considered**:
  1. **Nx** – Strong cloud/dashboard story but would require adopting Nx project graph files, generating `project.json` per workspace, and potentially switching to `nx` CLI for all scripts (higher migration cost, more "magic").
  2. **Turborepo** – Excellent caching but optimized for pnpm/yarn; npm support is improving but still lacks first-class `npm workspaces` detection and would require a `turbo.json` plus pipeline convention (less explicit, risk of violating Static & Explicit principle).
  3. **Custom npm scripts + concurrently** – Simple but misses cache/scope support and would reintroduce sequential bottlenecks; also would require bespoke diff detection logic everywhere.

## Decision 2: Cache Strategy (ESLint cache + Lage artifact cache)
- **Decision**: Leverage Lage's task hashing to skip already-linted packages and layer ESLint's native `--cache` for intrapackage speedups; persist Lage cache via GitHub Actions cache and `.lage/cache` directory.
- **Rationale**:
  - Lage hashing captures package contents, lockfiles, lint configs, and environment variables; unaffected packages simply don't run, delivering the bulk of the 10× win.
  - ESLint `--cache --cache-location .eslintcache` inside each workspace shortens reruns even when Lage decides a task must execute (partial file changes, no remote cache hit).
  - Cache directories remain per package (`packages/<pkg>/.eslintcache`) to honor package independence and avoid cross-package pollution.
  - GitHub Actions cache can store a tarball of `.lage/cache` + `.eslintcache` keyed on OS + lockfile hash + workflow name, ensuring deterministic restores.
- **Alternatives Considered**:
  1. **Remote cache service (e.g., Turborepo Cloud)** – Would centralize caches but introduces a SaaS dependency and potential IP concerns; also conflicts with requirement to stay npm-native.
  2. **Only ESLint cache** – Speeds repeated runs but still requires running lint for all packages (no task-level skip), so fails the 10× target.
  3. **Bazel build cache** – Too heavy for this scope and conflicts with static/explicit guidance without extensive onboarding.

## Decision 3: Change Detection Flow
- **Decision**: Use `lage run lint --since=<base>` for Git-based filtering, with a convenience wrapper `npm run lint:changed` that defaults to `origin/main` but accepts overrides (e.g., `lint:changed -- --since=HEAD~1`).
- **Rationale**:
  - Lage already understands git references and can expand dependent packages automatically.
  - Keeps developer-facing command simple while remaining explicit (no hidden heuristics).
  - Works identically on local clones and CI (CI can pass `--since=${{ github.event.pull_request.base.sha }}`).
- **Alternatives Considered**:
  1. **Custom `git diff` script piping into `npx lerna run`** – Recreates existing functionality but without caching.
  2. **Nx affected** – Requires migrating to Nx; rejected with Decision 1.
  3. **Manual package lists** – Burdens developers to know dependency graph; error-prone.

## Decision 4: Telemetry & Reporting
- **Decision**: Emit structured JSON Lines (`.lint-timings/lage-lint.jsonl`) from Lage's `logLevel:"verbose"` hooks using a small wrapper script, then upload as CI artifact and optionally ingest into the existing performance dashboard.
- **Rationale**:
  - Lage exposes task lifecycle hooks (`reporter`) enabling programmatic capture of start/stop events, durations, cache hits, worker id, etc.
  - JSONL keeps format append-friendly and easy to parse with tooling (Node, Python, spreadsheets).
  - Local runs store the file under `.lint-timings/` (gitignored) so developers can inspect regressions offline.
  - CI uploads the file alongside summary markdown for release archives, satisfying SC-004/SC-005.
- **Alternatives Considered**:
  1. **Prometheus/Grafana direct push** – Overkill for current scope and requires infra approval.
  2. **Plain console logs** – Hard to aggregate, violates telemetry requirements.
  3. **Nx/Turbo dashboards** – Tie us to alternative orchestrators, conflicting with Decision 1.

## Decision 5: Full Repo Assurance Flow
- **Decision**: Provide `npm run lint:full` that calls `lage run lint --no-cache --concurrency=<max>` to force every package once, writing a manifest (`lint-manifest.json`) keyed by package name, git sha, timestamp.
- **Rationale**:
  - Meets User Story 4 by producing auditable artifacts without needing separate tooling.
  - `--no-cache` ensures no false skips; manifest produced by same telemetry hook for consistency.
  - Command can be wired into release checklist and documented for manual use.
- **Alternatives Considered**:
  1. **Separate script enumerating packages** – Duplicate logic vs Lage; risk of drift.
  2. **CI matrix job per package** – Would explode runner usage and increase cost.

## Open Items Resolved
- Package-boundary concern: Lage executes each workspace's existing `lint` script in situ; no shared source directories introduced.
- Static/Explicit concern: `lage.config.mjs` houses the full task graph and concurrency rules checked into git; no implicit discovery beyond npm dependency graph.

All previously marked NEEDS CLARIFICATION items are now addressed.
