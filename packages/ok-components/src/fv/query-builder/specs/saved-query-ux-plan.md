# Saved-query and query-builder popover UX

Status: implemented. Nothing here is published, so the legacy grouped-query
contract is removed rather than preserved.

## Reference and scope

Reference: [Figma Make query builder designs](https://www.figma.com/make/lpacC1WyyLJAkQTxLe6pO6/query-builder-designs).
Reviewed the live preview on October 28, 2026, including selecting, editing,
switching, saving, creating, canceling creation, and deleting saved queries.

Update `ok-fv-query-builder` to match this saved-query workflow. Keep
`ok-fv-query-editor` responsible for expression editing, and keep storage,
authorization, and query execution in the host application. Do not copy the
prototype's React components, styling framework, or local-only persistence.

## Observed target behavior

| Surface | Prototype behavior |
| --- | --- |
| Toolbar selector | Shows a fixed **Queries** menu button with a chevron. A dirty indicator appears when the selected saved query has unsaved changes. |
| Queries menu | Working query first, saved names with a selection checkmark and dirty indicators, then Save as new… and Edit saved query. It is a compact selector, not a description/count card list. |
| Selection | Loads the selected working draft into the existing expression editor. Selecting from the dropdown closes it. Switching does not discard unsaved work or require replacement confirmation. |
| Working query | Has its own independent working expression. Switching to a saved query and back restores it. |
| Edit/Create | Opens one anchored popover directly below the Queries menu button. Create and edit views include a name field. Each view shares the existing expression editor and uses an action split button with Cancel beside it. |
| Working-query actions | Apply is primary; Save as new… is in the action menu. Cancel closes without applying and keeps the working draft. |
| Saved-query actions | Save is primary and persists the name and expression before applying. Apply in the action menu applies without saving. Delete and its confirmation are in the action menu. Cancel closes while retaining edits as a working draft. |
| Create saved query | Opens the popover with a focused, initially empty name field. Save is primary and creates then applies the saved query; Apply in the action menu applies without creating a record. Cancel abandons only the proposed creation and restores its source selection. |
| Delete | Requires a delete handler. Confirmed deletion returns to the independent Working query. |
| Apply area | Apply is the primary action in the Working query view and an action-menu item in create/edit views. There is no Clear all footer button. |
| Nigel assistance | An expandable Ask Nigel prompt and generated-query preview appear inside the same popover. The host handles the `query-ai-request` event and supplies any preview; the component does not invoke an AI service. |

Verified that a draft name and changed condition logic survived switching to
another saved query and back. Also verified that Working query retained its own
logic changes independently, saving updated the committed name and cleared dirty
state, and Escape left no newly created record.

The prototype has three initial saved queries. Large collections, persistence
failures, concurrent updates, and footer transaction semantics are not established
by this review. The production recommendations below are explicit additions,
not claims about tested prototype behavior.

## Gaps in the original implementation (resolved)

| Current implementation | Required change |
| --- | --- |
| [Saved menu template](../template.ts) renders name/description/count cards with a Load button and disabled Save current. | Replace with selection rows and functional Save as new/Edit actions. |
| [Builder state](../index.ts) has no active saved-query identity or per-query working copies. | Track Working query separately from each saved record's working draft. |
| `loadSavedQuery` compares against `appliedQuery` and asks for a second click before replacing work. | Preserve outgoing drafts and restore incoming drafts; delete the confirmation path and its labels. |
| [Types](../types.ts) define the two-level `QueryBuilderQuery`; saved records hold that grouped query. | Delete `QueryBuilderQuery` and its helpers; saved records hold a portable `QueryDocument`. |
| Builder binds `legacyFields`/`legacyQuery` and listens to `legacy-query-change`, storing only `detail.query`. | Bind the editor's portable `definition`, `draft`, and `optionResolver`; delete the legacy adapter. |
| [Editor](../../query-editor/index.ts) already exposes portable `definition`, `query`, `draft`, validation issues, and option resolution. | Reuse that contract; it becomes the only one. |
| [Saved-filter story](../../../../../storybook/src/ok/fv/query-builder/fv-query-builder.stories.ts) adds another host dropdown and Apply/Cancel buttons. | Demonstrate the component workflow itself; the host supplies persistence and handles query application. |

### Portable contract only

The grouped `QueryBuilderQuery` can't represent the editor's recursive
`QueryDocument` or unfinished `QueryEditorDraft`, so round-tripping through it
loses work. Nothing is published, so remove the legacy path rather than
maintaining two contracts:

- Builder inputs/outputs and saved records use `QueryBuilderDefinition` and
  `QueryDocument`; working copies are `QueryEditorDraft`.
- Delete `QueryBuilderQuery`, `cloneQuery`/`createEmptyQuery`, the editor's
  `legacyFields`/`legacyQuery`/`legacyDraft` inputs, `legacy-query-change`, and
  the legacy conversion helpers. Update the storybook fixtures and editor tests
  that use them.
- Replace `saved-query-loaded` with the selection ID on `query-apply` (below);
  do not keep compatibility shims.

Do not expand this into unrelated editor or API cleanup.

## State and transaction rules

Keep the state in the builder; no new store or manager component is needed:

- Selected saved-query ID, or no ID for Working query.
- One independent Working query draft.
- A map keyed by saved-query ID containing edited name and editor draft.
- Host-provided committed saved records, plus the applied document and its
  selection ID.
- Whether the Queries menu, editor popover, or Nigel prompt disclosure is open.
- Pending save/delete state and a visible operation error.

Take detached snapshots so editing never mutates host inputs or another query.
Record the outgoing editor draft before switching. Restore the incoming draft
when present, otherwise initialize it from the committed document. Close the
outgoing condition callout on switch.

**Dirty** = the edited name differs from the committed name, or the draft's
tokens and input text differ from the committed document's draft tokens (one
serialized comparison; caret, focus, touched state, and UI IDs excluded).
Editing back to the original clears dirty state. No semantic-equivalence check.

