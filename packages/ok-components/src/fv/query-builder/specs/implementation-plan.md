# OK FV Query Builder Implementation Plan

Superseded by [saved-query-ux-plan](./saved-query-ux-plan.md).

## Implementation Status

`ok-fv-query-builder` is implemented as a FAST component with configured fields, editable grouped queries, host validation errors, immediate change events, and clear/validate methods. The host-owned Apply/Cancel and saved-query example is in Storybook; backend translation and persistence remain outside the component. The sections below preserve the design contract and original verification criteria.

- Component, typed operand model, validation, responsive editor, and query events are implemented.
- Group logic is shown once per multi-rule group, and query logic is shown once for multiple groups.
- Component TypeScript build, focused ESLint, CEM generation, and Storybook production build pass.
- Chrome, Firefox, and WebKit each pass all 245 component specs.
- Storybook Accessibility reports 0 violations and 17 passes for the basic story; the saved-filter drawer reports 0 violations, 26 passes, and 2 inconclusive checks.
- Storybook TypeScript build remains blocked by two unrelated existing errors in Nimble icon metadata and table testing.
- Playwright verified popup bounds at 320px, 360px, and 390px with no document overflow. At 390px, the real Nimble drawer workflow, field selection, child-select Escape, editor Escape, Apply, and Cancel/preset restoration were verified in Chrome.

See <requirements.md> for the revised requirements and <research.md> for primary-source evidence. This document records the implemented design and its remaining verification gates.

## Review Findings

These issues were found in the original requirements and are corrected in the revised document:

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | Flattened group fragments hide expression precedence; multiple separator buttons suggest independent joins. | Visible group boundaries and one shared operator at each supported level. Omit the misleading legend. |
| High | Scalar/collection-only values cannot implement `between`, zero-value predicates, or custom-property operators. | Explicit operand shape and an editor/validator/summary for every advertised operator. |
| High | The document says there is no Apply/Cancel, but imported `DrawerShell` renders both with no working transaction wiring. | Host owns a working copy and applied query; Done only dismisses. |
| High | No distinction between editable drafts, valid queries, and asynchronous external errors. | Structural validation, revision-matched host errors, aggregate validity, and no implicit backend submission. |
| Medium | The prototype's collection summaries omit negation; generic objects render unreadably. | Type-aware summaries retain operator meaning and provide full accessible text. |
| Medium | Unconditional focus restoration can steal focus after outside interaction; nested selects can consume Escape first. | Close-reason-specific focus handling and an early nested-overlay integration check. |
| Medium | Generated output was treated as a possible dependency without maintained source in this checkout. | Independent FV contract; no imports, cleanup, or speculative compatibility layer. |
| Low | `advanced` is not an actual preset; the initial add behavior was underspecified. | Use all six real fixture states; add opens the new rule. |

## Contract

### Public Surface

| Member | Proposed contract |
| --- | --- |
| `fields` | Property-only, readonly ordered field definitions with stable IDs, labels, type, supported operator IDs, and optional enum options. No CSV or JSON attribute encoding. |
| `query` | Property-only editable draft: `{ logic: 'and' \| 'or', groups: [...] }`. Each group has ID, logic, and ordered rules; each rule has ID, revision, field ID, operator ID, and operand. |
| `disabled` | Boolean property/attribute. Disables mutations and closes the editor. |
| `label` | String property/attribute naming the editor region. |
| `defaultField` | Optional `default-field` attribute/property. Explicit invalid defaults disable Add instead of silently substituting another field. |
| `validationErrors` | Property-only readonly records `{ ruleId, revision, message }`; stale revisions are ignored. |
| `labels` | Property-only complete English-default label set for built-in actions, statuses, boolean text, operand labels, operator labels, and local validation messages; host may replace/localize it. Field/option labels remain host-provided. |
| `ruleCount`, `valid` | Readonly derived properties. Count includes incomplete/invalid rules; empty query is valid. |
| `clear()` | Clear groups, reset query logic to `and`, close overlays, emit a change only if query state changed. No-op while disabled. |
| `validate()` | Reveal local errors and return a boolean including current matching host errors; no query mutation or change event. |
| `query-change` | Bubbling/composed event containing a detached query snapshot, `ruleCount`, and `valid`. One event per semantic user edit or effective `clear()`, not for opening/closing, property assignment, or internal control events. |
| `validity-change` | Bubbling/composed event with `{ valid }` when aggregate validity changes, including after host error/field updates without a query edit. |

Use TypeScript readonly contracts and clone collections/objects when replacing state and emitting snapshots; no shared mutable operands. Maintain stable rule/group IDs across edits. Each rule mutation increments its revision. Hosts must preserve monotonic revisions for an existing rule ID or assign a fresh ID when replacing its identity. Programmatic query replacement is authoritative, closes the editor, clears local touched state, and emits no `query-change`; a same-reference assignment is not an update.

