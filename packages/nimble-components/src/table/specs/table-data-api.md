# Table Data API

## Problem Statement

A table/data-grid component can have a variety of ways to introduce data into it. We should make it clear how we expect users to introduce data into the `nimble-table` and address the implications that has on the API.

## Links To Relevant Work Items and Reference Material

[FAST data-grid spec](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md) (see `rowsData` in _properties:_ section)

[TanStack Table API](https://tanstack.com/table/v8/docs/api/core/table)

## Implementation / Design

In the `nimble-table`, the data to associated with rows will be exposed through a `data` property that is an array of key/value pairs. The key/value pairs within the data must have a key of type string and a value that is of a supported type. The supported value types are: `string`, `number`, `boolean`, `Date`, `null`, and `undefined`. As implied by the set of supported value types, complex value types such as arrays or objects are not supported. The supported value types are limited to ensure data operations are fast and to eliminate the need to custom sort functions, which could hurt performance. While the types are limited, a rendered column in the table can use data from multiple keys in a row's data item. The details about the way column definitions use data from the `data` property are out of scope for this spec.

Because `data` is a complex type, it will not be exposed as an attribute on the `nimble-table` element. As a result, the data must be provided to the table programatically rather than declaratively with HTML.

This API is similar to the `FASTDataGrid`. Its [data API](https://github.com/microsoft/fast/blob/416dc9167e9d41e6ffe11d87ed79b2f455357923/packages/web-components/fast-foundation/src/data-grid/data-grid.ts#L193), is provided via a `rowsData` property of type `object[]`.

To help enforce typing, the `Table` class will be generic on the type for the row data. The typing of the table is shown below:

```ts
export class Table<
    TData extends {
        [key: string]: string | number | boolean | Date | null | undefined;
    }
> extends FoundationElement {
    @observable
    public data: TData[];
}
```

The typing described above does not fully enforce the type requirement on the table. Specifically, the type of `TData` above does not enforce that a given key only has one data type associated with it. For example, it allows the following, which is not considered valid:

```ts
interface MyTableData {
    myFirstKey: string | number;
}
```

Therefore, types will be provided to allow clients to optionally provide more strict typing on their data. These types will look something like the following:

```ts
type StringData<ValueKey extends string> = {
    [key in ValueKey]: string | null | undefined;
};

type NumberData<ValueKey extends string> = {
    [k in ValueKey]: number | null | undefined;
};

type BooleanData<ValueKey extends string> = {
    [k in ValueKey]: boolean | null | undefined;
};

type DateData<ValueKey extends string> = {
    [k in ValueKey]: Date | null | undefined;
};
```

### Data type usage within column definitions

The types shown above can be used by column providers to enforce the data types they require. For example, if a numeric column required a numeric value, a unit string, and a placeholder string, it could export a type similar to the following:

```ts
type NumericColumnDefinitionData<
    ValueKey extends string,
    UnitsKey extends string,
    PlaceholderKey extends string
> = NumberData<ValueKey> & StringData<UnitsKey> & StringData<PlaceholderKey>;
```

Note that the above is only an example of what is possible. The details of a table's column definitions is out of scope of this spec.

Ideally, this typing can also be used to provide compile-time checking of templates. But, the feasibility and details associated with that are out of scope of this spec.

### Data interaction to the TanStack table

The `data` property on the `nimble-table` will be passed directly into the TanStack Table library. TanStack expects its `data` property to be provided as an array of some arbitrary type. The generic typing of the table allows the `nimble-table` to interface with the TanStack APIs using `TData` rather than `unknown` as shown below:

```ts
public data: TData[] = [];
private _options: TanstackOptionsResolved<TData>;

this._options = {
    get data(): TData[] { // instead of unknown[]
        return data;
    }
}
```

### Angular Integration

The Angular directive for the table will be generic for the row data type, `TData`. The `data` property will be exposed through the directive and have type of `TData[]`. The type requirements on `TData` in the Angular directive will be the same as in the web component.

### Blazor Integration

The Blazor wrapper around the table will be generic for the row data type. The best way to reflect the same type requirements on `TData` in Blazor has not yet been determined.

The Blazor wrapper around the table will require writing interop code to set the property on the underlying `nimble-table` component because Blazor does not allow binding to properties on an element. This can either be done through a getter and setter for a `Data` parameter where the interop Task is not awaited, or it can be done by exposing an async method on the Blazor component that allows setting the data.

### Hierarchical Data

There are no special data API considerations for hierarchical data. All data will be specified as a flat array. Parent/child relationships will be specified using IDs (likely the child having a reference to its parent's ID). The details of hierarchical data are out of scope of this spec.

### Data modification

The API for modifying the table's data by manipulating the table is out of scope for this spec. An example of this is an editable numeric column where the user can modify the value associated with a row directly within the table.

## Alternative Implementations / Designs

### Add additional requirements on `TData`

Some functionality, such as row selection, row expansion, and having an action menu, may require having a unique identifier associated with a row. To facilitate this, we could enforce that `TData` has a unique id field named `id`. Because the core table functionality (i.e. displaying read-only data in a table with no interaction) does not require an id, placing this requirement on all clients of the table is too heavy handed.

If the requirement for having unique row IDs comes up as table features are being defined, we will determine how to enforce that requirement at that time. One possibility would be to have a string attribute on the table that is the key of the id field, and if that attribute is not set, the row index is treated as the unique row id.

### Methods to get/set data (no property)

Rather than having a property on the table for the data, we could expose the data through `setData` and `getData` functions.

**Pros**

-   The API could be made async if desired. This could potentially be useful if we needed a way to inform the user that any asynchronous updates to the table had been completed.
-   The implementation of `setData` could ensure that the internal representation of the data had been updated in a way that the table would detect the changes. With `data` as a property, the client of the table needs to be aware of the appropriate ways to modify their data in order for the table to detect changes had been made.

**Cons**

-   Binding in supported frameworks, such as Angular, becomes more difficult. A property easily allows for simple array binding and for easily binding to an `Observable<TData[]>`.

### Support virtualized data

APIs around virtualized data, such as automatically loading more data when the user scrolls to the bottom of the data set is out of scope for this spec. It will be a client's responsibility to implement any necessary data virtualization.

### Support partial data updates

The current API does not allow updating only a subset of the data, such as modifying a single row. It only supports a new array of data being assigned to `data`. While we could write an API to allow for this, TanStack does not support partial data updates, so it would provide no performance benefit over reassigning the entire set of data.

## Open Issues

-   How will the type requirements of `TData` be reflected in Blazor?
