# Feature Specification: Lage Build Coordination

**Feature Branch**: `003-build-coordination`  
**Created**: November 26, 2025  
**Status**: Draft  
**Input**: User description: "use lage for build coordination"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fast Incremental Builds (Priority: P1) �� MVP

Contributors can run `npm run build` and Lage orchestrates builds across all packages in the correct dependency order with intelligent caching, ensuring changed packages and their dependents rebuild automatically while unchanged packages are skipped.

**Why this priority**: This is the foundation - without proper build orchestration, developers waste time on full rebuilds when only a few packages changed. This directly impacts daily development productivity.

**Independent Test**: 
1. Make a change in `nimble-tokens`
2. Run `npm run build`
3. Verify only `nimble-tokens` and its dependents (nimble-components, angular, blazor, react wrappers) rebuild
4. Verify other packages skip building via cache
5. Run `npm run build` again with no changes - all packages should skip via cache in <5 seconds

**Acceptance Scenarios**:

1. **Given** a clean repository, **When** running `npm run build`, **Then** all packages build in dependency order and subsequent runs complete in <5s via cache
2. **Given** nimble-tokens is modified, **When** running `npm run build`, **Then** only nimble-tokens and packages depending on it rebuild
3. **Given** nimble-components is modified, **When** running `npm run build`, **Then** nimble-components and wrapper packages (Angular, Blazor, React) rebuild but nimble-tokens is skipped
4. **Given** a build error in one package, **When** running `npm run build`, **Then** Lage stops immediately with clear error output and doesn't attempt dependent packages

---

### User Story 2 - Parallel Build Execution (Priority: P2)

Contributors benefit from parallel builds where independent packages build concurrently (up to 4 workers locally, 8 in CI) instead of sequentially, dramatically reducing full build time from ~10 minutes to ~3-4 minutes.

**Why this priority**: Parallel execution provides immediate time savings for full builds and CI pipelines, but the caching from US1 provides more dramatic improvements for incremental development.

**Independent Test**:
1. Clear Lage cache: `rm -rf .lage/cache`
2. Run `npm run build`
3. Observe multiple packages building in parallel (watch terminal output)
4. Verify total build time is <4 minutes (vs ~10 minutes sequential)
5. In CI, set `LAGE_CONCURRENCY=8` and verify 8 concurrent workers

**Acceptance Scenarios**:

1. **Given** cache is cleared, **When** running `npm run build` locally, **Then** up to 4 packages build in parallel simultaneously
2. **Given** CI environment with `LAGE_CONCURRENCY=8`, **When** running `npm run build`, **Then** up to 8 packages build in parallel
3. **Given** packages have no dependencies between them (e.g., jasmine-parameterized and nimble-tokens), **When** running `npm run build`, **Then** they build concurrently
4. **Given** package A depends on package B, **When** running `npm run build`, **Then** package B completes before package A starts

---

### User Story 3 - Build Specific Packages (Priority: P3)

Contributors can build specific packages or sets of packages using Lage's `--scope` flag, enabling faster iteration when working on isolated package changes without building the entire monorepo.

**Why this priority**: Nice productivity boost for focused development work, but US1 caching already provides most of this benefit by skipping unchanged packages.

**Independent Test**:
1. Run `lage run build --scope @ni/nimble-components`
2. Verify only nimble-components and its dependencies (nimble-tokens) build
3. Verify wrapper packages (Angular, Blazor, React) are skipped
4. Run with multiple scopes: `lage run build --scope @ni/nimble-components --scope @ni/spright-components`
5. Verify only those two packages and their dependencies build

**Acceptance Scenarios**:

1. **Given** working on nimble-components only, **When** running `lage run build --scope @ni/nimble-components`, **Then** only nimble-components and its dependencies build
2. **Given** working on multiple specific packages, **When** using multiple `--scope` flags, **Then** only those packages and their dependencies build
3. **Given** changed files since origin/main, **When** running `lage run build --since origin/main`, **Then** only changed packages and their dependents build

---

### Edge Cases

