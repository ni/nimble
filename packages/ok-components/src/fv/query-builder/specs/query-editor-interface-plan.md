# Query editor: standalone interface adoption plan

Status: implemented; the portable contract, editor adapter, documentation,
component build, Chrome tests, manifest build, and focused lint passed.
WebKit and Storybook verification limitations are recorded below.

## Recommendation

Adopt the definition and query-document contracts directly in
[`ok-fv-query-editor`](../../query-editor/index.ts). Keep its existing inline
and formatted UI, condition callouts, keyboard interaction, and localization.
Do not put a new wrapper around the existing two-level query model: it cannot
represent the proposed recursive document without losing information.

Use the [standalone interface specification](./Standalone-query-builder-interface-spec.md)
as the portable contract, not as a requirement to rewrite the editor in Angular.
The FAST editor is one adapter; an Angular Forms adapter can follow when needed.
Only the contract and validation module must be independent of Nimble and FAST.

## Interface review

The useful separation is already present in the proposal: definition describes
what can be edited, document describes query meaning, and the host resolves
options and translates the result for its backend.

These are the migration surfaces:

| Area | Current editor | Proposed contract and required change |
| --- | --- | --- |
| Configuration | `fields`, fixed field types, fixed operator catalog | `definition`, schema-driven values, opaque operator IDs, field allowlists |
| Query shape | Query logic plus groups of rules | Recursive groups and predicates; replace token/tree conversion |
| Group editing | One parenthesis level; toggles every join in the same scope | Nested scopes; retain the shared-combinator behavior within each explicit group |
| Values | Discriminated operands; string-only collections | JSON values validated against the effective operand schema |
| Identity | Rule/group IDs and rule revisions in query data | Private editor identity; no UI IDs or revisions in saved documents |
| Drafts | Serializable tokens preserve incomplete expressions | Keep a distinct editor draft; a valid document cannot represent unfinished editing |
| Options | Static string options; multiselect round-trips through comma-separated labels | Typed values and separate labels, plus cancellable dynamic resolution |
| Validation | Handwritten type/operator checks and localized strings | Definition/document validation and structured issues with JSON Pointer paths |
| Framework | FAST custom element | Keep FAST; Angular Forms belongs in a separate adapter |

### Resolved decisions

The [interface specification](./Standalone-query-builder-interface-spec.md)
is authoritative for the portable rules below. The host-context, exclusive-source,
and range-operand choices were confirmed by the user.

| Gap | Decision |
| --- | --- |
| Draft versus document | Only complete schema-valid drafts produce a document; invalid edit events contain `query: null`. A true clear produces `{ version: 1, root: null }`. |
| Editor selection | Operator override, field override, then effective-schema inference. Explicit `auto` requests inference. Reject unsupported shapes; no generic JSON form generator. |
| Range | Add `{ kind: "range", endpointSchema }`. Value is exactly `{ start, end }`; validate endpoints and ordering in the portable validator, not just controls. Number/integer and date-only ranges in v1. |
| Key operands | Key-only is a schema-constrained string; key/value is an explicitly selected editor for exactly `{ key: string, value: string }`. |
| Array membership | Operator-specific item schema; distinct IDs when item schemas differ. Never infer from an opaque ID. |
| Static/dynamic choices | Mutually exclusive for a field/operator pair. Select is selection-only; dynamic string combobox allows schema-valid custom strings. |
| Saved option labels | Cache within request context; retain selected typed values across pages. Use JSON text for unresolved labels. No lookup method in v1. |
| Dependencies | `dependsOn` lists required own-property keys in host `optionContext`, never predicate lookups. Missing keys block; null is present; context replacement refreshes. |
| Resolver errors | Typed rejection distinguishes unknown source from load failure. Missing resolver/context block explicitly. Source existence is checked on request, not by pure definition validation. |
| Option failure and validity | Operational failures have state/events but do not invalidate a schema-valid saved query. Hosts may gate Apply separately. Failed results cannot supply new selections. |
| Versioning | Closed vocabulary: structural additions require a new integer contract version. Draft changes here remain pre-publication v1. |
| Datetime | Assert offset-bearing `date-time`, preserve the original offset, no local-time conversion. Datetime ranges are deferred. |
| JSON Schema | `json-schema-library` 11.6.16, interpreter-style Draft 2020-12 validation with bundled meta-schemas. Assert supported standard formats, use only local refs, no coercion/default insertion/removal/network loading. |
| Browser CSP | Downloaded definitions must work without `unsafe-eval`. No runtime JavaScript generation or CSP relaxation. |
| Packaging | Portable types/validation have no UI imports; FAST adopts them directly. Angular is deferred, not a rewrite. |

