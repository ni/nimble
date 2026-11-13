# Query Builder High-Level Design

## Problem Statement

Applications need a reusable editor for structured filters, including
incomplete expressions, without coupling the UI to a particular backend.
The FV query builder adds saved-query and apply workflows around that editor;
the host retains control of persistence, execution, authorization, and AI.

## Links To Relevant Work Items and Reference Material

- [Interaction design](./IxD.md)
- [Definition JSON Schema](./standalone-query-builder-definition.schema.json)
- [Query document JSON Schema](./standalone-query-document.schema.json)
- [Query builder Storybook documentation](../../../../../storybook/src/ok/fv/query-builder/fv-query-builder.mdx)
- [Query editor Storybook documentation](../../../../../storybook/src/ok/fv/query-editor/fv-query-editor.mdx)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
- [JSON Pointer, RFC 6901](https://www.rfc-editor.org/rfc/rfc6901)

## Implementation / Design

### Component boundaries

`ok-fv-query-editor` owns expression editing, validation, condition controls,
and option resolution. It can be used without the builder. The
`ok-fv-query-builder` composes it with the Queries menu, working and saved
drafts, Apply/Save actions, optional Nigel prompt, and modal deletion
confirmation. Both are FAST web components. Their public usage and events are
documented in Storybook.

The host supplies the definition, current query, saved-query catalog,
localized labels, and optional resolver and persistence handlers. It maps
field and operator IDs to backend semantics, validates authorization and
eligibility on the server, translates and executes queries, and owns storage.
The builder emits Nigel requests and accepts a preview; it does not call an AI
service. No Angular adapter or legacy query-format adapter is provided.

### Portable contracts

`QueryBuilderDefinition` is versioned JSON describing fields and operators.
A field has a stable ID, JSON Pointer path, label, value schema, operator
allowlist, and optional editor. An operator has an ID, label, operand
definition, and optional editor. Operator IDs are opaque to the components;
their backend meaning, including null, string matching, and time-zone
semantics, belongs to the host. Keep IDs stable for saved queries; labels can
be localized independently.

Operand kinds are `none`, `field-value`, `field-value-list`, `range`, and
`schema`. An operator's editor overrides the field editor; `auto` requests
schema inference. Supported controls include text, number, boolean, date,
datetime, select, combobox, range, and key-value. Static primitive choices
can be supplied through schema `oneOf` entries with `const` and `title`, or
an `enum`; dynamic sources are configured separately. Unsupported editor and
schema combinations are reported rather than silently rendered as text.
Date-only values use the FV date-time picker; offset-bearing datetime values
remain text so their offset is not converted to local wall time.

`QueryDocument` is a versioned tree with an empty `root: null`, a predicate,
or a group of at least two children joined by `and` or `or`. Predicates carry
field and operator IDs and, except for unary operands, a JSON value. Groups
provide explicit scope instead of implicit mixed-operator precedence; nesting
is limited by `MAX_QUERY_GROUP_DEPTH` (four). JSON values preserve types,
including zero, false, empty strings, and explicit null when allowed.

`QueryEditorDraft` is a separate versioned token sequence with a caret
position, input text, stable local token IDs, and optional raw input buffers.
It preserves incomplete or invalid work and is not an executable query. Raw
buffers take precedence over previously parsed values when validating.
Programmatic query and draft assignments are authoritative snapshots; a
malformed assignment is rejected with issues instead of silently clearing the
editor. A shape-valid but semantically invalid query can remain inspectable.

### Validation and events

`validateDefinition` and `validateQuery` validate untrusted data and return
structured issues. The standalone schemas describe the serialized shapes;
runtime validation additionally checks definition-dependent field/operator
compatibility, operands, group depth, and other constraints. JSON Schema
Draft 2020-12 fragments are interpreted with locally registered standard
meta-schemas; nonlocal schema references are rejected. Validation does not
fetch schemas or make option requests.

On user edits, `query-change` carries a detached draft, condition count,
validity, and issues. It includes a validated document only when the draft is
valid; otherwise the event's query is `null`. Programmatic writes do not emit
`query-change`. The last valid query property must not be used as permission
to apply an invalid current draft. Definition and validity issues are exposed
separately from option-loading state and errors.

### Dynamic options

An editor's `optionsSource` names a host-defined source and can specify
context dependencies, search, and page size. The host implements
`QueryOptionResolver.resolve(request, signal)`, returning typed values, labels,
disabled states, and an optional cursor. Dependencies are taken from the
host-provided `optionContext`, not inferred from query predicates. Missing
context or resolver, failed requests, and invalid responses produce explicit
option issues. Searchable collection sources filter remotely; nonsearchable
sources use local label filtering.

Requests are canceled and invalidated when their context changes or the
editor closes; late responses cannot overwrite current state. Paging and
search preserve selected values. An unavailable option service does not
invalidate an otherwise schema-valid saved query, and the host must still
check eligibility before execution.

### Builder state and persistence

The builder tracks working drafts independently of the applied document and
reconciles them with host catalog updates. Selecting a valid draft applies it;
invalid drafts remain editable. Host removal of a dirty saved record preserves
its edits as an unsaved draft. Save and delete handlers return promises; errors
are surfaced and pending work is retained. Save applies only after persistence
succeeds, while Apply does not persist. Delete requires modal confirmation.
Feature flags control Nigel and each saved-query capability independently.

### Testing and documentation

Component tests cover contract validation, editor and builder behavior, and
error handling. Storybook provides configurable examples and Chromatic matrix
stories across themes, including editor and menu states. The documented
`test-query-stories.mjs` browser checks exercise the stories and interactions
in Chromium or WebKit. User-facing setup and API examples remain in the
Storybook documentation linked above.

## Alternative Implementations / Designs

- A backend-specific filter object would couple the editor to one service;
  the versioned document keeps translation at the host boundary.
- A document alone cannot represent unfinished input without losing work or
  exposing invalid data as executable. A separate draft retains that state.
- Inline deletion confirmation inside the action menu obscures a destructive
  workflow; a regular modal dialog provides a distinct confirmation step.
- An Angular wrapper was considered but is not implemented; applications use
  the web component and their own integration as needed.
