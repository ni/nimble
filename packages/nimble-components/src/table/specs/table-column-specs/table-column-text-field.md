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

    public cellTemplate: ViewTemplate<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>> =
        html<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>>`
            <nimble-text-field readonly="true" value="${x => x.data.value}" placeholder="${x => x.columnConfig.placeholder}">
            </nimble-text-field>
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

None.