# Research: Replace Concurrently with Lage

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Phase**: 0 - Research & Discovery  
**Status**: In Progress

## Research Questions

### 1. Lage Test Pipeline Configuration

**Question**: How should test tasks be configured in Lage pipeline to support browser-specific tests (webkit, firefox, chrome)?

**Investigation**:

Looking at current nimble-components test scripts:
```json
{
  "test-concurrent": "concurrently --pad-prefix --timings --group \"npm:test\" \"npm:test:vitest:webkit\"",
  "test": "vitest run",
  "test:vitest:watch": "vitest",
  "test:vitest:firefox": "BROWSER=firefox vitest run",
  "test:vitest:firefox:watch": "BROWSER=firefox vitest",
  "test:vitest:webkit": "BROWSER=webkit vitest run"
}
```

Lage can orchestrate test execution, but browser-specific tests use environment variables (BROWSER=webkit). Each package's `test` script should remain the default (Chrome) test. Browser-specific tests are run via separate commands, not orchestrated by Lage.

**Decision**: 
- Configure Lage `test` pipeline to run each package's `test` script (default browser)
- **DO NOT** orchestrate browser-specific tests through Lage - they're run separately via direct commands like `npm run test:vitest:webkit -w @ni/nimble-components`
- Current usage of browser tests is already manual/ad-hoc, not part of validate workflow

**Rationale**: 
- Browser-specific tests are typically run locally for debugging, not in parallel validation
- CI likely runs browser tests separately as distinct jobs
- Simpler to keep browser test execution as direct package script invocation

---

### 2. Cache Strategy for Test Tasks

**Question**: What inputs/outputs should be configured for test task caching? Test caching is more complex than lint (flaky tests, browser state, etc.)

**Investigation**:

Lint caching works well because:
- Deterministic output (ESLint cache files)
- No external dependencies (browser, network, etc.)
- Fast to regenerate cache

Test caching considerations:
- Tests may have side effects (file system, network mocks, etc.)
- Browser tests have environment dependencies
- Flaky tests can poison cache
- Test output is typically console output, not files

Lage cache configuration options:
```javascript
{
  cache: true | false,
  inputs: [],      // Files that invalidate cache when changed
  outputs: [],     // Files to cache (optional for tasks without file outputs)
}
```

**Decision**:
- **Enable caching for test tasks**: `cache: true`
- **Inputs**: Test source files are automatically tracked by Lage via git (default behavior)
- **Outputs**: Empty array `[]` - tests produce console output, not cacheable files
- **Cache behavior**: Lage will skip test execution if inputs haven't changed since last successful run
- **Cache invalidation**: Any source change in package or dependencies triggers re-run

**Concerns & Mitigations**:
- **Flaky tests**: These already exist and are handled via explicit skip tags (e.g., `#SkipFirefox`). Cache doesn't make this worse.
- **False cache hits**: If test becomes flaky after caching, developer can `rm -rf .lage/cache` to clear
- **CI behavior**: CI should always clear cache between runs or use `--no-cache` flag for test tasks if needed

**Recommendation**: Start with caching enabled. Monitor for issues. Can disable selectively per-package or globally if problems arise.

---

### 3. Validate vs. Test Pipeline Relationship

**Question**: Should validate and test be separate Lage pipelines, or should validate depend on test?

**Investigation**:

Current concurrently setup:
```json
{
  "validate": "concurrently --pad-prefix --timings --group \"npm:validate:*\"",
  "validate:lint:sequential": "npm run lint --workspaces --if-present",
  "validate:test:sequential": "npm run test --workspaces --if-present",
  "validate:lint-concurrent:nimble-components": "npm run lint-concurrent -w packages/nimble-components",
  "validate:test-concurrent:nimble-components": "npm run test-concurrent -w packages/nimble-components",
  "test": "concurrently --pad-prefix --timings --group \"npm:validate:test*\""
}
```

