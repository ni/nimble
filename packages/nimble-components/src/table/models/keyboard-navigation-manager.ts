/* eslint-disable no-console */
import { Notifier, Subscriber, Observable } from '@microsoft/fast-element';
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
} from '@microsoft/fast-web-utilities';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { ScrollToOptions } from '@tanstack/virtual-core';
import type { Table } from '..';
import {
    TableActionMenuToggleEventDetail,
    TableFocusType,
    TableRowFocusableElements,
    type TableRecord
} from '../types';
import type { Virtualizer } from './virtualizer';
import { TableGroupRow } from '../components/group-row';
import { TableRow } from '../components/row';
import { TableCell } from '../components/cell';
import { MenuButton } from '../../menu-button';
import { tableHeaderTag } from '../components/header';
import { MenuItem } from '../../menu-item';
import { Menu } from '../../menu';
import { TableCellView } from '../../table-column/base/cell-view';
import { getTabIndexTarget } from '../../utilities/directive/not-focusable';

interface TableFocusState {
    focusType: TableFocusType;
    headerActionIndex?: number;
    rowIndex?: number;
    columnIndex?: number;
    cellContentIndex?: number;
}

interface TableHeaderFocusableElements {
    headerActions: HTMLElement[];
    columnHeaders: HTMLElement[];
}

/**
 * Manages the keyboard navigation and focus within the table.
 * @internal
 */
