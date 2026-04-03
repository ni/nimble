# Nimble Table: Selection Follows Focus for Master-Detail HLD

## Problem Statement

The current `nimble-table` behavior intentionally separates keyboard focus movement from row selection. In single selection mode, keyboard users move focus with the arrow keys and then press `Space` to change selection. That matches the current row selection and keyboard navigation HLDs, but it is not a good fit for master-detail workflows where the selected row drives a detail pane and users expect `ArrowUp` / `ArrowDown` to immediately change the current record.

We want to support that master-detail workflow without changing the default behavior of existing tables. The change should therefore be opt-in, should preserve the current general-purpose table interaction model by default, and should only affect the specific keyboard interactions that are valuable for master-detail usage.

## Links To Relevant Work Items and Reference Material

- [Table Row Selection HLD](./table-row-selection.md)
- [Table Keyboard Navigation HLD](./table-keyboard-navigation-hld.md)
- [WAI-ARIA APG: Treegrid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/)
- [WAI-ARIA APG: Deciding When to Make Selection Automatically Follow Focus](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#decidingwhentomakeselectionautomaticallyfollowfocus)

## Implementation / Design

### Goals

- Add an opt-in table behavior that is better suited for master-detail scenarios.
- Preserve the current default behavior for all existing table clients.
- Reuse the existing single-selection infrastructure as much as possible.
- Limit the change to user-initiated keyboard row navigation so that focus restoration, scrolling, and programmatic updates do not unexpectedly change selection.

### Non-goals

- Changing the default semantics of `selection-mode="single"`.
- Introducing selection-follows-focus for multiple selection mode.
- Making selection and focus a hard invariant in every possible code path.
- Changing pointer-based selection behavior.
- Changing grouped row semantics so that group rows become selected simply by receiving focus.

### Summary of Recommendation

Add a new boolean table attribute, `selection-follows-focus`, that is opt-in and only has an effect when `selection-mode` is `single`.

When enabled, any keyboard command in table navigation mode that moves focus to a different selectable data row will also update the table selection to that row and emit the existing `selection-change` event if the selected row actually changed.

This produces the expected master-detail behavior while avoiding a breaking change for current consumers.

### Requirements

#### Functional Requirements

1. The table shall expose a new boolean `selection-follows-focus` attribute.
2. The default value shall be `false`.
3. The feature shall only affect tables whose `selection-mode` is `single`.
4. When `selection-follows-focus` is enabled and a keyboard navigation action moves focus to a different selectable data row, the selected row shall become that focused row.
5. The table shall continue to emit the existing `selection-change` event when selection changes due to this behavior.
6. The table shall not emit `selection-change` if keyboard navigation moves focus to a row that is already the only selected row.
7. The feature shall work when row focus is on the row itself.
8. The feature shall work when row focus is on a cell and vertical keyboard navigation moves to the same column in a different row.
9. The feature shall work for hierarchical parent rows and hierarchical child rows that are selectable data rows.
10. The feature shall not automatically select grouped rows.
11. The feature shall not alter the existing click behavior for single selection.
12. The feature shall not alter the existing action menu behavior beyond using the newly selected row as the current selection when applicable.

#### Navigation Scope Requirements

The feature shall update selection only for keyboard interactions that move focus to a different row in table navigation mode. This includes:

- `ArrowUp`
- `ArrowDown`
- `PageUp`
- `PageDown`
- `Home` when it moves focus to a row
- `End` when it moves focus to a row
- `Ctrl-Home`
- `Ctrl-End`

The feature shall not update selection for keyboard interactions that do not move focus to a different row. This includes:

- `ArrowLeft`
- `ArrowRight`
- `Tab`
- `Shift-Tab`
- `Enter`
- `F2`
- `Ctrl-Enter`

#### Exclusion Requirements

The feature shall not change selection in the following scenarios:

- Initial focus entering the table.
- Focus restoration when the user tabs away from the table and then tabs back.
- Focus restoration after virtualization or scroll-related row recycling.
- Focus changes caused by pointer interaction.
- Programmatic selection changes via `setSelectedRecordIds()`.
- Programmatic focus changes internal to the table.
- Focus landing on column headers or header action elements.
- Focus landing on grouped rows.

#### Compatibility Requirements

1. Existing consumers that do not set `selection-follows-focus` shall see no behavior change.
2. Existing `selection-change` event detail shape shall remain unchanged.
3. Existing `selection-mode="single"` and `selection-mode="multiple"` APIs shall remain unchanged.
4. Existing row selection and keyboard navigation tests shall continue to pass unless they are explicitly updated to cover the new opt-in behavior.

#### Accessibility Requirements

1. The implementation shall preserve the current keyboard navigation model when the new attribute is not enabled.
2. The implementation shall preserve the distinction between focus and selection for multiple selection mode.
3. Documentation shall explicitly state that this mode is intended for master-detail workflows and should be avoided when selection changes trigger slow or disruptive detail loading.

### API Changes

#### New Table Attribute

**`selection-follows-focus`** (boolean):

- **Default**: `false`
- **Supported with**: `selection-mode="single"`
- **Ignored when**: `selection-mode` is `none` or `multiple`

```html
<!-- Existing behavior -->
<nimble-table selection-mode="single"></nimble-table>

<!-- Master-detail behavior -->
<nimble-table
    selection-mode="single"
    selection-follows-focus
></nimble-table>
```

#### Why a Boolean Attribute

A boolean attribute matches the precedent set by `action-menus-preserve-selection` and keeps the feature narrowly scoped. The goal is not to invent a new global selection model; it is to opt a single-select table into a specific master-detail-oriented keyboard behavior.

### Detailed Behavior

#### Single Selection Without `selection-follows-focus`

Behavior remains unchanged:

- Arrow keys move focus.
- `Space` changes selection.
- Click changes selection.

#### Single Selection With `selection-follows-focus`

When enabled:

- Vertical keyboard navigation changes both focus and selection when the target row is a selectable data row.
- `selection-change` is emitted only if the selected row actually changes.
- `Space` retains its existing semantics.

Retaining the existing `Space` semantics means focus and selection can still temporarily diverge in some cases, for example if a user deselects the currently focused row with `Space`. This proposal accepts that limitation because the recommendation is targeted at arrow-key-driven master-detail navigation rather than redefining every aspect of single-selection behavior.

#### Group Rows

Grouped rows remain navigation targets, not selection targets.

- Focusing a grouped row does not change selection.
- Expanding or collapsing a grouped row does not change selection.
- If selection previously referred to a regular data row, that selection remains unchanged while a grouped row is focused.

#### Hierarchical Rows

Hierarchical parent rows and child rows that correspond to real records remain selectable.

- Focusing a hierarchical parent row via keyboard navigation updates selection to that row.
- Focusing a hierarchical child row via keyboard navigation updates selection to that row.

#### Initial Focus and Focus Restoration

The feature does not apply when focus is restored for convenience rather than moved by a user navigation command.

Examples:

- Tabbing into the table.
- Returning focus to the previously focused row after tabbing away and back.
- Re-focusing a row after virtualization changes the visible row elements.

This limitation is intentional. It prevents the table from silently changing selection and firing `selection-change` in scenarios that are not explicit row-navigation commands.

### Architecture Changes

The current architecture separates keyboard navigation from selection logic:

- `KeyboardNavigationManager` decides where focus moves.
- `InteractiveSelectionManager` and the concrete selection managers decide how selection changes.
- `Table` coordinates event emission and external API behavior.

The new feature should preserve that separation.

#### Proposed Internal Responsibilities

**`KeyboardNavigationManager`**

- Remains responsible for deciding when a user-initiated keyboard action moved focus to a different row.
- Invokes a table callback only for qualifying row-navigation actions.
- Does not directly manipulate TanStack selection state.

**`Table`**

- Adds a new boolean property/attribute for `selection-follows-focus`.
- Adds a helper that responds to keyboard row navigation by delegating to the selection manager and emitting `selection-change` if needed.

**`InteractiveSelectionManager` / `SelectionManagerBase`**

- Add a `handleRowFocus()`-style API so selection policy stays in the selection layer rather than being duplicated in keyboard navigation code.
- Respect the new feature only in the single-selection implementation.

**`SingleSelectionManager`**

- Reuse the existing `selectSingleRow()` logic when focus-follow selection is enabled.
- Return `false` when the focused row is already the only selected row.

### Implementation Plan

#### Phase 1: Public API and Documentation

1. Add `@attr({ attribute: 'selection-follows-focus', mode: 'boolean' })` to `Table`.
2. Document the attribute in the relevant table specs and wrapper documentation.
3. Expose the attribute through Angular and Blazor wrappers following the existing table attribute patterns.

#### Phase 2: Selection Manager Plumbing

1. Add a `selectionFollowsFocus` configuration value to `InteractiveSelectionManager`.
2. Propagate the value to the concrete selection manager implementation.
3. Add a new selection-manager entry point for row focus changes, for example `handleRowFocus(rowState)`.
4. Keep the default implementation as a no-op for disabled and multiple selection modes.
5. Implement the single-selection behavior by reusing `selectSingleRow(rowState)` when the feature flag is enabled.

#### Phase 3: Table-Level Coordination

1. Add a table helper dedicated to keyboard-navigation-driven selection updates.
2. That helper shall:
   - Resolve the target `TableRowState` from the row index.
   - Delegate to the selection manager.
   - Emit `selection-change` only when the selection manager reports a real change.
3. This helper shall be the only place where keyboard navigation is allowed to trigger selection changes.

#### Phase 4: Keyboard Navigation Integration

1. Add a dedicated row-navigation helper in `KeyboardNavigationManager` for qualifying user navigation actions.
2. Use that helper from the existing row-changing keyboard paths:
   - `onMoveUp()`
   - `onMoveDown()`
   - Home / End paths that land on a different row
3. Do not hook the behavior into the generic `scrollToAndFocusRow()` path.

This is important because `scrollToAndFocusRow()` is also used for:

- initial default focus
- focus restoration after tabbing back into the table
- focus restoration after virtualizer changes

Hooking into that lower-level helper would make the feature fire in scenarios that are explicitly out of scope.

#### Phase 5: Test Coverage

Add test coverage in the following areas.

**Selection Tests**

- Single selection with `selection-follows-focus` disabled remains unchanged.
- Single selection with `selection-follows-focus` enabled selects the next row on `ArrowDown`.
- Single selection with `selection-follows-focus` enabled selects the previous row on `ArrowUp`.
- Vertical navigation from cell focus updates selection to the row that receives focus.
- `PageUp`, `PageDown`, `Home`, `End`, `Ctrl-Home`, and `Ctrl-End` update selection when they move focus to another row.
- No `selection-change` event is emitted if the target row was already selected.

**Negative Tests**

- Group rows do not become selected when focused.
- Tabbing into the table does not change selection.
- Restoring focus after tabbing away and back does not change selection.
- Pointer interactions continue to use the existing click behavior only.
- `selection-mode="multiple"` ignores `selection-follows-focus`.
- `selection-mode="none"` ignores `selection-follows-focus`.

**Hierarchy / Grouping Tests**

- Hierarchical parent rows can be selected through keyboard focus movement.
- Hierarchical child rows can be selected through keyboard focus movement.
- Group rows remain non-selecting navigation targets.

#### Phase 6: Example and Wrapper Validation

1. Add or update a Storybook example that demonstrates a master-detail-style configuration.
2. Validate Angular and Blazor wrapper support if those wrappers expose row-selection-related table attributes today.

### File-Level Change Plan

The expected implementation will likely touch the following areas:

- `packages/nimble-components/src/table/index.ts`
- `packages/nimble-components/src/table/types.ts` only if additional internal typing is needed
- `packages/nimble-components/src/table/models/interactive-selection-manager.ts`
- `packages/nimble-components/src/table/models/selection-managers/selection-manager-base.ts`
- `packages/nimble-components/src/table/models/selection-managers/single-selection-manager.ts`
- `packages/nimble-components/src/table/models/keyboard-navigation-manager.ts`
- `packages/nimble-components/src/table/tests/table-selection.spec.ts`
- `packages/nimble-components/src/table/tests/table-keyboard-navigation.spec.ts`
- Angular wrapper files under `packages/angular-workspace/nimble-angular/table/` if the wrapper exposes the table attribute surface
- Blazor wrapper files if the wrapper exposes the table attribute surface

### Rollout Considerations

- Because the feature is opt-in, it is safe to ship without a migration requirement.
- Release notes should clearly describe the feature as a master-detail optimization for single-select tables.
- The documentation should advise against enabling the feature when `selection-change` causes slow network-backed detail loading or disruptive UI updates.

## Alternative Implementations / Designs

### Alternative 1: Change Single Selection Globally

Make all single-select tables automatically select the focused row during keyboard navigation.

**Pros**:

- No new API.
- Aligns more closely with the single-select treegrid guidance.

**Cons**:

- Breaking behavior change for existing clients.
- Would cause unexpected `selection-change` events in current apps.
- Could degrade usability in apps where row selection triggers expensive work.

**Rejection Reason**: Too risky as a default behavior change.

### Alternative 2: Add a New `selection-mode` Enum Value

Examples: `single-follow-focus` or `master-detail-single`.

**Pros**:

- Encodes the behavior entirely in one property.
- Makes the mode explicit.

**Cons**:

- Expands a well-understood API with a special-purpose variant.
- Makes the selection-mode enum less orthogonal and more use-case specific.
- Requires touching more type surfaces and wrappers than a boolean opt-in.

**Rejection Reason**: More API churn for a narrower gain.

### Alternative 3: Let Applications Implement It Externally

Applications could listen to focus-related events and then call `setSelectedRecordIds()` themselves.

**Pros**:

- No component API change.

**Cons**:

- The table does not currently expose a clean, stable row-focus-change event tailored for this workflow.
- Consumers would need to reconstruct table row identity from DOM focus behavior.
- Logic would be duplicated across clients and wrappers.

**Rejection Reason**: Pushes component-level behavior complexity onto every consumer.

### Alternative 4: Hook Into Generic Focus Restoration

Update selection from the generic `scrollToAndFocusRow()` helper so every focus change stays synchronized.

**Pros**:

- Central implementation point.

**Cons**:

- Would incorrectly change selection during initial focus, focus restoration, and virtualization-driven focus repair.
- Harder to reason about event emission.

**Rejection Reason**: Too broad. The feature should apply only to explicit row-navigation commands.

## Open Issues

- Whether the public attribute should be named `selection-follows-focus` or something more explicitly keyboard-scoped such as `selection-follows-keyboard-focus`.
- Whether wrapper updates should be part of the initial implementation or a follow-up if the wrappers do not currently mirror the full attribute surface of `nimble-table`.