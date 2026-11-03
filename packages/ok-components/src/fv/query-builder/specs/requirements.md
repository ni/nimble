# OK FV Query Builder Requirements

## Purpose

Provide a compact query toolbar with a menu-anchored editor popover for structured filters. Users should be able to scan the active rules, change a rule without leaving the list, combine rules with AND/OR logic, and add or remove rules.

This document records the requirements and implementation decisions for `ok-fv-query-builder`, informed by the supplied Concept2 React prototype. The component uses the package's `ok-fv-*` naming. See <research.md> for prototype research and <implementation-plan.md> for the original delivery record.

## Scope

### In scope

- An ordered row of editable rule chips, logical-operator controls, and an add-filter action.
- A rule editor opened from a chip, with field, operator, and type-appropriate value controls.
- Grouped rules, validation presentation, an empty state, and rule-count/clear integration.
- A query data contract that a host application can read and update.
- A ghost **Queries** split-button whose primary action opens a query-only popover without the name field or Save/Delete actions. Its secondary action retains the saved-query menu for switching queries and opening full create/edit workflows with naming and persistence actions. Both popover modes share the active working draft.
- The Queries split-button label reads **Query** when Working query is selected, or the selected saved-query name otherwise. The menu identifies the unsaved workspace as **Working query**.
- Descriptive popover titles: **Configure query**, **Create saved query**, and **Edit saved query**.
- An expandable Nigel prompt and generated-query preview inside the editor popover; the host handles AI requests.
- A footer action split button in each editor view, with the primary action first in keyboard order and **Cancel** as the adjacent secondary action. The Working query view uses **Apply** as primary and **Save as new…** in the menu. Create and saved-query edit views use **Save** as primary and **Apply** in the menu; saved-query edit also offers **Delete** in the menu.

### Host-owned services and page layout

Concept2 places the editor inside `ConceptLayout` and `DrawerShell`. The reusable component owns its **Queries** menu, anchored editor popover, and working drafts; the host supplies the saved-query catalog and asynchronous persistence handlers. The host still owns surrounding page/drawer layout, durable storage, authorization, and query execution.

**Apply** validates the active expression, emits `query-apply`, and closes the popover without saving; the host decides how to execute the query. In create and saved-query edit views, **Save** persists the query and applies it only after persistence succeeds. The menu's **Apply** action applies the draft without saving. **Save as new…** is available from the Working query view's action menu. **Cancel** closes the editor while keeping the active draft; in create mode it abandons the new-query form and restores its source selection. Saved-query **Delete** and its confirmation are in the action menu. Nigel assistance uses `spright-chat-input` and emits `query-ai-request`; the component does not call an AI service. The editor's Done action only dismisses its rule editor.

### Non-goals

- Executing a query against records or a data service.
- Owning the application's field catalog, presets, saved-filter persistence, or drawer/page layout.
- Providing a general-purpose visual query language beyond the configured fields and operators.
- Porting React, Tailwind, or Radix UI code into the FAST-based `ok-components` package.

## Functional Requirements

### Rules and groups

1. Render configured rules in their query order as compact chips. Each chip identifies its field, operator, and current value.
2. Render boolean values as readable True/False text. Render multi-values as a short summary (up to two values and a remaining-item count), retaining the operator and its negation. Render custom-property and range operands explicitly, never by generic object interpolation. Render a required missing operand as incomplete; zero-operand predicates are complete without a value. Explicit `false` and numeric zero are valid operands.
3. Represent a query as an ordered recursive document of predicates and AND/OR groups. Visible group boundaries must survive wrapping so nested expression meaning remains unambiguous. Limit grouping depth to the editor's supported maximum.
4. Allow the user to toggle group logic and query logic. Every separator for the same shared operator updates together; separators are not independent joins. Omit the prototype's misleading bottom logic legend.
5. Adding a rule to an empty query creates a group and a blank rule. Otherwise, add the new rule to the last group.
6. Removing a rule removes its chip. Remove a group when it has no rules. When the last rule is removed, show the empty state.
7. Provide an empty state with a clear indication that there are no active filters and an action to add the first filter.

### Rule editing

8. Activating a rule chip opens an anchored editor containing field, operator, and value controls. At most one rule editor is open. The editor can be dismissed with its close/Done controls, Escape, outside interaction, or focus leaving its owned controls. None of these actions rolls back edits. Opening a different rule transfers the editor without restoring focus to the previous trigger.
9. The field control lists the configured fields. Changing fields selects a valid default operator for the new field, clears the prior value, and clears any prior validation error.
10. The operator control lists only operators valid for the selected field.
11. Select the value control from the field type and the operator's explicit operand shape: none, scalar, collection, range, key, or key/value. Preserve an operand only when the field and operand contract remain compatible. Otherwise reset it to an incomplete value of the new shape. A no-value operator removes the old operand and hides value controls.
12. Incomplete rules remain editable and visually distinguishable from complete rules. Invalid rules show an error indicator and the associated validation message in the editor.
13. Derive completeness and structural validity locally. Show local errors after leaving an edited control or a host validation request. Done may close an incomplete rule. Invalid or incomplete drafts never produce an executable query.

### Host integration

