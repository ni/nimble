import type { Table } from '..';
import type { TableRecord } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

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

    public getRecordId(rowIndex: number): string | undefined {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        return rows.item(rowIndex).recordId;
    }

    public getRowWidth(): number {
        const tableRowContainer = this.tableElement.shadowRoot!.querySelector(
            '.table-row-container'
        );
        return tableRowContainer!.scrollWidth;
    }

    public getColumnFractionalWidth(columnIndex: number): number {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        return this.tableElement.columns[columnIndex]!.currentFractionalWidth;
    }

    public getColumnPixelWidth(columnIndex: number): number | null {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        return this.tableElement.columns[columnIndex]!.currentPixelWidth;
    }

    public getColumnRenderedWidth(columnIndex: number): number {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        const row = this.tableElement.shadowRoot?.querySelector('nimble-table-row');
        const cells = row?.shadowRoot?.querySelectorAll('nimble-table-cell');
        if (columnIndex >= (cells?.length ?? 0)) {
            throw new Error(
                'Attempting to index past the total number of cells'
            );
        }

        const columnCell = cells![columnIndex]!;
        return columnCell.getBoundingClientRect().width;
    }

    public setColumnFractionalWidth(
        columnIndex: number,
        fractionalWidth: number
    ): void {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        this.tableElement.columns[columnIndex]!.internalPixelWidth = null;
        this.tableElement.columns[columnIndex]!.internalFractionalWidth = fractionalWidth;
    }

    public setColumnPixelWidth(columnIndex: number, pixelWidth: number): void {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        this.tableElement.columns[columnIndex]!.internalPixelWidth = pixelWidth;
    }

    public setColumnMinPixelWidth(
        columnIndex: number,
        minPixelWidth: number
    ): void {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        this.tableElement.columns[columnIndex]!.internalMinPixelWidth = minPixelWidth;
    }

    public async scrollToLastRowAsync(): Promise<void> {
        const scrollElement = this.tableElement.viewport;
        scrollElement.scrollTop = scrollElement.scrollHeight;
        await waitForUpdatesAsync();
    }
}