Keep persistence separate from application:

1. **Save:** persist a named query. In create/edit views, apply only after the
   save succeeds. `Save` is disabled when the query cannot be saved.
2. **Apply:** validate and apply the active expression without implicitly
   saving it. `query-apply` detail carries the document and selected saved-query
   ID (`undefined` for Working query).
3. **Cancel:** close without applying and retain existing Working/saved-query
   drafts. In create mode, abandon only the proposed creation and restore its
   source selection.

### Production defaults

- Save requires a non-whitespace name and a complete, valid expression. An empty
  query remains valid.
- Creating from a saved draft copies the active expression without renaming or
  committing the source.
- Cancel/Escape in the create form discards only the proposed creation.
- Cancel keeps existing drafts and does not undo explicit saves or discard
  other saved drafts.
- Confirm deletion inline before requesting it; real deletion is durable. After
  successful deletion of the active record, select Working query without
  altering its draft.
- A host catalog update replaces clean records and keeps dirty drafts by ID.
  <!-- ponytail: dirty-draft-of-deleted-record handling deferred until a host refreshes the catalog mid-edit. -->

## Host persistence boundary

Continue accepting saved records from the host. Add typed async handler
properties, following the editor's existing `optionResolver` precedent:

- `saveHandler(request)` receives a create/update request with a detached
  name/document snapshot and returns the committed record.
- `deleteHandler(id)` resolves after deletion succeeds.

The host owns durable storage, generated IDs, permissions, and catalog updates.

- No storage backend, localStorage, autosave, or repository abstraction in the
  component.
- Missing handlers leave the relevant actions unavailable rather than appearing
  to succeed.
- While an operation is pending, disable the editor, name field, and mutation
  actions. This prevents both duplicate submissions and edits racing the result.
- On success, merge the returned record without clearing unrelated drafts, clear
  that record's dirty state, and announce success.
- On failure, retain the draft and show a localizable error; the action stays
  available for retry. Do not rename, remove, or clear dirty state optimistically.

## Implementation sequence

1. **Switch the builder to the portable contract.**
   Replace builder inputs, events, and saved-record types in [types](../types.ts)
   and [builder logic](../index.ts); bind the editor's portable inputs in the
   [template](../template.ts); delete the legacy adapter in the editor. Update
   fixtures and existing tests. This was completed before the UI change.
2. **Replace the dropdown and add selection.**
   Use Nimble menu-button/menu/menu-item components. Show Working query, saved
   names, selection/dirty indicators, Save as new…, and Edit saved query.
   Replace the second-click load confirmation with draft switching.
3. **Add the unified query popover and explicit commits.**
   Anchor one popover below the Queries menu button and reuse the query editor
   inside it. Implement draft renaming, action split buttons for Apply/Save,
   Cancel, menu Apply/Delete actions, delete confirmation, and pending/error
   feedback. Put Nigel's expandable prompt and generated preview in this same
   popover.
4. **Finish layout, accessibility, examples, and documentation.**
   Use [existing styles and tokens](../styles.ts), not copied prototype colors.
   Keep the selector height-bounded and scrollable; keep the popover usable at
   narrow widths without hiding the editor. Replace the duplicate
   controls in the saved-filter story with an in-memory async host example,
   including a failed-save case.

Give the selector an accessible name, expanded state, controlled popup ID, and
selection indication. Support keyboard navigation and Escape dismissal, move
focus to the creation name field, and restore focus appropriately on close.
Dirty dots need accessible unsaved-change text. Errors must be associated with
their controls and statuses announced without stealing focus. Preserve child
select Escape behavior and disabled-state behavior.

Documentation: update the saved-query/shell sections of
[requirements](./requirements.md) and the
[Storybook documentation](../../../../../storybook/src/ok/fv/query-builder/fv-query-builder.mdx).
Add one-line supersession notes pointing to this plan in
[UX requirements section 14](./UX_REQUIREMENTS_NIMBLE_CHIP_QUERY_BUILDER.md) and
the [implementation plan](./implementation-plan.md) instead of rewriting them.
Leave the [API research note](./query-builder-api-reference.md) alone.

## Verification

Extend the existing [Jasmine builder tests](../tests/query-builder.spec.ts):

- Working query and two saved drafts round-trip independently across switches,
  including a rename, nested groups, and a partially typed clause.
- Selection and Cancel never save or apply; Apply carries the selected ID and
  does not save.
- Saved-query Save is disabled when clean, enabled after edits, and clean again
  after reverting or a successful save.
- The Working query action menu exposes Save as new… when creation is enabled.
- The edit pane enables Delete with a delete handler and Save only for a valid
  dirty draft with a save handler.
- A failed save keeps the draft and dirty state; retry succeeds.
- Delete confirmation can be canceled; confirmed deletion of the active record
  selects Working query.

Run focused builder tests through VS Code test discovery, then:

```sh
npm run build:components -w @ni/ok-components
npm exec -w @ni/ok-components -- eslint src/fv/query-builder src/fv/query-editor
npm run test-chrome -w @ni/ok-components
```

WebKit/Firefox run in CI. Manually check the toolbar and popover in Storybook at
desktop and 320px, keyboard-only, RTL, and with 12+ records.

## Deliberately excluded

No autosave, search, pagination, additional manager surfaces, new dependencies,
backend implementation, cross-session draft storage, framework-wrapper work,
legacy-contract compatibility, name-uniqueness rules, or semantic expression
comparison. Add collection search only when saved-query volume makes bounded
scrolling insufficient.
