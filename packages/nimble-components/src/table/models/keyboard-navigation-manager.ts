import { type Notifier, type Subscriber, Observable } from '@ni/fast-element';
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyEscape,
    keyFunction2,
    keyHome,
    keyPageDown,
    keyPageUp,
    keySpace,
    keyTab
} from '@ni/fast-web-utilities';
import { FoundationElement } from '@ni/fast-foundation';
import type { ScrollToOptions } from '@tanstack/virtual-core';
import type { Table } from '..';
import { TableFocusType } from '../types';
import type {
    TableActionMenuToggleEventDetail,
    TableHeaderFocusableElements,
    TableRowFocusableElements,
    TableRecord
} from '../types';
import type { Virtualizer } from './virtualizer';
import { TableGroupRow } from '../components/group-row';
import { TableRow } from '../components/row';
import { TableCell } from '../components/cell';
import type { MenuButton } from '../../menu-button';
import { tableHeaderTag } from '../components/header';
import { TableCellView } from '../../table-column/base/cell-view';

interface TableFocusState {
    focusType: TableFocusType;
    headerActionIndex?: number;
    rowIndex?: number;
    columnIndex?: number;
    cellContentIndex?: number;
}

/**
 * Manages the keyboard navigation and focus within the table.
 * @internal
 */