14. The host can determine the number of rules and clear the active query through the component API. Clearing returns the editor to its empty state; there is no Clear all button in the editor footer.
15. Initial query, definition, and saved-query catalog are supplied by the host. Concept2's `empty`, `basic`, `multigroup`, `error`, `saved`, and `complex` page states are demonstrations, not intrinsic editor modes.

## Data Requirements

The component uses `QueryBuilderDefinition` for stable field IDs, JSON Pointer paths, value schemas, operator IDs, and optional editor configuration. Operators declare their operand schema; localized labels remain independent of serialized IDs. Fields with finite choices encode stable values and display titles in their JSON Schema.

The active expression uses a versioned recursive `QueryDocument` containing predicates and groups. Editable and incomplete state is represented separately by `QueryEditorDraft`; it is never silently coerced into an executable document.

Validation issues, caret position, and active editor state are not part of the executable document. Saved records contain a stable ID, name, and query document; the host owns persistence and catalog updates.

## Interaction and Accessibility Requirements

- Rule chips, remove actions, separator toggles, field/operator selectors, and add-filter actions must be operable by keyboard as well as pointer/touch.
- In the query popover, the action split button's primary action is the next footer tab stop after the query conditions. Its menu toggle and the **Cancel** button follow it.
- Each icon-only action must have an accessible name. Field, operator, and value controls must have programmatic labels.
- Use a named nonmodal dialog for the multi-control editor. Opening focuses its first useful control; Done or editor-level Escape returns focus to the chip. Outside-click and tab-out dismissal preserve destination focus. Do not trap focus or set `aria-modal`. A child select consumes the first Escape; only a subsequent unhandled Escape dismisses the editor.
- Validation text must be associated with the relevant value control and exposed to assistive technology.
- The chip row must wrap or otherwise remain usable at narrow widths. The anchored editor must remain reachable when viewport space is constrained.
- Visual distinctions for open, incomplete, invalid, and complete rules must not rely on color alone.
- Use separate sibling edit/remove buttons, not nested interactive controls. Target sizes must meet WCAG 2.2 AA's 24px minimum or an applicable spacing exception. Use theme tokens, RTL-compatible layout, and localizable labels rather than copying the prototype's colors, tiny targets, and fixed popup width.

## Repository Fit

Implement as a FAST-based component in `packages/ok-components/src/fv/`, registered with the `ok` prefix and exported through the FV component barrel. Reuse Nimble controls, icons, design tokens, and the existing test fixture patterns where suitable.

The supplied prototype uses React and Radix popovers and should be treated as behavioral/visual reference only. The current FV source barrel has no query-builder component. Generated `ok-query-builder` declarations and local historical commits are not a source contract for this component. Do not import from those generated artifacts, alter them, or add a compatibility adapter without an actual consumer requirement.

## Acceptance Criteria

- With no query, the component shows the empty state; adding the first rule creates a visible incomplete chip and opens or makes its editor readily available.
- A configured query renders all rules and group logic in the supplied order, and chip summaries match their field/operator/value state.
- Editing a field updates its available operators, resets incompatible state, and uses the correct value editor for the new field/operator.
- Scalar and multi-value operator transitions produce the expected value shape; validation errors are visible and clear when the value is edited.
- Toggling a separator changes the corresponding query logic; adding/removing rules updates the rule count and removes empty groups.
- Clearing the query returns to the empty state. All editing and removal actions work by keyboard, and focus is managed when the popover opens and closes.
- Tests cover empty, single-rule, multi-rule, multi-group, incomplete, invalid, field-change, operator-change, multi-value, add, remove, clear, and keyboard interaction cases.

## V1 Decisions

1. **Identity:** `FvQueryBuilder`, tag `ok-fv-query-builder`, export `fvQueryBuilderTag`, source under `src/fv/query-builder`. No coupling to the generated non-FV builder.
2. **Editing:** The builder owns independent Current-query and saved-query working drafts and emits immutable change snapshots. Host property replacement is authoritative and does not emit an edit event. Apply validates and emits a transaction event; the host owns query execution.
3. **Groups:** Use the portable recursive document and editor-supported nesting limit. Preserve group order and combinators; do not reinterpret unsupported expressions.
4. **Defaults:** Optional `default-field` selects an eligible field; otherwise use the first eligible configured field and its first supported operator. Invalid explicit defaults or no eligible fields disable Add with an accessible explanation. Add opens the new rule's editor. Do not hardcode `status`.
5. **Validation:** Local schema, operand, and structural validation. Expose a synchronous `validate()` method to reveal errors and return validity. Empty query means no filtering and is valid; rule counts include drafts.
6. **Saved queries:** The host supplies records and async save/delete handlers. Selection preserves each working draft. Save commits and applies only after persistence succeeds; Apply carries the selected ID without saving. Storage and catalog ownership remain with the host.
7. **Operands:** Use the portable operator schema contract for no-value, scalar, list, range, and structured JSON values. Only supported field/operator combinations are offered. Keep backend semantics and translation host-owned.

## Integration Limits

Case sensitivity, null/missing semantics, units, timezone conversion, and backend translation cannot be established by UI research. Hosts must map operator IDs to their service contract and must not execute invalid drafts. Hosts also own durable saved-query persistence and must reject stale or unauthorized mutations as appropriate.