# Query builder API research: typed dynamic configuration

[[_TOC_]]

## Purpose

This note summarizes the current shared query-builder field API in Skyline and
recommends a typed, serializable configuration contract for a replacement
component. It draws on the codebase and primary standards documentation,
including JSON Schema Draft 2020-12, OpenAPI 3.1.1, OData 4.01, JSON:API 1.1,
and GraphQL.

## Current Skyline API

The shared Angular component is
[`SlQueryBuilderComponent`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/components/sl-query-builder/sl-query-builder.component.ts).
It accepts an `ISlFilterField[]` through its `fields` input. Most applications
provide those fields through
[`FilterFieldProvider`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/filter-field-provider.ts).

[`ISlFilterField`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/models/sl-filter-field.ts)
currently defines:

| Property                                 | Current role                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `dataType`, `dataField`, `label`         | Type, resource property, and display label                                             |
| `supportedOperations`                    | Optional per-field operator override; otherwise the component selects defaults by type |
| `supportedValues`                        | `{ label, value }` string options for enum fields                                      |
| `comboBox`                               | Chooses an editable combo box rather than a read-only dropdown                         |
| `convertFunction`, `actualQueryProperty` | Adapt displayed/query values to the existing query representation                      |
| `valuesResolvedDynamically`              | Metadata used by AI tool descriptions; it is not an option-fetching API                |

Built-in field types include string, number, boolean, date, datetime, enum,
list, dictionary, and custom properties. The component has a default operator
list for each type; an application can override that list with
`supportedOperations`. Operator identifiers and LINQ expression templates are
defined separately in
[`sl-filter-operations.ts`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/models/sl-filter-operations.ts)
and the component.

Some parts of the current contract are executable implementation details rather
than serializable configuration.
[`IQueryOperation`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/models/sl-query-operation.ts)
can contain editor, value-conversion, parsing, and validation callbacks; the
JQX-facing
[`IQueryField`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/models/sl-query-field.ts)
has an `any`-typed `lookup`. Custom field extensions also register functions
through
[`FilterExtensionProvider`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/filter-extension-provider.ts).
These are useful runtime extension seams, but cannot be sent as JSON or
statically type-check a field/operator/value combination.

Options are currently assembled outside the component. For example, the Test
Insights specs provider populates `supportedValues` and updates them after
fetching data. The replacement should preserve this runtime capability without
embedding closures or fetch URLs in the configuration.

The query output is also a separate concern:
[`QueryFilterObjects`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/models/sl-query-filter-objects.ts)
uses nested tuple arrays, with permissive string operator types. The existing
Zod builder
([`createZodQueryFilterObjects`](../../../Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/filter/src/models/zod-query-filter-objects.ts))
is a useful precedent for runtime validation: it can restrict field identifiers,
extend operator sets, and validate allowed operations per field. It describes
the query payload, not the UI configuration.

## What JSON Schema should own

JSON Schema is a good contract for a field's value shape and constraints, but it
does not define query operators or a complete UI configuration format:

- The JSON Schema Validation vocabulary defines assertions such as `type`,
  `enum`, `const`, `minimum`, `maxLength`, and array constraints. These can
  validate a condition's value against the selected field's schema.
