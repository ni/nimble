# Data Model – Accelerate Monorepo Lint Execution

**Version**: 0.1 (2025-11-26)

## 1. WorkspaceLintTask
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | npm workspace name (e.g., `@ni/nimble-components`). Must match `package.json` `name`. |
| `path` | string | Relative path from repo root (e.g., `packages/nimble-components`). |
| `script` | string | npm script invoked (defaults to `lint`). Validated against workspace `package.json`. |
| `dependsOn` | string[] | Additional workspace names that must complete before this task (derived from package dependencies + manual overrides). |
| `weight` | enum(`light`,`standard`,`heavy`) | Used to tune concurrency (heavy tasks limited to 1 worker). Defaults to `standard`. |
| `cache` | object | Settings for ESLint cache path (`.eslintcache`) and Lage hash inputs (extra files beyond defaults). |
| `status` | enum(`pending`,`running`,`success`,`failed`,`skipped`,`cached`) | Runtime state captured in telemetry. |

**Relationships**: Tasks form a DAG where edges are expressed via `dependsOn`. Lage enforces topological order.

**Validation Rules**:
- `name`, `path`, and `script` are required.
- `dependsOn` must reference existing workspace names; validation occurs when generating the task graph.
- `weight` defaults to `standard` if unspecified.

## 2. OrchestratorConfig
| Field | Type | Description |
|-------|------|-------------|
| `pipeline` | Record<string, TaskDefinition> | Maps task names (e.g., `lint`) to dependency + cache rules. |
| `taskRunner` | enum(`lage`) | Fixed to `lage` for this feature. |
| `concurrency` | number | Max parallel tasks overall (default 4 locally, 8 in CI). |
| `workerOverrides` | Record<string, number> | Optional per-task concurrency caps (e.g., `{ "lint:nimble-components": 1 }`). |
| `cacheOptions` | object | Contains path to `.lage/cache`, remote cache key template, and GitHub cache settings. |
| `telemetry` | object | Paths + format for JSONL output, toggles for local/CI. |

**Validation Rules**:
- `pipeline.lint` must exist and declare `taskRunner: 'npmScript'` with script `lint`.
- `concurrency` must be >=1; recommended <= number of CPU cores.

## 3. TelemetrySnapshot (JSON Lines)
Each line appended to `.lint-timings/lage-lint.jsonl`:

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string (ISO 8601) | Task completion time. |
| `workspace` | string | Workspace name. |
| `task` | string | Task identifier (`lint`). |
| `durationMs` | number | Wall-clock duration. |
| `status` | enum(`success`,`failed`,`cached`,`skipped`) | Result of the task. |
| `cacheHit` | boolean | Whether Lage skipped execution due to hash hit. |
| `workerId` | string | Worker label emitted by Lage. |
| `machine` | string | Host identifier (e.g., `macos-m3`, `gha-ubuntu-22`). |
| `gitSha` | string | Short commit hash from `git rev-parse --short HEAD`. |
| `commandFlags` | string[] | Flags passed to `lage` (e.g., `['--since=origin/main']`). |

**Validation Rules**:
- `durationMs` must be ≥0.
- `workspace` must exist in WorkspaceLintTask set.

## 4. LintManifest (Full Run Evidence)
| Field | Type | Description |
|-------|------|-------------|
| `runId` | string | UUID for the full-lint invocation. |
| `gitSha` | string | Commit hash linted. |
| `timestamp` | string | ISO date when run finished. |
| `packages` | Array<LintManifestEntry> | One entry per workspace. |

`LintManifestEntry` fields:
- `workspace`: string – workspace name
- `status`: enum(`passed`,`failed`)
- `durationMs`: number
- `eslintCacheChecksum`: string (SHA256 of `.eslintcache` file for auditing)

**Validation Rules**:
- `packages` must include every workspace flagged as lintable in `package.json` workspaces list.
- `status` must be `passed` for release approval.

## 5. CacheArtifact
Physical directories/files persisted via GitHub Actions cache.

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | `.lage/cache` (global) or `packages/<pkg>/.eslintcache` (per workspace). |
| `hashInputs` | string[] | Files whose hashes determine cache validity (e.g., `package-lock.json`, `packages/<pkg>/.eslintrc.cjs`). |
| `platform` | enum(`macos`,`linux`,`windows`) | Distinguishes incompatible caches. |

**Validation Rules**:
- `hashInputs` must include workspace `package.json` and root `package-lock.json`.
- Cache keys must remain under 512 characters for GitHub Actions.

---

These entities feed the contracts (CLI/API) and developer workflows described in accompanying documents.
