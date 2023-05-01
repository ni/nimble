# Table Data API

## Problem Statement

A table/data-grid component can have a variety of ways to introduce data into it. We should make it clear how we expect users to introduce data into the `nimble-table` and address the implications that has on the API.

## Links To Relevant Work Items and Reference Material

[nimble-table README](README.md)

[FAST data-grid spec](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md) (see `rowsData` in _properties:_ section)

[TanStack Table API](https://tanstack.com/table/v8/docs/api/core/table)

## Implementation / Design

In the `nimble-table`, the data associated with the table will be specified by calling a `setData()` function, that takes an array of key/value pairs. The collection of key/value pairs is called a record, and each record is used to populate one row in the table. Each key/value pair within a record is called a field. The name of a field (i.e. the key of the key/value pair) must be a string, and the value of a field (i.e. the value of the key/value pair) must be a `string`, `number`, `boolean`, `null`, or `undefined`. As implied by the set of supported field types, complex field types such as arrays or objects are not supported. The supported field types are limited to ensure data operations are fast and to eliminate the need to create custom sort functions, which could hurt performance. While the types are limited, a rendered cell in the table can access multiple fields from the record. The details about the way column definitions use data from the table's data are out of scope for this spec.

The data will be specified by calling a function for a few different reasons:

-   Requiring a client to explicitly call `setData()` avoids confusion regarding what needs to be done to update the data. For example, if `data` were a property, would the table update if a new record were pushed into the assigned array? Would reassigning the same array instance cause the table to re-render to include any changes made to the array since last time the property was assigned?
-   By not having a `getData()` function or a property with a getter and setter, the table does not have to create an additional copy of the data in order to have it available to return to the client. Instead, the data provided in `setData()` can be passed to TanStack without an additional copy being cached within the `Table` class in nimble.

To help enforce typing, the `Table` class will be generic on the type for the record. The typing of the table is shown below:

```ts
type TableFieldName = string;

type TableFieldValue = string | number | boolean | null | undefined;

interface TableRecord {
    [key: TableFieldName]: TableFieldValue;
}

export class Table<TData extends TableRecord> extends FoundationElement {
    @observable
    public data: TData[];
}
```

The user of the table can type a reference to the table as:

```ts
const tableRef: Table<TData>;

// The type of records in the passed array is
// restricted by the type specified above
tableRef.setData([{...}]);
```

The typing described above does not fully enforce the type requirement on the table. Specifically, the type of `TData` above does not enforce that a given key only has one data type associated with it. For example, it allows the following, which is not considered valid:

```ts
interface MyTableData {
    myFirstKey: string | number;
}
```

Therefore, types will be provided to allow clients to optionally provide more strict typing on their data. These types will look something like the following:

```ts
type TableStringField<FieldName extends string> = {
    [name in FieldName]: string | null | undefined;
};

type NumberField<FieldName extends string> = {
    [name in FieldName]: number | null | undefined;
};

type BooleanField<FieldName extends string> = {
    [name in FieldName]: boolean | null | undefined;
};
```

### Data type usage within column definitions

The types shown above can be used by column providers to enforce the data types they require. For example, if a numeric column required a numeric value, a unit string, and a placeholder string, it could export a type similar to the following:

```ts
type NumericColumnRecord<
    ValueFieldName extends string,
    UnitsFieldName extends string,
    PlaceholderFieldName extends string
> = NumberData<ValueFieldName> &
    StringData<UnitsFieldName> &
    StringData<PlaceholderFieldName>;
```

Using the column definition, the user of a table can type a reference to the table as:

```ts
const tableRef: Table<
    NumericColumnRecord<'value', 'units', 'placeholder'> &
        BooleanField<'awesome'>
>;

// The field names and types in the array passed to setData()
// are enforced by the type above.
tableRef.setData([
    {
        value: 3,
        units: 'a',
        placeholder: 'b',
        awesome: true
    }
]);
```

Note that the above is only an example of what is possible. The details of a table's column definitions are out of scope of this spec.

Ideally, this typing can also be used to provide compile-time checking of templates. But, the feasibility and details associated with that are out of scope of this spec.

### Data interaction to the TanStack table

The data passed into the `nimble-table` will be passed into the TanStack Table library after making a shallow copy of the array to ensure that TanStack always detects that the data is being updated even when `setData()` is called multiple times with the same array instance. TanStack expects its `data` property to be provided as an array of some arbitrary type. The generic typing of the table allows the `nimble-table` to interface with the TanStack APIs using `TData` rather than `unknown` as shown below:

```ts
private _options: TanstackOptionsResolved<TData>;

this._options = {
    get data(): TData[] { // instead of unknown[]
        return [];  // TanStack starts with an empty array
    }
}

public setData(data: TData[]) {
    this._options.data = [...data];
}
```

### Angular Integration

The Angular directive for the table will be generic on the table's record type, `TData`. The `setData()` function will be exposed through the directive. Additionally, the directive will have a `data$` property that accepts an `Observable<TData[]>`. The directive will subscribe to the observable and internally call `setData()` on the web component when new values are emitted. The type requirements on `TData` in the Angular directive will be the same as in the web component.

### Blazor Integration

The Blazor wrapper around the table will be generic on the table's record type. In Blazor, `TData` will be required to be serializable to JSON without any nested objects or arrays.

The Blazor wrapper around the table will expose a `Data` property that internally calls `setData()` within `OnAfterRenderAsync()`. The `setData()` method will not be exposed directly from the Blazor component because it would have no functional difference from calling the `Data` property's setter.

### Hierarchical Data

There are no special data API considerations for hierarchical data. All data will be specified as a flat array. Parent/child relationships will be specified using IDs (likely the child having a reference to its parent's ID). The details of hierarchical data are out of scope of this spec.

### Data modification

The API for modifying the table's data by manipulating the table is out of scope for this spec. An example of this is an editable numeric column where the user can modify the value associated with a row directly within the table.

## Alternative Implementations / Designs

### Add additional requirements on `TData`

Some functionality, such as row selection, row expansion, and having an action menu, may require having a unique identifier associated with a row. To facilitate this, we could enforce that `TData` has a unique id field named `id`. Because the core table functionality (i.e. displaying read-only data in a table with no interaction) does not require an id, placing this requirement on all clients of the table is too heavy handed.

If the requirement for having unique row IDs comes up as table features are being defined, we will determine how to enforce that requirement at that time. One possibility would be to have a string attribute on the table that is the key of the id field, and if that attribute is not set, the row index is treated as the unique row id.

### Support virtualized data

APIs around virtualized data, such as automatically loading more data when the user scrolls to the bottom of the data set is out of scope for this spec. It will be a client's responsibility to implement any necessary data virtualization.

### Support partial data updates

The current API does not allow updating only a subset of the data, such as modifying a single record. It only supports a new array of data being provided in `setData()`. While we could write an API to allow for partial updates, TanStack does not support partial data updates, so it would provide no performance benefit over reassigning the entire set of data.