Observations:
- `validate` runs scripts matching `npm:validate:*` pattern
- This includes BOTH lint AND test tasks
- `test` command separately runs just test tasks
- Lint and test are independent (don't depend on each other)

**Decision**: 
- **Two separate Lage pipelines**: `lint` (already exists) and `test`
- **No dependencies between them**: lint and test are independent
- **Create wrapper validate task**: New Lage pipeline `validate` that depends on both `['^lint', '^test']`

```javascript
pipeline: {
  lint: { /* existing configuration */ },
  test: {
    dependsOn: ['^test'],
    cache: true,
    inputs: ['package-lock.json', 'lage.config.js'],
    outputs: []
  },
  validate: {
    dependsOn: ['^lint', '^test'],
    cache: false  // Composite task, doesn't produce output itself
  }
}
```

**Commands**:
- `npm run lint` → `lage run lint` (already exists)
- `npm run test` → `lage run test` (new)
- `npm run validate` → `lage run validate` (new, runs both)

---

### 4. Package-Specific Validation Migration

**Question**: How should `validate:lint-concurrent:nimble-components` and `validate:test-concurrent:nimble-components` be handled?

**Current usage**:
```json
{
  "validate:lint-concurrent:nimble-components": "npm run lint-concurrent -w packages/nimble-components",
  "validate:test-concurrent:nimble-components": "npm run test-concurrent -w packages/nimble-components"
}
```

**Analysis**:
- These scripts invoke nimble-components' `lint-concurrent` and `test-concurrent` scripts
- Those scripts themselves use concurrently to run lint+prettier or test+webkit in parallel
- With Lage, we already have `lage run lint --scope @ni/nimble-components`

**Decision**: 
- **Remove** `validate:lint-concurrent:nimble-components` from root package.json
- **Remove** `validate:test-concurrent:nimble-components` from root package.json  
- **Remove** `lint-concurrent` from nimble-components package.json (redundant with Lage lint)
- **Remove** `test-concurrent` from nimble-components package.json (keep as regular test command)

**Migration path for developers**:
- Old: `npm run validate:lint-concurrent:nimble-components`
- New: `lage run lint --scope @ni/nimble-components`

- Old: `npm run validate:test-concurrent:nimble-components`  
- New: `lage run test --scope @ni/nimble-components`

**Document in quickstart.md**: Command migration guide for common workflows

---

### 5. Output Formatting Parity

**Question**: Does Lage output formatting match concurrently's grouped, labeled output?

**Investigation**:

Concurrently output features:
- `--pad-prefix`: Aligns output columns
- `--timings`: Shows execution time for each task
- `--group`: Groups output by task

Lage output features:
- Task name prefix on each line
- Summary table at end showing success/failure/cached status
- Execution time per task
- Color coding for status (green=success, red=fail, gray=cached)

**Comparison Test**: Run both and compare

Concurrently output example:
```
[validate:lint] Starting...
[validate:test] Starting...
[validate:lint] ✓ Completed (12.3s)
[validate:test] ✓ Completed (45.1s)
```

Lage output example:
```
info    - @ni/nimble-components#lint     started
info    - @ni/jasmine-extensions#lint    started
success - @ni/nimble-components#lint     completed (12.3s) [cached]
success - @ni/jasmine-extensions#lint    completed (3.1s)

┌────────────────────────────────┬──────────┬──────────┐
│ Task                           │ Status   │ Duration │
├────────────────────────────────┼──────────┼──────────┤
│ @ni/nimble-components#lint     │ cached   │ 12.3s    │
│ @ni/jasmine-extensions#lint    │ success  │ 3.1s     │
└────────────────────────────────┴──────────┴──────────┘
```

**Decision**: 
- Lage output is **sufficient** - provides task names, status, timing, and cache indicators
- More informative than concurrently (shows cache hits, dependency graph)
- No custom reporter needed

**Rationale**: 
- Lage output is already familiar to developers from lint workflow
- Better cache visibility than concurrently (shows which tasks were cached)
- Summary table is clearer for large task sets

---

## Technology Choices

### Lage Pipeline Configuration

**Choice**: Extend existing lage.config.js with test and validate pipelines

**Alternatives Considered**:
1. Keep concurrently for test, use Lage only for lint
   - **Rejected**: Defeats purpose of consolidation
2. Separate lage configs for lint vs test
   - **Rejected**: Unnecessary complexity
3. Use npm scripts to compose lint + test
   - **Rejected**: Loses Lage's caching and dependency benefits

**Selected Approach**: Single lage.config.js with three pipelines (lint, test, validate)

---

### Test Caching Strategy

**Choice**: Enable caching with empty outputs array

**Alternatives Considered**:
1. Disable caching for tests (`cache: false`)
   - **Rejected**: Loses major performance benefit
2. Cache test output files (coverage, reports)
   - **Rejected**: Not all packages produce these; adds complexity
3. Selective caching (only deterministic packages)
   - **Rejected**: Hard to maintain; better to fix flaky tests

**Selected Approach**: Enable caching, rely on existing flaky test handling

---

## Best Practices from Research

1. **Pipeline Design**: Use dependency graph (`dependsOn: ['^lint', '^test']`) for composite tasks
2. **Cache Configuration**: Empty outputs array for tasks producing only console output
3. **Concurrency**: Inherit from lint configuration (4 local, 8 CI via LAGE_CONCURRENCY env var)
4. **Weight Assignment**: Reuse existing workspaces.json weight for test tasks (heavy packages get more workers)
5. **Script Migration**: Remove redundant *-concurrent scripts, use Lage's --scope instead

---

## Open Questions Resolved

All research questions have been answered:

- ✅ Test pipeline configuration: Run default browser tests only
- ✅ Cache strategy: Enable caching with empty outputs
- ✅ Validate/test relationship: Separate pipelines, validate depends on both
- ✅ Package-specific migration: Remove concurrent scripts, use --scope
- ✅ Output formatting: Lage output is sufficient

---

## Next Steps

Proceed to **Phase 1: Design & Contracts**

1. Create quickstart.md with migration guide
2. Document lage.config.js changes
3. Document package.json script changes
4. Prepare for Phase 2 task breakdown
