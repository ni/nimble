# Quickstart – Accelerate Monorepo Lint Execution

This guide teaches contributors how to use the new Lage-powered lint workflows locally and in CI simulations.

## 1. Install & Bootstrap
```bash
npm install
npx playwright install-deps || true  # only if Playwright already required
```
> Lage is installed as a devDependency at the repo root. No global install required.

## 2. Key Commands
| Command | Description |
|---------|-------------|
| `npm run lint:changed` | Runs `lage run lint --since=origin/main` (overridable) on affected workspaces + dependents. |
| `npm run lint:pkg -- @ni/nimble-components` | Scopes lint to a single workspace using Lage `--scope`. |
| `npm run lint:full` | Forces all workspaces to lint once (`lage run lint --no-cache`). Emits `lint-manifest.json`. |
| `npm run lint:ci` | Wrapper used by GitHub Actions. Restores cache, runs `lint:changed` with PR base SHA, uploads telemetry artifact. |

### Passing custom flags
All commands forward extra args to Lage:
```bash
npm run lint:changed -- --since=HEAD~3 --concurrency=6
```

## 3. Understanding Output
- Lage prints task lifecycle logs grouped per workspace.
- Telemetry stored at `.lint-timings/lage-lint.jsonl` (gitignored). Delete the file to reset local history.
- ESLint caches live under `packages/<pkg>/.eslintcache`. Safe to delete if debugging.

## 4. Adding a New Workspace
1. Ensure `package.json` exposes a `lint` script.
2. Add workspace to root `package.json` workspaces list.
3. Optional: register `weight` override in `lage.config.mjs` if it is CPU-heavy.
4. Run `npm run lint:full` once to prime caches and confirm telemetry entry.

## 5. CI Integration Cheat Sheet
- Workflow retrieves cache: `actions/cache` key => `lint-${{ runner.os }}-${{ hashFiles('package-lock.json') }}`.
- Execute `npm run lint:ci -- --since=${{ github.event.pull_request.base.sha }}`.
- Upload artifacts:
  - `.lage/cache` (for debugging cache misses)
  - `.lint-timings/lage-lint.jsonl`
  - `lint-manifest.json` when `lint:full` runs on release branches

## 6. Troubleshooting
| Symptom | Fix |
|---------|-----|
| Lint runs everything despite small change | Ensure branch tracks `origin/main`; pass `--since=origin/main`. Check for lockfile changes that invalidate cache. |
| Task never finishes / high CPU | Reduce concurrency `--concurrency=2` or mark workspace as `heavy` in config. |
| Telemetry file missing | Verify `LINT_TELEMETRY=1` env var (set by default in npm scripts). |
| Cache restore fails in CI | Remove stale caches via GitHub UI and rerun workflow; caches automatically repopulate. |

## 7. Next Steps
- Review `lage.config.mjs` for task graph changes before committing.
- Update Storybook/CONTRIBUTING docs when adding new lint commands.