### Concrete range example

```typescript
const between: OperatorDefinition = {
    id: 'between',
    label: 'Between',
    operand: {
        kind: 'range',
        endpointSchema: { type: 'number', minimum: 0 }
    }
};
// Predicate value: { start: 100, end: 500 }.
// { start: 500, end: 100 } fails portable validation, despite valid endpoints.
```

Declare a separate operator when a date range needs a different endpoint
schema. Schema shape validation alone cannot enforce the cross-property order;
`validateQuery` must test it for every range operand.

## What using it looks like

Public usage:

```typescript
const editor = document.createElement(fvQueryEditorTag);

editor.definition = {
    version: 1,
    fields: [
        {
            id: 'status',
            path: '/status',
            label: 'Status',
            valueSchema: {
                oneOf: [
                    { const: 'failed', title: 'Failed' },
                    { const: 'error', title: 'Error' }
                ]
            },
            operatorIds: ['in'],
            editor: { kind: 'select' }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration (ms)',
            valueSchema: { type: 'number', minimum: 0 },
            operatorIds: ['gt']
        }
    ],
    operators: [
        {
            id: 'in',
            label: 'Is any of',
            operand: { kind: 'field-value-list' }
        },
        {
            id: 'gt',
            label: 'Greater than',
            operand: { kind: 'field-value' }
        }
    ]
} satisfies QueryBuilderDefinition;

editor.query = {
    version: 1,
    root: {
        kind: 'group',
        combinator: 'and',
        children: [
            {
                kind: 'predicate',
                fieldId: 'status',
                operatorId: 'in',
                value: ['failed', 'error']
            },
            {
                kind: 'predicate',
                fieldId: 'duration',
                operatorId: 'gt',
                value: 500
            }
        ]
    }
} satisfies QueryDocument;

editor.layout = 'formatted';
editor.addEventListener('query-change', event => {
    const detail = (event as CustomEvent<QueryEditorEventDetail>).detail;
    workingDraft = detail.draft;
    canApply = detail.valid;
    if (detail.valid) {
        workingQuery = detail.query;
    }
});
```

The visible result remains:

```text
Status       Is any of       Failed, Error
AND Duration Greater than    500
```

Opening a chip still edits field, operator, and operand. Operator labels now
come from the definition, not hard-coded interpretation of IDs. `select` with
a list operand renders a multiselect. The existing formatted story's
`(status AND duration) OR workspace` becomes an OR group containing an AND
group and a workspace predicate.

Dynamic-only usage adds a resolver; dependencies additionally use host context:

```typescript
editor.optionResolver = inventoryOptions;
editor.optionContext = { workspaceId: 'production' };
```

`inventoryOptions` implements `QueryOptionResolver`; field configuration names
its `sourceId` and, when needed, `dependsOn: ['workspaceId']`. No fetch URLs or
callbacks enter the JSON definition.

### Public behavior

- Replace `fields` with property-only `definition`; replace the legacy `query`
  shape with `QueryDocument`. Retain `layout`, `label`, `labels`, `disabled`,
  `defaultField`, `draft`, `ruleCount`, and `valid`.
- Add property-only `optionResolver` and `optionContext`, readonly structured
  `issues`, and readonly active-operand `optionState`. Keep query/draft validity
  issues separate from operational option issues. Emit `configuration-error`
  with `{ issues }`, `options-error` with `{ issues }`, `options-state-change`
  with `{ state }`, and `validity-change` with `{ valid, issues }` when their
  respective effective state changes. All events bubble and are composed;
  snapshots are detached. Only `query-change` represents user query edits.
- Make `query-change` detail a discriminated union: valid edits contain
  `{ valid: true, query: QueryDocument, draft, ruleCount, issues: [] }`;
  invalid/incomplete edits contain
  `{ valid: false, query: null, draft, ruleCount, issues }`.
  This deliberately replaces the current event's potentially stale query.
- The `query` property retains the last validated document during incomplete
  user editing. Its getter is not permission to execute: hosts gate Apply on
  current validity. A valid clear updates it to `{ version: 1, root: null }`.