Duplicate IDs, unknown IDs, unsupported operand shapes, and invalid catalog references must produce an invalid, inspectable/removable draft rather than silent deletion or a crash. Disable editing an unsupported rule until a supported field/operator is chosen. Reject malformed public data at the validation layer, not through incidental template failures.

### Operand Model and Initial Matrix

Keep stable lowercase operator IDs separate from display labels; IDs are UI vocabulary, not service opcodes. Field definitions choose a subset of the supported type-specific operators. Use a discriminated operand union rather than `any`:

- `none`: no input/value.
- `scalar`: string, finite number, boolean, or `null` for a missing value, constrained by field type.
- `collection`: ordered string values; enum entries store option IDs, not labels.
- `range`: two numeric or date endpoints, each allowing `null` while incomplete.
- `key`: required string key.
- `key-value`: required string key and string comparison value.

Numeric controls retain transient raw editing text privately, including an unfinished sign/exponent. Emit `null` for a missing/unparseable endpoint with invalid/incomplete status, never coerce empty text to zero. Do not recreate the active control on each input event; preserve its raw text/caret until correction, field/operator change, or authoritative query replacement. Validation must continue to report invalid input while its raw buffer is present.

| Field type | Operator IDs | Operand/editor |
| --- | --- | --- |
| string | `equals`, `contains`, `starts-with`, `ends-with` | Scalar text |
| string | `is-blank`, `is-one-of` | None; free-text collection respectively |
| number | `equals`, `not-equals`, `greater-than`, `greater-or-equal`, `less-than`, `less-or-equal` | Scalar Nimble number field |
| number | `between`, `is-empty` | Two number fields; none respectively |
| date | `equals`, `before`, `after`, `between`, `is-empty` | Date-only input; two date inputs for range; none for empty |
| boolean | `is` | Explicit unset/True/False selector; unset is not `false` |
| enum | `is`, `is-not`, `is-any-of`, `is-none-of` | Scalar select or enum collection picker |
| array | `contains`, `does-not-contain`, `is-empty` | Scalar text member operand; none for empty |
| custom-property | `has-key`, `key-equals`, `key-contains` | Key only or key/value text fields |

Validate finite numbers, real date-only calendar values, ordered range endpoints, nonempty collections, enum membership, and required keys/values. Required empty string is incomplete; whitespace is preserved, not silently trimmed or treated as backend blank semantics. Changing fields resets all dependent state. Changing operators preserves an operand only if type, shape, and option domain match; no-value operators discard obsolete values.

Do not use FV chip-selector's comma-delimited attributes for arbitrary values. Implement the collection editor privately using an array model, sibling remove actions, a Nimble select/add action for enum entries, and text/add action for free entries. Reject empty and duplicate entries; preserve commas and option IDs. No shared component refactor is required.

### Groups and Transactions

Query logic joins all groups; each group's logic joins all rules. No recursion, independent boundary joins, add-group UI, drag/drop, or regrouping in v1. Add uses the configured/default eligible field and first supported operator; it creates a group if empty or appends to the last group. Remove prunes an emptied group. Show boundaries and accessible group names; toggling any displayed shared separator changes all of that group's joins, or all outer joins.

The host keeps a detached applied query and working query. `query-change` updates the working copy without echoing it back unnecessarily. Apply calls `validate()`, blocks invalid drafts, performs domain validation, then translates/submits. Cancel replaces `query` with a clone of the applied query. Selecting a saved filter replaces the working query; persistence and migration of saved records stay host-owned. Do not promise a built-in serializer or application-specific meaning for blank/null, string case, range inclusivity, or timezones.

## Implementation Steps

### 1. Model and First Vertical Slice (implemented)

Add `types.ts`, `index.ts`, `template.ts`, and `styles.ts` under the existing query-builder directory. Follow `FvChipSelector`/`FvBulkEditField` registration conventions. Keep typed state transitions, validation, and formatting private to this module; extract a neighboring internal helper only if it materially simplifies tests/implementation.

Start with one scalar rule: configure fields, add, open, edit, emit, remove, and clear. Reuse the package's existing fixture and async helpers in `tests/query-builder.spec.ts`. Add regression cases for `false`, `0`, missing value, immutable event snapshots, event isolation, and authoritative replacement before adding other operands.

**Gate:** targeted model/element tests pass, constructor works in Chrome/Firefox/WebKit, and package TypeScript compilation succeeds. No query execution occurs.

### 2. Prove Editor and Child Popup Composition (Chrome-verified at 390px; cross-browser follow-up remains)

