# Query Builder Research

## Scope and Conclusion

This document researches the seven original open questions in <requirements.md>. It does not approve a public API or implement a component. Findings come from static inspection of the supplied prototype, this checkout's component sources, and primary accessibility/platform specifications. The prototype was not run; visual geometry, assistive-technology behavior, and nested popup behavior remain to be tested.

The reviewed requirements and <implementation-plan.md> now select concrete v1 defaults. In particular, they select component-owned immediate edits with immutable notifications, matching local FV precedent, rather than the strict controlled-proposal option discussed below. Treat the tables here as research alternatives and evidence, not a second competing implementation contract.

**Recommendation:** build a small FAST FV query editor with host-supplied fields and query state, explicit operator operand metadata, and one shared nonmodal rule editor. Keep application Apply/Cancel, persistence, and backend query translation outside it. These are proposed defaults, not settled product requirements. Resolve the seven decisions below before freezing types or events.

The largest implementation risks are not chip styling: they are representing incomplete values without losing `false` or `0`, making group precedence visible, supporting the advertised operator arities, and composing editor dismissal with child controls.

## Evidence Sources

### Local Prototype

The following files were inspected under the external directory `/Users/fvisser/Downloads/query builder designs 2/src/app/`. Paths below are relative to that directory, not repository links:

| Source | Evidence used |
| --- | --- |
| `pages/Concept2.tsx` | `formatChipLabel`, `RulePopoverEditor`, `RuleChip`, `Concept2Content`, state initialization, mutations and saved-panel wiring |
| `types.ts` | `FieldType`, `Rule`, `RuleGroup`, `ALL_FIELDS`, `OPERATORS_BY_TYPE`, `ConceptState`, `getPreset`, saved-filter metadata |
| `components/ui.tsx` | Actual imported `NimbleSelect`, `NimbleInput`, `RuleValueInput`, `DrawerShell`, `SavedFiltersPanel` |
| `components/ui/popover.tsx`, `components/ui/select.tsx` | Separate Radix wrappers; their existence does not establish that Concept2 uses the wrapped select |

Concept2 imports `../components/ui`, whose actual controls are in `components/ui.tsx`. Its rule popup uses Radix directly; the styled "Nimble" input/select are native HTML controls, not Nimble web components. Do not infer runtime behavior from the similarly named UI directory.

### Repository Sources

Repository links are relative to this document. Generated declarations are evidence of local artifacts only, not proof of a maintained or published contract. Their paths are shown as text because they are not checked in and may be absent in a clean checkout.

| Source | Relevance |
| --- | --- |
| <requirements.md> | Requested behavior and seven open questions |
| [packages/ok-components/src/fv/all-fv.ts](../../all-fv.ts) | FV registration convention; no query-builder import in the inspected barrel |
| `packages/ok-components/dist/esm/query-builder/index.d.ts` | Locally generated `ok-query-builder` declaration |
| `packages/ok-components/dist/esm/query-builder/types.d.ts` | Different nested query/field/value model |
| [packages/nimble-components/src/chip/index.ts](../../../../../nimble-components/src/chip/index.ts) and [template.ts](../../../../../nimble-components/src/chip/template.ts) | Removal support, but no built-in edit-button interaction |
| [packages/nimble-components/src/anchored-region/index.ts](../../../../../nimble-components/src/anchored-region/index.ts) and [styles.ts](../../../../../nimble-components/src/anchored-region/styles.ts) | Positioning primitive, update/anchor lifecycle and stacking limitations |
| [packages/nimble-components/src/select/index.ts](../../../../../nimble-components/src/select/index.ts) and [template.ts](../../../../../nimble-components/src/select/template.ts) | Keyboard/focus handling and local anchored popup |
| [packages/ok-components/src/fv/chip-selector/index.ts](../../chip-selector/index.ts) and [template.ts](../../chip-selector/template.ts) | Multivalue candidate with CSV-like attributes and composed-path outside-click handling |
| [packages/ok-components/CONTRIBUTING.md](../../../../CONTRIBUTING.md) and [package.json](../../../../package.json) | Package conventions and existing build/test tooling |