- Programmatic writes emit no `query-change`. Invalid external input produces
  explicit issues and invalid state, never an empty-query fallback. Preserve
  semantically invalid predicates for inspection/removal when their shape can
  be rendered; reject malformed documents explicitly before token conversion.
- Use the versioned draft contract below. A draft is not a backend query and
  is never validated as a complete document.
- Preserve `0`, `false`, `""`, and explicit `null` when allowed by the schema.
  Missing input is separate draft state. Unary predicates omit `value`.
- Host backend translation, authorization, Apply/Cancel, and persistence stay
  outside the editor.

### Draft contract and assignment rules

```typescript
type QueryEditorDraftToken =
    | {
        kind: 'condition';
        id: string;
        fieldId: string;
        operatorId: string;
        value?: JsonValue;
        rawInputs?: Readonly<Record<string, string>>;
    }
    | { kind: 'logic'; logic: 'and' | 'or' }
    | { kind: 'open'; id: string }
    | { kind: 'close' };

interface QueryEditorDraft {
    version: 1;
    tokens: readonly QueryEditorDraftToken[];
    caretPosition: number;
    inputText: string;
}
```

`id` is stable local identity for a condition or opening group; IDs are unique
within the draft, never exported in a document. Group scopes come from balanced
tokens, not stored field/group references. `rawInputs` keys are JSON Pointers
into the condition: `/value` for a scalar, `/value/start` and `/value/end` for
ranges, and `/value/key` or `/value/value` for key/value strings. They preserve
unfinished numeric/date/structured text without coercing it to a valid value.
Raw text takes precedence during validation/export; no invalid raw buffer may
reuse a previous valid parsed value. Missing `value` is incomplete except for
unary operators. Explicit null is a value, never a missing-input sentinel.

Nonempty `inputText` is unfinished query entry, so the draft is invalid until
it is committed or explicitly dismissed. Caret movement alone does not emit
`query-change`; edits to `inputText` do, so unfinished drafts can be persisted.
The host can snapshot the `draft` property to persist the latest caret.
Closing a callout, including Done/Escape, retains edits and never applies them
to a backend.

An empty token list with empty input text is the only empty-query draft.
Unmatched parentheses, dangling joins, empty nested groups, duplicate IDs, and
mixed combinators within a scope are invalid, inspectable drafts. Parenthesized
single children may be unwrapped on document export, but remain in the draft.
Do not silently remove an empty child group to make its parent valid.

External assignments are authoritative, immutable snapshots; assigning the same
reference is not an update. Validate before conversion. `query` accepts no bare
null, unlike Angular Forms' reset convention. A shape-valid but semantically
invalid document becomes an inspectable invalid draft; unknown IDs remain
visible and removable. A malformed query/draft is rejected, retains the prior
display and last valid query, sets an explicit blocking input issue, and is
never treated as accepted. Clear that issue on a valid replacement or explicit
user clear, not on focus changes.

The `query` getter returns the last validated document, including after rejected
writes. Accepted `query` writes regenerate draft IDs, close callouts, and reset
caret/input text. Accepted `draft` writes preserve its exact tokens/raw text,
close callouts, and update the query only if complete and valid. For writes
to both properties, the last accepted assignment determines the display; no
hidden query/draft merge. Configuration changes preserve the draft and
revalidate it. Deep-clone all JSON values at ingress and event egress.

`issues` contains blocking definition/query/draft issues, not option transport
issues. Draft issue paths point into `/tokens/{index}` or `/inputText`;
document validation paths point into `/root/...`. Issue `target` identifies
which payload the path addresses. Localizable messages are display-only.
With malformed definitions, preserve the draft for recovery, disable new edits,
and report all actionable configuration issues rather than hiding the editor
behind a success-shaped empty state.

### Events and external state

Programmatic query/draft writes never emit `query-change`, but issue/validity
changes are observable. The first validity notification occurs after initial
configuration; subsequent notifications fire only when validity or its issue
set changes. UI text and operand edits each emit one `query-change`; keystrokes
are not backend submissions. Async option updates emit no query changes.
`disabled` blocks user mutation and closes overlays without losing the draft.

`configuration-error` reports definition issues; malformed externally assigned
query/draft data is visible through `issues` and `validity-change`. An invalid
explicit `defaultField` disables Add rather than silently choosing another
field. Operator labels come exclusively from the definition; retain `labels`
for actions, statuses, and errors without a second operator-label catalog.