Use a single active rule ID and shared named nonmodal editor. Start with Nimble anchored-region and existing controls, not a new overlay framework or React dependency. Compose edit/remove as sibling buttons. The anchored-region supplies positioning only; implement outside/focus dismissal and lifecycle cleanup locally.

Verify a real Nimble select inside the editor: selecting an option stays inside; first Escape closes the child, second closes the editor; outside pointer/tab-out preserves destination focus. Re-anchor after wrapping or anchor replacement and reposition after scroll/resize/editor-size changes. Test inside an overflow-constrained drawer, not only an unconstrained canvas.

Done/Escape restore trigger focus; removing a focused rule falls back to next rule, previous rule, then Add. Rapid switching must not restore stale focus. Query replacement, clear, disable, and disconnect close owned popups and release listeners. Coordinate Escape after child handlers and respect `defaultPrevented`.

**Gate:** real keyboard/pointer checks pass in Chrome, Firefox, and WebKit, including clipping/stacking. If anchored-region cannot satisfy the drawer case, evaluate native top-layer popover in a small reversible composition test; do not silently accept clipping or assume native nesting solves library popup ownership.

### 3. Complete Operands, Validation, and Group Rendering (implemented)

Add each matrix row as an editor + validator + summary + tests together. Use Nimble select/text/number controls and supported native date-only input where there is no suitable Nimble date control. Keep current controls stable during input. Collection entry must work from an empty collection and preserve arbitrary commas.

Add group boundaries, shared toggles, empty state, no-eligible-field behavior, disabled state, stale-error handling, and unsupported-data recovery. Hide stale error text as well as error indicators. Show complete summaries on accessible names even when visible text truncates. Avoid exposing unsupported operators.

**Gate:** matrix coverage includes zero-operand completeness, collection negation, custom-property summaries, invalid dates/numbers, reverse ranges, option IDs different from labels, and last-rule pruning. Local/domain invalid drafts remain invalid, not implicitly broadened queries.

### 4. Package and Storybook Integration (implemented; cross-browser drawer and zoom follow-up remains)

Register through [all-fv.ts](../../all-fv.ts), which is already included by [all-components.ts](../../../all-components.ts). Add `fv-query-builder.stories.ts`, `fv-query-builder-matrix.stories.ts`, and `fv-query-builder.mdx` under `packages/storybook/src/ok/fv/query-builder/`, matching the neighboring [FV chip-selector story](../../../../../storybook/src/ok/fv/chip-selector/fv-chip-selector.stories.ts). Reuse theme story helpers, the OK warning, and the zoom-transform workaround for anchored controls. Document imports, labels, property-only data, event payloads, group semantics, and host transaction ownership.

Use the actual six prototype states plus all operand shapes, long/RTL labels, disabled/empty catalogs, unsupported IDs, and host errors. Provide one working drawer example with Apply/Cancel and saved-preset replacement; do not build persistence. Deep-clone fixtures and use a local catalog, not imported Downloads files.

Use Nimble theme/design tokens for all supported themes; no copied Tailwind palette or fixed-width popup. Verify at narrow mobile and desktop widths, zoom/reflow, high contrast, reduced motion, and at least 24px targets or valid spacing. Host labels must be localizable. No Angular/Blazor/React wrappers or native form association are required for this initial editor proposal; document property/event consumption and defer wrappers until a concrete consumer needs them.

**Gate:** stories render without console errors, measured layout has no overlap/clipping, keyboard and screen-reader checks are recorded, and package documentation accurately distinguishes drafts from executable queries.

### 5. Final Verification and Release (verified with one upstream type-check blocker)

Use existing package scripts; no new test runner or dependency is needed:

```sh
npm run build:components -w @ni/ok-components
npx eslint packages/ok-components/src/fv/query-builder packages/ok-components/src/fv/all-fv.ts
npm run test-chrome -w @ni/ok-components
npm run test-firefox -w @ni/ok-components
npm run test-webkit -w @ni/ok-components
npm run build:cem -w @ni/ok-components
npm run build:sb -w @ni-private/storybook
```

All listed component checks pass, and the Beachball minor change entry is present. `npm run build:ts -w @ni-private/storybook` reports only two errors outside the new files: the existing `IconArrowRightArrowLeft` metadata reference and a nullable `groupRow` in the Nimble table page object. The standalone Storybook production build succeeds. Do not commit generated `dist` output or unrelated build cleanup.

## Remaining Integration Inputs

Service owners still supply production fields/options, domain validation, backend translations, and any persistence/versioning policy. UI research cannot determine these business semantics. The basic story has an accessibility-addon pass, and popup bounds were checked at 320px, 360px, and 390px. The drawer and child-select interaction were verified in Chrome at 390px; cross-browser drawer/stacking checks, screen-reader behavior beyond the automated accessibility pass, and zoom geometry remain explicit follow-up gates.