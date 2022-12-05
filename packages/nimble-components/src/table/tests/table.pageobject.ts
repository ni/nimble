import type { ITableData, Table } from '..';

/**
 * Page Object for the `nimble-table` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TablePageObject<T extends ITableData> {
    public constructor(private readonly tableElement: Table<T>) {}

    public getRenderedRowCount(): number {
        return (
            this.tableElement.shadowRoot!.querySelectorAll('.table-row')
                .length || 0
        );
    }

    public getCellContent(rowIndex: number, columnIndex: number): string {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('.table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index passed the total number of rendered rows'
            );
        }

        const row = rows.item(rowIndex);
        const cells = row.querySelectorAll('.table-cell');
        if (columnIndex >= cells.length) {
            throw new Error(
                'Attempting to index passed the totla number of rendered columns'
            );
        }

        return cells.item(columnIndex).textContent || '';
    }
}
