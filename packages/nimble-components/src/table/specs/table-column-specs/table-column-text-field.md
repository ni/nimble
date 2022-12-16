# TableColumnTextField API

## Problem Statement

The most typical column visualization in the table is a simple readonly text-field. This document covers all of the unique API concerns specific to a text-field column.

## Links To Relevant Work Items and Reference Material

[Table Column API](../table-columns-hld.md)

## Implementation / Design

### [`TableCellState` Reference](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table/specs/table-columns-hld.md#tablecellstate-interface)

```TS
interface TableCellState<TCellData, TColumnConfig> {
    data: TCellData;
    columConfig: TColumnConfig;
}
```

### `TableColumnTextField`

```TS
// import necessary tokens
type TableColumnTextCellData = StringColumnData<'value'>;
type TableColumnTextColumnConfig = { placeholder: string };

public class TableColumnTextField extends TableColumn<TableColumnTextCellData, TableColumnTextColumnConfig> {
    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder };
    }

    public cellDataKeyNames = ['value'] as const;

    @attr
    public valueKey: string;

    @attr
    public placeholder: string; // Column auxiliary configuration

    public getRowDataKeys(): string[] {
        return [valueKey];
    }

    public cellStyles: ElementStyles = css`
        .text-value {
            // set necessary tokens for font/alignment/etc...
        }

        .placeholder {
            // set necessary tokens for font/alignment/etc...
        }
    `

    public cellTemplate: ViewTemplate<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>> =
        html<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>>`
            ${when(x => x.value, html`
                <span class='text-value'>${x => x.data.value}</span>
            `)}
            ${when(x => !x.value, html`
                <span class='placeholder'>${x => x.columnConfig.placeholder}</span>
            `)}
        `;

    public validateCellData(cellData: TableRowData): void {
        if(typeof(cellData['value']) !== 'string') {
            throw new Error('Expected cellData value type of string.');
        }
    }
}
```

Other `NimbleTextField` attributes don't seem necessary to expose (beyond `placeholder`) as they either relate to editable text (such as `readonly`, `disabled`, or `error-text`), or influence the width of the component (such as `size`) which should primarily be dictated through the general column API.

## Alternative Implementations / Designs

Instead of using a `span` in the `cellTemplate` we could use the `NimbleTextField`.

Pros:

-   Ligther-weight than a FAST component, which can lead to better initialization performance, particularly with tables that use this column type for many of their columns, which is likely common.
-   Possibly a more straightforward padding behavior in that it will just use the padding provided by the cell itself to have the text of the cell properly aligned with the header content.

Cons:

-   Once we support editable cells it's possible we would just want to use this column type to support that which would require us to use the `NimbleTextField` anyway.
-   Some of amount of duplicate styling is necessary to get the visual to look like the `NimbleTextField`
-   Some interactions that the `NimbleTextField` has, even in `read-only` mode will not be possible. Notably, the interactions that allow a user to drag-select from any part of the text to the end, even when the end is beyond the cell extents.