- JSON Schema annotation keywords such as `title`, `description`, and `default`
  provide descriptive hints. The specification does not require applications to
  render those hints in a particular way. See
  [JSON Schema Core, §7.7](https://json-schema.org/draft/2020-12/json-schema-core#name-annotations)
  and
  [JSON Schema Validation](https://json-schema.org/draft/2020-12/json-schema-validation).
- `format` is an annotation by default; format assertion is a separately
  specified vocabulary. Do not rely on `format: "date-time"` alone for
  enforcement. See
  [JSON Schema Validation, §7.2](https://json-schema.org/draft/2020-12/json-schema-validation#section-7.2).
- Nullable values use a type array, such as `{"type": ["string", "null"]}`,
  rather than a custom `nullable` flag. See
  [JSON Schema Core, §7.6.1](https://json-schema.org/draft/2020-12/json-schema-core#name-assertions-and-instance-pri).
- A plain `enum` has no standard per-value label. OpenAPI 3.1.1 describes
  `oneOf` branches with `const` and annotations such as `title` as a way to
  associate labels with enum values. See the
  [OpenAPI 3.1.1 Schema Object](https://spec.openapis.org/oas/v3.1.1.html#schema-object).

UI schema libraries follow the same separation.
[JSON Forms](https://jsonforms.io/docs/uischema/) uses a UI Schema for controls
and layout, with `scope` binding a control to a data-schema location.
[React JSON Schema Form](https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema/)
similarly keeps widget choices in `uiSchema`. This is a useful precedent: keep
field validation and widget/operator presentation distinct, even if an
application distributes them together in one versioned configuration object.

JSON Schema has no standard operator vocabulary.
[JSON:API 1.1](https://jsonapi.org/format/#fetching-filtering) explicitly leaves
filter strategies to servers;
[OData 4.01](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html#sec_LogicalOperators)
is an example of a standard that defines comparison, logical, and membership
operators. Therefore the component API must explicitly define each operator's
meaning, accepted operand shape, null semantics, and supported field types.

## Recommended API

Use three explicit contracts: a JSON Schema for field values, a serializable
field/operator configuration for the builder, and a typed query AST for user
selections. Keep rendering and query execution in registered code, not in
serialized configuration.

### Field and operator configuration

```typescript
type JsonSchema = Record<string, unknown>; // Use the JSON Schema 2020-12 dialect.

type OperandShape =
  | { kind: "none" }
  | { kind: "field-value" }
  | { kind: "field-value-list"; minItems?: number }
  | { kind: "schema"; schema: JsonSchema };

type Editor =
  | { kind: "text" }
  | { kind: "number" }
  | { kind: "date" }
  | { kind: "select"; options: StaticOptions | OptionSource }
  | { kind: "combobox"; options: StaticOptions | OptionSource };

interface FieldDefinition {
  id: string; // Stable API identifier; not a localized label.
  path: string; // Data path, preferably a JSON Pointer.
  label: string;
  valueSchema: JsonSchema; // Value shape and constraints only.
  operatorIds: string[]; // Allowlist for this field.
  editor?: Editor; // UI hint interpreted by an approved renderer.
}

interface OperatorDefinition {
  id: string; // Stable, documented operator identifier.
  label: string;
  operand: OperandShape; // Serializable; no functions or closures.
}

interface StaticOptions {
  kind: "static";
  values: Array<{ value: string | number | boolean; label: string }>;
}

interface OptionSource {
  kind: "source";
  sourceId: string; // Resolved by an injected, typed client registry.
}

interface QueryBuilderConfig {
  version: 1;
  fields: FieldDefinition[];
  operators: OperatorDefinition[];
}
```

`OperandShape` is intentionally a small serializable descriptor rather than a
callback. For example, `in` can use `field-value-list`, equality can use
`field-value`, and a unary blank/null test can use `none`. The component can
derive a value editor and runtime validator from this descriptor. A renderer or
special operator that needs executable behavior should reference a known
registry key and be implemented in code.

For static enum values that need labels in the schema itself, use
`oneOf`/`const`/`title`; for example:

```json
{
  "oneOf": [
    { "const": "ready", "title": "Ready" },
    { "const": "failed", "title": "Failed" }
  ]
}
```

For dynamic values, keep the value's schema broad enough for the value type and
put an allowlisted `sourceId` in the editor configuration. Resolve options via
an injected service that supports the application's needs (loading, search,
pagination, dependencies, and errors). Do not serialize a JavaScript callback or
an arbitrary endpoint. Revalidate submitted values on the server.

### Query AST

Keep the query representation independent from the field schema and UI
configuration:

```typescript
type QueryNode =
  | {
      kind: "predicate";
      fieldId: string;
      operatorId: string;
      value?: unknown;
    }
  | {
      kind: "group";
      combinator: "and" | "or";
      children: QueryNode[];
    };
```

Use a discriminated tree rather than nested tuple arrays or generated LINQ text
as the component's primary value. Validate that the selected field exists, that
the field allows the selected operator, and that the operator's operand shape
matches the field schema. JSON Schema alone does not express this
config-dependent relationship in a convenient, reusable way; use a runtime
validator plus an explicit compatibility check. Keep an adapter to the existing
`QueryFilterObjects`/LINQ formats during migration if current services still
require them.

For statically authored TypeScript configurations, expose generic or generated
types that narrow the allowed operator and operand for a selected field. For
configuration loaded dynamically at runtime, TypeScript cannot prove the
contents ahead of time: validate the raw JSON against the versioned config
schema, normalize it into the internal typed model, and surface invalid field,
operator, option-source, or value errors explicitly. Validate again at the
service boundary.

## Design decisions

| Concern                       | Recommendation                                                                                   | Reason                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| JSON Schema role              | Field value shape and validation                                                                 | It has standard data assertions and descriptive annotations, not query-builder semantics.                            |
| UI metadata                   | Separate from the field schema; may be distributed in the same versioned config                  | JSON Forms and React JSON Schema Form use separate UI schemas; this avoids inventing UI keywords in the data schema. |
| Operators                     | Stable identifiers, explicit operand shapes, field allowlists                                    | Operator names and semantics are product/API decisions, not defined by JSON Schema.                                  |
| Enum labels                   | `oneOf` branches with `const` and `title` for portable static options                            | Standard schema keywords; plain `enum` cannot attach a label to each value.                                          |
| Dynamic options               | `sourceId` resolved by a typed runtime registry                                                  | Supports asynchronous application data without non-serializable callbacks or arbitrary URLs.                         |
| Null and multi-value behavior | Model null checks as explicit operators; model membership as an operator whose value is an array | Nullability is a value constraint; unary/null and `in` are query semantics. OData is a useful operator precedent.    |
| Query serialization           | Versioned AST plus adapters for legacy formats                                                   | Separates query intent from rendering and backend expression syntax.                                                 |

## References

- [JSON Schema Core, Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core)
- [JSON Schema Validation, Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-validation)
- [OpenAPI Specification 3.1.1](https://spec.openapis.org/oas/v3.1.1.html)
- [JSON Forms UI Schema](https://jsonforms.io/docs/uischema/)
- [React JSON Schema Form UI Schema](https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema/)
- [JSON:API 1.1, Filtering](https://jsonapi.org/format/#fetching-filtering)
- [OData 4.01, URL Conventions](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html)