### External Primary Sources

- [WAI-ARIA 1.2: dialog](https://www.w3.org/TR/wai-aria-1.2/#dialog), [aria-haspopup](https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup), [aria-invalid](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid), and [aria-errormessage](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage): normative semantics, naming and error relationships.
- [ARIA APG: modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): advisory modal interaction guidance. Its focus trap, inert background and `aria-modal="true"` are not requirements for a nonmodal rule editor.
- [ARIA APG: combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): advisory popup keyboard behavior, including Escape returning to the combobox.
- [WCAG 2.2: Target Size (Minimum)](https://www.w3.org/TR/WCAG22/#target-size-minimum) and [Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 24 by 24 CSS pixel AA minimum or an applicable exception, including spacing.
- [WHATWG HTML: popovers](https://html.spec.whatwg.org/multipage/popover.html): top layer, auto/manual dismissal, nested popover relationships and focus behavior.
- [WHATWG HTML: dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element): nonmodal `show()` versus modal `showModal()` and close-request behavior.

Specifications establish platform/accessibility constraints, not product ownership, backend semantics, or browser support in this repository.

## Prototype Inventory

### Field Catalog

**Observed in `types.ts`:** seven field types and fourteen fields. These are demo data, not an approved service schema.

| Type | Field IDs | Options |
| --- | --- | --- |
| `string` | `name`, `serial`, `description` | Free text |
| `number` | `duration`, `temperature` | No domain bounds or unit contract in the field definition |
| `date` | `started_at`, `updated_at` | Native date input in the demo |
| `boolean` | `passed`, `active` | True / False |
| `enum` | `status` | Passed, Failed, Running, Skipped, Error |
| `enum` | `workspace` | Default, Production, Staging, QA |
| `array` | `tags`, `keywords` | Text entry, not an enumerated option catalog |
| `custom-property` | `custom` | Key and value inputs |

### Operators and Operand Shapes

The operator spellings below are the exact prototype labels, including mathematical symbols. **Observed:** operators are strings with no arity/type metadata; `Rule.value` is `any`. **Recommendation:** use stable operator IDs separate from localized labels and declare operand shape explicitly. The final column proposes semantics; it is not behavior fully implemented by the prototype.

| Field type | Prototype operator labels | Recommended operand contract |
| --- | --- | --- |
| `string` | `equals`, `contains`, `starts with`, `ends with`, `is blank`, `is one of` | One string for ordinary predicates; none for `is blank`; nonempty string collection for `is one of` |
| `number` | `=`, `≠`, `>`, `≥`, `<`, `≤`, `between`, `is empty` | One finite number; two endpoints for `between`; none for `is empty` |
| `date` | `equals`, `before`, `after`, `between`, `is empty` | One date; two endpoints for `between`; none for `is empty` |
| `boolean` | `is` | One explicit boolean, including `false` |
| `enum` | `is`, `is not`, `is any of`, `is none of` | One option ID for `is`/`is not`; nonempty option-ID collection for any/none |
| `array` | `contains`, `does not contain`, `is empty` | One member operand for contains predicates; none for `is empty` |
| `custom-property` | `has key`, `key equals`, `key contains` | Key only for existence; key plus comparison value for the other predicates, pending domain approval |

Field collection type and operand cardinality are different: `tags contains regression` takes one member operand, whereas `status is any of [...]` takes a collection even though status is an enum. A range is an ordered pair, not an arbitrary multiselect.

**Unresolved semantics:** whether blank includes whitespace/null/missing; whether empty means null, absent property or empty collection; string case sensitivity; numeric units/precision; range inclusivity/order; date-only versus timestamp/timezone; custom-property key lookup and value types. No cited source establishes the backend meaning of these labels. Do not infer it from English text or silently translate dates to UTC.

### Actual Value Editors and Gaps

**Observed in `components/ui.tsx` and `RulePopoverEditor`:** value rendering depends on field type and current value shape, not the selected operator. `RuleValueInput` does not receive the operator.

| Editor | Actual behavior | Implementation implication |
| --- | --- | --- |
| Scalar enum | Native select of field options | Reusable interaction pattern, not a Nimble implementation |
| Collection enum | Existing removable chips only | Cannot add an option; an empty array has no entry affordance |
| String | Text input, including after choosing `is one of` | Array is coerced to display text; editing returns a scalar, losing collection shape |
| Number / date | One native number/date input | No two-endpoint editor for `between`; input callbacks return strings |
| Boolean | Select converts value with comparison to `'true'` | Choosing its empty placeholder yields `false`, not absence |
| Array field | Scalar text input | No demonstrated collection operand editor, which is appropriate for member predicates but not a general multivalue implementation |
| Custom property | Key/value object editor | Always shows both inputs, including `has key`; generic chip interpolation produces `[object Object]` |
| No-value operators | Still show a value control | Completeness and summary need arity-aware behavior |

**Observed transitions:** field change selects the first operator for the new field type, resets value to `''`, and clears `hasError` but not `errorMsg`. Operator change recognizes only `is any of`, `is none of`, and `is one of` as multivalue: scalar-to-multi resets to `[]`, array-to-scalar resets to `''`, otherwise it preserves the old value. Operator change does not clear errors. Value edits clear `hasError` but retain `errorMsg`. Done only closes; there is no validation engine.

**Recommendation:** preserve an operand only when old/new contracts are compatible; otherwise reset to an explicit incomplete shape. Field change always resets dependent state. Zero-operand predicates remove obsolete operands. Reset or recompute error visibility and messages together; do not retain stale host errors against a changed rule revision.

### Falsy Values and Completeness

**Observed:** boolean formatting runs before the formatter's missing-value check; the check also explicitly excludes numeric zero. Thus `false` and `0` are not demonstrated formatter bugs. `RuleChip` considers both complete. Do not replace these checks with generic truthiness.

The current completeness test rejects `''`, `null`, and empty arrays, but accepts `undefined` and arbitrary objects. It is not operator-aware. Empty arrays also take the array summary branch without a clear incomplete marker. Array summaries omit the operator, making `is any of` and `is none of` visually indistinguishable for the same field/values.

**Recommended acceptance cases:** explicit `false` and finite `0` are valid scalar values; absent/undefined operands are incomplete where required; `NaN`, infinity, invalid dates, unknown option IDs and malformed key/value objects are invalid. Collection predicates need at least one valid item; ranges need both valid endpoints, including zero where numeric. Zero-operand predicates are complete without a value. Distinguish incomplete drafts from invalid values and from when errors should become visible. Never convert an empty numeric input to zero by coercion.

Summaries should retain field, operator (especially negation), and a type-aware operand description. Truncated collection summaries can show two values plus an additional count, but their accessible name should preserve the full meaning. Unknown field/operator IDs should remain inspectable/removable rather than crash or silently disappear.

### Presets, Shell and Saved Filters

**Observed in `types.ts` and `Concept2Content`:** states are `empty`, `basic`, `multigroup`, `error`, `saved`, and `complex`. There is no `advanced` state despite its mention in the requirements. Switching state remounts the keyed content and resets local state.

| State | Actual initialization |
| --- | --- |
| `empty` | No groups |
| `basic` | One AND group: status any-of Failed/Error; duration > `'500'`; workspace is Production |
| `multigroup` | Basic AND group plus an OR group: tags contains regression; started_at after 2024-01-01 |
| `error` | One AND group: status Failed; duration > empty with `hasError` and "A value is required"; workspace Production |
| `saved` | Basic query with saved-filter panel initially open |
| `complex` | Four-rule AND group (status, duration >1000, workspace, started_at) plus three-rule OR group (tags regression, name contains Integration, temperature >80) |

Outer group logic initializes separately to AND. `getPreset` clones groups/rules and regenerates IDs, but retains array-valued operand references. Future fixtures must not share mutable operand objects/arrays.

The saved catalog contains metadata only: Failed Production Tests (3 rules / 1 group), Long Running (>1 s) (1 / 1), and Recent Regression Failures (4 / 2). It has no saved query payload. `SavedFiltersPanel` supplies an ID to `onLoad`, but Concept2 ignores that ID and only closes the panel. "+ Save current" has no handler. Loading and persistence are not demonstrated capabilities.

`DrawerShell` renders Clear, Cancel and Apply. This corrects the requirements' claim that the concept has no Apply/Cancel action: they are visible, but Cancel has no handler and Apply invokes an optional callback that Concept2 does not supply. They do not establish draft/commit semantics. Clear empties groups only; it does not reset outer logic. Count sums every rule, including incomplete/invalid rules. Shell sizing (440px width, 660px maximum height), page tabs and surrounding app layout are demo scaffolding, not evidence that the reusable component must own a drawer.

### Groups and Rule Lifecycle

**Observed:** add hardcodes field `status`, operator `is`, and `''`; it creates an AND group for an empty query or appends to the last group. It does not explicitly open the new rule's editor. Removal prunes empty groups. There is no add-group action.

Each group has one shared internal AND/OR value; every between-group control shares one outer AND/OR value. These are not independently editable boundaries. The bottom "Group logic" legend says "between groups" while its controls actually mutate each group's internal logic.

Groups render as fragments without visible parentheses/boundaries. A flat display such as `A AND B AND C AND D OR E` does not communicate the stored `(A AND B AND C) AND (D OR E)`. **Recommendation:** preserve explicit group boundaries when wrapping, expose group names/internal logic to assistive technology, and clearly distinguish internal logic from the single outer logic. Do not silently flatten or adopt ordinary textual precedence. More deeply nested or per-boundary expressions require a separate approved model.

Each `RuleChip` owns an independent open boolean. Radix outside interaction may close the previous editor, but the React state model itself does not enforce one-open-editor; static inspection does not prove multiple remain open at runtime. **Recommendation:** one builder-level active rule ID and one editor/anchor, closed when its rule disappears, the query is replaced, the component is disabled, or it disconnects.

## Answers to the Seven Open Questions

Each row separates observed evidence from a proposed default and the remaining decision. None is automatically resolved by the prototype.

| Question | Evidence | Recommended default | Product/owner decision still required |
| --- | --- | --- | --- |
| 1. Public identity and API | Requirements propose FV; inspected FV barrel has no query builder. Local generated declarations describe `ok-query-builder`. | Use `ok-fv-query-builder` and existing FV registration patterns, subject to ownership review. | Confirm whether the generated non-FV API is abandoned, experimental, published, or requires compatibility. Approve tag, exported types and event names. |
| 2. Controlled edits versus draft/Apply | Concept2 changes local groups immediately; shell Apply/Cancel are inert here. | Host-supplied query with immutable change notifications for edits, including incomplete drafts; editor Done/Escape close without rollback. Host owns any transaction/Apply/Cancel. | Approve controlled-update acceptance/rejection timing and event detail. An immutable proposal event is not an executed backend query. Component-owned Apply would require an explicit draft/commit contract instead. |
| 3. Group ownership and logic | Groups come from presets; add appends to the last group; uniform internal/outer joins; no group-creation UI. | Host owns supplied structure; support the specified rule edits/removal and shared join changes, not a recursive expression designer. | Confirm group creation/deletion scope, which group receives a new rule, pruning empty groups, and whether uniform joins are sufficient. Reject/preserve unsupported expressions explicitly, never reinterpret them. |
| 4. Default field | New rules hardcode `status`; field changes choose first compatible operator. | Configured default field, otherwise first eligible field; type/arity-aware empty operand; open new rule editor after host accepts addition. | Approve fallback ordering, no-fields behavior (disable Add), invalid default handling and initial operator selection. Do not bake the demo catalog into the component. |
| 5. Validation contract | Seeded error flag/message; edits clear only part of error state; no validator. | Component derives structural completeness/type validity; host supplies domain/server errors tied to stable rule identity/revision. Show errors on agreed interaction/submission boundary. | Approve timing, error precedence/clearing, async stale-response handling and whether Done can close an incomplete rule. Distinguish visible error state from completeness. |
| 6. Presets and saved filters | Demo presets initialize state; saved records contain metadata, and load merely closes. | Host owns queries, saved records, persistence and shell. If a selector is in scope, emit selected preset ID; host replaces query. | Approve ID-only versus query-bearing load payload, replace versus merge, save scope and count semantics. A production saved filter needs a versioned query contract, not just a name/count. |
| 7. Initial field/operator/value support | Seven demo types; several advertised operators lack usable editors. Generated model differs again. | Host catalog with explicit stable IDs, option values and operand shapes; support only operators with implemented editor/validator/summary behavior. | Approve initial matrix and backend meanings above. Either implement ranges, collections, zero-value and custom-property cases or explicitly exclude them from launch; do not expose nonfunctional operators. |

### Generated API Compatibility Warning

The inspected generated declarations expose `fields`, `query`, `disabled`, `heading`, condition count and Apply/Cancel/Clear handlers, and declare tag `ok-query-builder`. Their model uses lowercase `and`/`or`, field properties such as `dataField`/`filterOperations`/`lookup`, and nested alternating query nodes and joins. Their data types include `list`, `object` and `datetime`, rather than the prototype's exact type set. Condition tuples allow an omitted operand, but the declared value union has no collection value.

These artifacts are not tracked query-builder source evidence in the checked paths. They cannot establish release status, intended ownership or safe compatibility. An adapter may eventually be needed, but copying this contract would not solve the prototype's collection/range requirements. Confirm provenance with the owner before publishing a second API or deleting anything. No cleanup of generated artifacts is proposed here.

**Follow-up Git evidence:** this checkout is on `main` at `b4bd3eddc`. Local commit `b71fd0818` contains `packages/ok-components/src/fv/query-builder/types.ts`; its tuple model matches the limitations above. Commit `a17b43a26` on local branch `users/fvisser/ok-query-builder-review` revises that FV draft and is not an ancestor of current HEAD. Reproduce with `git show b71fd0818:packages/ok-components/src/fv/query-builder/types.ts`, `git show --stat a17b43a26`, and `git merge-base --is-ancestor a17b43a26 HEAD` (exit 1). This establishes a local historical experiment, not a maintained source dependency on current main or proof of release history. The selected plan does not change it or add an adapter.

## Accessible Editor and Overlay Feasibility

### Reuse Assessment

**Observed in repository sources:** Nimble chip has removal and an internal remove button, but no built-in edit activation semantics. Anchored-region extends FAST positioning and does not add a focus/dismissal/dialog lifecycle. It documents calling `update()` when an anchor moves and reassigning `anchorElement` when the anchor is recreated. Its styles use layout containment and z-index 1000; it is not the browser top layer and cannot guarantee escape from clipping/stacking contexts.

**Recommendation:** reuse Nimble inputs/selects/buttons, tokens and icons; compose sibling edit and remove actions instead of placing an interactive removable chip inside a button. Evaluate a non-removable chip as presentation only if the final composition retains appropriate semantics. Do not add a React/Radix dependency just to copy this prototype.

FV chip-selector is a candidate, not a drop-in typed collection editor: `selectedValues` and `options` are comma-separated strings split/trimmed/deduplicated. Values containing commas cannot round-trip as arbitrary string items under that contract. Its template combines combobox/listbox declarations with menu elements, so accessibility suitability also needs verification. Do not broaden that component's API as an unapproved side task; choose a compatible restricted catalog or make a separate reuse decision.

### Recommended Nonmodal Interaction Contract

WAI-ARIA requires a dialog name and recommends a focusable descendant. A rule editor containing several inputs is reasonably modeled as a named nonmodal dialog, not a menu or tooltip. `aria-haspopup="dialog"` must match that role; the trigger should expose expanded state and a valid controls relationship. Verify relationships across the chosen shadow-root boundaries.

1. Activate the edit action with Enter/Space. On opening, focus the first useful editor control; for a newly incomplete rule, normally the field selector. Programmatically associate every visible field/operator/value label with its control. Name close/remove icons explicitly.
2. Permit Tab/Shift+Tab to reach all editor controls and leave the nonmodal editor. Do not trap focus, mark the background inert, or set `aria-modal="true"` unless a genuinely modal design is approved. Define focus-out dismissal after accounting for child popups.
3. Done or editor-level Escape closes and returns focus to its edit trigger. If the rule/trigger was removed, use the next rule, previous rule, or Add action as a deterministic fallback. Closing due to an intentional outside click or tab-out must not steal focus from the destination.
4. Removing a rule must not also open its editor. Removing the active rule, clearing, query replacement, disabling, and disconnection close child overlays and release listeners/references.
5. Present incomplete/error status with text and accessible relationships, not color alone. Associate current error text with the actual invalid input using supported `aria-describedby`/`aria-errormessage` behavior. Avoid announcing a missing required value as invalid before the agreed validation boundary.
6. Measure actual edit/remove hit areas after layout. WCAG 2.2 AA SC 2.5.8 is 24 by 24 CSS pixels or an exception, not a blanket 44px rule. For spacing, centered 24px-diameter circles around undersized targets must not intersect another target or another undersized target's circle. The prototype's nominal `w-4 h-4` adjacent remove action warrants measurement; a small icon alone does not prove failure or compliance.

These are implementation recommendations informed by ARIA/APG, not a claim that a generic APG nonmodal popover pattern supplies all lifecycle behavior.

### Nested Selects, Outside Interaction and Escape

**Observed:** Nimble select renders its anchored listbox within its shadow template using fixed placement and automatic updates. Its open-select Escape branch prevents default, closes and focuses the select, but does not explicitly stop propagation. It also closes on focus-out. FV chip-selector uses a local anchored region, document-click `composedPath()` containment, and an Escape handler that prevents default and closes its popup without an explicit propagation stop. Neither inspected implementation demonstrates a body-portal popup. The separate prototype Radix select wrapper does use a portal, but Concept2's actual value select is native HTML.

**Required implementation checks:**

- Treat the editor, trigger and owned child overlays as inside. Use shadow-aware composed event paths and actual overlay ownership; ordinary `contains(event.target)` is insufficient for retargeted events or a future portaled child. DOM ownership and ARIA ownership are not interchangeable.
- Let the innermost popup consume Escape first. An open child select must close while the rule editor stays open; a later unhandled Escape may close the editor. Handle the parent after child handlers and respect `defaultPrevented`; explicitly coordinate child-open state where event handling alone is insufficient. A document capture handler that closes immediately can defeat this ordering.
- Selecting an option, clicking a child popup, moving focus into it, or interacting with a native picker must not be mistaken for outside interaction. Verify real pointer/focus ordering, including opening another rule, rather than asserting safety from static source.
- Opening another rule should transfer the shared editor once, without restoring focus to the old trigger or letting a delayed close clear the new active ID. Distinguish close reasons.
- Reposition after wrapping, resizing, scrolling and operand/editor size changes. Rebind recreated anchors; handle removed/offscreen anchors predictably. Test clipping and stacking inside a host drawer and Storybook canvas.

### Native Platform Alternative

WHATWG `popover="auto"` offers top-layer rendering, light dismissal and close requests, and preserves nested popover ancestors while closing unrelated auto popovers. It does not automatically provide the editor's appropriate ARIA role or focus the first form control without relevant focus setup. `manual` does not provide auto light-dismiss/close-request behavior. Focus restoration is conditional; do not override outside-user focus changes indiscriminately.

Native popover is a candidate only after browser-matrix and FAST integration checks. Separate library popups do not automatically join the native nested-popover lifecycle. Likewise, `<dialog>.show()` is nonmodal whereas `showModal()` is modal; do not choose the latter merely for convenient dismissal. Living Standard `closedby` behavior is not proof of supported behavior in the repository's browsers. Prefer a focused composition test before committing to native top-layer versus anchored-region infrastructure.

## Research Handoff

The following was the initial research handoff. The actionable sequence and selected interface are in <implementation-plan.md>; no runtime implementation is part of this documentation task.

1. **Approve contracts.** Resolve the seven rows with product/component owners. Record the supported operand matrix, public identity, host transaction boundary and generated-API disposition. Establish query examples that round-trip to the intended backend, including nested-group precedence and custom-property semantics.
2. **Define the smallest typed model.** Separate field/operator IDs and localized labels; distinguish scalar, collection, range, key-only and key/value operands. Define explicit incomplete drafts, stable rule/group IDs, immutable change proposals and validation metadata. Keep transient active-rule/focus state out of serialized queries. Specify host replacement and rejection behavior; do not add a generic expression engine or serializer without a consumer contract.
3. **Implement one vertical slice.** Follow FV conventions under the existing query-builder directory: component class, template, styles and types, with registration through the FV barrel once approved. First cover one group and a scalar rule from add through edit, summary, change event, remove and clear. Validate `false` and `0` alongside missing operands before extending types. Use existing local fixtures/test helpers.
4. **Prove overlay composition early.** Use one active rule and one anchored editor. Test actual Nimble select and the chosen collection control inside it for first/second Escape, option selection, outside interaction, trigger transfer, focus return, removal, scroll/reflow and cleanup. Decide native popover versus anchored-region using that result and the supported browser matrix; do not create a shared overlay framework preemptively.
5. **Complete supported operands and groups.** Add approved collection/range/no-operand/custom editors and matching validators/summaries together. Make group boundaries and shared joins explicit. Preserve supplied ordering; prune groups only under the approved contract. Handle empty catalog, unsupported IDs, disabled state and external query replacement without data loss.
6. **Integrate host surfaces.** Demonstrate a host-owned drawer/Apply/Cancel and preset loading without baking demo persistence/catalog into the control. If Apply is host-owned, it validates/submits the accepted query; editor Done is not Apply. Confirm saved-filter identity/payload and clone nested operands in fixtures.
7. **Add focused tests and stories.** Reuse package Jasmine/Karma patterns and adjacent FV story conventions. Cover six actual demo states, long labels, wrapped groups, all supported operands, errors, disabled/empty catalogs and nested popups. Run focused unit/interaction tests, type/lint gates and Chrome/WebKit checks used by the package; include Firefox where required by the supported matrix. Perform keyboard and screen-reader review rather than treating automated ARIA checks as sufficient.

### Acceptance Matrix for Future Work

| Area | Minimum discriminating cases |
| --- | --- |
| Model | `false`, `0`, empty/undefined/null, finite-number validation, invalid date, empty collection, both range endpoints, key-only versus key/value, zero-operand completeness |
| Mutation | Field reset, compatible/incompatible operator transitions, immutable operands, last-rule pruning, clear semantics, host acceptance/rejection/replacement, stale validation response |
| Meaning | Negated collection summaries differ; custom values are readable; group boundaries match stored expression at narrow width; one shared outer join is not rendered as independent boundary state |
| Editing | Add opens accepted new rule; one editor only; active rule removed; rapid switching; disabled/disconnected cleanup |
| Overlays | Child option click remains inside; child Escape then editor Escape; native picker interaction; outside click/tab-out preserves destination focus; no stale focus restoration |
| Accessibility/layout | Labels and names, keyboard edit/remove, focus fallback, current error association, measured target sizes/spacing, zoom/reflow, scroll/resize, host-drawer clipping and stacking |
| Host integration | Count explicitly means all rules or valid rules; preset replacement works; Apply/Cancel transaction is demonstrated; persistence is not implied by a metadata-only list |

## Limits and Remaining Decisions

Static source inspection supports the behavioral findings, not a runtime accessibility or visual-conformance claim. The prototype's catalog and operator labels do not define server semantics. Generated output cannot settle public API ownership. Browser support for native popover/dialog features and the final nesting behavior have not been verified. The seven defaults are now selected in the reviewed requirements and plan, subject to normal design review; host-specific domain semantics remain integration inputs rather than unanswered UI design questions.
