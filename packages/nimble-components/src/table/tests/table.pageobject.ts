import type { Table } from '..';
import type { TableRecord } from '../types';

/**
 * Page object for the `nimble-table` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TablePageObject<T extends TableRecord> {
    public constructor(private readonly tableElement: Table<T>) {}

    public getRenderedHeaderCount(): number {
        const headers = this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-header'
        )!;
        return headers.length;
    }

    public getRenderedHeaderContent(columnIndex: number): string {
        const headers = this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-header'
        )!;
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return headers.item(columnIndex).textContent?.trim() ?? '';
    }

    public getRenderedRowCount(): number {
        return this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-row'
        ).length;
    }

    public getRenderedCellContent(
        rowIndex: number,
        columnIndex: number
    ): string {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        const row = rows.item(rowIndex);
        const cells = row.shadowRoot!.querySelectorAll('nimble-table-cell');
        if (columnIndex >= cells.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return cells.item(columnIndex).shadowRoot!.textContent?.trim() ?? '';
    }

    public getRowId(rowIndex: number): string | undefined {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        return rows.item(rowIndex).recordId;
    }
}