## Implementation record

### 1. Implement the resolved portable contract

The specification and definition schema now include the decisions above.
The query-document schema is unchanged: range values already fit `JsonValue`.
Create the shared contract/validation module beside the current query-builder
types, independent of FAST. Export the portable types, `validateDefinition`,
and `validateQuery`; use them directly in both the editor and its tests.

Use `json-schema-library` 11.6.16 as a direct dependency during implementation.
Do not install it or alter manifests as part of this design-only change.
Its `compileSchema` prepares an interpreted schema tree, not generated
JavaScript. Prepare/cache per immutable definition, not per keystroke.
Use `drafts: [draft2020]`, enable `formatAssertion`, and register only the bundled
2020-12 meta-schemas from its `remotes` export. Exclude the bundled older drafts.
Meta-validate supplied schemas explicitly; compiling a schema is not itself
proof that it passes its meta-schema. Map its error pointers/codes to our
structured issue contract rather than exposing library error shapes.

Preflight supplied schema reference keywords (`$ref` and `$dynamicRef`) and
dialects before compilation: permit local fragments only, reject unresolved
references, and prohibit remote loaders. The standard meta-schema URLs used
by our shipped definition schema resolve exclusively to bundled documents,
not the network. A schema without `$schema` uses 2020-12; reject any explicit
other dialect. Validation must not generate default data or alter caller values.
Only compile/validate operations are needed; do not invoke the library's
data-generation or editing helpers.

The host supplies trusted schema definitions, not arbitrary schemas from an
end user. Host authorization and payload/complexity limits remain necessary;
strict CSP prevents code generation, not pathological regex/recursion costs.

#### CSP choice and evidence

