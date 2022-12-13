# TableColumnText API

## Problem Statement

The most typical column visualization in the table is a simple readonly text. This document covers all of the unique API concerns specific to the text column.

## Links To Relevant Work Items and Reference Material

[Table Column API](../table-columns-hld.md)

## Implementation / Design

### `TableColumnText`

```TS
type TableColumnTextCellData = StringColumnData<'value'>;

public class TableColumnText extends TableColumn {
      public generateCellState = (cellData: TextColumnCellData): TableColumnTextCellState<TextColumnCellData> => {
        return { data: cellData, placeholder: this.placeholder };
    }

    public cellDataKeyNames = ['value'] as const;

    @attr
    public valueKey: string;

    @attr
    public placeholder: string; // Column auxiliary configuration

    public getRowDataKeys(): string[] {
        return [valueKey];
    }

    public cellTemplate: ViewTemplate<TableCellState<TableColumnTextCellData>> =
        html<TableCellState<TableColumnTextCellData>>`
            <nimble-text-field readonly="true" value=${x => x.data.value} placeholder=${x => x.placeholder}>
            </nimble-text-field>
        `;

    public validateCellData(cellData: TableRowData): boolean {
        return typeof cellData['value'] === 'string';
    }  
}
```

## Alternative Implementations / Designs

*Describe any design alternatives and discuss why they were rejected.*

## Open Issues

*Describe any open issues with the design that you need feedback on before proceeding.*
*It is expected that these issues will be resolved during the review process and this section will be removed when this documented in pulled into source.*
