import type { Checkbox } from '@ni/fast-foundation';
import { parseColor } from '@ni/fast-colors';
import type { Table } from '..';
import { tableHeaderTag, type TableHeader } from '../components/header';
import {
    TableColumnSortDirection,
    type TableRecord,
    TableRowSelectionState
} from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { menuButtonTag, type MenuButton } from '../../menu-button';
import { tableCellTag, type TableCell } from '../components/cell';
import type { TableGroupHeaderView } from '../../table-column/base/group-header-view';
import { TableCellView } from '../../table-column/base/cell-view';
import { tableRowTag, type TableRow } from '../components/row';
import { Anchor, anchorTag } from '../../anchor';
import { tableGroupRowTag, type TableGroupRow } from '../components/group-row';
import type { Button } from '../../button';
import { Icon } from '../../icon-base';
import type { IconSeverity } from '../../icon-base/types';
import { Spinner, spinnerTag } from '../../spinner';
import { borderHoverColor } from '../../theme-provider/design-tokens';

/**
 * Summary information about a column that is sorted in the table for use in the `TablePageObject`.
 */
export interface SortedColumn {
    columnId?: string;
    sortDirection: TableColumnSortDirection;
}

/**
 * Page object for the `nimble-table` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TablePageObject<T extends TableRecord> {
    public constructor(private readonly tableElement: Table<T>) {}

    public getRenderedHeaderCount(): number {
        const headers = this.tableElement.shadowRoot!.querySelectorAll(tableHeaderTag);
        return headers.length;
    }

    public getRenderedCellCountForRow(rowIndex: number): number {
        const row = this.getRow(rowIndex);
        const cells = row.shadowRoot!.querySelectorAll(tableCellTag);
        return cells.length;
    }

    public getHeaderContent(columnIndex: number): Node | undefined {
        const headers = this.tableElement.shadowRoot!.querySelectorAll<TableHeader>(
            tableHeaderTag
        );
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return this.getHeaderContentElement(headers.item(columnIndex));
    }

    public getHeaderElement(columnIndex: number): TableHeader {
        const headers = this.tableElement.shadowRoot!.querySelectorAll<TableHeader>(
            tableHeaderTag
        );
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return headers.item(columnIndex);
    }

    public getHeaderTitle(columnIndex: number): string {
        const column = this.tableElement.columns[columnIndex];
        return (
            column?.shadowRoot!.firstElementChild?.getAttribute('title') ?? ''
        );
    }

    public getHeaderTextContent(columnIndex: number): string {
        return (
            this.getHeaderContent(
                columnIndex
            )?.firstChild?.textContent?.trim() ?? ''
        );
    }

    public dispatchEventToHeader(
        columnIndex: number,
        event: Event
    ): boolean | undefined {
        const column = this.tableElement.columns[columnIndex];
        return column?.shadowRoot!.firstElementChild?.dispatchEvent(event);
    }

    public getHeaderRenderedWidth(columnIndex: number): number {
        const headers = this.tableElement.shadowRoot!.querySelectorAll<TableHeader>(
            tableHeaderTag
        );
        if (columnIndex >= headers.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return headers[columnIndex]!.getBoundingClientRect().width;
    }

    public async clickColumnHeader(
        columnIndex: number,
        shiftKeyDown = false
    ): Promise<void> {
        const clickEvent = new MouseEvent('click', {
            shiftKey: shiftKeyDown,
            bubbles: true
        } as MouseEventInit);
        this.getHeaderElement(columnIndex).dispatchEvent(clickEvent);
        await waitForUpdatesAsync();
    }

    public getRenderedRowCount(): number {
        return this.tableElement.shadowRoot!.querySelectorAll(tableRowTag)
            .length;
    }

    public getRenderedGroupRowCount(): number {
        return this.tableElement.shadowRoot!.querySelectorAll(tableGroupRowTag)
            .length;
    }

    public getAllGroupRowsExpandedState(): boolean[] {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(tableGroupRowTag);
        return Array.from(groupRows).map(row => row.expanded);
    }

    public getAllDataRowsExpandedState(): boolean[] {
        const rows = this.tableElement.shadowRoot!.querySelectorAll(tableRowTag);
        return Array.from(rows).map(row => row.expanded);
    }

    public getRenderedCellView(
        rowIndex: number,
        columnIndex: number
    ): TableCellView {
        const cell = this.getCell(rowIndex, columnIndex);
        const cellView = cell.cellViewContainer.firstElementChild;
        if (!(cellView instanceof TableCellView)) {
            throw new Error(
                'Cell view not found in cell - ensure cellViewTag is set for column'
            );
        }
        return cellView as TableCellView;
    }

    public getRenderedCellViewById(
        recordId: string,
        columnId: string
    ): TableCellView {
        const cell = this.getCellById(recordId, columnId);
        const cellView = cell.cellViewContainer.firstElementChild;
        if (!(cellView instanceof TableCellView)) {
            throw new Error(
                'Cell view not found in cell - ensure cellViewTag is set for column'
            );
        }
        return cellView as TableCellView;
    }

    public getRenderedCellTextContent(
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

    public getRenderedCellAnchor(
        rowIndex: number,
        columnIndex: number
    ): Anchor {
        const anchor = this.getRenderedCellView(
            rowIndex,
            columnIndex
        ).shadowRoot!.querySelector(anchorTag);
        if (!anchor) {
            throw new Error(
                `Anchor not found at cell ${rowIndex},${columnIndex}`
            );
        }
        return anchor;
    }

    public getRenderedMappingColumnCellIconTagName(
        rowIndex: number,
        columnIndex: number
    ): string {
        const iconOrSpinner = this.getRenderedMappingColumnIconOrSpinner(
            this.getRenderedCellView(rowIndex, columnIndex)
        );
        return iconOrSpinner.tagName.toLocaleLowerCase();
    }

    public getRenderedMappingColumnCellIconSeverity(
        rowIndex: number,
        columnIndex: number
    ): IconSeverity {
        const iconOrSpinner = this.getRenderedMappingColumnIconOrSpinner(
            this.getRenderedCellView(rowIndex, columnIndex)
        );
        if (iconOrSpinner instanceof Icon) {
            return iconOrSpinner.severity;
        }
        throw new Error('Cell does not contain an icon');
    }

    public getRenderedGroupHeaderTextContent(groupRowIndex: number): string {
        return (
            this.getGroupRowHeaderView(
                groupRowIndex
            ).shadowRoot!.textContent?.trim() ?? ''
        );
    }

    public getAllRenderedGroupHeaderTextContent(): string[] {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(tableGroupRowTag);
        return Array.from(groupRows).map((_, i) => {
            return this.getRenderedGroupHeaderTextContent(i);
        });
    }

    public getCellTitle(rowIndex: number, columnIndex: number): string {
        const cellView = this.getRenderedCellView(rowIndex, columnIndex);
        return (
            cellView.shadowRoot!.firstElementChild?.getAttribute('title') ?? ''
        );
    }

    public dispatchEventToCell(
        rowIndex: number,
        columnIndex: number,
        event: Event
    ): boolean | undefined {
        const cellView = this.getRenderedCellView(rowIndex, columnIndex);
        return cellView.shadowRoot!.firstElementChild?.dispatchEvent(event);
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

    public async sizeTableToGivenRowWidth(
        rowWidth: number,
        table: Table<T>
    ): Promise<void> {
        if (!table.$fastController.isConnected) {
            throw Error(
                'The element must be connected before calling this method'
            );
        }

        table.style.width = `${
            rowWidth
            + table.headerRowActionContainer.getBoundingClientRect().width
            + table.virtualizer.headerContainerMarginRight
        }px`;
        await waitForUpdatesAsync();
    }

    public getCellRenderedWidth(rowIndex: number, columnIndex: number): number {
        const cell = this.getCell(rowIndex, columnIndex);
        const actualWidth = cell.getBoundingClientRect().width;
        // Round to one decimal place. This is to work around a bug in Chrome related to
        // fractional widths (e.g. '1fr') in grid layouts that results in some numerical
        // precision issues. See: https://bugs.chromium.org/p/chromium/issues/detail?id=1515685
        return Math.round(actualWidth * 10) / 10;
    }

    public getTotalCellRenderedWidth(): number {
        const row = this.getRow(0);
        const cells = row?.shadowRoot?.querySelectorAll(tableCellTag);
        return Array.from(cells!).reduce((p, c) => {
            return p + c.getBoundingClientRect().width;
        }, 0);
    }

    public async scrollToFirstRowAsync(): Promise<void> {
        const scrollElement = this.tableElement.viewport;
        scrollElement.scroll({ top: 0 });
        await waitForUpdatesAsync();
    }

    public async scrollToLastRowAsync(): Promise<void> {
        const scrollElement = this.tableElement.viewport;
        scrollElement.scroll({ top: scrollElement.scrollHeight });
        await waitForUpdatesAsync();
    }

    public getCellActionMenu(
        rowIndex: number,
        columnIndex: number
    ): MenuButton | null {
        return this.getCell(rowIndex, columnIndex).shadowRoot!.querySelector(
            menuButtonTag
        );
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
        const cells = row.shadowRoot!.querySelectorAll(tableCellTag);
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

    public async clickGroupRow(groupRowIndex: number): Promise<void> {
        const groupRow = this.getGroupRow(groupRowIndex);
        groupRow.click();
        await waitForUpdatesAsync();
    }

    public async clickRow(
        rowIndex: number,
        modifiers: { shiftKey?: boolean, ctrlKey?: boolean } = {}
    ): Promise<void> {
        const row = this.getRow(rowIndex);
        const event = new MouseEvent('click', modifiers);
        row.dispatchEvent(event);
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
        this.getGroupRow(groupRowIndex).click();
    }

    public clickCollapseAllButton(): void {
        this.getCollapseAllButton()?.click();
    }

    public clickDataRowExpandCollapseButton(rowIndex: number): void {
        const expandCollapseButton = this.getExpandCollapseButtonForRow(rowIndex);
        if (!expandCollapseButton) {
            throw new Error(
                'The provided row index has no visible expand collapse button associated with it.'
            );
        }

        expandCollapseButton.click();
    }

    public isCollapseAllButtonVisible(): boolean {
        const collapseButton = this.getCollapseAllButton();
        if (collapseButton) {
            return (
                window.getComputedStyle(collapseButton).visibility === 'visible'
            );
        }
        return false;
    }

    public isCollapseAllButtonSpaceReserved(): boolean {
        const collapseButton = this.getCollapseAllButton();
        if (collapseButton) {
            return window.getComputedStyle(collapseButton).display !== 'none';
        }
        return true;
    }

    public isDataRowExpandCollapseButtonVisible(rowIndex: number): boolean {
        const expandCollapseButton = this.getExpandCollapseButtonForRow(rowIndex);
        return expandCollapseButton !== null;
    }

    public isDataRowLoadingSpinnerVisible(rowIndex: number): boolean {
        const row = this.getRow(rowIndex);
        const spinner = row.shadowRoot!.querySelector(spinnerTag);
        return spinner !== null;
    }

    public isTableSelectionCheckboxVisible(): boolean {
        const checkbox = this.getSelectionCheckboxForTable();
        return this.isCheckboxVisible(checkbox);
    }

    public getTableSelectionState(): TableRowSelectionState {
        const checkbox = this.getSelectionCheckboxForTable();
        return this.getSelectionStateOfCheckbox(checkbox);
    }

    public clickTableSelectionCheckbox(): void {
        const checkbox = this.getSelectionCheckboxForTable();
        checkbox!.click();
    }

    public isRowSelectionCheckboxVisible(rowIndex: number): boolean {
        const checkbox = this.getSelectionCheckboxForRow(rowIndex);
        return this.isCheckboxVisible(checkbox);
    }

    public getRowSelectionState(rowIndex: number): TableRowSelectionState {
        const checkbox = this.getSelectionCheckboxForRow(rowIndex);
        return this.getSelectionStateOfCheckbox(checkbox);
    }

    public clickRowSelectionCheckbox(rowIndex: number, shiftKey = false): void {
        if (shiftKey) {
            const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                key: 'Shift',
                shiftKey: true,
                bubbles: true
            } as KeyboardEventInit);
            document.dispatchEvent(shiftKeyDownEvent);
        }

        const checkbox = this.getSelectionCheckboxForRow(rowIndex);
        checkbox!.click();

        if (shiftKey) {
            const shiftKeyUpEvent = new KeyboardEvent('keyup', {
                key: 'Shift',
                bubbles: true
            } as KeyboardEventInit);
            document.dispatchEvent(shiftKeyUpEvent);
        }
    }

    public getGroupRowSelectionState(
        groupRowIndex: number
    ): TableRowSelectionState {
        const checkbox = this.getSelectionCheckboxForGroupRow(groupRowIndex);
        return this.getSelectionStateOfCheckbox(checkbox);
    }

    public clickGroupRowSelectionCheckbox(
        groupRowIndex: number,
        shiftKey = false
    ): void {
        if (shiftKey) {
            const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                key: 'Shift',
                shiftKey: true,
                bubbles: true
            } as KeyboardEventInit);
            document.dispatchEvent(shiftKeyDownEvent);
        }

        const checkbox = this.getSelectionCheckboxForGroupRow(groupRowIndex);
        checkbox!.click();

        if (shiftKey) {
            const shiftKeyUpEvent = new KeyboardEvent('keyup', {
                key: 'Shift',
                bubbles: true
            } as KeyboardEventInit);
            document.dispatchEvent(shiftKeyUpEvent);
        }
    }

    /**
     * @param columnIndex The index of the column to the left of the divider to press.
     */
    public pressRightColumnDivider(columnIndex: number): void {
        this.pressColumnDivider(this.getColumnDivider(columnIndex, false));
    }

    /**
     * @param columnIndex The index of the column to the left of the divider to release.
     */
    public releaseRightColumnDivider(columnIndex: number): void {
        this.releaseColumnDivider(this.getColumnDivider(columnIndex, false));
    }

    /**
     * @param columnIndex The index of the column to the left of a divider being dragged. Thus, this
     * cannot be given a value representing the last visible column index.
     * @param deltas The series of mouse movements in the x-direction while sizing a column.
     */
    public dragSizeColumnByRightDivider(
        columnIndex: number,
        deltas: readonly number[]
    ): void {
        this.dragSizeColumnByDivider(columnIndex, false, deltas);
    }

    /**
     * @param columnIndex The index of the column to the right of a divider being dragged. Thus, this
     * value must be greater than 0 and less than the total number of visible columns.
     * @param deltas The series of mouse movements in the x-direction while sizing a column.
     */
    public dragSizeColumnByLeftDivider(
        columnIndex: number,
        deltas: readonly number[]
    ): void {
        this.dragSizeColumnByDivider(columnIndex, true, deltas);
    }

    /**
     * @param columnIndex The index of the column whose right divider we're checking.
     */
    public columnRightDividerHasActiveStyling(columnIndex: number): boolean {
        const divider = this.getColumnDivider(columnIndex, false);
        const currentColor = parseColor(
            window.getComputedStyle(divider).borderLeftColor
        );
        const hoverColor = parseColor(borderHoverColor.getValueFor(divider))!;
        return currentColor!.equalValue(hoverColor);
    }

    public isVerticalScrollbarVisible(): boolean {
        return (
            this.tableElement.viewport.clientHeight
            < this.tableElement.viewport.scrollHeight
        );
    }

    public isHorizontalScrollbarVisible(): boolean {
        return (
            this.tableElement.viewport.clientWidth
            < this.tableElement.viewport.scrollWidth
        );
    }

    public getSortedColumns(): SortedColumn[] {
        return this.tableElement.columns
            .filter(
                x => !x.columnInternals.sortingDisabled
                    && typeof x.columnInternals.currentSortIndex === 'number'
                    && x.columnInternals.currentSortDirection
                        !== TableColumnSortDirection.none
            )
            .sort(
                (a, b) => a.columnInternals.currentSortIndex!
                    - b.columnInternals.currentSortIndex!
            )
            .map(x => {
                return {
                    columnId: x.columnId,
                    sortDirection: x.columnInternals.currentSortDirection
                };
            });
    }

    public getGroupedColumns(): string[] {
        return this.tableElement.columns
            .filter(
                x => !x.columnInternals.groupingDisabled
                    && typeof x.columnInternals.groupIndex === 'number'
            )
            .sort(
                (a, b) => a.columnInternals.groupIndex!
                    - b.columnInternals.groupIndex!
            )
            .map(x => x.columnId ?? '');
    }

    public getChildRowCountForGroup(groupRowIndex: number): number {
        const groupRow = this.getGroupRow(groupRowIndex);
        const countDisplayString = groupRow
            .shadowRoot!.querySelector('.group-row-child-count')!
            .textContent!.trim();
        // Remove the parenthesis to get just the number as a string
        const countString = countDisplayString.substring(
            1,
            countDisplayString.length - 1
        );
        return Number(countString);
    }

    /** @internal */
    public isRowHoverStylingEnabled(): boolean {
        const rows: NodeListOf<TableRow | TableGroupRow> = this.tableElement.shadowRoot!.querySelectorAll(
            `${tableRowTag}, ${tableGroupRowTag}`
        );
        const firstRowAllowsHover = rows[0]!.allowHover;
        if (Array.from(rows).some(x => x.allowHover !== firstRowAllowsHover)) {
            throw new Error('Rows inconsistently allow hover styling');
        }
        return firstRowAllowsHover;
    }

    /** @internal */
    public getGroupRowHeaderView(groupRowIndex: number): TableGroupHeaderView {
        const groupRow = this.getGroupRow(groupRowIndex);
        return groupRow.shadowRoot!.querySelector('.group-header-view')!;
    }

    /** @internal */
    public getRow(rowIndex: number): TableRow {
        const rows = this.tableElement.shadowRoot!.querySelectorAll(tableRowTag);
        if (rowIndex >= rows.length) {
            throw new Error(
                'Attempting to index past the total number of rendered rows'
            );
        }

        return rows.item(rowIndex);
    }

    /** @internal */
    public getCell(rowIndex: number, columnIndex: number): TableCell {
        const row = this.getRow(rowIndex);
        const cells = row.shadowRoot!.querySelectorAll(tableCellTag);
        if (columnIndex >= cells.length) {
            throw new Error(
                'Attempting to index past the total number of rendered columns'
            );
        }

        return cells.item(columnIndex);
    }

    private getRowById(recordId: string): TableRow {
        const row: TableRow | null = this.tableElement.shadowRoot!.querySelector(
            `nimble-table-row[record-id="${CSS.escape(recordId)}"]`
        );
        if (!row) {
            throw new Error(
                'Row with given id was not found. It may not be scrolled into view.'
            );
        }

        return row;
    }

    private getCellById(recordId: string, columnId: string): TableCell {
        const row = this.getRowById(recordId);
        const cell: TableCell | null = row.shadowRoot!.querySelector(
            `nimble-table-cell[column-id="${CSS.escape(columnId)}"]`
        );

        if (!cell) {
            throw new Error('Cell with given columnId was not found in row');
        }

        return cell;
    }

    private getCollapseAllButton(): Button | null {
        return this.tableElement.shadowRoot!.querySelector<Button>(
            '.collapse-all-button'
        );
    }

    private getExpandCollapseButtonForRow(rowIndex: number): Button | null {
        const row = this.getRow(rowIndex);
        const rowExpandCollapseButton = row.shadowRoot!.querySelector<Button>(
            '.expand-collapse-button'
        );
        if (!rowExpandCollapseButton) {
            const firstCell = this.getCell(rowIndex, 0);
            return firstCell?.shadowRoot!.querySelector<Button>(
                '.expand-collapse-button'
            );
        }

        return rowExpandCollapseButton;
    }

    private getSelectionCheckboxForRow(rowIndex: number): Checkbox | null {
        const row = this.getRow(rowIndex);
        return row.shadowRoot!.querySelector('.selection-checkbox');
    }

    private getSelectionCheckboxForGroupRow(
        groupRowIndex: number
    ): Checkbox | null {
        const groupRow = this.getGroupRow(groupRowIndex);
        return groupRow.shadowRoot!.querySelector('.selection-checkbox');
    }

    private getSelectionCheckboxForTable(): Checkbox | null {
        return this.tableElement.shadowRoot!.querySelector<Checkbox>(
            '.header-row .selection-checkbox'
        );
    }

    private isCheckboxVisible(checkbox: Checkbox | null): boolean {
        return !!checkbox && !checkbox.hidden;
    }

    private getSelectionStateOfCheckbox(
        checkbox: Checkbox | null
    ): TableRowSelectionState {
        if (!checkbox) {
            throw new Error('Cannot get selection state from null checkbox');
        }

        if (checkbox.indeterminate) {
            return TableRowSelectionState.partiallySelected;
        }
        if (checkbox.checked) {
            return TableRowSelectionState.selected;
        }
        return TableRowSelectionState.notSelected;
    }

    private getGroupRow(groupRowIndex: number): TableGroupRow {
        const groupRows = this.tableElement.shadowRoot!.querySelectorAll(tableGroupRowTag);
        if (groupRowIndex >= groupRows.length) {
            throw new Error(
                'Attempting to index past the total number of group rows'
            );
        }

        return groupRows.item(groupRowIndex);
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

    private getRenderedMappingColumnIconOrSpinner(
        view: TableCellView | TableGroupHeaderView
    ): Icon | Spinner {
        const viewShadowRoot = view.shadowRoot!;
        const spinnerOrIcon = viewShadowRoot.querySelector(
            '.reserve-icon-size'
        )?.firstElementChild;
        if (
            !(spinnerOrIcon instanceof Icon || spinnerOrIcon instanceof Spinner)
        ) {
            throw new Error('Icon or Spinner not found');
        }

        return spinnerOrIcon;
    }

    private getColumnDivider(
        columnIndex: number,
        leftDivider: boolean
    ): HTMLElement {
        const headerContainers = this.tableElement.shadowRoot!.querySelectorAll('.header-container');
        if (columnIndex < 0 || columnIndex >= headerContainers.length) {
            throw new Error(
                'Invalid column index. Index must be greater than or equal to 0 and less than the number of visible columns.'
            );
        }
        const side = leftDivider ? 'left' : 'right';
        const divider = headerContainers[columnIndex]!.querySelector(
            `.column-divider.${side}`
        );
        if (!divider) {
            throw new Error(
                `The provided column index has no ${side} divider associated with it.`
            );
        }

        return divider as HTMLElement;
    }

    private pressColumnDivider(divider: HTMLElement): number {
        const dividerRect = divider.getBoundingClientRect();
        const clickX = (dividerRect.x + dividerRect.width) / 2;
        const pointerDownEvent = new PointerEvent('pointerdown', {
            // -1 is a value reserved for synthetic events: https://w3c.github.io/pointerevents/#dom-pointerevent-pointerid
            pointerId: -1,
            clientX: clickX,
            clientY: (dividerRect.y + dividerRect.height) / 2
        });
        divider.dispatchEvent(pointerDownEvent);

        return clickX;
    }

    private releaseColumnDivider(divider: HTMLElement): void {
        divider.dispatchEvent(new PointerEvent('pointerup'));
    }

    private dragSizeColumnByDivider(
        columnIndex: number,
        leftDivider: boolean,
        deltas: readonly number[]
    ): void {
        const divider = this.getColumnDivider(columnIndex, leftDivider);
        let currentPointerX = this.pressColumnDivider(divider);
        for (const delta of deltas) {
            currentPointerX += delta;
            const pointerMoveEvent = new PointerEvent('pointermove', {
                clientX: currentPointerX
            });
            divider.dispatchEvent(pointerMoveEvent);
        }
        this.releaseColumnDivider(divider);
    }

    private readonly isSlotElement = (
        element: Node | undefined
    ): element is HTMLSlotElement => {
        return element?.nodeName === 'SLOT';
    };
}