The user requires dynamic definitions in strict-CSP browsers. Ajv runtime
compilation is excluded because its
[CSP documentation](https://ajv.js.org/security.html#content-security-policy)
requires `unsafe-eval`; Ajv standalone generation would instead require
build-time-known schemas.

[`json-schema-library`](https://github.com/sagold/json-schema-library)
documents browser support, Draft 2020-12, schema-tree compilation, format
assertions, and locally registered references. An isolated probe of the
11.6.16 browser bundle and bundled meta-schemas passed all 33 checks under
Node's `--disallow-code-generation-from-strings`: both contract schemas,
positive/negative examples, meta-validation, real dates, timezone requirement,
local/unresolved references, no coercion, and unchanged input data.
This is evidence for the selection, not a claim that browser integration
has already been tested.

The implementation must run the same dynamic-definition scenario under an
actual browser CSP without `unsafe-eval`, with schema network access blocked.
Include a downloaded definition, its invalid-value error path, and a rejected
external reference. Do not waive this gate or switch back to Ajv runtime if a
bundle/build integration issue appears.

**Exit:** definitions and documents validate with structured paths, reference
checks, operator arity, and schema constraints.

### 2. Replace the editor's model seam

Update the [editor implementation](../../query-editor/index.ts) to use the
portable definition and document. Keep stable editor IDs private to drafts.
Replace the one-level structure validator, tree/token conversion, group lookup,
and scope operations together with stack/recursive handling.

Use one combinator per explicit scope. Require parentheses to express mixed
logic rather than inventing implicit precedence. A truly empty whole expression
becomes `root: null`, a single child is unwrapped, and emitted groups have at
least two children. Empty nested groups are invalid, not silently pruned.
Do not normalize unfinished drafts into valid documents.

Make formatted indentation depth-based rather than a boolean. Keep selection,
caret, and open-callout identity stable through ordinary edits. Definition
updates revalidate without discarding unknown fields/operators or operands.

**Exit:** empty, single predicate, existing grouped examples, and deeper mixed
trees round-trip without changing meaning; unfinished drafts restore exactly.

### 3. Wire schema-driven operand editing

Update the [editor template](../../query-editor/template.ts), summary formatting,
parsing, and validation together. Reuse existing Nimble controls; no renderer
registry or general-purpose form generator.

Cover text, number/integer, boolean, date, datetime, select/combobox, list,
range, key-only, key/value, and unary operands. Honor explicit editor precedence.
Keep datetime/timezone policy explicit; never truncate timestamps to dates.

The current [chip selector](../../chip-selector/index.ts) exposes
comma-separated strings. Add a typed property-only option/selection path if
reusing it, preserving its existing string interface for other callers. Route
selection by opaque control keys mapped to JSON values, not by labels.
Duplicate labels, commas in labels/values, and numeric/boolean/null selections
must round-trip unchanged. Do not stringify the query's values.

**Exit:** migrate every current operand fixture without losing capability;
arbitrary unsupported schemas fail explicitly rather than rendering unusable
controls.

### 4. Add dynamic options

Resolve only configured sources and dependency values under the agreed policy.
Cancel on search, source/dependency change, query replacement, disabled state,
and disconnect; also ignore late results from resolvers that ignore abort.
Support paging without dropping selections, selected-label retention, disabled
options, loading status, visible failures, and retry. Cancellation is not a
load failure.

**Exit:** fake-resolver tests prove typed values, search, paging, dependencies,
cancellation, stale-result rejection, and explicit unknown-source/load errors.

### 5. Migrate examples and document the break

Move query-editor stories off the legacy shared fixtures. Update its
[Storybook documentation](../../../../../storybook/src/ok/fv/query-editor/fv-query-editor.mdx)
with the new properties, draft/event rules, errors, and a dynamic option example.
Add nested, typed-option, range/datetime, incomplete, and failure stories.

Leave `ok-fv-query-builder` on its current contract during this editor-only
migration. Do not modify its shared types in place or silently redirect its
imports. If the builder later adopts the contract, reuse the new module.
Document the editor's breaking change; add a legacy converter only for an
identified consumer, with explicit rejection of unrepresentable values.

**Exit:** the existing builder behavior is unchanged and the editor examples
exercise only the proposed public interface.

## Verification

Extend the existing Jasmine tests; no new runner or parallel test architecture.

- Portable validation: unsupported versions, duplicate IDs, bad pointers,
  unknown/disallowed operators, invalid schemas, unresolved references, operand
  arity, constraints, range ordering, list uniqueness, and typed static choices.
- Tree/draft behavior: nested mixed scopes, no meaning-changing conversion,
  shared-scope toggles, canonical empty/single-child output, raw invalid input,
  exact draft restoration, and no last-valid query in invalid change events.
- Values: zero/false/empty/null versus missing, integer constraints, dates versus
  datetime, ranges, structured operands, duplicate labels, commas, and option
  values with different JSON types but similar display text.
- Dynamic behavior: controlled resolver promises for cancellation and
  out-of-order results, missing/unknown resolver, failure/retry, pagination,
  missing context versus explicit null, disabled options, and saved selections
  outside a page. Verify option failures do not invalidate valid saved documents.
- Existing UI regressions: inline/formatted layouts, keyboard autocomplete,
  deletion, focus return, child-select Escape, scrolling, dropdown overflow,
  disabled state, and detached event snapshots.

Implementation verification:

```sh
npm run build:components -w @ni/ok-components
npm run test-chrome -w @ni/ok-components
npm run test-webkit -w @ni/ok-components
npm run build:cem:config -w @ni/ok-components
```

Results on 2026-10-27:

- `npm run build:components -w @ni/ok-components` — passed.
- `npm run test-chrome -w @ni/ok-components` — passed, 304/304 tests.
- `npm run test-webkit -w @ni/ok-components` — one run reported 304/304
  successes, then the WebKit Karma launcher raised a post-test cleanup
  exception while checking for its Playwright process. A repeat lost the
  browser heartbeat and reported `DISCONNECTED` after executing 304/304
  specs; treat WebKit verification as inconclusive.
- `npm run build:cem:config -w @ni/ok-components` — passed.
- `npm run build:ts -w @ni-private/storybook` — blocked by existing errors in
  `packages/nimble-components/src/icon-svg/tests/icon-metadata.ts` and
  `packages/storybook/src/ok/fv/query-builder/fixtures.ts`; neither is part of
  the query-editor migration.
- The Chrome and WebKit component tests run with the repository's test CSP,
  which does not include `unsafe-eval`; the portable validator and dynamic
  definition tests passed in both browsers.
- Focused ESLint on changed component TypeScript and the query-editor story —
  passed.

## Deliberately out of scope

No Angular rewrite, backend compiler, renderer plugin system, schema-generated
TypeScript tooling, new query store, or compatibility framework. Add an Angular
Forms adapter only for an actual Angular consumer, delegating validation and
editing to the same module.