export class KeyboardNavigationManager<TData extends TableRecord>
implements Subscriber {
    private focusType: TableFocusType = TableFocusType.none;
    private headerActionIndex = -1;
    private rowIndex = -1;
    private cellContentIndex = -1;
    private columnIndex = -1;
    private focusWithinTable = false;
    private isCurrentlyFocusingElement = false;
    private readonly tableNotifier: Notifier;
    private readonly virtualizerNotifier: Notifier;
    private visibleRowNotifiers: Notifier[] = [];
    private get inNavigationMode(): boolean {
        return (
            this.focusType !== TableFocusType.cellActionMenu
            && this.focusType !== TableFocusType.cellContent
        );
    }

    public constructor(
        private readonly table: Table<TData>,
        private readonly virtualizer: Virtualizer<TData>
    ) {
        this.tableNotifier = Observable.getNotifier(this.table);
        this.tableNotifier.subscribe(this, 'rowElements');
        this.virtualizerNotifier = Observable.getNotifier(this.virtualizer);
        this.virtualizerNotifier.subscribe(this, 'visibleItems');
    }

    public resetFocusState(): void {
        this.focusType = TableFocusType.none;
        const activeElement = this.getActiveElement();
        if (activeElement && this.isInTable(activeElement)) {
            this.setDefaultFocus();
        }
    }

    public get hasActiveRowOrCellFocus(): boolean {
        return this.focusWithinTable && this.hasRowOrCellFocusType();
    }

    public connect(): void {
        this.table.addEventListener(
            'keydown',
            this.onCaptureKeyDown as EventListener,
            { capture: true }
        );
        this.table.addEventListener('keydown', this.onKeyDown as EventListener);
        this.table.addEventListener(
            'focusin',
            this.onTableFocusIn as EventListener
        );
        this.table.addEventListener(
            'focusout',
            this.onTableFocusOut as EventListener
        );
        this.table.viewport.addEventListener('keydown', this.onViewportKeyDown);
        this.table.viewport.addEventListener(
            'cell-action-menu-blur',
            this.onCellActionMenuBlur as EventListener
        );
        this.table.viewport.addEventListener(
            'cell-view-focus-in',
            this.onCellViewFocusIn as EventListener
        );
        this.table.viewport.addEventListener(
            'cell-focus-in',
            this.onCellFocusIn as EventListener
        );
        this.table.viewport.addEventListener(
            'cell-blur',
            this.onCellBlur as EventListener
        );
    }

    public disconnect(): void {
        this.table.removeEventListener(
            'keydown',
            this.onCaptureKeyDown as EventListener,
            { capture: true }
        );
        this.table.removeEventListener(
            'keydown',
            this.onKeyDown as EventListener
        );
        this.table.removeEventListener(
            'focusin',
            this.onTableFocusIn as EventListener
        );
        this.table.removeEventListener(
            'focusout',
            this.onTableFocusOut as EventListener
        );
        this.table.viewport.removeEventListener(
            'keydown',
            this.onViewportKeyDown
        );
        this.table.viewport.removeEventListener(
            'cell-action-menu-blur',
            this.onCellActionMenuBlur as EventListener
        );
        this.table.viewport.removeEventListener(
            'cell-view-focus-in',
            this.onCellViewFocusIn as EventListener
        );
        this.table.viewport.removeEventListener(
            'cell-focus-in',
            this.onCellFocusIn as EventListener
        );
        this.table.viewport.removeEventListener(
            'cell-blur',
            this.onCellBlur as EventListener
        );
    }

    public handleChange(source: unknown, args: unknown): void {
        let focusRowAndCell = false;
        if (source === this.virtualizer && args === 'visibleItems') {
            focusRowAndCell = true;
        } else if (source === this.table && args === 'rowElements') {
            for (const notifier of this.visibleRowNotifiers) {
                notifier.unsubscribe(this);
            }
            this.visibleRowNotifiers = [];
            for (const visibleRow of this.table.rowElements) {
                const rowNotifier = Observable.getNotifier(visibleRow);
                rowNotifier.subscribe(this, 'resolvedRowIndex');
                this.visibleRowNotifiers.push(rowNotifier);
                if (visibleRow.resolvedRowIndex === this.rowIndex) {
                    focusRowAndCell = true;
                }
            }
        } else if (
            args === 'resolvedRowIndex'
            && this.isResolvedRowType(source)
        ) {
            if (source.resolvedRowIndex === this.rowIndex) {
                focusRowAndCell = true;
            }
        }

        if (focusRowAndCell) {
            // We want open action menus to be closed, and focused interactive cell content blurred, on scroll. We also don't want to
            // refocus the interactive cell content after the scroll, as the element no longer represents the same table data at that
            // point. So in both those cases, we focus the cell here. This also lets us maintain what row/ cell the user had focused
            // previously.
            if (
                this.focusType === TableFocusType.cellActionMenu
                || this.focusType === TableFocusType.cellContent
            ) {
                this.setCellFocusState(this.columnIndex, this.rowIndex, false);
            }
            if (this.inNavigationMode && this.hasRowOrCellFocusType()) {
                if (this.rowIndex > this.table.tableData.length - 1) {
                    // Focused row index no longer valid, coerce to 1st row if possible
                    if (this.table.tableData.length > 0) {
                        this.rowIndex = 0;
                    } else {
                        if (this.focusWithinTable) {
                            this.setDefaultFocus();
                        } else {
                            this.focusType = TableFocusType.none;
                        }
                        return;
                    }
                }
                if (this.focusWithinTable) {
                    this.focusCurrentRow(false);
                }
            }
        }
    }

    public onRowFocusIn(event: FocusEvent): void {
        if (this.isCurrentlyFocusingElement) {
            return;
        }
        const row = event.target;
        if (this.isResolvedRowType(row)) {
            if (this.rowIndex !== row.resolvedRowIndex) {
                // If user focuses a row some other way (e.g. mouse), update our focus state so future keyboard nav
                // will start from that row
                this.setRowFocusState(row.resolvedRowIndex);
            }
        }
    }

    public onRowBlur(event: FocusEvent): void {
        const row = event.target;
        if (this.isResolvedRowType(row)) {
            this.setElementFocusable(row, false);
        }
    }

    public onRowActionMenuToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        const isOpen = event.detail.newState;
        if (isOpen) {
            const row = event.target as TableRow;
            const columnIndex = this.table.visibleColumns.findIndex(
                column => column.columnId === event.detail.columnId
            );
            this.setCellActionMenuFocusState(
                row.resolvedRowIndex!,
                columnIndex,
                false
            );
        }
    }

    private readonly onTableFocusIn = (event: FocusEvent): void => {
        this.focusWithinTable = true;
        this.updateFocusStateFromActiveElement(false);

        // Sets initial focus on the appropriate table content
        const actionMenuOpen = this.table.openActionMenuRecordId !== undefined;
        if (
            (event.target === this.table
                || this.focusType === TableFocusType.none)
            && !actionMenuOpen
        ) {
            let focusHeader = true;
            if (
                this.hasRowOrCellFocusType()
                && this.scrollToAndFocusRow(this.rowIndex)
            ) {
                focusHeader = false;
            }
            if (focusHeader && !this.setFocusOnHeader()) {
                // nothing to focus
                this.table.blur();
            }
        }
    };

    private readonly onTableFocusOut = (): void => {
        this.focusWithinTable = false;
    };

    private readonly onCellActionMenuBlur = (
        event: CustomEvent<TableCell>
    ): void => {
        event.stopPropagation();
        const cell = event.detail;
        if (cell.actionMenuButton) {
            // Ensure that action menu buttons get hidden when no longer focused
            this.setActionMenuButtonFocused(cell.actionMenuButton, false);
        }
    };

    private readonly onCellViewFocusIn = (
        event: CustomEvent<TableCell>
    ): void => {
        event.stopPropagation();
        this.updateFocusStateFromActiveElement(false);
    };

    private readonly onCellFocusIn = (event: CustomEvent<TableCell>): void => {
        event.stopPropagation();
        const cell = event.detail;
        this.updateFocusStateFromActiveElement(true);
        // Currently, clicking a non-interactive cell only updates the focus state to that row, it
        // doesn't focus the cell. If we revisit this, we most likely need to set the cells to tabindex=-1
        // upfront too, so their focusing behavior is consistent whether they've been previously keyboard
        // focused or not.
        if (
            this.focusType === TableFocusType.row
            && this.getActiveElement() === cell
        ) {
            this.focusCurrentRow(false);
        }
    };

    private readonly onCellBlur = (event: CustomEvent<TableCell>): void => {
        event.stopPropagation();
        const cell = event.detail;
        this.setElementFocusable(cell, false);
    };

    private readonly onCaptureKeyDown = (event: KeyboardEvent): void => {
        let handled = false;
        if (event.key === keyTab) {
            handled = this.onTabPressed(event.shiftKey);
        } else if (this.inNavigationMode) {
            switch (event.key) {
                case keyArrowLeft:
                    handled = this.onLeftArrowPressed();
                    break;
                case keyArrowRight:
                    handled = this.onRightArrowPressed();
                    break;
                case keyArrowUp:
                    handled = this.onUpArrowPressed();
                    break;
                case keyArrowDown:
                    handled = this.onDownArrowPressed();
                    break;
                case keyPageUp:
                    handled = this.onPageUpPressed();
                    break;
                case keyPageDown:
                    handled = this.onPageDownPressed();
                    break;
                case keyHome:
                    handled = this.onHomePressed(event.ctrlKey);
                    break;
                case keyEnd:
                    handled = this.onEndPressed(event.ctrlKey);
                    break;
                case keyEnter:
                    handled = this.onEnterPressed(event.ctrlKey);
                    break;
                case keySpace:
                    handled = this.onSpacePressed(event.shiftKey);
                    break;
                case keyFunction2:
                    handled = this.onF2Pressed();
                    break;
                default:
                    break;
            }
        }
        if (handled) {
            event.preventDefault();
        }
    };

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (!this.inNavigationMode && !event.defaultPrevented) {
            if (event.key === keyEscape || event.key === keyFunction2) {
                const row = this.getCurrentRow();
                if (row) {
                    this.trySetCellFocus(row.getFocusableElements());
                }
            }
        }
    };

    private readonly onViewportKeyDown = (event: KeyboardEvent): void => {
        let handleEvent = !this.inNavigationMode
            && (event.key === keyArrowUp || event.key === keyArrowDown);
        switch (event.key) {
            case keyPageUp:
            case keyPageDown:
            case keyHome:
            case keyEnd:
                handleEvent = true;
                break;
            default:
                break;
        }
        if (handleEvent) {
            // Swallow key presses that would cause table scrolling, independently of keyboard navigation
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    private onEnterPressed(ctrlKey: boolean): boolean {
        let row: TableRow | TableGroupRow | undefined;
        let rowElements: TableRowFocusableElements | undefined;
        if (this.hasRowOrCellFocusType()) {
            row = this.getCurrentRow();
            rowElements = row?.getFocusableElements();
        }
        if (this.focusType === TableFocusType.row) {
            if (row instanceof TableGroupRow) {
                this.toggleRowExpanded(row);
                return true;
            }
        }
        if (this.focusType === TableFocusType.cell) {
            if (ctrlKey) {
                const cell = rowElements?.cells[this.columnIndex];
                if (cell?.actionMenuButton && !cell.actionMenuButton.open) {
                    cell.actionMenuButton.toggleButton!.control.click();
                    return true;
                }
            }
            return this.focusFirstInteractiveElementInCurrentCell(rowElements);
        }
        return false;
    }

    private onF2Pressed(): boolean {
        if (this.focusType === TableFocusType.cell) {
            const row = this.getCurrentRow();
            const rowElements = row?.getFocusableElements();
            return this.focusFirstInteractiveElementInCurrentCell(rowElements);
        }
        return false;
    }

    private onSpacePressed(shiftKey: boolean): boolean {
        if (
            this.focusType === TableFocusType.row
            || this.focusType === TableFocusType.cell
        ) {
            if (this.focusType === TableFocusType.row || shiftKey) {
                const row = this.getCurrentRow();
                if (row instanceof TableRow && row.selectable) {
                    row.onSelectionChange(row.selected, !row.selected);
                } else if (row instanceof TableGroupRow) {
                    this.toggleRowExpanded(row);
                }
            }
            // Default Space behavior scrolls down, which is redundant given the rest of our keyboard nav code, and we'd still try to focus a
            // row that you scrolled away from. So suppress default Space behavior if a row or cell is selected, regardless of if we're
            // toggling selection or not.
            return true;
        }
        return false;
    }

    private onLeftArrowPressed(): boolean {
        let row: TableRow | TableGroupRow | undefined;
        let rowElements: TableRowFocusableElements | undefined;
        let headerElements!: TableHeaderFocusableElements;
        if (this.hasRowOrCellFocusType()) {
            row = this.getCurrentRow();
            rowElements = row?.getFocusableElements();
        } else if (this.hasHeaderFocusType()) {
            headerElements = this.getTableHeaderFocusableElements();
        }

        switch (this.focusType) {
            case TableFocusType.headerActions:
                return this.trySetHeaderActionFocus(
                    headerElements,
                    this.headerActionIndex - 1
                );
            case TableFocusType.columnHeader:
                return (
                    this.trySetColumnHeaderFocus(
                        headerElements,
                        this.columnIndex - 1
                    )
                    || this.trySetHeaderActionFocus(
                        headerElements,
                        headerElements.headerActions.length - 1
                    )
                );
            case TableFocusType.row:
                if (this.isRowExpanded(row) === true) {
                    this.toggleRowExpanded(row!);
                    return true;
                }
                return false;
            case TableFocusType.rowSelectionCheckbox:
                this.setRowFocusState();
                return this.focusCurrentRow(true);
            case TableFocusType.cell:
                if (
                    !this.trySetCellFocus(rowElements, this.columnIndex - 1)
                    && !this.trySetRowSelectionCheckboxFocus(rowElements)
                ) {
                    this.setRowFocusState();
                    this.focusCurrentRow(true);
                }
                return true;
            default:
                break;
        }

        return false;
    }

    private onRightArrowPressed(): boolean {
        let row: TableRow | TableGroupRow | undefined;
        let rowElements: TableRowFocusableElements | undefined;
        let headerElements!: TableHeaderFocusableElements;
        if (this.hasRowOrCellFocusType()) {
            row = this.getCurrentRow();
            rowElements = row?.getFocusableElements();
        } else if (this.hasHeaderFocusType()) {
            headerElements = this.getTableHeaderFocusableElements();
        }

        switch (this.focusType) {
            case TableFocusType.headerActions:
                return (
                    this.trySetHeaderActionFocus(
                        headerElements,
                        this.headerActionIndex + 1
                    ) || this.trySetColumnHeaderFocus(headerElements, 0)
                );
            case TableFocusType.columnHeader:
                return this.trySetColumnHeaderFocus(
                    headerElements,
                    this.columnIndex + 1
                );
            case TableFocusType.row:
                if (this.isRowExpanded(row) === false) {
                    this.toggleRowExpanded(row!);
                    return true;
                }
                return (
                    this.trySetRowSelectionCheckboxFocus(rowElements)
                    || this.trySetCellFocus(rowElements, 0)
                );
            case TableFocusType.rowSelectionCheckbox:
                return this.trySetCellFocus(rowElements, 0);
            case TableFocusType.cell:
                return this.trySetCellFocus(rowElements, this.columnIndex + 1);
            default:
                break;
        }

        return false;
    }

    private onUpArrowPressed(): boolean {
        this.onMoveUp(1);
        // Always prevent default - prevents page scroll, and FireFox changing focus if focus is at table extents
        return true;
    }

    private onPageUpPressed(): boolean {
        return this.onMoveUp(this.virtualizer.pageSize);
    }

    private onHomePressed(ctrlKey: boolean): boolean {
        if (this.handleHomeEndWithinRow(ctrlKey)) {
            const row = this.getCurrentRow();
            const rowElements = row?.getFocusableElements();
            return (
                this.trySetRowSelectionCheckboxFocus(rowElements)
                || this.trySetCellFocus(rowElements, 0)
            );
        }

        return this.onMoveUp(0, 0);
    }

    private onDownArrowPressed(): boolean {
        this.onMoveDown(1);
        // Always prevent default - prevents page scroll, and FireFox changing focus if focus is at table extents
        return true;
    }

    private onPageDownPressed(): boolean {
        return this.onMoveDown(this.virtualizer.pageSize);
    }

    private onEndPressed(ctrlKey: boolean): boolean {
        if (this.handleHomeEndWithinRow(ctrlKey)) {
            const row = this.getCurrentRow();
            const rowElements = row?.getFocusableElements();
            return this.trySetCellFocus(
                rowElements,
                this.table.visibleColumns.length - 1
            );
        }

        return this.onMoveDown(0, this.table.tableData.length - 1);
    }

    private handleHomeEndWithinRow(ctrlKey: boolean): boolean {
        return (
            (this.focusType === TableFocusType.cell
                || this.focusType === TableFocusType.rowSelectionCheckbox)
            && !ctrlKey
        );
    }

    private onTabPressed(shiftKeyPressed: boolean): boolean {
        const activeElement = this.getActiveElement();
        if (activeElement === null || activeElement === this.table) {
            return false;
        }
        const nextFocusState = this.hasRowOrCellFocusType()
            ? this.getNextRowTabStop(shiftKeyPressed)
            : this.getNextHeaderTabStop(shiftKeyPressed);
        if (nextFocusState) {
            this.focusType = nextFocusState.focusType;
            this.rowIndex = nextFocusState.rowIndex ?? this.rowIndex;
            this.columnIndex = nextFocusState.columnIndex ?? this.columnIndex;
            this.headerActionIndex = nextFocusState.headerActionIndex ?? this.headerActionIndex;
            this.cellContentIndex = nextFocusState.cellContentIndex ?? this.cellContentIndex;
            if (this.hasRowOrCellFocusType()) {
                this.focusCurrentRow(false);
            } else {
                this.focusHeaderElement();
            }
            return true;
        }
        this.blurAfterLastTab(activeElement);
        return false;
    }

    private getNextRowTabStop(
        shiftKeyPressed: boolean
    ): TableFocusState | undefined {
        const row = this.getCurrentRow();
        if (row === undefined) {
            return undefined;
        }
        let startIndex = -1;
        const focusStates = [];
        const rowElements = row.getFocusableElements();
        if (rowElements.selectionCheckbox) {
            focusStates.push({
                focusType: TableFocusType.rowSelectionCheckbox
            });
            if (this.focusType === TableFocusType.rowSelectionCheckbox) {
                startIndex = 0;
            }
        }
        let cellIndex = 0;
        while (cellIndex < rowElements.cells.length) {
            const firstCellTabbableIndex = focusStates.length;
            const cellInfo = rowElements.cells[cellIndex]!;
            const cellViewTabbableChildren = cellInfo.cell.cellView.tabbableChildren;
            for (let i = 0; i < cellViewTabbableChildren.length; i++) {
                focusStates.push({
                    focusType: TableFocusType.cellContent,
                    columnIndex: cellIndex,
                    cellContentIndex: i
                });
                if (
                    this.focusType === TableFocusType.cellContent
                    && this.columnIndex === cellIndex
                    && this.cellContentIndex === i
                ) {
                    startIndex = focusStates.length - 1;
                }
            }
            if (cellInfo.actionMenuButton) {
                focusStates.push({
                    focusType: TableFocusType.cellActionMenu,
                    columnIndex: cellIndex
                });
                if (
                    this.focusType === TableFocusType.cellActionMenu
                    && this.columnIndex === cellIndex
                ) {
                    startIndex = focusStates.length - 1;
                }
            }
            const lastCellTabbableIndex = focusStates.length - 1;
            if (
                this.focusType === TableFocusType.cell
                && this.columnIndex === cellIndex
            ) {
                startIndex = shiftKeyPressed
                    ? lastCellTabbableIndex + 1
                    : firstCellTabbableIndex - 1;
            }
            cellIndex += 1;
        }
        if (this.focusType === TableFocusType.row) {
            startIndex = shiftKeyPressed ? focusStates.length : -1;
        }
        const direction = shiftKeyPressed ? -1 : 1;
        return focusStates[startIndex + direction];
    }

    private getNextHeaderTabStop(
        shiftKeyPressed: boolean
    ): TableFocusState | undefined {
        let startIndex = -1;
        const focusStates = [];
        const headerTabbableElements = this.getTableHeaderFocusableElements().headerActions;
        for (let i = 0; i < headerTabbableElements.length; i++) {
            focusStates.push({
                focusType: TableFocusType.headerActions,
                headerActionIndex: i
            });
        }
        if (this.focusType === TableFocusType.headerActions) {
            startIndex = this.headerActionIndex;
        } else {
            // TableFocusType.columnHeader
            startIndex = focusStates.length;
        }
        const direction = shiftKeyPressed ? -1 : 1;
        return focusStates[startIndex + direction];
    }

    private blurAfterLastTab(activeElement: HTMLElement): void {
        // In order to get the desired browser-provided Tab/Shift-Tab behavior of focusing the
        // element before/after the table, the table shouldn't have tabIndex=0 when this event
        // handling ends. However it needs to be tabIndex=0 so we can re-focus the table the next time
        // it's tabbed to, so set tabIndex back to 0 after a rAF.
        // Note: In Chrome this is only needed for Shift-Tab, but in Firefox both Tab and Shift-Tab need this
        // to work as expected.
        this.table.tabIndex = -1;
        window.requestAnimationFrame(() => {
            this.table.tabIndex = 0;
        });

        // Don't explicitly call blur() on activeElement (causes unexpected behavior on Safari / Mac Firefox)
        this.setElementFocusable(activeElement, false);
    }

    private onMoveUp(rowDelta: number, newRowIndex?: number): boolean {
        const coerceRowIndex = rowDelta > 1;
        switch (this.focusType) {
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
            case TableFocusType.cell: {
                const scrollOptions: ScrollToOptions = {};
                let rowIndex = this.rowIndex;
                if (newRowIndex !== undefined) {
                    rowIndex = newRowIndex;
                }
                rowIndex -= rowDelta;
                if (coerceRowIndex && rowIndex < 0) {
                    rowIndex = 0;
                }
                if (rowDelta > 1) {
                    scrollOptions.align = 'start';
                }

                if (rowIndex < this.rowIndex && rowIndex >= 0) {
                    return this.scrollToAndFocusRow(rowIndex, scrollOptions);
                }
                if (rowIndex === -1) {
                    const headerElements = this.getTableHeaderFocusableElements();
                    if (
                        this.focusType === TableFocusType.row
                        || this.focusType === TableFocusType.rowSelectionCheckbox
                    ) {
                        return (
                            this.trySetHeaderActionFocus(headerElements, 0)
                            || this.trySetColumnHeaderFocus(headerElements, 0)
                        );
                    }
                    return this.trySetColumnHeaderFocus(
                        headerElements,
                        this.columnIndex
                    );
                }
                return false;
            }
            default:
                break;
        }

        return false;
    }

    private onMoveDown(rowDelta: number, newRowIndex?: number): boolean {
        const coerceRowIndex = rowDelta > 1;
        switch (this.focusType) {
            case TableFocusType.headerActions: {
                this.setRowFocusState(0);
                return this.scrollToAndFocusRow(0);
            }
            case TableFocusType.columnHeader: {
                this.setCellFocusState(this.columnIndex, 0, false);
                return this.scrollToAndFocusRow(0);
            }
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
            case TableFocusType.cell: {
                const scrollOptions: ScrollToOptions = {};
                let rowIndex = this.rowIndex;
                if (newRowIndex !== undefined) {
                    rowIndex = newRowIndex;
                }
                rowIndex += rowDelta;
                if (coerceRowIndex && rowIndex >= this.table.tableData.length) {
                    rowIndex = this.table.tableData.length - 1;
                }
                if (rowDelta > 1) {
                    scrollOptions.align = 'end';
                }
                if (
                    rowIndex > this.rowIndex
                    && rowIndex < this.table.tableData.length
                ) {
                    return this.scrollToAndFocusRow(rowIndex, scrollOptions);
                }
                return false;
            }
            default:
                break;
        }

        return false;
    }

    private updateFocusStateFromActiveElement(setRowFocus: boolean): void {
        // If the user is interacting with the table with non-keyboard methods (like mouse), we need to
        // update our focus state based on the current active/focused element
        const activeElement = this.getActiveElement();
        if (activeElement) {
            const row = this.getContainingRow(activeElement);
            if (row) {
                if (!(row instanceof TableGroupRow)) {
                    const cell = this.getContainingCell(activeElement);
                    if (cell) {
                        const columnIndex = this.table.visibleColumns.indexOf(
                            cell.column!
                        );
                        if (cell.actionMenuButton === activeElement) {
                            this.setCellActionMenuFocusState(
                                row.resolvedRowIndex!,
                                columnIndex,
                                false
                            );
                            return;
                        }
                        const contentIndex = cell.cellView.tabbableChildren.indexOf(
                            activeElement
                        );
                        if (contentIndex > -1) {
                            this.setCellContentFocusState(
                                contentIndex,
                                row.resolvedRowIndex!,
                                columnIndex,
                                false
                            );
                            return;
                        }
                    }
                }
                if (
                    setRowFocus
                    && this.hasRowOrCellFocusType()
                    && this.rowIndex !== row.resolvedRowIndex
                ) {
                    this.setRowFocusState(row.resolvedRowIndex);
                }
            }
        }
    }

    private focusElement(
        element: HTMLElement,
        focusOptions?: FocusOptions
    ): void {
        const previousActiveElement = this.getActiveElement();
        if (previousActiveElement !== element) {
            this.setElementFocusable(element, true);
            this.isCurrentlyFocusingElement = true;
            element.focus(focusOptions);
            this.isCurrentlyFocusingElement = false;
            if (
                previousActiveElement
                && this.isInTable(previousActiveElement)
            ) {
                this.setElementFocusable(previousActiveElement, false);
            }
        }
    }

    private setElementFocusable(
        element: HTMLElement,
        focusable: boolean
    ): void {
        if (element === this.table) {
            return;
        }

        element.tabIndex = focusable ? 0 : -1;
    }

    private setActionMenuButtonFocused(
        menuButton: MenuButton,
        focused: boolean
    ): void {
        // The action MenuButton needs to be visible in order to be focused, so this CSS class styling
        // handles that (see cell/styles.ts).
        if (focused) {
            menuButton.classList.add('cell-action-menu-focused');
        } else {
            menuButton.classList.remove('cell-action-menu-focused');
        }
    }

    private setFocusOnHeader(): boolean {
        if (this.hasHeaderFocusType()) {
            return this.focusHeaderElement();
        }
        this.setDefaultFocus();
        return this.focusType !== TableFocusType.none;
    }

    private setDefaultFocus(): void {
        const headerElements = this.getTableHeaderFocusableElements();
        if (
            !this.trySetHeaderActionFocus(headerElements, 0)
            && !this.trySetColumnHeaderFocus(headerElements, 0)
            && !this.scrollToAndFocusRow(0)
        ) {
            this.focusType = TableFocusType.none;
        }
    }

    private scrollToAndFocusRow(
        totalRowIndex: number,
        scrollOptions?: ScrollToOptions
    ): boolean {
        if (totalRowIndex >= 0 && totalRowIndex < this.table.tableData.length) {
            switch (this.focusType) {
                case TableFocusType.none:
                case TableFocusType.headerActions:
                case TableFocusType.columnHeader:
                    this.setRowFocusState(totalRowIndex);
                    break;
                default:
                    break;
            }
            this.rowIndex = totalRowIndex;
            this.virtualizer.scrollToIndex(totalRowIndex, scrollOptions);
            this.focusCurrentRow(true);
            return true;
        }
        return false;
    }

    private focusCurrentRow(allowScroll: boolean): boolean {
        const visibleRowIndex = this.getCurrentRowVisibleIndex();
        if (visibleRowIndex < 0) {
            return false;
        }
        const focusedRow = this.table.rowElements[visibleRowIndex]!;

        let focusRowOnly = false;
        switch (this.focusType) {
            case TableFocusType.row:
                focusRowOnly = true;
                break;
            case TableFocusType.cell:
            case TableFocusType.cellActionMenu:
            case TableFocusType.cellContent:
                focusRowOnly = focusedRow instanceof TableGroupRow;
                break;
            default:
                break;
        }
        const focusOptions = { preventScroll: !allowScroll };
        if (focusRowOnly) {
            this.focusElement(focusedRow, focusOptions);
            return true;
        }
        this.focusRowElement(focusedRow, focusOptions);
        return true;
    }

    private focusRowElement(
        row: TableRow | TableGroupRow,
        focusOptions?: FocusOptions
    ): void {
        const rowElements = row.getFocusableElements();
        let focusableElement: HTMLElement | undefined;
        switch (this.focusType) {
            case TableFocusType.rowSelectionCheckbox:
                focusableElement = rowElements.selectionCheckbox;
                break;
            case TableFocusType.cell: {
                focusableElement = rowElements.cells[this.columnIndex]!.cell;
                break;
            }
            case TableFocusType.cellActionMenu: {
                const actionMenuButton = rowElements.cells[this.columnIndex]?.cell.actionMenuButton;
                if (actionMenuButton) {
                    focusableElement = actionMenuButton;
                    this.setActionMenuButtonFocused(actionMenuButton, true);
                }
                break;
            }
            case TableFocusType.cellContent: {
                focusableElement = rowElements.cells[this.columnIndex]?.cell.cellView
                    .tabbableChildren[this.cellContentIndex];
                break;
            }
            default:
                break;
        }
        if (focusableElement) {
            this.focusElement(focusableElement, focusOptions);
        }
    }

    private focusHeaderElement(): boolean {
        const headerElements = this.getTableHeaderFocusableElements();
        let focusableElement: HTMLElement | undefined;
        switch (this.focusType) {
            case TableFocusType.headerActions:
                focusableElement = headerElements.headerActions[this.headerActionIndex];
                break;
            case TableFocusType.columnHeader:
                focusableElement = headerElements.columnHeaders[this.columnIndex];
                break;
            default:
                break;
        }
        if (focusableElement) {
            this.focusElement(focusableElement);
            return true;
        }
        return false;
    }

    private getCurrentRowVisibleIndex(): number {
        return this.table.rowElements.findIndex(
            row => row.resolvedRowIndex === this.rowIndex
        );
    }

    private getTableHeaderFocusableElements(): TableHeaderFocusableElements {
        const headerActions: HTMLElement[] = [];
        if (
            this.table.selectionCheckbox?.getRootNode()
            === this.table.shadowRoot
        ) {
            headerActions.push(this.table.selectionCheckbox);
        }

        if (
            this.table.showCollapseAll
            && this.table.collapseAllButton?.getRootNode()
                === this.table.shadowRoot
        ) {
            headerActions.push(this.table.collapseAllButton);
        }

        const columnHeaders: HTMLElement[] = [];
        if (this.canFocusColumnHeaders()) {
            this.table.columnHeadersContainer
                .querySelectorAll(tableHeaderTag)
                .forEach(header => columnHeaders.push(header));
        }

        return { headerActions, columnHeaders };
    }

    private canFocusColumnHeaders(): boolean {
        return (
            this.table.columns.find(c => !c.columnInternals.sortingDisabled)
            !== undefined
        );
    }

    private getCurrentRow(): TableRow | TableGroupRow | undefined {
        return this.table.rowElements[this.getCurrentRowVisibleIndex()];
    }

    private isRowExpanded(
        row: TableRow | TableGroupRow | undefined
    ): boolean | undefined {
        if (
            (row instanceof TableRow && row.isParentRow)
            || row instanceof TableGroupRow
        ) {
            return row.expanded;
        }
        return undefined;
    }

    private toggleRowExpanded(row: TableRow | TableGroupRow): void {
        if (row instanceof TableGroupRow) {
            row.onGroupExpandToggle();
        } else {
            row.onRowExpandToggle();
        }
        this.focusRowElement(row);
    }

    private getContainingRow(
        start: Element | undefined | null
    ): TableRow | TableGroupRow | undefined {
        return this.getContainingElement(start, e => this.isResolvedRowType(e));
    }

    private getContainingCell(
        start: Element | undefined | null
    ): TableCell | undefined {
        return this.getContainingElement(start, e => e instanceof TableCell);
    }

    private getContainingElement<TElement>(
        start: Element | undefined | null,
        isElementMatch: (element: Element) => boolean
    ): TElement | undefined {
        let possibleMatch = start;
        while (possibleMatch && possibleMatch !== this.table) {
            if (isElementMatch(possibleMatch)) {
                return possibleMatch as TElement;
            }
            possibleMatch = possibleMatch.parentElement
                ?? (possibleMatch.parentNode as ShadowRoot)?.host;
        }

        return undefined;
    }

    private isInTable(start: Element): boolean {
        let possibleMatch = start;
        while (possibleMatch && possibleMatch !== this.table) {
            possibleMatch = possibleMatch.parentElement
                ?? (possibleMatch.parentNode as ShadowRoot)?.host;
        }

        return possibleMatch === this.table;
    }

    private getActiveElement(): HTMLElement | null {
        let activeElement = document.activeElement;
        while (activeElement?.shadowRoot?.activeElement) {
            activeElement = activeElement.shadowRoot.activeElement;
            // In some cases, the active element may be a sub-part of a control (example: MenuButton -> ToggleButton -> a div with tabindex=0). Stop at the outer control boundary, so that
            // we can more simply check equality against the elements of getTableHeaderFocusableElements() / row.getFocusableElements().
            // (For rows/cells/cell views, we do need to recurse into them, to get to the appropriate focused controls though)
            if (
                activeElement instanceof FoundationElement
                && !this.isResolvedRowType(activeElement)
                && !(activeElement instanceof TableCell)
                && !(activeElement instanceof TableCellView)
            ) {
                break;
            }
        }

        return activeElement as HTMLElement;
    }

    private focusFirstInteractiveElementInCurrentCell(
        rowElements?: TableRowFocusableElements
    ): boolean {
        if (!rowElements) {
            return false;
        }
        return (
            this.trySetCellContentFocus(rowElements, 0)
            || this.trySetCellActionMenuFocus(rowElements)
        );
    }

    private hasRowOrCellFocusType(): boolean {
        switch (this.focusType) {
            case TableFocusType.cell:
            case TableFocusType.cellActionMenu:
            case TableFocusType.cellContent:
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
                return true;
            default:
                return false;
        }
    }

    private hasHeaderFocusType(): boolean {
        switch (this.focusType) {
            case TableFocusType.headerActions:
            case TableFocusType.columnHeader:
                return true;
            default:
                return false;
        }
    }

    private trySetRowSelectionCheckboxFocus(
        rowElements: TableRowFocusableElements | undefined
    ): boolean {
        if (rowElements?.selectionCheckbox) {
            this.focusType = TableFocusType.rowSelectionCheckbox;
            this.focusCurrentRow(true);
            return true;
        }
        return false;
    }

    private trySetColumnHeaderFocus(
        headerElements: TableHeaderFocusableElements,
        columnIndex: number
    ): boolean {
        if (
            columnIndex >= 0
            && columnIndex < headerElements.columnHeaders.length
        ) {
            this.focusType = TableFocusType.columnHeader;
            this.columnIndex = columnIndex;
            this.focusHeaderElement();
            return true;
        }
        return false;
    }

    private trySetHeaderActionFocus(
        headerElements: TableHeaderFocusableElements,
        headerActionIndex: number
    ): boolean {
        if (
            headerActionIndex >= 0
            && headerActionIndex < headerElements.headerActions.length
        ) {
            this.focusType = TableFocusType.headerActions;
            this.headerActionIndex = headerActionIndex;
            this.focusHeaderElement();
            return true;
        }
        return false;
    }

    private trySetCellFocus(
        rowElements: TableRowFocusableElements | undefined,
        columnIndex?: number,
        rowIndex?: number
    ): boolean {
        if (!rowElements) {
            return false;
        }
        const newColumnIndex = columnIndex ?? this.columnIndex;
        const newRowIndex = rowIndex ?? this.rowIndex;

        if (newColumnIndex >= 0 && newColumnIndex < rowElements.cells.length) {
            this.focusType = TableFocusType.cell;
            this.setRowCellFocusState(newColumnIndex, newRowIndex, true);
            return true;
        }

        return false;
    }

    private trySetCellContentFocus(
        rowElements: TableRowFocusableElements | undefined,
        cellContentIndex: number,
        columnIndex?: number,
        rowIndex?: number
    ): boolean {
        if (!rowElements) {
            return false;
        }
        const newColumnIndex = columnIndex ?? this.columnIndex;
        const newRowIndex = rowIndex ?? this.rowIndex;

        if (
            newColumnIndex >= 0
            && newColumnIndex < rowElements.cells.length
            && cellContentIndex >= 0
            && cellContentIndex
                < rowElements.cells[newColumnIndex]!.cell.cellView
                    .tabbableChildren.length
        ) {
            this.setCellContentFocusState(
                cellContentIndex,
                newRowIndex,
                newColumnIndex,
                true
            );
            return true;
        }

        return false;
    }

    private trySetCellActionMenuFocus(
        rowElements: TableRowFocusableElements,
        columnIndex?: number,
        rowIndex?: number
    ): boolean {
        const newColumnIndex = columnIndex ?? this.columnIndex;
        const newRowIndex = rowIndex ?? this.rowIndex;

        if (
            newColumnIndex >= 0
            && newColumnIndex < rowElements.cells.length
            && rowElements.cells[newColumnIndex]!.actionMenuButton
        ) {
            this.setCellActionMenuFocusState(newRowIndex, newColumnIndex, true);
            return true;
        }

        return false;
    }

    private setCellActionMenuFocusState(
        rowIndex: number,
        columnIndex: number,
        focusElement: boolean
    ): void {
        this.focusType = TableFocusType.cellActionMenu;
        this.setRowCellFocusState(columnIndex, rowIndex, focusElement);
    }

    private setCellContentFocusState(
        cellContentIndex: number,
        rowIndex: number,
        columnIndex: number,
        focusElement: boolean
    ): void {
        this.focusType = TableFocusType.cellContent;
        this.cellContentIndex = cellContentIndex;
        this.setRowCellFocusState(columnIndex, rowIndex, focusElement);
    }

    private setRowFocusState(rowIndex?: number): void {
        this.focusType = TableFocusType.row;
        if (rowIndex !== undefined) {
            this.rowIndex = rowIndex;
        }
    }

    private setCellFocusState(
        columnIndex: number,
        rowIndex: number,
        focusElement: boolean
    ): void {
        this.focusType = TableFocusType.cell;
        this.setRowCellFocusState(columnIndex, rowIndex, focusElement);
    }

    private setRowCellFocusState(
        columnIndex: number,
        rowIndex: number,
        focusElement: boolean
    ): void {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        if (focusElement) {
            this.focusCurrentRow(true);
        }
    }

    private isResolvedRowType(row: unknown): row is TableRow | TableGroupRow {
        return row instanceof TableRow || row instanceof TableGroupRow;
    }
}
