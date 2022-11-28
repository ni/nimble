# Table Data API

## Problem Statement

Table/Data-grid components can have a variety of ways to introduce data into it. We should make it clear how we expect users to introduce data into the `nimble-table` and address the implications that has on the API.

## Links To Relevant Work Items and Reference Material

[FAST data-grid spec](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md) (see `rowsData` in _properties:_ section)

[TanStack Table API](https://tanstack.com/table/v8/docs/api/core/table)

## Implementation / Design

To use the TanStack Table library it expect its `data` to be provided as an array of some arbitrary type. Much of its API is generic to the type of the object that represents a single row of data.

The `FASTDataGrid` has similar expectations for its [data API](https://github.com/microsoft/fast/blob/416dc9167e9d41e6ffe11d87ed79b2f455357923/packages/web-components/fast-foundation/src/data-grid/data-grid.ts#L193), provided via a `rowsData` property of type `object[]`. Columns are determined by looking at all of the property names of the first object in that array.

It seems helpful to not only provide a similarly simplistic means of providing data to the `nimble-table`, but to also provide the type for the row data via a generic argument on the `Table` class itself, i.e.:

```ts
export class Table<TData> extends FoundationElement {
    @observable
    public data: TData[];
}
```

This provides a couple of benefits:

-   Interfacing with the TanStack APIs is now more direct and avoids `unknown` typing, e.g.:

```ts
public data: TData[] = [];
private _options: TanstackOptionsResolved<TData>;

this._options = {
    get data(): TData[] { // instead of unknown[]
        return data;
    },
```

-   View templating can access named columns in some scenarios. For instance, given a row type of `Person`, that has a field `friends` in it whose value was another table, a user could define FAST ViewTemplate in the following way:

```ts
const rowTemplate = (index: number): ViewTemplate<any, Table<Person>> => html<
    any,
    Table<Person>
>`
    <nimble-table
        style="max-height: 500px"
        :data="${(_, c) => c.parent.tableData[index]!.row.original.friends}"
    >
    </nimble-table>
`;
```

Both of these are demonstrated in the following prototype branch:

[Table in a Table](https://github.com/ni/nimble/blob/tanstack-table-in-table) (see [Storybook](https://60e89457a987cf003efc0a5b-wzissaavew.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story))

### Hierarchical Data

_Placeholder_

### Limitations

Despite the generic typing of `Table` making it more strict, users would not benefit from that in a scenario where they could provide declarative column definitions that could theoretically only visualize a specific datatype. Take the following markup:

template (Angular)

```html
<nimble-table data="data" #table>
    <nimble-text-field-column columnId="firstName"></nimble-text-field-column>
    <nimble-text-field-column columnId="lastName"></nimble-text-field-column>
    <nimble-number-field-column columnId="age"></nimble-text-field-column>
    <nimble-number-field-column columnId="birthDate"></nimble-text-field-column>
</nimble-table>
```

component (Angular)

```ts
@ViewChild('table') private table: Table<Person>;
```

Here, if the `birthDate` value was really a `DateTime`, but the provided column definition would try to render it as a `number`, the user would be unaware of the mistake by static type checking (in environments like Angular).

## Alternative Implementations / Designs

### Genericize on column types

One idea was that we would still provide the `Table` generic typing, but it would be a generic argument for each expected column of data. While this might solve some of the static typing concerns mentioned above, I think it makes the API too verbose.

### Methods to get/set data (no property)

_Placeholder_

## Open Issues

_Describe any open issues with the design that you need feedback on before proceeding._
_It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source._
