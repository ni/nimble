# Nimble Table Columns API

## Problem Statement

The `nimble-table` requires users to be able to configure which columns to display for a table. Additionally, a particular display column may require access to multiple fields in the data, and allow a user to define the field to sort by. We need to provide a means for a client to provide their own column visualization. Finally, columns must also provide the user to either specify the header text, or custom visuals to use for the header.

### Out of scope of this HLD

Programmatic API for state that could be considered column-centric: width, sort direction, grouped, etc. These concerns should be covered in separate designs covering those topics specifically, allowing for discussion on both the interactive side and the API design on an individual basis.

## Links To Relevant Work Items and Reference Material

[Table Spec](./README.md)

[Table Declarative Columns API prototype:](https://github.com/ni/nimble/blob/325983040e886e52a100664d8fb1129dee767c2f/packages/nimble-components/src/table/tests/table.stories.ts#L23) ([Storybook](https://60e89457a987cf003efc0a5b-twewjutggo.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story))

## Implementation / Design

Columns will be provided to the table as slotted elements. The slot for the columns will be the default slot for the table, and thus no slot needs to be expressly provided by the user for a column:

```
<nimble-table>
    <nimble-table-column-text data-key="name"></nimble-table-column-text>
    <nimble-table-column-icon data-key="ready"></nimble-table-column-icon>
    ...
</nimble-table>
```

These columns will _not_ have templates/CSS associated with them, and instead be implementations of an interface that will require returning a FAST ViewTemplate for its visual representation. The ordering of the columns in the markup will determine the visual ordering of the columns (top to bottom equals left to right...unless in 'rtl'). Re-ordering of columns will be done, at least at first, through the re-ordering of the columns elements in the DOM.

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

### `TableCellData` interface

A table cell represents a single column for a single row. The data that a cell has access to will be a subset of the data for the entire row. An instance of a table cell will be generic to describe the subset of data it contains, where `TCellData` is a subset of the data represented by `TableRowData`:

```TS
interface TableCellData<TCellData extends TableRowData> {
  data: TCellData;
}
```

This interface could possibly be expanded in the future to communicate relevant table state to the cell template, such as whether or not the row is selected.

### `ITableColumn` interface

This interface is what a column web component (i.e. a slotted column) must implement.

```TS
interface ITableColumn<TCellData extends TableRowData> {
    // The string to use in the header for the column
    header?: string;

    // The template to use for the header (string if none provided)
    headerTemplateFn?: () => ViewTemplate;

    // The template to use to render the cell content for the column
    cellTemplate: ViewTemplate<TableCellData<TCellData>>;

    // The keys that should be present in TCellData.
    // This array is parallel with the keys returned from `getDataKeys()`.
    readonly cellDataKeyNames: readonly string[];

    // The keys from the row data that correlate to the data that will be in TCellData.
    // This array is parallel with the keys specified by `dataKeyNames`.
    getRowDataKeys: () => string[];

    // Function that allows the table column to validate the type that gets created
    // for the cell data. This should validate that the types in TCellData are correct
    // for each key defined by `dataKeyNames`.
    // Return `true` if the data is valid. Return `false` if the data is not valid.
    validateCellData(cellData: TableRowData): boolean;
}
```

The `ITableColumn` interface would be updated to support other features not covered in this HLD such as sorting and grouping.

Given the above interface, a series of column providers to handle basic use cases can be written within nimble. For example, the `ITableColumn` implementation we could create for rendering data as a read-only `NimbleTextField` could look like this:

```TS
type TableColumnTextCellData = StringColumnData<'value'>;
public TableColumnText extends FoundationElement implements ITableColumn<TableColumnTextCellData> {
    ...

    public cellDataKeyNames = ['value'] as const;

    @attr
    public valueKey: string;

    public getRowDataKeys(): string[] {
        return [valueKey];
    }

    public cellTemplate: ViewTemplate<ITableCellData<TableColumnTextCellData>> =
        html<ITableCellData<TableColumnTextCellData>>`
            <nimble-text-field readonly="true" value=${x => x.data.value}>
            </nimble-text-field>
        `;

    public validateCellData(cellData: TableRowData): boolean {
        return typeof cellData['value'] === 'string';
    }
}
```

This also enables columns to access multiple pieces of data to use in its rendering:

```TS
type TableColumnNumberWithUnitCellData = NumberColumnData<'value'> & StringColumnData<'units'>;
public TableColumnNumberWithUnit extends FoundationElement implements ITableColumn<TableColumnNumberWithUnitCellData> {
    ...

    public cellDataKeyNames = ['value', 'units'] as const;

    @attr
    public valueKey: string;

    @attr
    public unitKey: string;

    public getRowDataKeys(): string[] {
        return [valueKey, unitKey];
    }

    public cellTemplate: ViewTemplate<ITableCellData<TableColumnTextCellData>> =
        html<ITableCellData<TableColumnNumberWithUnitCellData>>`
            <nimble-text-field
                readonly="true"
                value=${x => this.formatData(x.data.value, x.data.units)}
            >
            </nimble-text-field>
        `;

    public formatData(value: number, unit: string): string {
        return `${value.toString()} ${units}`;
    }

    public validateCellData(cellData: TableRowData): boolean {
        return typeof cellData['value'] === 'number' && typeof cellData['units'] === 'string';
    }
}
```

Here we have a column visualized in different ways based on custom logic:

```TS
type TableColumnPositiveNegativeNumberCellData = NumberColumnData<'value'>;
public TableColumnPositiveNegativeNumber extends FoundationElement implements ITableColumn<TableColumnPositiveNegativeNumberCellData> {
    ...

    public cellDataKeyNames = ['value'] as const;

    @attr
    public valueKey: string;

    public getRowDataKeys(): string[] {
        return [valueKey];
    }

    public cellTemplate: ViewTemplate<ITableCellData<TableColumnPositiveNegativeNumberCellData>> =
        html<ITableCellData<TableColumnPositiveNegativeNumberCellData>`
            ${when(x => !this.isPositive(x.data.value)),
            html`
                <nimble-text-field
                    readonly="true"
                    value=${x => x.data.value}
                    style="fontColor: red;"
                >
                </nimble-text-field>
            `}
            ${when(x => this.isPositive(x.data.value)),
            html`
                <nimble-text-field
                    readonly="true"
                    value=${x => x.data.value}
                    style="fontColor: green;"
                >
                </nimble-text-field>
            `}
        `;

    public isPositive(value: number): bool {
        return value >= 0;
    }

    public validateCellData(cellData: TableRowData): boolean {
        return typeof cellData['value'] === 'number';
    }
}
```

Finally, here is a column that allows a user to register a callback for a click event on a button inside the cell template:

```TS
type TableColumnButtonCellData = StringColumnData<'id'>;
public TableColumnButton extends FoundationElement implements ITableColumn<TableColumnButtonCellData> {
    ...

    public cellDataKeyNames = ['id'] as const;

    @attr
    public idKey: string;

    public getRowDataKeys(): string[] {
        return [valueKey];
    }

    public callback: (id: string) => void;

    public cellTemplate: ViewTemplate<ITableCellData<TableColumnButtonCellData>> =
        html<ITableCellData<TableColumnButtonCellData>>`
            <nimble-button readonly="true" @click="${x => this.callback(x.data.id)}>
                <span>Press Me</span>
            </nimble-button>
        `;

    public validateCellData(cellData: TableRowData): boolean {
        return typeof cellData['id'] === 'string';
    }
}
```

Angular template:

```HTML
<nimble-table>
    <nimble-table-column-button #tableButton></nimble-table-column-button>
</nimble-table>
```

Angular code:

```TS
@ViewChild('tableButton', { read: NimbleTableColumnButton, static: true }) private readonly tableButton!: NimbleTableColumnButton;

public ngOnInit(): void {
    tableButton.callback = this.doSomething;
}

private doSomething(id: string): void {
    ...
}

```

Note the missing implementation in the above `ITableColumn` implementations are the necessary pieces to register them as FAST components.

## Alternative Implementations / Designs

### Programmatic API

A programmatic API was also considered either in place of, or along side the proposed declarative API. Since declaring what columns to show is an aspect of view configuration, it makes sense to accomplish this declaratively when possible. Offering a programmatic API alongside the declarative one, while possible, does introduce complexity in the implementation that would be nice to avoid, at least initially, if possible.

## Open Issues

-   The current design doesn't offer any strict templating feedback (in Angular) for a particular `ITableColumn` implementation. So, if a user provides a dataKey to a property of an `ITableColumn` that wants the value for that dataKey to be a `DateTime` (i.e. its `cellTemplateFn` implementation expects a `DateTime`), but the value in the actual table data for that key is a string, the user will be unaware of that mismatch at compile time.

    It is unclear how we could provide such feedback, but it would be extremely nice if possible.

    (*RESOLVED*) - While we recognize that offering strict templating feedback in something like an Angular environment would be nice, it's not immediately obvious how we would accomplish this, and isn't critical, so, for now, we will not bother with this.
