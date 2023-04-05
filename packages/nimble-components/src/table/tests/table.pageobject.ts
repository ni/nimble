import type { Table } from '..';
import type { TableHeader } from '../components/header';
import type { TableRecord } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { MenuButton } from '../../menu-button';
import type { TableCell } from '../components/cell';
import { TableCellView } from '../../table-column/base/cell-view';

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

        return this.getHeaderContentElement(headers.item(columnIndex));
    }

    public getHeaderElement(columnIndex: number): TableHeader {
        const headers = this.tableElement.shadowRoot!.querySelectorAll<TableHeader>(
            'nimble-table-header'
        )!;
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return headers.item(columnIndex);
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

    public getRenderedCellView(
        rowIndex: number,
        columnIndex: number
    ): TableCellView {
        const cell = this.getCell(rowIndex, columnIndex);
        const cellView = cell.shadowRoot!.firstElementChild;
        if (!(cellView instanceof TableCellView)) {
            throw new Error(
                'Cell view not found in cell - ensure cellViewTag is set for column'
            );
        }
        return cellView as TableCellView;
    }

    public getRenderedCellContent(
        rowIndex: number,
        columnIndex: number
    ): string {
        return (
            this.getRenderedCellView(
                rowIndex,
                columnIndex
            ).shadowRoot!.textContent?.trim() ?? ''
        );
    }

    public getCellTitle(rowIndex: number, columnIndex: number): string {
        const cellView = this.getRenderedCellView(rowIndex, columnIndex);
        return (
            cellView.shadowRoot!.querySelector('span')?.getAttribute('title')
            ?? ''
        );
    }

    public dispatchEventToCell(
        rowIndex: number,
        columnIndex: number,
        event: Event
    ): boolean | undefined {
        const cellView = this.getRenderedCellView(rowIndex, columnIndex);
        return cellView.shadowRoot!.querySelector('span')?.dispatchEvent(event);
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

    public async scrollToLastRowAsync(): Promise<void> {
        const scrollElement = this.tableElement.viewport;
        scrollElement.scrollTop = scrollElement.scrollHeight;
        await waitForUpdatesAsync();
    }

    public getCellActionMenu(
        rowIndex: number,
        columnIndex: number
    ): MenuButton | null {
        return this.getCell(
            rowIndex,
            columnIndex
        ).shadowRoot!.querySelector<MenuButton>('nimble-menu-button');
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

    private getCell(rowIndex: number, columnIndex: number): TableCell {
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

        return cells.item(columnIndex);
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
