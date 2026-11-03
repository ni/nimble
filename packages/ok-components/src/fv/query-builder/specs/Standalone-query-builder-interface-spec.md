# Standalone query builder module interface specification

[[_TOC_]]

## Status and scope

**Status:** Draft, version 1

This specification defines a portable configuration and value contract for a
reusable query builder, plus an Angular standalone component adapter. The
serialized contracts are framework-independent and can be copied into another
repository without Skyline-specific packages, services, query formats, or UI
libraries.

The query builder module owns field/operator presentation, editing, local
validation, and query-tree construction. The host application owns its domain
data, dynamic option retrieval, authorization, and translation of the query tree
into backend-specific requests.

The portable contract and validation module has no FAST, Nimble, or Angular
dependency. The existing FAST query editor adopts it directly; the Angular
adapter below is a separate, deferred consumer, not a rewrite requirement.
The [query-editor adoption plan](./query-editor-interface-plan.md) records the
implementation sequence and editor-specific draft contract.

The machine-readable schemas are:

- [Configuration schema](./standalone-query-builder-definition.schema.json)
- [Query document schema](./standalone-query-document.schema.json)

## Design principles

- Keep the public interface small: a versioned definition, a versioned query
  document, and one option-resolution port for fields with dynamic options.
- Keep configuration serializable. Configuration may name a built-in editor or
  option source, but must not contain functions, closures, arbitrary URLs, or
  backend expression templates.
- Keep JSON Schema responsible for field value shape and constraints. Store
  operator semantics and presentation metadata in the query-builder
  configuration.
- Keep the query document independent from both the UI and backend query
  language. Use an adapter in the host repository for backend translation.
- Make the seam testable: the host supplies an option resolver; tests can
  provide an in-memory adapter.

## Public contracts

### Definition

The configuration is JSON data with a top-level `version`, `fields`, and
`operators`. The JSON Schema file defines the exact structure and rejects
unknown properties.

```typescript
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonSchema202012 = boolean | { [keyword: string]: JsonValue };

type OperandDefinition =
  | { kind: "none" }
  | { kind: "field-value" }
  | { kind: "field-value-list"; minItems?: number }
  | { kind: "range"; endpointSchema: JsonSchema202012 }
  | { kind: "schema"; schema: JsonSchema202012 };

interface QueryBuilderDefinition {
  version: 1;
  fields: FieldDefinition[];
  operators: OperatorDefinition[];
}

interface FieldDefinition {
  id: string;
  path: string;
  label: string;
  valueSchema: JsonSchema202012;
  operatorIds: string[];
  editor?: EditorDefinition;
}

interface OperatorDefinition {
  id: string;
  label: string;
  operand: OperandDefinition;
  editor?: EditorDefinition;
}

type EditorDefinition =
  | { kind: "auto" }
  | {
      kind: "text" | "number" | "boolean" | "date" | "datetime" | "range" | "key-value";
    }
  | {
      kind: "select" | "combobox";
      optionsSource?: OptionSourceDefinition;
    };

interface OptionSourceDefinition {
  sourceId: string;
  dependsOn?: string[];
  searchable?: boolean;
  pageSize?: number;
}

type QueryBuilderIssueCode =
  | "unsupported-version"
  | "invalid-definition"
  | "invalid-query"
  | "duplicate-id"
  | "invalid-field-path"
  | "unknown-field"
  | "unknown-operator"
  | "unsupported-operator"
  | "invalid-schema"
  | "invalid-value"
  | "invalid-editor-options"
  | "unsupported-editor"
  | "incomplete-expression"
  | "missing-option-resolver"
  | "missing-option-context"
  | "unknown-option-source"
  | "options-load-failed";

interface QueryBuilderIssue {
  code: QueryBuilderIssueCode;
  target: "definition" | "query" | "draft" | "options";
  path: string;
  message: string;
}

type ValidationResult<T> =
  | { valid: true; value: T; issues: [] }
  | { valid: false; issues: QueryBuilderIssue[] };
```