- **Circular dependencies**: What happens if package dependencies form a cycle? (Lage should detect and error)
- **Missing dependencies**: What if package.json doesn't list a build dependency? (Build may succeed but be incorrect - need dependency graph validation)
- **Build script missing**: What if a package has no `build` script in package.json? (Lage should skip gracefully, not error)
- **Build failures mid-orchestration**: When one package fails, do subsequent packages in the dependency chain attempt to build? (No - Lage should fail-fast)
- **Cache corruption**: What if Lage cache becomes inconsistent? (Clear cache: `rm -rf .lage/cache`)
- **Out-of-memory during build**: What if a heavy package exhausts memory? (Consider weight-based worker limits)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST execute builds in dependency order (dependencies before dependents)
- **FR-002**: System MUST cache build outputs and skip rebuilds when inputs haven't changed
- **FR-003**: System MUST detect package dependencies from package.json and workspace structure
- **FR-004**: System MUST build independent packages in parallel (up to worker limit)
- **FR-005**: System MUST invalidate cache when source files, build configuration, or dependencies change
- **FR-006**: System MUST respect `LAGE_CONCURRENCY` environment variable (default 4, CI uses 8)
- **FR-007**: System MUST provide clear error messages when builds fail, including which package failed
- **FR-008**: System MUST skip packages without `build` scripts gracefully
- **FR-009**: System MUST stop dependent builds when a dependency build fails (fail-fast)
- **FR-010**: System MUST support scoped builds via `--scope` flag for specific packages
- **FR-011**: System MUST support `--since` flag to build only changed packages since a git ref
- **FR-012**: System MUST integrate with existing `npm run build` command (users shouldn't need to learn new commands)

### Key Entities *(include if feature involves data)*

- **Package**: A workspace package with a build script in package.json
  - Attributes: name, path, dependencies, devDependencies, build script
  - Relationships: depends on other packages, dependents depend on it
  
- **Build Task**: An execution of a package's build script
  - Attributes: package name, status (pending/running/completed/failed), duration, worker ID
  - Relationships: belongs to a package, blocks dependent tasks
  
- **Build Cache**: Hash-based cache of build outputs
  - Attributes: cache key (hash of inputs), package name, timestamp, outputs
  - Relationships: belongs to a package, invalidated by input changes

- **Build Graph**: Directed acyclic graph (DAG) of package dependencies
  - Nodes: packages
  - Edges: depends-on relationships
  - Computed from package.json dependencies and workspace configuration

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Full monorepo build with warm cache completes in <5 seconds (vs minutes currently)
- **SC-002**: Full monorepo build with cold cache completes in <4 minutes on local (4 workers) and <3 minutes in CI (8 workers) vs ~10 minutes sequential
- **SC-003**: Incremental build (single package change) completes in <30 seconds including dependencies
- **SC-004**: Cache hit rate >90% on typical incremental builds (1-3 package changes)
- **SC-005**: Build orchestration runs with ≥4 concurrent workers locally, ≥8 in CI
- **SC-006**: CI build pipeline completes successfully with no workflow changes required
- **SC-007**: Build failures provide clear error output showing which package failed and why

## Scope & Boundaries *(mandatory)*

### In Scope

- Orchestrating `npm run build` for all workspace packages via Lage
- Caching build outputs based on source file changes
- Parallel execution of independent builds
- Dependency-aware build ordering
- Integration with existing CI pipeline
- Support for scoped and incremental builds
- Clear error reporting on build failures

### Out of Scope (Future Enhancements)

- Watch mode builds (developers currently use package-specific watch scripts like `npm run build-components:watch`)
- Remote caching (current implementation uses local cache only)
- Build telemetry and analytics
- Build output compression or artifact management
- Custom build scripts beyond standard `build` in package.json
- Migration of package-specific watch/TDD workflows (these remain manual for now)

## Assumptions & Constraints

### Assumptions

- Lage 2.14.15+ is already installed (from 002-lint-speedup and 001-replace-concurrently)
- All packages follow npm workspace conventions
- Build scripts in package.json are deterministic (same input = same output)
- Build outputs are written to predictable locations (dist/, lib/, etc.)
- Dependencies between packages are correctly declared in package.json
- Build failures are rare enough that fail-fast is acceptable (don't continue building dependent packages)

### Constraints

- Must maintain backward compatibility with existing `npm run build` command
- Must not require changes to CI pipeline workflows
- Must work on macOS (arm64/x64), Linux, and Windows
- Must handle Apple Silicon M-series architecture (arm64 + Rosetta x64 workers)
- Must not exceed 4 workers locally (to avoid overwhelming developer machines)
- Cache must be compatible with git-ignored directories (.lage/cache)

## Dependencies & Prerequisites

### Dependencies

- **Lage 2.14.15+**: Already installed from 002-lint-speedup
- **npm workspaces**: Existing monorepo structure
- **Node.js 22+**: Current development environment
- **Workspace manifest**: `scripts/lint/workspaces.json` (already exists from lint speedup)

### Prerequisites

1. All workspace packages must have a `build` script in package.json (if they produce build artifacts)
2. Package dependencies must be correctly declared in package.json
3. Build scripts must be idempotent (can run multiple times safely)
4. No circular dependencies between packages

## Open Questions & Clarifications

### Questions for Stakeholders

1. **Watch mode integration**: Should we migrate watch scripts to Lage or keep them package-specific?
   - Current state: Developers manually run `npm run build-components:watch` for specific packages
   - Option A: Keep current manual watch scripts (simpler, no change)
   - Option B: Add Lage-orchestrated watch mode (more complex, unified DX)
   - Recommendation: Option A - defer to future enhancement

2. **Remote caching**: Should we enable shared cache across developers/CI?
   - Option A: Local cache only (simpler, already works with Lage)
   - Option B: GitHub Actions cache integration (requires configuration)
   - Option C: Azure Blob Storage remote cache (complex, requires infrastructure)
   - Recommendation: Option A for MVP, evaluate Option B for future

3. **Build output validation**: Should we validate that build outputs match expectations?
   - Option A: Trust build scripts, no validation (current state)
   - Option B: Add checksums or output verification (more robust)
   - Recommendation: Option A - rely on tests to catch issues

## Migration Strategy

### Backward Compatibility

- `npm run build` continues to work (no user-facing changes)
- All existing build scripts remain functional
- CI pipeline requires no workflow modifications
- Developers can opt-in to scoped builds (`lage run build --scope <package>`)

### Rollback Plan

If Lage build orchestration causes issues:

1. Restore original root package.json build script: `"build": "npm run build --workspaces --if-present"`
2. Remove build pipeline from lage.config.js
3. Clear Lage cache: `rm -rf .lage/cache`
4. Communicate rollback to team via PR or slack

### Implementation Phases

1. **Phase 1**: Add build pipeline to lage.config.js (no behavior change)
2. **Phase 2**: Update root package.json to use Lage for builds
3. **Phase 3**: Test and validate cache behavior
4. **Phase 4**: Document and communicate to team

## References

- [Lage Documentation](https://microsoft.github.io/lage/)
- [002-lint-speedup spec](../002-lint-speedup/) - Prior Lage integration for linting
- [001-replace-concurrently spec](../001-replace-concurrently/) - Prior Lage integration for validate/test
- [Lage Build Pipeline Docs](https://microsoft.github.io/lage/docs/Guide/pipeline#pipeline)
- [Nimble CONTRIBUTING.md](/CONTRIBUTING.md) - Repository contribution guidelines
