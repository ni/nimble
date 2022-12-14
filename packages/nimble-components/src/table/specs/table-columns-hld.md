# Nimble Table Columns API

## Problem Statement

The `nimble-table` requires users to be able to configure which columns to display for a table. Additionally, a particular display column may require access to multiple fields in the data, and allow a user to define the field to sort by. We need to provide a means for a client to provide their own column visualization. Finally, columns must also specify the content to render in its header.

### Out of scope of this HLD

Programmatic API for state that could be considered column-centric: width, sort direction, grouped, etc. These concerns should be covered in separate designs covering those topics specifically, allowing for discussion on both the interactive side and the API design on an individual basis.

## Links To Relevant Work Items and Reference Material

[Table Spec](./README.md)

[Table Declarative Columns API prototype:](https://github.com/ni/nimble/blob/325983040e886e52a100664d8fb1129dee767c2f/packages/nimble-components/src/table/tests/table.stories.ts#L23) ([Storybook](https://60e89457a987cf003efc0a5b-twewjutggo.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story))

## Implementation / Design

Column custom elements will be provided to the table as slotted elements. The slot for the column elements will be the default slot for the table, and thus no slot needs to be expressly provided by the user for a column element:

```HTML
<nimble-table>
    <nimble-table-column-text data-key="name"></nimble-table-column-text>
    <nimble-table-column-icon data-key="ready"></nimble-table-column-icon>
    ...
</nimble-table>
```

These column elements will _not_ have templates/CSS associated with them. Instead, each column element will provide a FAST ViewTemplate for the visual representation of each cell in the column. The ordering of the column elements in the markup will determine the visual ordering of the columns (top to bottom equals left to right...unless in 'rtl'). Re-ordering of columns will be done, at least at first, through the re-ordering of the column elements in the DOM.

The table API to support this could look like the following:

```TS
public Table<TableRecord> extends FoundationElement {
    ...

    /*
     * @internal
     */
    @observable
    public readonly slottedColumns: TableColumn[] = [];

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

### Framework Integration

Column elements will always be FAST-based custom elements. Framework-specific constructs/content are not supported. Standard column types (e.g. text-field, link, icon, etc) will be provided by Nimble. For non-standard column types, clients will be expected to implement a custom column element, which the rest of this document desribes in detail.

### `TableCellState` interface

A table cell represents a single column for a single row. The data that a cell has access to will be a subset of the data for the entire row. An instance of a table cell will be generic to describe the subset of data it contains, where the `TCellData` type is a superset of the type represented by [`TableRecord`](https://github.com/ni/nimble/blob/3e4b8d3dd59431d1671e381aa66052db57bc475c/packages/nimble-components/src/table/types.ts#L24):

```TS
interface TableCellState<TCellData extends TableRecord, TColumnConfig> {
  data: TCellData;
  columnConfig: TColumnConfig;
}
```

This interface could possibly be expanded in the future to communicate relevant table state to the cell template, such as whether or not the row is selected.

### `TableColumn<>`

This abstract class is what a column web component (i.e. a slotted column element) must extend.

```TS
abstract class TableColumn<TCellData extends TableRecord = TableRecord, TColumnConfig = {}> {
    // This method returns the relevant, static configuration a column rquires its cellTemplate
    // to have access to
    getColumnConfig(): TColumnConfig {}

    // The template to use to render the cell content for the column
    abstract cellTemplate: ViewTemplate<TableCellState<TCellData, TColumnConfig>>;

    // The style to apply to the cellTemplate
    cellStyles?: ElementStyles;

    // The keys that should be present in TCellData.
    // This array is parallel with the keys returned from `getRecordFieldNames()`.
    readonly cellStateDataFieldNames: readonly string[];

    // The keys from the row data that correlate to the data that will be in TCellData.
    // This array is parallel with the keys specified by `cellStateDataFieldNames`.
    abstract getRecordFieldNames(): string[];

    // Function that allows the table column to validate the type that gets created
    // for the cell data. This should validate that the types in TCellData are correct
    // for each key defined by `cellStateDataFieldNames`.
    // This function should throw if validation fails.
    abstract validateCellData(cellData: TCellData): void;
}
```

_Note: The `TableColumn` class may be updated to support other features not covered in this HLD such as sorting and grouping._

Given the above class, a series of column elements to handle basic use cases can be written within Nimble. For example, the `TableColumn` implementation we could create for rendering data as a read-only `NimbleTextField` could look like this:

```TS
type TableColumnTextCellData = StringField<'value'>;
type TableColumnTextColumnConfig = { placeholder: string };

// this interface is used to pass auxiliary configuration to access within the cellTemplate
interface TableColumnTextCellState<TCellData extends TableRecord, TableColumnTextColumnConfig> extends TableCellState<TCellData, TableColumnTextColumnConfig> { }

public class TableColumnText extends TableColumn<TableColumnTextCellData, TableColumnTextColumnConfig> {
    ...

    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder };
    }

    public cellStateDataFieldNames = ['value'] as const;

    @attr
    public valueKey: string;

    @attr
    public placeholder: string; // Column auxiliary configuration

    public getRecordFieldNames(): string[] {
        return [valueKey];
    }

    public readonly cellTemplate: ViewTemplate<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>> =
        html<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>>`
            <nimble-text-field readonly="true" value="${x => x.data.value}" placeholder="${x => x.columnConfig.placeholder}">
            </nimble-text-field>
        `;

    public validateCellData(cellData: TCellData): void {
        if(typeof(cellData['value']) !== 'string') {
            throw new Error('Type for cellData is incorrect!');
        }
    }
}
```

In the above example, notifications for when the `placeholder` property changed would be handled by the base class, and it would be responsible for any further action. This aciton could be a combination of things like causing a re-render, and issuing an event that may be publically visibile (such as `column-configuration-changed`). These details will be ironed out outside of this spec.

Below demonstrates how column elements can access multiple fields from the row's record to use in its rendering:

```TS
type TableColumnNumberWithUnitCellData = NumberField<'value'> & StringField<'units'>;