`JsonSchema202012` is an extensible JSON object (or boolean schema) using the
[JSON Schema Draft 2020-12 dialect](https://json-schema.org/draft/2020-12/json-schema-core).
Meta-validate it against that dialect before use. The module should interpret
only standard keywords it supports for choosing editors; validation semantics
come from a JSON Schema validator, not a TypeScript cast. The validator must not
fetch arbitrary remote references from a field schema. Version 1 accepts local
fragment references within each supplied schema, resolved without network access.
External references are rejected; trusted external-schema registration is deferred
until a consumer needs it. Do not silently ignore unresolved references.

The module asserts supported standard formats in field and operand validation,
including real calendar dates for `date` and a required offset for `date-time`.
Unknown formats remain annotations. This is an explicit module policy:
the `format` keyword is otherwise an annotation by default
([JSON Schema Validation, §7.2](https://json-schema.org/draft/2020-12/json-schema-validation#section-7.2)).

`id` is a stable machine identifier, unique within its collection. `label` is
display text supplied by the host in the user's locale. `path` is a
[JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901) into a record; it is not
a display label or an expression in the backend query language.

All public JSON values must be finite, acyclic JSON data, not JavaScript
objects with functions, undefined members, or non-finite numbers. JSON value
equality preserves type (`1` differs from `"1"`), compares arrays in order,
and compares object members independent of key order. Use this same equality
for list uniqueness, option identity, and schema `const`/`enum` matching.

Each field lists the operators that are valid for it. Each operator defines the
shape of its input:

- `none`: unary operator; the predicate must not contain a `value`.
- `field-value`: one value validated against the field's `valueSchema`.
- `field-value-list`: a non-empty list of values, each validated against the
  field's `valueSchema`. `minItems` defaults to 1. This supports membership
  operators without changing the field's own type. Values must be unique by
  JSON value equality.
- `range`: exactly `{ start, end }`, with both endpoints required and validated
  against `endpointSchema`. Version 1 supports non-null number/integer or
  date-only string endpoints and additionally enforces `start <= end`.
  Numeric endpoints are finite numbers; dates compare as validated ISO
  `YYYY-MM-DD` strings. Datetime ranges are not supported in version 1.
- `schema`: an operator-specific value validated against the supplied schema.

For array-member predicates, use a `schema` operand describing the item, not
`field-value`, which validates the entire array. If fields need different item
schemas, configure distinct operator IDs. The module never infers semantics
from an operator ID.

### Editor selection and supported shapes

Resolve the editor independently for every allowed field/operator pair:
operator editor overrides field editor, then schema inference applies. An
explicit `auto` at either level requests inference and does not fall through
to the next override. Unary operators render no input and ignore field editor
hints; an operator-level non-auto editor on a unary operator is invalid.

The effective schema is the field schema for `field-value`, the per-item field
schema for `field-value-list`, `endpointSchema` for `range`, and the operator
schema for `schema`. Lists repeat the inferred/selected scalar control; a
select becomes a multiselect. Without an explicit non-auto hint, the range
operand infers the range editor and its two endpoint controls. An explicit
non-range hint on a range operand is incompatible; put `{ kind: "range" }`
on the operator to override a scalar field editor.

Inference supports direct primitive `type`, an optional null in a type union,
string `format: date`/`date-time`, and primitive `oneOf` choices with `const`
and `title`. A local `$ref` may be followed to those shapes. An integer uses
the number editor with integer validation. Static choices take precedence over
primitive inference. A primitive `enum` also infers select, using JSON text
as its fallback labels. Nullable scalar editors expose an explicit null choice,
separate from missing input; selecting it writes JSON null.

Version 1 does not infer general object/array forms, arbitrary unions, or
composition through `allOf`/conditional schemas. An explicit editor may be used
with constraints on a supported direct shape; constraints still validate.
Boolean schemas are valid JSON Schemas but cannot identify a non-unary editor.
Reject unsupported or incompatible field/operator/editor combinations as
`unsupported-editor` at configuration time; never fall back to a text box.
Value-only validation may accept JSON shapes that the editing module rejects.

The built-in editors accept these shapes:

| Editor | Shape |
| --- | --- |
| text | String; empty string is allowed unless the schema forbids it |
| number | Finite number/integer; retain raw invalid text only in the draft |
| boolean | Boolean; no coercion from strings |
| date | Date-only string with asserted `date` format |
| datetime | Offset-bearing string with asserted `date-time` format |
| select | Primitive choices from one static source or one dynamic source |
| combobox | Non-null string schema and dynamic source, no static enum/choices; custom strings remain schema-validated |
| range | Range operand with supported endpoint schema; cannot be used with `schema` operands |
| key-value | `schema` operand with object type, exactly required string properties `key` and `value`, `additionalProperties: false` |

Use a text/schema operand for a key-only predicate; constrain the key with
`minLength`/`pattern` as required by the host. A key-value editor validates both
properties against their schemas. It is explicit, never inferred.

The datetime control edits the offset-bearing string without local-time
conversion or truncation. Preserve its offset on load/save and reject a
timezone-less local timestamp. A plain text control with validation is
acceptable; a timezone-assuming `datetime-local` conversion is not.
Backend interpretation of timestamps remains the host's responsibility.

Configuration cannot introduce executable renderer code. Arbitrary JSON
objects/arrays remain possible in the document format, not a promise of
arbitrary form rendering.

### Static and dynamic options

Static, labeled choices belong in the field's JSON Schema as `oneOf` branches
with `const` values and `title` labels:

```json
{
  "oneOf": [
    { "const": "ready", "title": "Ready" },
    { "const": "failed", "title": "Failed" }
  ]
}
```

An editor can infer these values when `kind` is `select` or `combobox`. This
follows the schema-native pattern described in the
[OpenAPI 3.1.1 Schema Object](https://spec.openapis.org/oas/v3.1.1.html#schema-object).
For this inference, every `oneOf` branch must have a primitive `const` and a
non-empty `title`. Values must be distinct by JSON value equality, not label.
Duplicate labels are allowed. Plain primitive `enum` choices are also supported.

Static choices and a dynamic `optionsSource` are mutually exclusive on an
effective operand schema. Reject the combination as `invalid-editor-options`.
The following example uses static and dynamic sources on different fields,
not merged sources on one field. Static select values are constrained by their
schema. A dynamic select only permits newly choosing returned enabled options;
an existing schema-valid selection is retained even when absent from a page.
A combobox permits custom strings that satisfy its schema.

The following configuration combines static and dynamic choices. The query
builder treats the operator IDs as opaque identifiers and returns them in the
query document:

```json
{
  "version": 1,
  "fields": [
    {
      "id": "status",
      "path": "/status",
      "label": "Status",
      "valueSchema": {
        "oneOf": [
          { "const": "ready", "title": "Ready" },
          { "const": "failed", "title": "Failed" }
        ]
      },
      "operatorIds": ["eq", "in"],
      "editor": { "kind": "select" }
    },
    {
      "id": "partNumber",
      "path": "/partNumber",
      "label": "Part number",
      "valueSchema": { "type": "string" },
      "operatorIds": ["eq", "contains"],
      "editor": {
        "kind": "combobox",
        "optionsSource": {
          "sourceId": "inventory.part-numbers",
          "searchable": true
        }
      }
    }
  ],
  "operators": [
    {
      "id": "eq",
      "label": "Equals",
      "operand": { "kind": "field-value" }
    },
    {
      "id": "in",
      "label": "Is one of",
      "operand": { "kind": "field-value-list", "minItems": 1 }
    },
    {
      "id": "contains",
      "label": "Contains",
      "operand": {
        "kind": "schema",
        "schema": { "type": "string", "minLength": 1 }
      }
    }
  ]
}
```

For dynamic options, the field schema describes the value type and the editor
names a `sourceId`. The module resolves that identifier through the option
resolver port; the configuration does not carry an endpoint or callback. Values
from an option source must preserve their JSON value type. The label is
presentation only and must not be serialized as the predicate value.

```typescript
interface QueryOption {
  value: JsonPrimitive;
  label: string;
  disabled?: boolean;
}

interface QueryOptionPage {
  options: QueryOption[];
  nextCursor?: string;
}

interface QueryOptionRequest {
  sourceId: string;
  fieldId: string;
  operatorId: string;
  dependentValues: Readonly<Record<string, JsonValue>>;
  searchText?: string;
  cursor?: string;
  pageSize?: number;
}

interface QueryOptionResolver {
  resolve(
    request: QueryOptionRequest,
    signal: AbortSignal,
  ): Promise<QueryOptionPage>;
}

interface QueryOptionFailure {
  code: "unknown-option-source" | "options-load-failed";
  message: string;
}

type QueryOptionState =
  | { status: "idle" }
  | { status: "blocked"; issues: QueryBuilderIssue[] }
  | { status: "loading"; options: QueryOption[] }
  | { status: "ready"; options: QueryOption[]; nextCursor?: string }
  | { status: "error"; options: QueryOption[]; issues: QueryBuilderIssue[] };
```

The host provides an adapter that implements `QueryOptionResolver`. The module
accepts property-only `optionContext: Readonly<Record<string, JsonValue>>`
(default `{}`). `dependsOn` names required keys in that context, not field IDs
or query predicates. Pass only those own-property values in `dependentValues`;
never derive them from the query. A missing key blocks the request with
`missing-option-context`; explicit null is a supplied value. Host context
replacement triggers refresh; changing query predicates alone does not.

`resolve` rejects with `QueryOptionFailure` for known failures. Other rejected
errors become `options-load-failed` with a localized user-facing message; do
not expose backend error bodies. A missing resolver is
`missing-option-resolver`. Unknown source IDs are discovered on resolution,
not by pure definition validation. There is no source registry/check method.
Malformed pages or schema-invalid returned values are explicit
`options-load-failed` errors, not successful empty lists.

Expose readonly `optionState` for the active operand and issue notifications
for blocked/failed requests. Its issue paths are `/fields/{index}/editor/optionsSource`
or `/operators/{index}/editor/optionsSource` with target `definition`, as
appropriate; bad context keys use target `options` and a pointer into
`optionContext`. Escape pointer segments per RFC 6901.

Requests include the active operator ID because one field may have
operator-specific operand schemas. Send `searchText` only when `searchable`
is true (default false). `pageSize` is an optional requested limit, not a
guarantee; `nextCursor` is opaque. Reuse the same source, operator, context,
search, and page-size snapshot for subsequent pages. Append pages by typed
value identity; replace metadata for a repeated value. Conflicting metadata
for duplicate values within one page is an error.

Cancel and invalidate the request generation on field/operator/source/context
or search change, query/draft replacement, disabled state, callout close, and
disconnect. Ignore late responses even if the resolver ignores abort.
Cancellation is not an error. Query edits that do not change this request
context do not cause a refetch.

Retain selected values and labels across paging/search within the same request
context. Clear label caches on definition/resolver/dependency replacement,
using JSON text as a safe fallback label for selections not yet resolved.
Version 1 does not add a selected-value lookup method. Missing page membership
or a disabled returned option does not delete/invalidate a saved value;
disabled options prevent new selection. The host still validates eligibility.
Failures preserve the selection and previous visible options, mark them
unavailable for new selection, and offer retry. Loading and failures are
announced accessibly; retries use the failed request snapshot, unless context
has changed, in which case they start the current first page.

### Query document

The serialized value is a versioned tree. A group explicitly scopes its
children, so mixed `and`/`or` expressions do not rely on implicit precedence. An
empty query is represented by `root: null`.

```typescript
interface QueryDocument {
  version: 1;
  root: QueryNode | null;
}

type QueryNode = QueryGroup | QueryPredicate;

interface QueryGroup {
  kind: "group";
  combinator: "and" | "or";
  children: QueryNode[];
}

interface QueryPredicate {
  kind: "predicate";
  fieldId: string;
  operatorId: string;
  value?: JsonValue;
}
```

For example:

```json
{
  "version": 1,
  "root": {
    "kind": "group",
    "combinator": "and",
    "children": [
      {
        "kind": "predicate",
        "fieldId": "status",
        "operatorId": "in",
        "value": ["ready", "failed"]
      },
      {
        "kind": "predicate",
        "fieldId": "partNumber",
        "operatorId": "contains",
        "value": "PN-"
      }
    ]
  }
}
```

The optional `value` accommodates unary operators. Runtime validation enforces
that it is absent for `none` operands and present with the correct shape for
other operators. A group must contain at least two children; the editor should
not emit empty or single-child groups. Queries allow up to four nested groups
below the root expression. A predicate's `fieldId` must exist in the definition,
and its `operatorId` must be listed by that field.

The query-document schema validates the tree's shape. Config-dependent rules
(field/operator compatibility and value validation) are additional runtime
checks; a standalone schema cannot express those references across arbitrary
configuration data in a reusable way.

For statically authored TypeScript definitions, the package should preserve
literal field and operator identifiers and offer generated or generic types
where practical. The public package should expose
`validateDefinition(input: unknown): ValidationResult<QueryBuilderDefinition>`
and
`validateQuery(input: unknown, definition: QueryBuilderDefinition): ValidationResult<QueryDocument>`.
`validateDefinition` includes editor-compatibility checks for every allowed pair;
`validateQuery` includes range ordering and list uniqueness beyond JSON Schema.
Both functions are pure and perform no resolver calls. Compile/cache schemas
per immutable definition, not per keystroke. Disable type coercion, default
insertion, and property removal. An invalid definition supplied to
`validateQuery` returns its definition-targeted issues.

Dynamic definitions must work in browsers whose CSP prohibits `unsafe-eval`.
Use an interpreter-style validator; schema preparation must not generate
JavaScript. The selected implementation is `json-schema-library` 11.6.16 with
Draft 2020-12 and its bundled meta-schemas, as detailed and probed in the
[adoption plan](./query-editor-interface-plan.md#csp-choice-and-evidence).
Register those trusted meta-schemas locally; the schema URLs in the shipped
definition schema are identifiers, not permission to fetch them.
Meta-validate definitions explicitly, reject nonlocal `$ref`/`$dynamicRef`
in supplied fragments, and reject unsupported explicit dialects.
A configuration received dynamically cannot be made compile-time-known by
TypeScript; validate it at runtime before using it. Do not claim that a
TypeScript cast validates downloaded JSON. For static consumers that need
field/operator/value correlation at compile time, generate a query type from
their concrete definition during their build.

## Angular standalone component interface

The Angular adapter is a standalone component with an explicit
`standalone: true` declaration, so the consuming application imports it directly
rather than importing an NgModule. Angular documents that standalone components
can be imported directly; the `standalone` default differs before Angular 19, so
the declaration should be explicit
([Angular component guide](https://angular.dev/guide/components)).

The component exposes:

- Required `definition: QueryBuilderDefinition` input.
- A value interface through Angular Forms:
  - implement `ControlValueAccessor` for `QueryDocument | null`;
  - implement `Validator` so the host form reflects query validation.
- `configurationError` output for invalid definitions or unsupported versions.
- An injected `QUERY_OPTION_RESOLVER` token when a definition contains dynamic
  option sources. No resolver is required for static-only definitions.
- An `optionContext` input using the same host-context policy as the FAST editor.

`configurationError` emits `QueryBuilderIssue[]`; form validation returns the
same issue shape under a `queryBuilder` error key. `QueryBuilderIssue.target`
identifies the document/context; `path` is a JSON Pointer within it.
Callers should branch on
`code`, not on the localized `message`.

This supports the normal Angular form integration:

```html
<standalone-query-builder
  [definition]="queryDefinition"
  [formControl]="queryControl"
/>
```

`ControlValueAccessor` is Angular's documented bridge between a custom control
and the forms API; it handles model-to-view updates, user changes, touched
state, and disabled state
([Angular `ControlValueAccessor`](https://angular.dev/api/forms/ControlValueAccessor)).
The component package should document its Angular peer dependency. The host
imports `ReactiveFormsModule` when using `formControl`.

`writeValue(null)` resets to `{ version: 1, root: null }`; emitted complete
values always use `QueryDocument`. Unfinished editing reports form validation
errors and does not call `onChange` with a stale document or an empty-query
substitute. The adapter exposes draft changes separately so hosts can persist
unfinished work. Disabled state suppresses user changes but does not erase
validation issues or drafts.

The serialized definition and query document remain usable outside Angular.
Angular Forms is an adapter at the UI seam, not part of either JSON contract.

The portable entry point exports public TypeScript types, `validateDefinition`,
and `validateQuery`, with the two JSON Schema documents. The deferred Angular
entry point separately exports the standalone component and
`QUERY_OPTION_RESOLVER`; importing the portable module never registers UI
elements or pulls in Angular.

## Validation and error behavior

Before rendering, the module validates a definition and reports all actionable
issues. It must reject:

- Unsupported definition versions.
- Duplicate field or operator IDs.
- A field that references an unknown operator.
- An invalid JSON Schema fragment or unsupported schema dialect.
- A select editor with neither static choices nor a dynamic option source.
- An incompatible or unsupported editor/operand combination.
- Static choices combined with a dynamic source.

Missing resolver/context and unknown source are runtime option issues, not
proof that a serializable definition is invalid. Validation functions cannot
check source registration and do not claim to do so.

When editing a query, validation checks the query schema, field/operator
allowlist, operand arity, and the operand against the effective schema. For a
dynamic option source, the host remains responsible for authorization and
server-side value eligibility.

`valid` reports definition, draft structure, and query-value validity.
Loading/blocked/failed option requests are separately exposed through
`optionState` and `options-error`; they do not make an otherwise schema-valid
saved query invalid. A host may disable Apply while options are unavailable,
but backend eligibility checks remain mandatory regardless of UI state.
The editor prevents new selection from blocked/failed results. Query/draft
issues drive `validity-change`; option state changes drive `options-state-change`,
not synthetic query edits. This keeps pure query validation and editor validity
consistent without treating a failed option request as a successful empty list.

Invalid user input is exposed through Angular form validation; invalid
configuration and option-resolution failures are surfaced explicitly. The module
must not silently drop unsupported nodes, substitute empty option lists, or
convert an invalid query into a success-shaped value. The host service must
validate the query again before execution.

## Operator semantics

The module stores and returns operator IDs; it does not compile them into SQL,
LINQ, OData, or another backend language. The host's adapter maps IDs to the
service's semantics. The host must document operator behavior, including
case-sensitivity, date/time zone handling, null handling, and string matching.

If a shared starter catalog is needed, use stable IDs such as `eq`, `ne`, `gt`,
`gte`, `lt`, `lte`, `contains`, `startsWith`, `in`, `isNull`, and `isNotNull`.
`in` has a `field-value-list` operand. `isNull` and `isNotNull` have `none`
operands. Keep empty-string behavior separate from null behavior; add a distinct
blank/empty operator if the domain requires it. The allowlist on each field
remains authoritative.

OData 4.01 is a useful reference for comparison, logical, and membership
operators, but the standalone module does not require hosts to adopt OData's
wire syntax
([OData 4.01 URL Conventions](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html)).

## Compatibility and packaging

- Version the definition and query document independently. A reader must reject
  unsupported major versions rather than guess at their meaning.
- Version 1 has a closed structural vocabulary (`additionalProperties: false`).
  Adding a configuration/document property, operand/editor kind, or changing
  existing meaning requires a new integer contract version; package patch
  releases may clarify documentation or correct implementation without changing
  accepted data. These pre-publication draft decisions are folded into version 1.
  Custom field/operator/source identifiers remain data, not vocabulary changes.
- Keep field IDs, operator IDs, and option source IDs stable across saved
  queries and deployments. Labels may change or be localized without changing
  query meaning.
- The portable module must not require a repository-specific DI provider, UI
  library, expression parser, network client, or global stylesheet. The FAST
  editor retains its normal Nimble dependencies; the Angular adapter declares
  its own peer dependencies.
- The host's backend adapter is responsible for translating `QueryDocument` and
  preserving service-specific behavior. It must not be hidden in the standalone
  component.

## Contract tests

Test the module through the public interface, using an in-memory
`QueryOptionResolver` adapter:

- Valid definitions and queries validate; unsupported versions and unknown
  field/operator references return structured issues.
- A field cannot use an operator outside its `operatorIds` allowlist, and each
  operand follows the operator's arity and schema.
- Static option values retain their JSON type; dynamic requests contain only
  configured dependency values and support search, paging, and cancellation.
- Option-source failures remain visible and do not become empty successful
  results.
- The Angular form control propagates writes, user changes, touched state,
  disabled state, and validation status through its documented interfaces.

## References

- [JSON Schema Core, Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core)
- [JSON Schema Validation, Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-validation)
- [OpenAPI Specification 3.1.1](https://spec.openapis.org/oas/v3.1.1.html)
- [Angular component guide](https://angular.dev/guide/components)
- [Angular `ControlValueAccessor`](https://angular.dev/api/forms/ControlValueAccessor)
- [JSON Pointer, RFC 6901](https://www.rfc-editor.org/rfc/rfc6901)
- [OData 4.01, URL Conventions](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html)
