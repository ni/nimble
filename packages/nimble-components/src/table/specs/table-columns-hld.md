# Nimble Table Columns API

## Problem Statement

The `nimble-table` requires users to be able to configure which columns to display for a table. Additionally, a particular display column may require access to multiple fields in the data, and allow a user to define the field to sort by. We need to provide a means for a client to provide their own column visualization. Finally, columns must also specify the content to render in its header.

### Out of scope of this HLD

Programmatic API for state that could be considered column-centric: width, sort direction, grouped, etc. These concerns should be covered in separate designs covering those topics specifically, allowing for discussion on both the interactive side and the API design on an individual basis.

Defining the API for how a column will specify which data field will be used for sorting (when it uses multiple fields) is also out of scope for this HLD.

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

These column elements will _not_ have templates/CSS associated with them. Instead, each column element have an associated FAST-based custom element which will be used in each table cell for that column. The ordering of the column elements in the markup will determine the visual ordering of the columns (top to bottom equals left to right...unless in 'rtl'). Re-ordering of columns will be done, at least at first, through the re-ordering of the column elements in the DOM.

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

Column elements, and the associated elements used in table cells, will always be FAST-based custom elements. Framework-specific constructs/content are not supported. Standard column types (e.g. text-field, link, icon, etc) will be provided by Nimble. For non-standard column types, clients will be expected to implement a custom column type, which the rest of this document desribes in detail.

### `TableCellState` interface