const formatData = (value: number, unit: string): string => {
    return `${value.toString()} ${units}`;
};

public TableColumnNumberWithUnit extends FoundationElement implements ITableColumn<TableColumnNumberWithUnitCellData> {
    ...

    public cellStateDataFieldNames = ['value', 'units'] as const;

    @attr
    public valueKey: string;

    @attr
    public unitKey: string;

    public getRecordFieldNames(): string[] {
        return [valueKey, unitKey];
    }

    public readonly cellTemplate: ViewTemplate<TableCellState<TableColumnNumberWithUnitCellData>> =
        html<TableCellState<TableColumnNumberWithUnitCellData>>`
            <nimble-text-field
                readonly="true"
                value="${x => formatData(x.data.value, x.data.units)}"
            >
            </nimble-text-field>
        `;

    public validateCellData(cellData: TCellData): void {
        if(!(typeof(cellData['value']) === 'number' && typeof typeof(cellData['units']) === 'string')) {
            throw new Error('Type for cellData is incorrect!');            
        }
    }
}
```

Here we have a cell visualized in different ways based on custom logic:

```TS
type TableColumnPositiveNegativeNumberCellData = NumberField<'value'>;

const isPositive = (value: number): bool => {
    return value >= 0;
}

public TableColumnPositiveNegativeNumber extends FoundationElement implements ITableColumn<TableColumnPositiveNegativeNumberCellData> {
    ...

    public cellStateDataFieldNames = ['value'] as const;

    @attr
    public valueKey: string;

    public getRecordFieldNames(): string[] {
        return [valueKey];
    }

    public readonly cellStyles: ElementStyles = 
        css`
            .good {
                color: green;
            }

            .bad {
                color: red;
            }
        `;

    public readonly cellTemplate: ViewTemplate<TableCellState<TableColumnPositiveNegativeNumberCellData>> =
        html<TableCellState<TableColumnPositiveNegativeNumberCellData>`
            <nimble-text-field
                class="${x => isPositive(x.data.value) ? "good" : "bad"}"
                readonly="true"
                value="${x => x.data.value}"
            >
            </nimble-text-field>
        `;

    public validateCellData(cellData: TCellData): void {
        if (typeof(cellData['value']) !== 'number') {
            throw new Error('Type for cellData is incorrect!');            
        }
    }
}
```

Finally, here is a column element that allows a user to register a callback for a click event on a button inside the cell template:

```TS
type TableColumnButtonCellData = StringField<'id'>;

public TableColumnButton extends FoundationElement implements ITableColumn<TableColumnButtonCellData> {
    ...

    public cellStateDataFieldNames = ['id'] as const;

    @attr
    public idKey: string;

    public getRecordFieldNames(): string[] {
        return [valueKey];
    }

    public callback: (id: string) => void;

    public readonly cellTemplate: ViewTemplate<TableCellState<TableColumnButtonCellData>> =
        html<TableCellState<TableColumnButtonCellData>>`
            <nimble-button @click="${(x, c) => c.event.currentTarget.$emit('button-click'), {data: x.data.id})}">
                <span>Press Me</span>
            </nimble-button>
        `;

    public validateCellData(cellData: TCellData): void {
        if (typeof(cellData['id']) ~== 'string') {
            throw new Error('Type for cellData is incorrect!');            
        }
    }
}
```

Angular template:

```HTML
<nimble-table (button-click)="doSomething($event)">
    <nimble-table-column-button></nimble-table-column-button>
</nimble-table>
```

Angular code:

```TS
private doSomething(CustomEvent e): void {
    ...
}

```

The exact pattern for how we expect event APIs to be implemented is TBD. The above is simply illustrative of one approach, but it's safe to say that the goal will be to provide frameworks like Angular the expected event binding APIs.

_Note: The implementation necessary to register the column elements as FAST components is missing, and has been omitted for brevity's sake._

### Header Content

Clients should be allowed to use arbitrary content for the display part of a header. This is accomplished through slotting the desired content in the default slot of a `TableColumn` element. The details of how this is implemented will not be captured here, just the proposed API.

```HTML
<nimble-table>
    <nimble-table-column-text>
        <!-- uses icon for column header -->
        <nimble-icon-x></nimble-icon-x>
    <nimble-table-column-text>
</nimble-table>
```

## Alternative Implementations / Designs

### Programmatic API

A programmatic API was also considered either in place of, or along side the proposed declarative API. Since declaring what columns to show is an aspect of view configuration, it makes sense to accomplish this declaratively when possible. Offering a programmatic API alongside the declarative one, while possible, does introduce complexity in the implementation that would be nice to avoid, at least initially, if possible.

## Open Issues

-   The current design doesn't offer any strict templating feedback (in Angular) for a particular `TableColumn` implementation. So, if a user provides a dataKey to a property of an `TableColumn` that wants the value for that dataKey to be a `DateTime` (i.e. its `cellTemplate` implementation expects a `DateTime`), but the value in the actual table data for that key is a string, the user will be unaware of that mismatch at compile time.

    It is unclear how we could provide such feedback, but it would be extremely nice if possible.

    (_RESOLVED_) - While we recognize that offering strict templating feedback in something like an Angular environment would be nice, it's not immediately obvious how we would accomplish this, and isn't critical, so, for now, we will not bother with this.