export class KeyboardNavigationManager<TData extends TableRecord>
implements Subscriber {
    private readonly focusState: TableFocusState = {
        focusType: TableFocusType.none
    };

    private readonly tableNotifier: Notifier;
    private focusableHeaderElements!: TableHeaderFocusableElements;
    private inNavigationMode = true;
    private needsRowFocusAfterScroll = false;

    public constructor(
        private readonly table: Table<TData>,
        private readonly virtualizer: Virtualizer<TData>
    ) {
        table.addEventListener('keydown', e => this.onCaptureKeyDown(e), {
            capture: true
        });
        table.addEventListener('keydown', e => this.onKeyDown(e));
        table.addEventListener('focusin', e => this.handleFocus(e));
        table.addEventListener('focusout', e => {
            console.log(
                'table focusout',
                'target',
                e.target,
                'relatedTarget',
                e.relatedTarget,
                'nav mode',
                this.inNavigationMode,
                'focusType',
                this.focusState.focusType
            );
            if (e.relatedTarget instanceof MenuItem) {
                const cell = this.getCellWithActionMenu(e.relatedTarget);
                if (cell) {
                    const rowWithActionMenu = this.getContainingRow(cell);
                    this.focusState.focusType = TableFocusType.cellActionMenu;
                    this.focusState.rowIndex = rowWithActionMenu!.dataIndex;
                    this.focusState.columnIndex = this.table.visibleColumns.indexOf(cell.column!);
                    this.inNavigationMode = false;
                    // Need to ensure action menu button is focusable. If nothing in the table is focusable, opening an
                    // action menu via keyboard results in the menu losing focus too (could no longer select menu items
                    // with the keyboard)
                    this.setElementFocusable(cell.actionMenuButton!, true);
                }
            }
        });
        table.addEventListener('blur', e => {
            console.log(
                'table blur',
                'target',
                e.target,
                'relatedTarget',
                e.relatedTarget,
                'nav mode',
                this.inNavigationMode,
                'focusType',
                this.focusState.focusType
            );
        });
        this.tableNotifier = Observable.getNotifier(this.table);
        this.tableNotifier.subscribe(this, 'rowElements');
        window.setTimeout(() => this.printActiveElement(), 8000);
    }

    public connect(): void {
        this.table.viewport.addEventListener('keydown', e => this.onViewportKeyDown(e));
    }

    public printActiveElement(): void {
        console.log('Current Active Element', this.getActiveElement(false));
        window.setTimeout(() => this.printActiveElement(), 8000);
    }

    public handleChange(source: unknown, args: unknown): void {
        if (
            source === this.table
            && args === 'rowElements'
            && this.hasRowOrCellFocusType()
            && this.inNavigationMode
        ) {
            this.focusCurrentRow(false);
        }
    }

    public onVirtualizerChange(): void {
        const needsFocus = this.inNavigationMode || this.needsRowFocusAfterScroll;
        const allowScroll = this.needsRowFocusAfterScroll;
        if (this.hasRowOrCellFocusType() && needsFocus) {
            // TODO - the rAF fixes an issue where fast ArrowDown presses won't always focus a new row. Look at switching this
            // back to observing both the virtualizer items and the dataIndex on rows.
            window.requestAnimationFrame(() => {
                this.focusCurrentRow(allowScroll);
                this.needsRowFocusAfterScroll = false;
            });
        }
    }

    public onRowFocusIn(event: FocusEvent): void {
        const row = event.target;
        if (row instanceof TableRow || row instanceof TableGroupRow) {
            if (this.focusState.rowIndex !== row.dataIndex) {
                this.focusState.focusType = TableFocusType.row;
                this.focusState.rowIndex = row.dataIndex;
            }
        }
    }

    public onRowActionMenuToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        const isOpen = event.detail.newState;
        const row = event.target as TableRow;
        if (isOpen) {
            this.focusState.focusType = TableFocusType.cellActionMenu;
            this.focusState.rowIndex = row.dataIndex;
            this.focusState.columnIndex = this.table.visibleColumns.findIndex(
                column => column.columnId === event.detail.columnId
            );
            this.inNavigationMode = false;
        }
    }

    private readonly handleFocus = (event: FocusEvent): void => {
        // User may have clicked elsewhere in the table (on an element not reflected in this.focusState). Update our focusState
        // based on the current active element in a few cases:
        // - user is interacting with tabbable content of a cell
        // - user clicked an action menu. In this case, the active element can either be the MenuButton (no table focus beforehand), or a
        //   MenuItem (if focus was already in the table when the action menu button was clicked).  If it's a MenuItem, we need to look up
        //   the linked action menu and cell to figure out what to set our focusState to.
        // TODO: any better ways to handle this? Only do this if mouse clicked after last key navigation? Cache the active element
        // as we update focusState, and only do the more complicated logic if activeElement no longer matches what we think it should
        // be (based on focusState)?
        const activeElement = this.getActiveElement();
        let actionMenuActive = this.table.openActionMenuRecordId !== undefined;
        let row: TableRow | TableGroupRow | undefined;
        let cell: TableCell | undefined;
        console.log(
            'table focusin',
            'target',
            event.target,
            'relatedTarget',
            event.relatedTarget
        );
        if (activeElement) {
            row = this.getContainingRow(activeElement);
            cell = this.getContainingCell(activeElement);
            if (row && !(row instanceof TableGroupRow)) {
                if (cell) {
                    if (cell.actionMenuButton === activeElement) {
                        this.focusState.focusType = TableFocusType.cellActionMenu;
                        this.focusState.rowIndex = row.dataIndex;
                        this.focusState.columnIndex = this.table.visibleColumns.indexOf(cell.column!);
                        actionMenuActive = true;
                        this.inNavigationMode = false;
                    } else {
                        const contentIndex = cell.cellView.tabbableChildren.indexOf(
                            activeElement
                        );
                        if (contentIndex > -1) {
                            this.focusState.focusType = TableFocusType.cellContent;
                            this.focusState.rowIndex = row.dataIndex;
                            this.focusState.columnIndex = this.table.visibleColumns.indexOf(cell.column!);
                            this.focusState.cellContentIndex = contentIndex;
                            this.inNavigationMode = false;
                        }
                    }
                }
            }
        }

        // Sets initial focus on the appropriate table content
        if (
            (event.target === this.table
                || this.focusState.focusType === TableFocusType.none)
            && !actionMenuActive
        ) {
            let focusHeader = true;
            if (
                this.hasRowOrCellFocusType()
                && this.scrollToAndFocusRow(this.focusState.rowIndex!)
            ) {
                focusHeader = false;
            }
            this.inNavigationMode = this.focusState.focusType !== TableFocusType.cellActionMenu
                && this.focusState.focusType !== TableFocusType.cellContent;
            if (focusHeader && !this.setFocusOnHeader()) {
                this.table.blur(); // nothing to focus
            }
        }
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
            if (
                event.key === keyEscape
                && (this.focusState.focusType === TableFocusType.cellActionMenu
                    || this.focusState.focusType === TableFocusType.cellContent)
                /* || (event.key === keyEnter && this.focusState.focusType === TableFocusType.cellContent) */
            ) {
                const focusedRow = this.getCurrentRow();
                if (focusedRow) {
                    this.focusState.focusType = TableFocusType.cell;
                    this.focusRowElement(focusedRow);
                    this.inNavigationMode = true;
                    // event.preventDefault();
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
            // Swallow keypresses that would cause table scrolling, independently of keyboard navigation
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    private onEnterPressed(ctrlKey: boolean): boolean {
        let row: TableRow | TableGroupRow | undefined;
        let focusableRowElements: TableRowFocusableElements;
        if (this.hasRowOrCellFocusType()) {
            row = this.getCurrentRow();
            focusableRowElements = row!.getFocusableElements();
        }
        if (this.focusState.focusType === TableFocusType.row) {
            if (row instanceof TableGroupRow) {
                this.toggleRowExpanded(row);
                return true;
            }
        }
        if (this.focusState.focusType === TableFocusType.cell) {
            if (ctrlKey) {
                const cell = focusableRowElements!.cells[this.focusState.columnIndex!]!;
                if (cell.actionMenuButton && !cell.actionMenuButton.open) {
                    cell.actionMenuButton.toggleButton!.control.click();
                    return true;
                }
            } else {
                // const previousActiveElement = this.getActiveElement(false);
                const interactiveElement = this.focusFirstInteractiveElementInCurrentCell(
                    focusableRowElements!
                );
                // for same behavior as F2:
                // return interactiveElement !== undefined;
                if (interactiveElement) {
                    // Since the element may delegate focus, we want to get the innermost active element to
                    // interact with. (Example: <a> inside the nimble-anchor)
                    const newActiveElement = this.getActiveElement(false);
                    if (newActiveElement) {
                        newActiveElement.click();
                    } else {
                        interactiveElement.click();
                    }
                    return true;
                }
            }
        }
        return false;
    }

    private onF2Pressed(): boolean {
        if (this.focusState.focusType === TableFocusType.cell) {
            const row = this.getCurrentRow();
            const focusableRowElements = row!.getFocusableElements();
            const cellInfo = focusableRowElements.cells[this.focusState.columnIndex!]!;
            if (
                !cellInfo.actionMenuButton
                && cellInfo.cell.cellView.tabbableChildren.length === 1
            ) {
                // already focused (single interactive element)
                return false;
            }
            const interactiveElement = this.focusFirstInteractiveElementInCurrentCell(
                focusableRowElements
            );
            return interactiveElement !== undefined;
        }
        return false;
    }

    private onSpacePressed(shiftKey: boolean): boolean {
        if (
            this.focusState.focusType === TableFocusType.row
            || this.focusState.focusType === TableFocusType.cell
        ) {
            if (this.focusState.focusType === TableFocusType.row || shiftKey) {
                const row = this.getCurrentRow();
                if (row instanceof TableRow) {
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
        const focusType = this.focusState.focusType;
        let focusedRow: TableRow | TableGroupRow | undefined;
        let focusedRowElements: TableRowFocusableElements;
        if (this.hasRowOrCellFocusType()) {
            focusedRow = this.getCurrentRow();
            focusedRowElements = focusedRow!.getFocusableElements();
        }

        switch (focusType) {
            case TableFocusType.headerActions:
                if (this.focusState.headerActionIndex! - 1 < 0) {
                    return false;
                }
                this.focusState.headerActionIndex! -= 1;
                this.focusHeaderElement();
                return true;
            case TableFocusType.columnHeader:
                if (this.focusState.columnIndex! - 1 >= 0) {
                    this.focusState.columnIndex! -= 1;
                    this.focusHeaderElement();
                    return true;
                }
                if (this.focusableHeaderElements.headerActions.length > 0) {
                    this.focusState.focusType = TableFocusType.headerActions;
                    this.focusState.headerActionIndex = this.focusableHeaderElements.headerActions.length - 1;
                    this.focusHeaderElement();
                    return true;
                }
                return false;
            case TableFocusType.row:
                if (this.isRowExpanded(focusedRow) === true) {
                    this.toggleRowExpanded(focusedRow!);
                    return true;
                }
                return false;
            case TableFocusType.rowSelectionCheckbox:
                this.focusState.focusType = TableFocusType.row;
                this.focusCurrentRow(true);
                return true;
            case TableFocusType.cell:
                if (focusedRowElements!.cells.length > 0) {
                    if (this.focusState.columnIndex! - 1 < 0) {
                        if (focusedRowElements!.selectionCheckbox) {
                            this.focusState.focusType = TableFocusType.rowSelectionCheckbox;
                        } else {
                            this.focusState.focusType = TableFocusType.row;
                            this.focusCurrentRow(true);
                            return true;
                        }
                    } else {
                        this.focusState.columnIndex! -= 1;
                    }
                    this.focusRowElement(focusedRow!);
                    return true;
                }
                return false;
            default:
                break;
        }

        return false;
    }

    private onRightArrowPressed(): boolean {
        const focusType = this.focusState.focusType;
        let focusedRow: TableRow | TableGroupRow | undefined;
        let focusedRowElements: TableRowFocusableElements;
        if (this.hasRowOrCellFocusType()) {
            focusedRow = this.getCurrentRow();
            focusedRowElements = focusedRow!.getFocusableElements();
        }

        switch (focusType) {
            case TableFocusType.headerActions:
                if (
                    this.focusState.headerActionIndex! + 1
                    >= this.focusableHeaderElements.headerActions.length
                ) {
                    if (this.focusableHeaderElements.columnHeaders.length > 0) {
                        this.focusState.focusType = TableFocusType.columnHeader;
                        this.focusState.columnIndex = 0;
                    } else {
                        return false;
                    }
                } else {
                    this.focusState.headerActionIndex! += 1;
                }
                this.focusHeaderElement();
                return true;
            case TableFocusType.columnHeader:
                if (
                    this.focusState.columnIndex! + 1
                    < this.focusableHeaderElements.columnHeaders.length
                ) {
                    this.focusState.columnIndex! += 1;
                    this.focusHeaderElement();
                    return true;
                }
                return false;
            case TableFocusType.row:
                if (this.isRowExpanded(focusedRow) === false) {
                    this.toggleRowExpanded(focusedRow!);
                } else if (focusedRowElements!.selectionCheckbox) {
                    this.focusState.focusType = TableFocusType.rowSelectionCheckbox;
                } else if (focusedRowElements!.cells.length > 0) {
                    this.focusState.columnIndex = 0;
                    this.focusState.focusType = TableFocusType.cell;
                } else {
                    return false;
                }
                this.focusRowElement(focusedRow!);
                return true;
            case TableFocusType.rowSelectionCheckbox:
                if (focusedRowElements!.cells.length > 0) {
                    this.focusState.focusType = TableFocusType.cell;
                    this.focusState.columnIndex = 0;
                    this.focusRowElement(focusedRow!);
                    return true;
                }
                return false;
            case TableFocusType.cell:
                if (
                    this.focusState.columnIndex! + 1
                    < focusedRowElements!.cells.length
                ) {
                    this.focusState.columnIndex! += 1;
                    this.focusRowElement(focusedRow!);
                    return true;
                }
                return false;
            default:
                break;
        }

        return false;
    }

    private onUpArrowPressed(): boolean {
        return this.onMoveUp(1);
    }

    private onPageUpPressed(): boolean {
        return this.onMoveUp(this.virtualizer.pageSize);
    }

    private onHomePressed(ctrlKey: boolean): boolean {
        if (!ctrlKey && this.focusState.focusType === TableFocusType.cell) {
            const focusedRow = this.getCurrentRow();
            const focusedRowElements = focusedRow!.getFocusableElements();
            if (focusedRowElements.selectionCheckbox) {
                this.focusState.focusType = TableFocusType.rowSelectionCheckbox;
                this.focusRowElement(focusedRow!);
                return true;
            }
            if (focusedRowElements.cells.length > 0) {
                this.focusState.columnIndex = 0;
                this.focusRowElement(focusedRow!);
                return true;
            }
        }

        return this.onMoveUp(0, 0);
    }

    private onDownArrowPressed(): boolean {
        return this.onMoveDown(1);
    }

    private onPageDownPressed(): boolean {
        if (!this.inNavigationMode) {
            return true;
        }
        return this.onMoveDown(this.virtualizer.pageSize);
    }

    private onEndPressed(ctrlKey: boolean): boolean {
        if (
            !ctrlKey
            && (this.focusState.focusType === TableFocusType.cell
                || this.focusState.focusType
                    === TableFocusType.rowSelectionCheckbox)
        ) {
            const focusedRow = this.getCurrentRow();
            const focusedRowElements = focusedRow!.getFocusableElements();
            if (focusedRowElements.cells.length > 0) {
                this.focusState.focusType = TableFocusType.cell;
                this.focusState.columnIndex = focusedRowElements.cells.length - 1;
                this.focusRowElement(focusedRow!);
                return true;
            }
        }

        return this.onMoveDown(0, this.table.tableData.length - 1);
    }

    private onTabPressed(shiftKeyPressed: boolean): boolean {
        const activeElement = this.getActiveElement();
        if (activeElement === null || activeElement === this.table) {
            return false;
        }

        let focusableElement: HTMLElement | undefined;
        if (this.hasRowOrCellFocusType()) {
            const row = this.getCurrentRow();
            if (row === undefined) {
                // this.blurAfterLastTab(activeElement);
                return false;
            }
            const focusableRowElements = row.getFocusableElements();
            if (!shiftKeyPressed) {
                let cellIndex = -1;
                switch (this.focusState.focusType) {
                    case TableFocusType.row:
                        if (focusableRowElements.selectionCheckbox) {
                            focusableElement = focusableRowElements.selectionCheckbox;
                            this.focusState.focusType = TableFocusType.rowSelectionCheckbox;
                        } else {
                            cellIndex = 0;
                        }
                        break;
                    case TableFocusType.rowSelectionCheckbox:
                        cellIndex = 0;
                        break;
                    case TableFocusType.cell:
                    case TableFocusType.cellActionMenu:
                    case TableFocusType.cellContent:
                        cellIndex = this.focusState.columnIndex!;
                        if (
                            this.focusState.focusType
                            === TableFocusType.cellActionMenu
                        ) {
                            cellIndex += 1;
                        }
                        break;
                    default:
                        break;
                }
                let cellContentIndex = 0;
                if (this.focusState.focusType === TableFocusType.cellContent) {
                    cellContentIndex = this.focusState.cellContentIndex! + 1;
                } else if (this.focusState.focusType === TableFocusType.cell) {
                    const cellInfo = focusableRowElements.cells[cellIndex]!;
                    if (
                        !cellInfo.actionMenuButton
                        && cellInfo.cell.cellView.tabbableChildren.length === 1
                    ) {
                        // Single interactive element (which means it was already focused)
                        cellContentIndex = 1; // Skip single interactive element
                    }
                }
                while (
                    cellIndex >= 0
                    && cellIndex < this.table.visibleColumns.length
                ) {
                    const cell = focusableRowElements.cells[cellIndex]!;
                    const tabbableCellContent = cell.cell.cellView.tabbableChildren;
                    while (cellContentIndex < tabbableCellContent.length) {
                        focusableElement = tabbableCellContent[cellContentIndex];
                        if (focusableElement) {
                            break;
                        }
                        cellContentIndex += 1;
                    }
                    if (focusableElement) {
                        this.focusState.focusType = TableFocusType.cellContent;
                        this.focusState.columnIndex = cellIndex;
                        this.focusState.cellContentIndex = cellContentIndex;
                        break;
                    }
                    if (cell.actionMenuButton) {
                        focusableElement = cell.actionMenuButton;
                        this.focusState.focusType = TableFocusType.cellActionMenu;
                        this.focusState.columnIndex = cellIndex;
                        break;
                    }
                    cellIndex += 1;
                    cellContentIndex = 0;
                }
            } else {
                // shiftKeyPressed
                let cellIndex = -1;
                switch (this.focusState.focusType) {
                    case TableFocusType.row:
                        cellIndex = focusableRowElements.cells.length - 1;
                        break;
                    case TableFocusType.rowSelectionCheckbox:
                        // Already on the 1st tabbable row element; nothing else to focus (we'll blur)
                        break;
                    case TableFocusType.cell:
                    case TableFocusType.cellActionMenu:
                    case TableFocusType.cellContent:
                        cellIndex = this.focusState.columnIndex!;
                        if (
                            (this.focusState.focusType
                                === TableFocusType.cellContent
                                && this.focusState.cellContentIndex === 0)
                            || (this.focusState.focusType
                                === TableFocusType.cellActionMenu
                                && focusableRowElements.cells[
                                    this.focusState.columnIndex!
                                ]!.cell.cellView.tabbableChildren.length
                                    === 0)
                            || (this.focusState.focusType
                                === TableFocusType.cell
                                && !focusableRowElements.cells[
                                    this.focusState.columnIndex!
                                ]!.actionMenuButton
                                && focusableRowElements.cells[
                                    this.focusState.columnIndex!
                                ]!.cell.cellView.tabbableChildren.length === 1)
                        ) {
                            cellIndex -= 1;
                        }
                        break;
                    default:
                        break;
                }
                let cellContentIndex: number | undefined;
                if (this.focusState.focusType === TableFocusType.cellContent) {
                    cellContentIndex = this.focusState.cellContentIndex! - 1;
                } else if (
                    this.focusState.focusType
                        === TableFocusType.cellActionMenu
                    && cellIndex === this.focusState.columnIndex!
                ) {
                    cellContentIndex = -1;
                }
                while (
                    cellIndex >= 0
                    && cellIndex < this.table.visibleColumns.length
                ) {
                    const cell = focusableRowElements.cells[cellIndex]!;
                    if (
                        cellContentIndex === undefined
                        && cell.actionMenuButton
                    ) {
                        focusableElement = cell.actionMenuButton;
                        this.focusState.focusType = TableFocusType.cellActionMenu;
                        this.focusState.columnIndex = cellIndex;
                        break;
                    }
                    const tabbableCellContent = cell.cell.cellView.tabbableChildren;
                    cellContentIndex = tabbableCellContent.length - 1;
                    while (cellContentIndex >= 0) {
                        focusableElement = tabbableCellContent[cellContentIndex];
                        if (focusableElement) {
                            break;
                        }
                        cellContentIndex -= 1;
                    }
                    if (focusableElement) {
                        this.focusState.focusType = TableFocusType.cellContent;
                        this.focusState.columnIndex = cellIndex;
                        this.focusState.cellContentIndex = cellContentIndex;
                        break;
                    }
                    cellIndex -= 1;
                    cellContentIndex = undefined;
                }
                if (
                    focusableElement === undefined
                    && this.focusState.focusType
                        !== TableFocusType.rowSelectionCheckbox
                    && focusableRowElements.selectionCheckbox
                ) {
                    focusableElement = focusableRowElements.selectionCheckbox;
                    this.focusState.focusType = TableFocusType.rowSelectionCheckbox;
                }
            }
        } else {
            const headerActionIndex = this.focusableHeaderElements.headerActions.indexOf(
                activeElement
            );
            if (shiftKeyPressed) {
                if (headerActionIndex > -1) {
                    if (headerActionIndex > 0) {
                        this.focusState.focusType = TableFocusType.headerActions;
                        this.focusState.headerActionIndex = headerActionIndex - 1;
                        focusableElement = this.focusableHeaderElements.headerActions[
                            this.focusState.headerActionIndex
                        ];
                    }
                } else if (
                    this.focusableHeaderElements.columnHeaders.includes(
                        activeElement
                    )
                ) {
                    if (this.focusableHeaderElements.headerActions.length > 0) {
                        this.focusState.focusType = TableFocusType.headerActions;
                        this.focusState.headerActionIndex = this.focusableHeaderElements.headerActions.length
                            - 1;
                        focusableElement = this.focusableHeaderElements.headerActions[
                            this.focusState.headerActionIndex
                        ];
                    }
                }
            } else if (headerActionIndex > -1) {
                if (
                    headerActionIndex + 1
                    < this.focusableHeaderElements.headerActions.length
                ) {
                    this.focusState.focusType = TableFocusType.headerActions;
                    this.focusState.headerActionIndex = headerActionIndex + 1;
                    focusableElement = this.focusableHeaderElements.headerActions[
                        this.focusState.headerActionIndex
                    ];
                }
            }
        }
        if (focusableElement) {
            this.inNavigationMode = this.focusState.focusType !== TableFocusType.cellContent
                && this.focusState.focusType !== TableFocusType.cellActionMenu;
            this.focusElement(focusableElement);
            return true;
        }
        this.blurAfterLastTab(activeElement);
        return false;
    }

    private blurAfterLastTab(activeElement: HTMLElement): void {
        // In order to get the desired browser-provided Tab/Shift-Tab behavior of focusing the
        // element before/after the table, the table shouldn't have tabIndex=0 when this event
        // handling ends. However it needs to be tabIndex=0 so we can re-focus the table the next time
        // it's tabbed to, so set tabIndex back to 0 after a rAF.
        // Note: In Chrome this is only needed for Shift-Tab, but in Firefox both Tab+Shift-Tab need this
        // to work as expected.
        this.table.tabIndex = -1;
        window.requestAnimationFrame(() => {
            this.table.tabIndex = 0;
        });

        // Don't explicitly call blur() on activeElement (causes unexpected behavior on Safari / Mac Firefox)
        // activeElement.blur();
        this.setElementFocusable(activeElement, false);
    }

    private onMoveUp(rowDelta: number, newRowIndex?: number): boolean {
        const focusType = this.focusState.focusType;
        const coerceRowIndex = rowDelta > 1;
        switch (focusType) {
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
            case TableFocusType.cell: {
                const scrollOptions: ScrollToOptions = {};
                let rowIndex = this.focusState.rowIndex!;
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

                if (rowIndex < this.focusState.rowIndex! && rowIndex >= 0) {
                    return this.scrollToAndFocusRow(rowIndex, scrollOptions);
                }
                if (rowIndex === -1) {
                    if (
                        focusType === TableFocusType.row
                        || focusType === TableFocusType.rowSelectionCheckbox
                    ) {
                        if (
                            this.focusableHeaderElements.headerActions.length
                            > 0
                        ) {
                            const selectAllCheckboxIndex = 0;
                            this.focusState.focusType = TableFocusType.headerActions;
                            this.focusState.headerActionIndex = selectAllCheckboxIndex;
                            this.focusHeaderElement();
                            return true;
                        }
                        if (
                            this.focusableHeaderElements.columnHeaders.length
                            > 0
                        ) {
                            this.focusState.focusType = TableFocusType.columnHeader;
                            this.focusState.columnIndex = 0;
                            this.focusHeaderElement();
                            return true;
                        }
                    } else if (
                        focusType === TableFocusType.cell
                        && this.canFocusColumnHeaders()
                    ) {
                        this.focusState.focusType = TableFocusType.columnHeader;
                        this.focusHeaderElement();
                        return true;
                    }
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
        switch (this.focusState.focusType) {
            case TableFocusType.headerActions: {
                this.focusState.focusType = TableFocusType.row;
                return this.scrollToAndFocusRow(0);
            }
            case TableFocusType.columnHeader: {
                this.focusState.focusType = TableFocusType.cell;
                return this.scrollToAndFocusRow(0);
            }
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
            case TableFocusType.cell: {
                const scrollOptions: ScrollToOptions = {};
                let rowIndex = this.focusState.rowIndex!;
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
                    rowIndex > this.focusState.rowIndex!
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

    private focusElement(
        element: HTMLElement,
        focusOptions?: FocusOptions
    ): void {
        const previousActiveElement = this.getActiveElement();
        if (previousActiveElement !== element) {
            this.setElementFocusable(element, true);
            element.focus(focusOptions);
            if (
                previousActiveElement
                && this.isInTable(previousActiveElement)
            ) {
                this.setElementFocusable(previousActiveElement, false);
            }
        } /* else {
            // If a row has been mouse-clicked without keyboard interaction, it'll be the active element
            // but still tabindex -1 at this point.
            const tabIndexTarget = getTabIndexTarget(element);
            if (tabIndexTarget.tabIndex === -1) {
                this.setElementFocusable(element, true);
                element.focus(focusOptions);
            }
        }
        */
    }

    private setElementFocusable(
        element: HTMLElement,
        focusable: boolean
    ): void {
        if (element === this.table) {
            return;
        }

        const tabIndex = focusable ? 0 : -1;
        const menuButton = element instanceof MenuButton
            ? element
            : this.getContainingMenuButton(element);
        let tabIndexTarget = element;
        if (menuButton) {
            tabIndexTarget = menuButton;
            // The MenuButton needs to be visible in order to be focused, so this 'focused' CSS class styling
            // handles that (see cell/styles.ts).
            // TableCell.onActionMenuButtonBlur() ensures that the CSS class is removed when the action menu
            // button is blurred in all cases.
            if (focusable) {
                menuButton.classList.add('focused');
            } else {
                menuButton.classList.remove('focused');
            }
        }

        tabIndexTarget = getTabIndexTarget(tabIndexTarget);
        tabIndexTarget.tabIndex = tabIndex;
    }

    private setFocusOnHeader(): boolean {
        // TODO: Need to re-evaluate this whenever the elements in the header change - e.g.
        // hierarchy on/off, grouping on/off, etc
        this.focusableHeaderElements = this.getTableHeaderFocusableElements();

        if (
            this.focusState.focusType !== TableFocusType.headerActions
            && this.focusState.focusType !== TableFocusType.columnHeader
        ) {
            this.focusState.focusType = TableFocusType.headerActions;
            if (this.focusState.headerActionIndex === undefined) {
                if (this.focusableHeaderElements.headerActions.length > 0) {
                    this.focusState.headerActionIndex = 0;
                } else if (
                    this.focusableHeaderElements.columnHeaders.length > 0
                ) {
                    this.focusState.focusType = TableFocusType.columnHeader;
                    this.focusState.columnIndex = 0;
                } else if (this.table.tableData.length > 0) {
                    return this.scrollToAndFocusRow(0);
                } else {
                    this.focusState.focusType = TableFocusType.none;
                    return false;
                }
            }
        }
        return this.focusHeaderElement();
    }

    private scrollToAndFocusRow(
        totalRowIndex: number,
        scrollOptions?: ScrollToOptions
    ): boolean {
        switch (this.focusState.focusType) {
            case TableFocusType.none:
            case TableFocusType.headerActions:
            case TableFocusType.columnHeader:
                this.focusState.focusType = TableFocusType.row;
                break;
            default:
                break;
        }
        if (totalRowIndex >= 0 && totalRowIndex < this.table.tableData.length) {
            this.focusState.rowIndex = totalRowIndex;
            this.needsRowFocusAfterScroll = true;
            this.virtualizer.scrollToIndex(
                this.focusState.rowIndex,
                scrollOptions
            );
            this.focusCurrentRow(true);
            return true;
        }
        return false;
    }

    private focusCurrentRow(allowScroll: boolean): boolean {
        const visibleRowIndex = this.getVisibleRowIndex();
        if (visibleRowIndex < 0) {
            return false;
        }
        const focusedRow = this.table.rowElements[visibleRowIndex]!;
        let focusRowOnly = false;
        switch (this.focusState.focusType) {
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
        if (focusRowOnly) {
            this.focusElement(focusedRow, { preventScroll: !allowScroll });
            return true;
        }
        this.focusRowElement(focusedRow);
        return true;
    }

    private focusRowElement(row: TableRow | TableGroupRow): void {
        const focusableRowElements = row.getFocusableElements();
        let focusableElement: HTMLElement | undefined;
        switch (this.focusState.focusType) {
            case TableFocusType.rowSelectionCheckbox:
                focusableElement = focusableRowElements.selectionCheckbox;
                break;
            case TableFocusType.cell: {
                const cell = focusableRowElements.cells[this.focusState.columnIndex!]!;
                const tabbableChildren = cell.cell.cellView.tabbableChildren;
                // For cells with a single focusable element, and no action menu, we focus the
                // child element instead of the cell itself (as it's the only thing the user can
                // interact with)
                if (!cell.actionMenuButton && tabbableChildren.length === 1) {
                    focusableElement = tabbableChildren[0];
                } else {
                    focusableElement = cell.cell;
                }
                break;
            }
            case TableFocusType.cellActionMenu:
                focusableElement = focusableRowElements.cells[this.focusState.columnIndex!]!
                    .actionMenuButton;
                break;
            case TableFocusType.cellContent: {
                const cell = focusableRowElements.cells[this.focusState.columnIndex!]!;
                focusableElement = cell.cell.cellView.tabbableChildren[
                    this.focusState.cellContentIndex!
                ];
                break;
            }
            default:
                break;
        }
        if (focusableElement) {
            this.focusElement(focusableElement);
        }
    }

    private focusHeaderElement(): boolean {
        let focusableElement: HTMLElement | undefined;
        switch (this.focusState.focusType) {
            case TableFocusType.headerActions:
                if (
                    this.focusState.headerActionIndex!
                    >= this.focusableHeaderElements.headerActions.length
                ) {
                    return false;
                }
                focusableElement = this.focusableHeaderElements.headerActions[
                    this.focusState.headerActionIndex!
                ]!;
                break;
            case TableFocusType.columnHeader:
                if (
                    this.focusState.columnIndex!
                    >= this.focusableHeaderElements.columnHeaders.length
                ) {
                    return false;
                }
                focusableElement = this.focusableHeaderElements.columnHeaders[
                    this.focusState.columnIndex!
                ]!;
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

    private getVisibleRowIndex(): number {
        return this.table.rowElements.findIndex(
            row => row.dataIndex === this.focusState.rowIndex
        );
    }

    private getTableHeaderFocusableElements(): TableHeaderFocusableElements {
        const headerActions: HTMLElement[] = [];
        if (this.table.selectionCheckbox) {
            headerActions.push(this.table.selectionCheckbox);
        }

        if (this.table.showCollapseAll) {
            headerActions.push(this.table.collapseAllButton!);
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
        return this.table.columns.find(c => !c.sortingDisabled) !== undefined;
    }

    private getCurrentRow(): TableRow | TableGroupRow | undefined {
        const visibleRowIndex = this.getVisibleRowIndex();
        if (visibleRowIndex >= 0) {
            return this.table.rowElements[visibleRowIndex];
        }
        return undefined;
    }

    private isRowExpanded(
        row: TableRow | TableGroupRow | undefined
    ): boolean | undefined {
        if (row instanceof TableRow && row.isParentRow) {
            return row.expanded;
        }
        if (row instanceof TableGroupRow) {
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
    }

    private getContainingRow(
        start: Element | undefined | null
    ): TableRow | TableGroupRow | undefined {
        return this.getContainingElement(
            start,
            e => e instanceof TableRow || e instanceof TableGroupRow
        );
    }

    private getContainingCell(
        start: Element | undefined | null
    ): TableCell | undefined {
        return this.getContainingElement(start, e => e instanceof TableCell);
    }

    private getContainingMenuButton(
        start: Element | undefined | null
    ): MenuButton | undefined {
        return this.getContainingElement(start, e => e instanceof MenuButton);
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

    private getActiveElement(stopAtTableBoundaries = true): HTMLElement | null {
        let activeElement = document.activeElement;
        while (activeElement?.shadowRoot?.activeElement) {
            activeElement = activeElement.shadowRoot.activeElement;
            // In some cases, the active element may be a sub-part of a control (example: MenuButton -> ToggleButton -> a div with tabindex=0). Stop at the outer control boundary, so that
            // we can more simply check equality against the elements of getTableHeaderFocusableElements() / row.getFocusableElements().
            // (For rows/cells/cell views, we do need to recurse into them, to get to the appropriate focused controls though)
            if (
                stopAtTableBoundaries
                && activeElement instanceof FoundationElement
                && !(activeElement instanceof TableRow)
                && !(activeElement instanceof TableCell)
                && !(activeElement instanceof TableCellView)
            ) {
                break;
            }
        }

        return activeElement as HTMLElement;
    }

    private getCellWithActionMenu(menuItem: MenuItem): TableCell | undefined {
        let menuParent = menuItem.parentElement;
        while (menuParent && !(menuParent instanceof Menu)) {
            menuParent = menuParent.parentElement;
        }
        if (menuParent instanceof Menu) {
            const cell = this.getContainingCell(
                menuParent.assignedSlot?.assignedSlot
            );
            const menuSlot = menuParent.assignedSlot?.assignedSlot?.assignedSlot;
            if (
                cell?.actionMenuButton?.slottedMenus
                && menuSlot
                && cell.actionMenuButton.slottedMenus.includes(menuSlot)
            ) {
                return cell;
            }
        }
        return undefined;
    }

    private focusFirstInteractiveElementInCurrentCell(
        focusableRowElements: TableRowFocusableElements
    ): HTMLElement | undefined {
        const cellInfo = focusableRowElements.cells[this.focusState.columnIndex!]!;
        const tabbableElements = cellInfo.cell.cellView.tabbableChildren;
        let firstInteractiveElement: HTMLElement | undefined;
        if (tabbableElements.length > 0) {
            this.focusState.focusType = TableFocusType.cellContent;
            this.focusState.cellContentIndex = 0;
            firstInteractiveElement = tabbableElements[0];
        } else if (cellInfo.actionMenuButton) {
            this.focusState.focusType = TableFocusType.cellActionMenu;
            firstInteractiveElement = cellInfo.actionMenuButton;
        }
        if (firstInteractiveElement) {
            this.inNavigationMode = false;
            this.focusElement(firstInteractiveElement);
        }
        return firstInteractiveElement;
    }

    private hasRowOrCellFocusType(): boolean {
        switch (this.focusState.focusType) {
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

    private getActiveElementDebug(): HTMLElement | string | null {
        const result = this.getActiveElement();
        if (result === document.body) {
            return '<body />';
        }
        return result;
    }
}