A table cell represents a single column for a single row. The data that a cell has access to will be a subset of the data for the entire row. An instance of a table cell will be generic to describe the subset of data it contains, where the `TCellRecord` type is a superset of the type represented by [`TableRecord`](https://github.com/ni/nimble/blob/3e4b8d3dd59431d1671e381aa66052db57bc475c/packages/nimble-components/src/table/types.ts#L24):

```TS
interface TableCellState<TCellRecord extends TableRecord, TColumnConfig> {
  data: TCellRecord;
  columnConfig: TColumnConfig;
  recordId: string;
}
```

This interface could possibly be expanded in the future to communicate relevant table state to the cell template, such as whether or not the row is selected.

### `TableColumn<>`

This abstract class is what a column web component (i.e. a slotted column element) must extend.

```TS
abstract class TableColumn<TColumnConfig = {}> {
    // An optional ID to associated with the column.
    @attr({ attribute: 'column-id' })
    columnId?: string;

    // The name of the slot containing the action menu for this column, or `undefined` to indicate
    // that the column does not have an action menu.
    // Note: Multiple columns can specify the same slot.
    @attr({ attribute: 'action-menu-slot'})
    actionMenuSlot?: string;

    // The label to associated with the column's action menu for accessibility purposes.
    @attr({ attribute: 'action-menu-label' })
    actionMenuLabel?: string;

    // The index for sorting the column. When multiple columns are sorted,
    // they will be sorted from lowest index to highest index.
    @attr({ attribute: 'sort-index', converter: nullableNumberConverter })
    public sortIndex?: number | null;

    // The direction the column is sorted.
    @attr({ attribute: 'sort-direction' })
    public sortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

    // The relevant, static configuration a column requires its cellTemplate to have access to.
    columnConfig?: TColumnConfig;

    // The tag (element name) of the custom element that renders the cell content for the column.
    // Should derive from TableCellView<TCellRecord, TColumnConfig>.
    cellViewTag: string;

    // The names of the fields that should be present in TCellRecord.
    // This array is parallel with the field names specified by `dataRecordFieldNames`.
    readonly cellRecordFieldNames: readonly string[];

    // The names of the fields from the row's record that correlate to the data that will be in TCellRecord.
    // This array is parallel with the field names specified by `cellRecordFieldNames`.
    dataRecordFieldNames: readonly (TableFieldName | undefined)[] = [];

    // The name of the data field that will be used for operations on the table, such as sorting and grouping.
    operandDataRecordFieldName?: TableFieldName;

    /**
     * @internal
     *
     * The operation to use when sorting the table by this column.
     */
    @observable
    public sortOperation: TableColumnSortOperation;

    // Function that allows the table column to validate the type that gets created
    // for the cell data. This should validate that the types in TCellRecord are correct
    // for each key defined by `cellRecordFieldNames`.
    // This function should throw if validation fails.
    abstract validateCellData(cellData: TCellRecord): void;
}
```

_Note: The `TableColumn` class may be updated to support other features not covered in this HLD such as sorting and grouping._

### `TableCellView<>`

```TS
abstract class TableCellView<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
>
    extends FoundationElement
    implements TableCellState<TCellRecord, TColumnConfig> {
    @observable
    public cellRecord!: TCellRecord;

    @observable
    public columnConfig!: TColumnConfig;

    /**
     * Called if an element inside this cell element has focus, and this row/cell is being recycled.
     * Expected implementation is to commit changes as needed, and blur the focusable element (or close
     * the menu/popup/etc).
     */
    public focusedRecycleCallback(): void {}
}
```

Requiring column plugins to create custom elements for use in the table cells has several implications:

-   The elements encapsulate any state needed by the cell
-   The cell element templates can use `ref` to get references to view elements from their templates, for use in their element code
-   Simplifies the API needed to respond to events from the table. One example is `TableCellView.focusedRecycleCallback()` which will be called before a row is recycled during a virtualized scroll, giving column plugins the opportunity to commit changes and blur the control in the cell.

Given the above classes, a series of column types to handle basic use cases can be written within Nimble. For example, the `TableColumn` implementation we could create for rendering data as a read-only `NimbleTextField` could look like this:

```TS
type TableColumnTextCellRecord = TableStringField<'value'>;
type TableColumnTextColumnConfig = { placeholder: string };

public class TableColumnText extends TableColumn<TableColumnTextCellRecord, TableColumnTextColumnConfig> {
    ...

    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder };
    }

    public cellRecordFieldNames = ['value'] as const;

    @attr
    public valueKey: string;

    @attr
    public placeholder: string; // Column auxiliary configuration

    public getDataRecordFieldNames(): string[] {
        return [valueKey];
    }

    public cellViewTag = 'nimble-table-cell-view-text';

    public validateCellData(cellData: TCellRecord): void {
        if (typeof(cellData['value']) !== 'string') {
            throw new Error('Type for cellData is incorrect!');
        }
    }
}
```

In the above example, notifications for when the `placeholder` property changed would be handled by the base class, and it would be responsible for any further action. This action could be a combination of things like causing a re-render, and issuing an event that may be publicly visible (such as `column-configuration-changed`). These details will be ironed out outside of this spec.

The corresponding cell element implementation would look like this:

```TS
class TextCellView extends TableCellView<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    @observable
    public override cellRecord!: TableColumnTextCellRecord;

    @observable
    public override columnConfig!: TableColumnTextColumnConfig;

    @volatile
    public get content(): string {
        return typeof this.cellRecord.value === 'string'
            ? this.cellRecord.value
            : this.columnConfig.placeholder;
    }

    public textField!: TextField;
}

const textCellView = TextCellView.compose({
    baseName: 'table-cell-view-text',
    template: html<TextCellView>`
        <nimble-text-field ${ref('textField')} readonly="true" value="${x => x.cellRecord.value}" placeholder="${x => x.columnConfig.placeholder}">
        </nimble-text-field>`,
    styles: /* styling */
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
```

Below demonstrates how column elements can access multiple fields from the row's record to use in its rendering:

```TS
type TableColumnNumberWithUnitCellData = NumberField<'value'> & TableStringField<'units'>;

public class TableColumnNumberWithUnit extends TableColumn {
    ...

    public cellRecordFieldNames = ['value', 'units'] as const;

    @attr
    public valueKey: string;

    @attr
    public unitKey: string;

    public cellViewTag = 'nimble-table-cell-view-number-with-unit';

    public getDataRecordFieldNames(): string[] {
        return [valueKey, unitKey];
    }

    public validateCellData(cellData: TCellRecord): void {
        if (!(typeof(cellData['value']) === 'number' && typeof typeof(cellData['units']) === 'string')) {
            throw new Error('Type for cellData is incorrect!');
        }
    }
}

class NumberWithUnitCellView extends TableCellView<TableColumnNumberWithUnitCellData> {
    public get formattedValue(): string {
        return `${this.cellRecord.value.toString()} ${this.cellRecord.units}`;
    }
}
const numberWithUnitCellView = NumberWithUnitCellView.compose({
    baseName: 'table-cell-view-number-with-unit',
    template: html<NumberWithUnitCellView>`
        <nimble-text-field
            readonly="true"
            value="${x => x.formattedValue}"
        >
        </nimble-text-field>`,
    styles: /* styling */
});
```

Here we have a cell visualized in different ways based on custom logic:

```TS
type TableColumnPositiveNegativeNumberCellData = NumberField<'value'>;

const isPositive = (value: number): bool => {
    return value >= 0;
}

public class TableColumnPositiveNegativeNumber extends TableColumn {
    ...

    public cellRecordFieldNames = ['value'] as const;

    @attr
    public valueKey: string;

    public cellViewTag = 'table-cell-view-positive-negative-number';

    public getDataRecordFieldNames(): string[] {
        return [valueKey];
    }

    public validateCellData(cellData: TCellRecord): void {
        if (typeof(cellData['value']) !== 'number') {
            throw new Error('Type for cellData is incorrect!');
        }
    }
}

class PositiveNegativeNumberCellView extends TableCellView<TableColumnPositiveNegativeNumberCellData> {
    public get textFieldCssClass(): string {
        return this.cellRecord.value > 0 ? 'good' : 'bad';
    }
}
const positiveNegativeNumberCellView = PositiveNegativeNumberCellView.compose({
    baseName: 'table-cell-view-positive-negative-number',
    template: html<PositiveNegativeNumberCellView>`
        <nimble-text-field
            class="${x => x.textFieldCssClass}"
            readonly="true"
            value="${x => x.cellRecord.value}"
        >
        </nimble-text-field>`,
    styles: css`
        .good {
            color: green;
        }

        .bad {
            color: red;
        }
    `
});
```

Finally, here is a column element that allows a user to register a callback for a click event on a button inside the cell template:  

```TS
type TableColumnButtonCellData = TableStringField<'id'>;

public class TableColumnButton extends TableColumn<TableColumnButtonCellData> {
    ...

    public cellRecordFieldNames = ['id'] as const;

    @attr
    public idKey: string;

    public getDataRecordFieldNames(): string[] {
        return [valueKey];
    }

    public cellViewTag = 'table-cell-view-button';

    public validateCellData(cellData: TCellRecord): void {
        if (typeof(cellData['id']) !== 'string') {
            throw new Error('Type for cellData is incorrect!');
        }
    }
}

class ButtonCellView extends TableCellView<TableColumnButtonCellData> {
    public onButtonClick(): void {
        this.$emit('button-click', { data: this.cellRecord.id })
    }
}
const buttonCellView = ButtonCellView.compose({
    baseName: 'table-cell-view-button',
    template: html<ButtonCellView>`
        <nimble-button @click="${(x) => x.onButtonClick()}">
            <span>Press Me</span>
        </nimble-button>`,
    styles: /* styling */
});
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
