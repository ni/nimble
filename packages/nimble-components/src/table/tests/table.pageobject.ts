import type { Table } from '..';
import type { TableHeader } from '../components/header';
import type { TableRecord } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { MenuButton } from '../../menu-button';

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

    public getRenderedCellCountForRow(rowIndex: number): number {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        const row = rows.item(rowIndex);
        const cells = row.shadowRoot!.querySelectorAll('nimble-table-cell');
        return cells.length;
    }

    public getHeaderContent(columnIndex: number): Node | undefined {
        const headers = this.tableElement.shadowRoot!.querySelectorAll<TableHeader>(
            'nimble-table-header'
        )!;
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return this.getHeaderContentElement(headers[columnIndex]!);
    }

    public getHeaderRenderedWidth(columnIndex: number): number {
        const headers = this.tableElement.shadowRoot!.querySelectorAll<TableHeader>(
            'nimble-table-header'
        )!;
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return headers[columnIndex]!.getBoundingClientRect().width;
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

    public getCellRenderedWidth(columnIndex: number, rowIndex = 0): number {
        if (columnIndex >= this.tableElement.columns.length) {
            throw new Error(
                'Attempting to index past the total number of columns'
            );
        }

        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }
        const row = rows[rowIndex];
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

    public getCellActionMenu(
        rowIndex: number,
        columnIndex: number
    ): MenuButton | null {
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

        return cells
            .item(columnIndex)
            .shadowRoot!.querySelector<MenuButton>('nimble-menu-button');
    }

    public async clickCellActionMenu(
        rowIndex: number,
        columnIndex: number
    ): Promise<void> {
        this.setRowHoverState(rowIndex, true);
        await waitForUpdatesAsync();

        const menuButton = this.getCellActionMenu(rowIndex, columnIndex);
        if (!menuButton) {
            throw new Error('Cannot click on a non-visible action menu');
        }

        menuButton.toggleButton!.control.click();
    }

    public isCellActionMenuVisible(
        rowIndex: number,
        columnIndex: number
    ): boolean {
        const actionMenu = this.getCellActionMenu(rowIndex, columnIndex);
        if (!actionMenu) {
            return false;
        }

        return window.getComputedStyle(actionMenu).display !== 'none';
    }

    public setRowHoverState(rowIndex: number, hover: boolean): void {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        const cells = rows
            .item(rowIndex)
            .shadowRoot!.querySelectorAll('nimble-table-cell');
        if (hover) {
            cells.forEach(cell => cell.style.setProperty(
                '--ni-private-table-cell-action-menu-display',
                'block'
            ));
        } else {
            cells.forEach(cell => cell.style.removeProperty(
                '--ni-private-table-cell-action-menu-display'
            ));
        }
    }

    private getHeaderContentElement(
        element: HTMLElement | HTMLSlotElement
    ): Node | undefined {
        const nodeChildren = this.isSlotElement(element)
            ? element.assignedNodes()
            : element.shadowRoot?.childNodes;
        if (!nodeChildren) {
            return undefined;
        }

        const slotElement = Array.from(nodeChildren)?.find<HTMLSlotElement>(
            this.isSlotElement
        );
        if (slotElement) {
            return this.getHeaderContentElement(slotElement);
        }

        return nodeChildren[0]; // header content should be first item in final slot element
    }

    private readonly isSlotElement = (
        element: Node | undefined
    ): element is HTMLSlotElement => {
        return element?.nodeName === 'SLOT' ?? false;
    };
}
