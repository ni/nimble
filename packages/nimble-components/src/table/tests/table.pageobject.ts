import type { Table } from '..';
import type { TableHeader } from '../components/header';
import type { TableRecord } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { MenuButton } from '../../menu-button';
import type { TableCell } from '../components/cell';
import type { TableGroupHeaderView } from '../../table-column/base/group-header-view';
import { TableCellView } from '../../table-column/base/cell-view';
import type { TableRow } from '../components/row';

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
        const row = this.getRow(rowIndex);
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

    public getRenderedGroupRowCount(): number {
        return this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-group-row'
        ).length;
    }

    public getAllGroupRowExpandedState(): boolean[] {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-group-row'
        );
        return Array.from(groupRows).map(row => row.expanded);
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

    public getRenderedGroupHeaderContent(groupRowIndex: number): string {
        return (
            this.getGroupRowHeaderView(
                groupRowIndex
            ).shadowRoot!.textContent?.trim() ?? ''
        );
    }

    public getAllRenderedGroupHeaderContent(): string[] {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-group-row'
        );
        return Array.from(groupRows).map((_, i) => {
            return this.getRenderedGroupHeaderContent(i);
        });
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

    public getGroupHeaderTitle(groupRowIndex: number): string {
        const groupHeader = this.getGroupRowHeaderView(groupRowIndex);
        return (
            groupHeader
                .shadowRoot!.querySelector('span')
                ?.getAttribute('title') ?? ''
        );
    }

    public dispatchEventToGroupHeader(
        groupRowIndex: number,
        event: Event
    ): boolean | undefined {
        const groupHeader = this.getGroupRowHeaderView(groupRowIndex);
        return groupHeader
            .shadowRoot!.querySelector('span')
            ?.dispatchEvent(event);
    }

    public getRecordId(rowIndex: number): string | undefined {
        return this.getRow(rowIndex).recordId;
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

        const row = this.getRow(rowIndex);
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
        const row = this.getRow(rowIndex);
        const cells = row.shadowRoot!.querySelectorAll('nimble-table-cell');
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

    public async clickRow(rowIndex: number): Promise<void> {
        const row = this.getRow(rowIndex);
        row.click();
        await waitForUpdatesAsync();
    }

    public getIsRowSelectable(rowIndex: number): boolean {
        const row = this.getRow(rowIndex);
        return row.selectable;
    }

    public getIsRowSelected(rowIndex: number): boolean {
        const row = this.getRow(rowIndex);
        return row.selected;
    }

    public toggleGroupRowExpandedState(groupRowIndex: number): void {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-group-row'
        );
        if (groupRowIndex >= groupRows.length) {
            throw new Error(
                'Attempting to index past the total number of group rows'
            );
        }

        groupRows[groupRowIndex]!.click();
    }

    private getRow(rowIndex: number): TableRow {
        const rows = this.tableElement.shadowRoot!.querySelectorAll('nimble-table-row');
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        return rows.item(rowIndex);
    }

    private getCell(rowIndex: number, columnIndex: number): TableCell {
        const row = this.getRow(rowIndex);
        const cells = row.shadowRoot!.querySelectorAll('nimble-table-cell');
        if (columnIndex >= cells.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return cells.item(columnIndex);
    }

    private getGroupRowHeaderView(groupRowIndex: number): TableGroupHeaderView {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(
            'nimble-table-group-row'
        );
        if (groupRowIndex >= groupRows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        const groupRow = groupRows[groupRowIndex];
        return groupRow!.shadowRoot!.querySelector('.group-header-view')!;
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
