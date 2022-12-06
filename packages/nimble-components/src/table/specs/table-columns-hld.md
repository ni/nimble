# Nimble Table Columns API

## Problem Statement

The `nimble-table` requires users to be able to configure which columns to display for a table. Additionally, a particular display column may require access to multiple fields in the data, and allow a user to either define the field to sort by, or provide a custom sort routine. We need to provide a means for a client to provide their own column visualization. Finally, columns must also provide the user to either specify the header text, or custom visuals to use for the header.

### Out of scope of this HLD

Programmatic API for state that could be considered column-centric: width, sort direction, grouped, etc. These concerns should be covered in separate designs covering those topics specifically, allowing for discussion on both the interactive side and the API design on an individual basis.

## Links To Relevant Work Items and Reference Material

[Table Declarative Columns API prototype:](https://github.com/ni/nimble/blob/325983040e886e52a100664d8fb1129dee767c2f/packages/nimble-components/src/table/tests/table.stories.ts#L23) ([Storybook](https://60e89457a987cf003efc0a5b-twewjutggo.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story))

## Implementation / Design

Columns will be provided to the table as slotted elements. The slot for the columns will be the default slot for the table, and thus no slot needs to be expressly provided by the user for a column:

```
<nimble-table>
    <nimble-table-column-text valueKey="name"></nimble-table-column-text>
    <nimble-table-column-icon valueKey="ready"></nimble-table-column-icon>
    ...
</nimble-table>
```

These columns will _not_ have templates/CSS associated with them, and instead be implementations of an interface that will require returning a FAST ViewTemplate for its visual representation.

The table API to support this could look like the following:

```TS
public Table extends FoundationElement {
    ...

    @observable
    public slottedColumns: ITableColumn[] = [];

    private slottedColumnsChanged(): void {
        if (this.slottedColumns.length > 0) {
            for (const tableColumn of this.slottedColumns) {
                if (this.isTableColumn(tableColumn)) {
                    // do init work
                }
            }
        }
    }
}

template:
<template>
    <div>
        ...
    </div>
    <slot ${slotted('slottedColumns')}></slot>
</template>
```

### `ITableColumn`

This interface is what a column web component (i.e. a slotted column) must implement.

```TS
interface ITableColumn {
    header?: string; // the string to use in the header for the column
    headerTemplateFn?: () => ViewTemplate; // the template to use for the header (string if none provided)
    cellTemplateFn: () => ViewTemplate<ITableCellData>; // the template to use to render the cell content for the column (required)
    getDataKeys: () => string[]; // the set of keys the table needs to provide the cellTemplateFn with the proper subset of data
}
```

The `ITableColumn` interface would be updated to support other features not covered in this HLD such as sorting and grouping.

### `ITableCellData`

In order for the `cellTemplateFn` in the above interface to be able to act on the necessary table data, we should have a type that the template function can work with directly through.

```TS
type tableData = string | number | boolean | Date | null | undefined;

interface ITableCellData {
    data: { [key: string]: tableData };
}

/**
 * @internal
 */
class TableCellData<TData extends { [key: string]: tableData }> implements ITableCellData {
    public constructor(public data: TData) { }
}
```

`TData` here represents a subset of the overall data provided to the table. The `getDataKeys()` method on the `ITableColumn` interface will be used to retrieve the subset of data to provide to a particular `TableCellData` instance.

With these mechanisms in place we should be able to define a series of column providers to handle all of the basic use cases. For example, the `ITableColumn` implementation we could create for rendering data as a read-only `NimbleTextField` could look like this:

```TS
public TableColumnText extends FoundationElement implements ITableColumn {
    ...

    @attr
    public valueKey: string;

    public getDataKeys(): string[] {
        return [valueKey];
    }

    public cellTemplateFn(): ViewTemplate<ITableCellData> {
        return html<ITableCellData>`
            <nimble-text-field readonly="true" value=${x => x.data[this.valueKey]}>
            </nimble-text-field>
        `;
    }
}
```

Enabling a particular column to access multiple pieces of data to use in its rendering is equally trivial:

```TS
public TableColumnNumberWithUnit extends FoundationElement implements ITableColumn {
    ...

    @attr
    public valueKey: string;

    @attr
    public unitKey: string;

    public getDataKeys(): string[] {
        return [valueKey, unitKey];
    }

    public cellTemplateFn(): ViewTemplate<ITableCellData> {
        return html<ITableCellData>`
            <nimble-text-field readonly="true" value=${x => this.formatData(x.data[this.valueKey], x.data[this.unitKey])}>
            </nimble-text-field>
        `;
    }

    public formatData(value: unknown, unit: unknown): string {
        return `${(value as string)}, ${(unit as string)}`;
    }
}
```

Finally, here we have a column visualize in different ways based on custom logic:

```TS
public TableColumnPositiveNegativeNumber extends FoundationElement implements ITableColumn {
    ...

    @attr
    public valueKey: string;

    public getDataKeys(): string[] {
        return [valueKey];
    }

    public cellTemplateFn(): ViewTemplate<ITableCellData> {
        return html<ITableCellData>`
            ${when(x => !this.isPositive(x.data[this.valueKey])),
            html`
                <nimble-text-field readonly="true" value=${x => x.data[this.valueKey]} style="fontColor: red;">
                </nimble-text-field>
            `}
            ${when(x => this.isPositive(x.data[this.valueKey])),
            html`
                <nimble-text-field readonly="true" value=${x => x.data[this.valueKey]} style="fontColor: green;">
                </nimble-text-field>
            `}
        `;
    }

    public isPositive(value: unknown): bool {
        return (value as number) >= 0;
    }
}
```

Note the missing implementation in the above `ITableColumn` implementations are the necessary pieces to register them as FAST components.

### Initial Nimble-provided Columns

`TableColumnText`

_Custom Properties:_

```TS
placeholder: string; // The string to display while no value is present
```

`TableColumnHyperlink`

The API for this column type is out of scope for this spec and should be defined in a separate document. A specific concern for this column that must be addressed is how the hyperlinks that are placed in the shadow DOM of the table will work with the Angular Router (for instance).

`TableColumnIcon`

The API for this column type is also out of scope and should be covered in a separate document. Some unique concerns for this column is how a user can specify the set of icons to display, and then how a user can specify the logic to associate a particular value with one of the provided icons. Additionally, how do we allow a user to specify custom header content (won't be a static `headerTemplateFn` `ITableColumn` implementation).

## Alternative Implementations / Designs

A programmatic API was also considered either in place of, or along side the proposed declarative API. Since declaring what columns to show is an aspect of view configuration, it makes sense to accomplish this declaratively when possible. Offering a programmatic API alongside the declarative one, while possible, does introduce complexity in the implementation that would be nice to avoid, at least initially, if possible.

## Open Issues

-   The current design doesn't offer any strict templating feedback for a particular `ITableColumn` implementation. So, if a user provides a dataKey to a property of an `ITableColumn` that wants the value for that dataKey to be a `DateTime` (i.e. its `cellTemplateFn` implementation expects a `DateTime`), but the value in the actual table data for that key is a string, the user will be unaware of that mismatch at compile time.

    It is unclear how we could provide such feedback, but it would be extremely nice if possible.

-   There is some concern with the lifecycle of these custom column components.
