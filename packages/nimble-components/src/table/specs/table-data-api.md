# Table Data API

## Problem Statement

Table/Data-grid components can have a variety of ways to introduce data into it. We should make it clear how we expect users to introduce data into the `nimble-table` and address the implications that has on the API.

## Links To Relevant Work Items and Reference Material

[FAST data-grid spec](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md) (see `rowsData` in _properties:_ section)

[TanStack Table API](https://tanstack.com/table/v8/docs/api/core/table)

## Implementation / Design

To use the TanStack Table library it expects its `data` to be provided as an array of some arbitrary type. Much of its API is generic to the type of the object that represents a single row of data.

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
    }
}
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

### Limitations

Despite the generic typing of `Table` making it more strict, users would not benefit from that in a scenario where they could provide declarative column definitions that could theoretically only visualize a specific datatype. Take the following markup:

template (Angular)

```html
<nimble-table [data]="data" #table>
    <nimble-text-field-column columnId="firstName"></nimble-text-field-column>
    <nimble-text-field-column columnId="lastName"></nimble-text-field-column>
    <nimble-number-field-column columnId="age"></nimble-number-field-column>
    <nimble-number-field-column columnId="birthDate"></nimble-number-field-column>
</nimble-table>
```

component (Angular)

```ts
@ViewChild('table') private table: Table<Person>;
```

Here, if the `birthDate` value was really a `DateTime`, but the provided column definition would try to render it as a `number`, the user would be unaware of the mistake by static type checking (in environments like Angular).

### Angular Integration

The Angular directive for the table will be generic for the row data type, `TData`. The `data` property will be exposed through the directive and have type of `TData[]`.

### Blazor Integration

The Blazor wrapper around the table will require writing interop code to set the property on the underlying `nimble-table` component because Blazor does not allow binding to properties on an element. This can either be done through a getter and setter for a `Data` parameter where the interop Task is not awaited, or it can be done by exposing an async method on the Blazor component that allows setting the data.

### Hierarchical Data

There are no special data API considerations for hierarchical data. All data will be specified as a flat array. Parent/child relationships will be specified using IDs (likely the child having a reference to its parent's ID). The details of hierarchical data are out of scope of this spec.

### Data modification

The API for modifying the table's data by manipulating the table is out of scope for this spec. An example of this is an editable numeric column where the user can modify the value associated with a row directly within the table.

## Alternative Implementations / Designs

### Genericize on column types

One idea was that we would still provide the `Table` generic typing, but it would be a generic argument for each expected column of data. While this might solve some of the static typing concerns mentioned above, I think it makes the API too verbose.

### Provide additional restrictions on `TData`

Some functionality, such as row selection, row expansion, and having an action menu, may require having a unique identifier associated with a row. To facilitate this, we could enforce that `TData` has a unique id field. For example, we could define the table as `class Table<TData extends { id: string }>`. Because the core table functionality (i.e. displaying read-only data in a table with no interaction) does not require an id, placing this requirement on all clients of the table is too heavy handed.

If the requirement for having unique row IDs comes up as table features are being defined, we will determine how to enforce that requirement at that time. One possibility would be to have a string attribute on the table that is the key of the id field, and if that attribute is not set, the row index is treated as the unique row id.

### Methods to get/set data (no property)

Rather than having a property on the table for the data, we could expose the data through `setData` and `getData` functions.

**Pros**

-   The API could be made async if desired. This could potentially be useful if we needed a way to inform the user that any asynchronous updates to the table had been completed.
-   The implementation of `setData` could ensure that the internal representation of the data had been updated in a way that the table would detect the changes. With `data` as a property, the client of the table needs to be aware of the appropriate ways to modify their data in order for the table to detect changes had been made.

**Cons**

-   Binding in supported frameworks, such as Angular, becomes more difficult. A property easily allows for simple array binding and for easily binding to an `Observable<TData[]>`.

## Open Issues

_None_
