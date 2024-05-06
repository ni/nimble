/* eslint-disable no-console */
import { Notifier, Subscriber, Observable } from '@microsoft/fast-element';
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEscape,
    keyTab
} from '@microsoft/fast-web-utilities';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { ScrollToOptions } from '@tanstack/virtual-core';
import type { Table } from '..';
import {
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
import type { TabIndexOverride } from '../../patterns/tab-index-override/types';
import { TableCellView } from '../../table-column/base/cell-view';

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
    private handlingTabPress = false;

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
                'active element',
                this.getActiveElementDebug()
            );
        });
        table.addEventListener('blur', e => {
            console.log(
                'table blur',
                'target',
                e.target,
                'relatedTarget',
                e.relatedTarget,
                'active element',
                this.getActiveElementDebug()
            );
        });
        this.tableNotifier = Observable.getNotifier(this.table);
        this.tableNotifier.subscribe(this, 'rowElements');
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
        if (this.hasRowOrCellFocusType() && this.inNavigationMode) {
            this.focusCurrentRow(false);
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
        let actionMenuActive = false;
        let row: TableRow | TableGroupRow | undefined;
        console.log(
            'table focusin',
            'target',
            event.target,
            'relatedTarget',
            event.relatedTarget,
            'active element',
            this.getActiveElementDebug()
        );
        if (activeElement) {
            row = this.getContainingRow(activeElement);
            const cell = this.getContainingCell(activeElement);
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

        if (event.target instanceof MenuItem) {
            const cell = this.getCellWithActionMenu(event.target);
            if (cell) {
                const rowWithActionMenu = this.getContainingRow(cell);
                this.focusState.focusType = TableFocusType.cellActionMenu;
                this.focusState.rowIndex = rowWithActionMenu!.dataIndex;
                this.focusState.columnIndex = this.table.visibleColumns.indexOf(
                    cell.column!
                );
                actionMenuActive = true;
                this.inNavigationMode = false;
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
            this.handlingTabPress = true;
            handled = this.onTabPressed(event.shiftKey);
            this.handlingTabPress = false;
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
                default:
                    break;
            }
        }
        if (handled) {
            event.preventDefault();
        }

        // TODO: unhandled keys: PageUp/PageDown, Home/End, Ctrl-Home/End
        // Enter/F2/Ctrl-Enter (nav mode => cell or action menu interaction modes)
    };

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (
            !this.inNavigationMode
            && event.key === keyEscape
            && !event.defaultPrevented
            && (this.focusState.focusType === TableFocusType.cellActionMenu
                || this.focusState.focusType === TableFocusType.cellContent)
        ) {
            const focusedRow = this.getCurrentRow();
            if (focusedRow) {
                this.focusState.focusType = TableFocusType.cell;
                this.focusRowElement(focusedRow);
                this.inNavigationMode = true;
                event.preventDefault();
            }
        }
        // TODO: unhandled keys: Enter to exit cell interaction mode (according to HLD at least - may not make sense until have text inputs/ combobox in a cell)
    };

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
        const focusType = this.focusState.focusType;
        switch (focusType) {
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
            case TableFocusType.cell:
                if (this.focusState.rowIndex! > 0) {
                    return this.scrollToAndFocusRow(
                        this.focusState.rowIndex! - 1
                    );
                }
                if (
                    focusType === TableFocusType.row
                    || focusType === TableFocusType.rowSelectionCheckbox
                ) {
                    if (this.focusableHeaderElements.headerActions.length > 0) {
                        const selectAllCheckboxIndex = 0;
                        this.focusState.focusType = TableFocusType.headerActions;
                        this.focusState.headerActionIndex = selectAllCheckboxIndex;
                        this.focusHeaderElement();
                        return true;
                    }
                    if (this.focusableHeaderElements.columnHeaders.length > 0) {
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
                break;
            default:
                break;
        }

        return false;
    }

    private onDownArrowPressed(): boolean {
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
            case TableFocusType.cell:
                if (
                    this.focusState.rowIndex! + 1
                    < this.table.tableData.length
                ) {
                    return this.scrollToAndFocusRow(
                        this.focusState.rowIndex! + 1
                    );
                }
                return false;
            default:
                break;
        }

        return false;
    }

    private onTabPressed(shiftKeyPressed: boolean): boolean {
        const activeElement = this.getActiveElement();
        if (activeElement === null || activeElement === this.table) {
            return false;
        }

        let focusableElement: HTMLElement | undefined;
        if (this.hasRowOrCellFocusType()) {
            const row = this.getCurrentRow()!;
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
                                ]!.cell.cellView.tabbableChildren.length === 0)
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

        activeElement.blur();
        this.setElementFocusable(activeElement, false);
    }

    private focusElement(
        element: HTMLElement,
        focusOptions?: FocusOptions
    ): void {
        const previousActiveElement = this.getActiveElement();
        if (previousActiveElement !== element) {
            this.setElementFocusable(element, true);
            element.focus(focusOptions);
            if (previousActiveElement) {
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

        const tabIndex = focusable ? 0 : -1;
        const menuButton = element instanceof MenuButton
            ? element
            : this.getContainingMenuButton(element);
        if (menuButton) {
            menuButton.tabIndexOverride = tabIndex;
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

        if ('tabIndexOverride' in element) {
            (element as TabIndexOverride).tabIndexOverride = tabIndex;
        } else {
            element.tabIndex = tabIndex;
        }
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
            this.virtualizer.scrollToIndex(
                this.focusState.rowIndex,
                scrollOptions
            );
            return this.focusCurrentRow(true);
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

    private getActiveElement(): HTMLElement | null {
        let activeElement = document.activeElement;
        while (activeElement?.shadowRoot?.activeElement) {
            activeElement = activeElement.shadowRoot.activeElement;
            // In some cases, the active element may be a sub-part of a control (example: MenuButton -> ToggleButton -> a div with tabindex=0). Stop at the outer control boundary, so that
            // we can more simply check equality against the elements of getTableHeaderFocusableElements() / row.getFocusableElements().
            // (For rows/cells/cell views, we do need to recurse into them, to get to the appropriate focused controls though)
            if (
                activeElement instanceof FoundationElement
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
