# TanStack Table v9 upgrade

## Scope and sources

Upgrade `@tanstack/table-core` from the locked 8.21.3 to **9.3.1**
(npm's latest stable release on November 11, 2026), preserving Nimble's public
attributes, methods, events, rendering, and interaction behavior.

- [Release announcement](https://tanstack.com/blog/announcing-tanstack-table-v9)
- [Lit migration guide](https://tanstack.com/table/latest/docs/framework/lit/guide/migrating)
- [React migration guide](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)
- [Lit quick start](https://tanstack.com/table/latest/docs/framework/lit/quick-start)
- [Reactivity architecture](https://tanstack.com/blog/tanstack-table-v9-reactivity)

The published 9.3.1 declarations and JavaScript were also inspected. The adapter
guides omit an important vanilla-core requirement: explicit reactivity bindings.

**Keep table-core and FAST.** Use the Lit guide's shared API changes, not its
`TableController` or rendering migration. A Lit reactive controller is not a FAST
lifecycle adapter. No Lit dependency, new selection engine, cell spanning, worker
architecture, or Virtual upgrade is part of this change.

## Required implementation

1. Replace `createTable` with `constructTable`.
2. Define shared, concrete `tableFeatures` with `rowSortingFeature`,
   `columnGroupingFeature`, `rowExpandingFeature`, and `rowSelectionFeature`.
   Move row factories into `sortedRowModel`, `groupedRowModel`, and
   `expandedRowModel`; remove the automatic core-row-model option.
3. Supply `coreReactivityFeature: storeReactivityBindings()` from the exported
   `@tanstack/table-core/store-reactivity-bindings` subpath.
4. Characterize implicit numeric aggregation: v8 group-row sorting can consume
   automatically aggregated non-group fields. Preserve this with the separate
   `rowAggregationFeature` and individually registered functions if observable.
   Nimble dates are numeric timestamps, not JavaScript `Date` records.
5. Thread the feature type through `Table`, `Row`, `ColumnDef`, and custom sort
   types. Replace `TableOptionsResolved` with `TableOptions`.
6. Rename `sortingFn` / `SortingFnOption` / `SortingFn` to their `sortFn` /
   `SortFnOption` / `SortFn` equivalents. Preserve custom comparators and
   `sortUndefined: false`.
7. Remove `onStateChange`; read state through atoms/store rather than `getState`
   or optional controlled options. Retain per-slice callbacks and explicit
   projection into FAST observables rather than introducing duplicate refresh
   subscriptions.
8. Clone published selection maps before range changes or group deselection.
   v9 memoizes selection APIs by map reference.
9. Retain `ExpansionManager` and group-selection workarounds initially. The
   expanded-row model still bypasses `getIsRowExpanded` for empty expanded
   state; callback suppression and memo invalidation need behavioral tests.
10. Validate export-aware TypeScript module resolution, ES2022 dependency output,
    ESM bundling, SSR smoke tests, and declaration consumers. Do not import
    private package paths or broadly loosen types.

Nimble owns column layout, visibility, resizing, ordering, and pinning. Do not
enable similarly named TanStack features or rename Nimble's public `left` pinning
API. The `_willUpdate` call belongs to Virtual, not Table. Keep the deliberate
TanStack Renovate exclusion.

## Coverage assessment and characterization

Existing browser coverage is strong for exact sort/group order, multi-column
sorting/grouping, null/undefined handling, hierarchy and lazy children, selection
IDs and checkbox states, event behavior, menus, keyboard navigation,
virtualization, and detach/reattach.

The initial v8 baseline passed **1,372 Chrome tests** and **1,364 WebKit tests
with 8 existing browser-tagged skips** across table and table-column specs.
The VS Code runner could not connect to Bun; repository Karma was the successful
fallback. Comparator tests use fake rows, not the real processing pipeline.
The performance workspace currently benchmarks the wafer map, not the table.

Before migration, add characterization tests for:

- Real numeric sorting in both directions, including undefined/null/NaN,
  infinities, signed zero, stable ties, and multi-sort tie breaking.
- Numeric aggregate group sorting and nested grouped-column sorting.
- Repeated additive range expansion/contraction and group deselection, asserting
  IDs, header/group tri-state, and event counts.
- Repeated collapse-all, selective re-expansion, lazy children, and replacement
  of grouped/hierarchical data without losing selection or unrelated state.

Keep legitimate v8 expectations. Do not simply rewrite expected outputs to match
v9. Existing reconnect coverage should remain sufficient if no subscriptions are
introduced; subscriptions would require dedicated cleanup tests.

## Implementation and validation sequence

- [x] Add and run characterization tests against v8.
- [x] Update manifest and lockfile, then migrate all integration/type surfaces.
- [x] Fix tightly coupled invalidation behavior and preserve workarounds.
- [x] Run table/table-column coverage in Chrome and WebKit, including full suites.
- [x] Run component type-check/build and lint.
- [x] Run full component browser suites; record WebKit launcher failure separately.
- [x] Build component bundles/SSR smoke test, wrappers, and Storybook.
- [x] Review local visual matrices and collect exploratory large-data/bundle costs.
- [x] Update [tech-stack.md](./tech-stack.md) and add a Beachball change entry.
- [ ] Complete isolated retained-heap and comparable v8/v9 FAST/bundle measurements.

Focused validation extends the existing headless Karma config, preserving its
shared setup and selecting `src/table/**/*.spec.ts` and
`src/table-column/**/*.spec.ts`. Use the repository's existing tooling, not a
new test framework.

Broader commands:

```sh
npm run build:components -w @ni/nimble-components
npm run lint -w @ni/nimble-components
npm run test -w @ni/nimble-components
npm run build-components
npm run build-bundle -w @ni/nimble-components
npm run build-angular
npm run build-react
npm run build-blazor
npm run build-storybook
```

`build-components` does not run bundle tasks; `build-bundle` also runs the Node
smoke test. Check emitted declaration consumers even though wrapper APIs should
not change.

Compare identical deterministic 20k/100k-record v8/v9 fixtures, including
flat/grouped/hierarchical data, for processing and next-frame latency, retained
heap across replacements, bounded rendered rows, and minified/gzipped bundle
size. Report repeated-run medians and variability, not announcement benchmarks.
Set numerical tolerances from the measured baseline rather than inventing them.

Review existing Storybook matrices for themes, grouping/hierarchy/selection,
pinning, open menus, and fit-row height. Snapshots are not sufficient evidence
for long state-transition sequences.

## Decisions and execution results

The integration upgrade is implemented. Remaining comparative performance work
is explicitly listed below; the exploratory measurements are not release
budgets or evidence that every operation improved.

### Compatibility decisions

- Retained FAST's controlled state and observable projection, without a Lit
  adapter or additional subscriptions. Registered only the required features,
  including numeric sum aggregation.
- Updated all feature-aware types and sort names. Nimble's TypeScript project
  uses `bundler` module resolution for exported dependency subpaths. The shared
  feature composition has an explicit root-resolvable declaration type so
  downstream consumers do not need to change their module resolution.
- Cloned selection maps before additive range changes and grouped deselection.
  This preserves v9 memo invalidation and Nimble's checkbox tri-state behavior.
- Preserved expansion and group-selection workarounds, including Nimble's
  collapsed-descendant range behavior rather than adopting v9's native ranges.
- Fixed a real nested-group sorting regression: v8 exposed the first
  descendant's value for later grouped columns, whereas v9 returns undefined
  at outer grouping depths. Nimble's comparators now explicitly retrieve that
  descendant value. The expected outer-group order was verified against v8,
  not changed to match v9.
- Added nine browser regression cases in
  [table-upgrade-regressions.spec.ts](../tests/table-upgrade-regressions.spec.ts).
  The first seven passed on v8 before migration; the final two cover nested
  grouped-column sorting and combined sorted/grouped/hierarchical replacement
  with expansion and selection preservation.

### Validation results

Commands below run from the repository root.

| Command | Result |
| --- | --- |
| `npm run build:components -w @ni/nimble-components` | Passed |
| `npm run build:components -w @ni/spright-components` | Passed; verifies declaration compatibility |
| `npm run build-components` | Passed, 7/7 Turbo tasks |
| `npm run build-bundle -w @ni/nimble-components` | Passed, including Node SSR smoke test |
| `npm run lint -w @ni/nimble-components` | Passed |
| `npm run test-chrome -w @ni/nimble-components` | Passed, 5,669/5,669 tests |
| `npm run test-webkit -w @ni/nimble-components` | 5,654 assertions passed, 15 existing skips; launcher teardown failed and the hung process was stopped |
| `npm exec -- turbo run @ni-private/angular-workspace#build @ni-private/react-client-app#build @ni-private/blazor-workspace#build @ni-private/storybook#build --log-order=grouped --continue=dependencies-successful` | Passed, 17/17 tasks, including Angular, React, Blazor and Storybook |
| `git diff --check` | Passed |

The focused Chrome suite also passed all 1,379 cases after the initial seven
regressions and migration. The subsequent full runs include all nine new cases.
A final focused dual-browser retry failed in the existing Playwright launcher
before reporting test totals; it does not replace the successful full-suite
assertion evidence. Its process was stopped.

Do not run source-generating builds alongside Karma: Vite watches generated
files and reloads the browser. Full browser results above came from sequential
runs with stable sources. WebKit's launcher throws from its process lookup
(`ps | grep ...`) during cleanup; this is not an assertion failure or a clean
command exit. No unrelated launcher changes were made.

Local built Storybook inspection covered grouped/hierarchical multiple
selection in light, color, and dark themes, pinned columns at both scroll
positions, an opened action menu, and the 50-row-height story. Theme colors were
also checked through computed row styles. This was a local smoke review, not
an automated visual comparison or a remote Chromatic upload.

### Exploratory performance results and remaining checks

Core-only measurements used Node 24.4.1, identical deterministic 20k/100k data,
one warmup and five measured runs per version. Hierarchical data had one parent
and nine children per ten records. Each run materialized the core model, applied
two-column sorting, grouped, collapsed/re-expanded, selected all, and replaced
data. Counts and cross-version sorted IDs were asserted. These timings exclude
FAST rendering, use a simple numeric comparator, and are not production
latency budgets.

Selected times below are **median [minimum–maximum] milliseconds**, v8 to v9:

| Records/layout | Core model | Data replacement | Re-expansion |
| --- | --- | --- | --- |
| 20k flat | 64.74 [63.09–79.24] → 7.81 [7.63–10.79] | 129.57 [127.56–166.50] → 31.12 [27.61–32.23] | 1.41 [0.93–4.87] → 1.66 [1.33–2.18] |
| 20k hierarchy | 65.51 [64.67–67.79] → 8.46 [7.66–8.96] | 99.91 [96.81–104.74] → 19.36 [18.93–25.13] | 1.17 [0.79–2.10] → 1.35 [1.08–1.82] |
| 100k flat | 366.78 [360.85–414.83] → 51.72 [49.64–52.68] | 832.53 [815.91–854.27] → 242.28 [236.90–250.02] | 5.17 [4.86–5.72] → 16.00 [15.16–17.40] |
| 100k hierarchy | 380.43 [370.58–387.32] → 58.68 [57.65–64.34] | 623.99 [619.23–659.70] → 123.71 [117.17–133.79] | 7.07 [6.29–7.21] → 9.51 [8.62–10.51] |

Sorting, grouping, selection, and replacement medians improved in these core
samples, but re-expansion was slower, particularly for 100k flat records.
Investigate that operation with the complete FAST pipeline before setting a
release tolerance.

A local v9 FAST smoke fixture (one text column, multiple selection, 500px
height) performed three replacements for each size. `setData` plus two
animation frames took 55.6/47.9/48.5ms for 20k and 139.7/115.1/109.8ms for 100k.
Rendered record rows stayed below 40; scrolling to the end rendered 17 rows and
the correct last record. Selection of that record survived detach/reattach at
both sizes. This is a v9-only smoke check, not a v8 latency comparison.

The current all-components minified bundle is 1,676,252 bytes, or 446,895 bytes
with Node's default gzip. There is no comparable v8 build, so no size-improvement
claim is made.

**Still unverified:** isolated retained-heap measurements across replacements,
identical v8/v9 FAST frame measurements, and a v8/v9 bundle-size comparison.
The in-process heap experiment produced implausible deltas even with an
explicit live-table reference and was rejected rather than reported as a
memory improvement. These checks remain follow-up performance validation, not
completed gates.
