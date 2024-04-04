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
    keyTab
} from '@microsoft/fast-web-utilities';
import type { ScrollToOptions } from '@tanstack/virtual-core';
import type { Table } from '..';
import type { TableRecord } from '../types';
import type { Virtualizer } from './virtualizer';
import { TableGroupRow } from '../components/group-row';
import { TableRow } from '../components/row';
import type { TableCell } from '../components/cell';
import { tabbable } from 'tabbable';

const tableFocusState = {
    none: 0,
    tableFocused: 1,
    rowFocused: 2,
    cellFocused: 3,
    cellContentFocused: 4
} as const;

/**
 * This class manages the keyboard navigation within the table
 * @internal
 */
export class TableNavigationManager<TData extends TableRecord>
implements Subscriber {
    private _focusedTotalRowIndex?: number;
    private _focusedRowElementIndex = -1;
    private _focusedHeaderElementIndex = -1;
    private _focusedRow?: TableRow | TableGroupRow;
    private _focusedCell?: TableCell;
    private _tableActiveElement?: Element;
    private readonly virtualizerNotifier: Notifier;
    private readonly tableNotifier: Notifier;
    private visibleRowNotifiers: Notifier[] = [];
    private focusableRowElements: HTMLElement[] = [];
    private focusableHeaderElements: HTMLElement[] = [];
    private _inNavigationMode = true;
    private _tableFocusState = tableFocusState.none;

    public get focusedRow(): TableRow | TableGroupRow | undefined {
        return this._focusedRow;
    }

    public constructor(
        private readonly table: Table<TData>,
        private readonly virtualizer: Virtualizer<TData>
    ) {
        table.addEventListener('keydown', e => this.onKeyDown(e), { capture: true });
        table.addEventListener('focusout', () => this.resetState);
        table.addEventListener('focusin', e => this.handleFocus(e), true);
        table.addEventListener('blur', () => this.resetState);
        this.tableNotifier = Observable.getNotifier(this.table);
        // this.tableNotifier.subscribe(this, 'rowElements');
        this.virtualizerNotifier = Observable.getNotifier(this.virtualizer);
        this.virtualizerNotifier.subscribe(this, 'visibleItems');
    }

    public setFocusedRow(rowIndex: number): void {
        this.scrollToAndFocusRow(rowIndex);
    }

    public handleChange(source: unknown, args: unknown): void {
        if (source === this.virtualizer && args === 'visibleItems') {
            this.focusVisibleRow();
        } else if (source === this.table && args === 'rowElements') {
            for (const notifier of this.visibleRowNotifiers) {
                notifier.unsubscribe(this);
            }
            this.visibleRowNotifiers = [];
            for (const visibleRow of this.table.rowElements) {
                const rowNotifier = Observable.getNotifier(visibleRow);
                rowNotifier.subscribe(this, 'dataIndex');
            }
            this.focusVisibleRow();
        } else if (args === 'dataIndex') {
            const dataIndex = (source as TableRow | TableGroupRow).dataIndex;
            if (dataIndex === this._focusedTotalRowIndex) {
                this.focusVisibleRow();
            }
        }
    }

    private readonly onKeyDown = (event: KeyboardEvent): boolean => {
        if (!this.table.rowElements.length) {
            return true;
        }

        if (!this._inNavigationMode
            && !(event.key === keyFunction2 || event.key === keyEscape)) {
            return false;
        }

        switch (event.key) {
            case keyTab: {
                // this.resetState(true);
                this.onTabPressed();
                break;
            }
            case keyArrowRight: {
                const handled = this.handleNavigationRight();
                if (handled) {
                    event.preventDefault();
                }
                return !handled;
            }
            case keyArrowLeft: {
                if (this._focusedTotalRowIndex === undefined && this.focusableHeaderElements.length > 0) {
                    if (this._focusedHeaderElementIndex > 0) {
                        this._focusedHeaderElementIndex -= 1;
                        this.focusHeaderElement();
                        return false;
                    }
                    return true;
                }

                if (!this.focusableRowElements.length || this._focusedRowElementIndex === -1) {
                    if (this.getFocusedRowExpanded() === true) {
                        this.toggleFocusedRowExpanded();
                    }
                    return true;
                }

                if (this._focusedRowElementIndex === 0) {
                    this._focusedRowElementIndex -= 1;
                    this.focusVisibleRow();
                    return true;
                }

                this._focusedRowElementIndex -= 1;
                this.focusRowElement();
                event.preventDefault();
                return false;
            }
            case keyArrowDown: {
                const rowWithFocus = this.getRowWithFocus();
                const newFocusedTotalRowIndex = rowWithFocus === undefined
                    ? 0
                    : rowWithFocus.dataIndex! + 1;
                if (newFocusedTotalRowIndex < this.table.tableData.length) {
                    if (newFocusedTotalRowIndex === 0) {
                        this._focusedRowElementIndex = this._focusedHeaderElementIndex;
                    }
                    this.scrollToAndFocusRow(newFocusedTotalRowIndex);
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                break;
            }
            case keyArrowUp: {
                const rowWithFocus = this.getRowWithFocus();
                const currentRowIndex = rowWithFocus === undefined
                    ? undefined
                    : rowWithFocus.dataIndex!;

                if (currentRowIndex === undefined) {
                    return true;
                }

                if (currentRowIndex === 0) {
                    if (this._focusedRowElementIndex > -1) {
                        this._focusedHeaderElementIndex = this._focusedRowElementIndex;
                        if (this._focusedHeaderElementIndex >= this.focusableHeaderElements.length) {
                            this._focusedHeaderElementIndex = this.focusableHeaderElements.length - 1;
                        }
                    } else {
                        this._focusedHeaderElementIndex = 0;
                    }

                    this.setFocusOnHeader();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }

                if (currentRowIndex > 0) {
                    this.scrollToAndFocusRow(currentRowIndex - 1);
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                break;
            }
            case keyPageUp: {
                const newFocusedRowIndex = Math.max(
                    this.table.rowElements[0]!.dataIndex!
                        - this.table.rowElements.length
                        + 1,
                    0
                );
                this.scrollToAndFocusRow(newFocusedRowIndex, {
                    align: 'start'
                });
                event.preventDefault();
                return false;
            }
            case keyPageDown: {
                const newFocusedRowIndex = this.table.rowElements[this.table.rowElements.length - 1]!
                    .dataIndex!;
                this.scrollToAndFocusRow(newFocusedRowIndex, {
                    align: 'start'
                });
                event.preventDefault();
                return false;
            }
            case keyHome: {
                if (event.ctrlKey) {
                    this.scrollToAndFocusRow(0);
                }
                event.preventDefault();
                return false;
            }
            case keyEnd: {
                if (event.ctrlKey) {
                    this.scrollToAndFocusRow(this.table.tableData.length - 1);
                }
                event.preventDefault();
                return false;
            }
            case keyEnter:
            case keyFunction2: {
                /* if (this._inNavigationMode && this._focusedRowElementIndex >= 0) {
                    this._inNavigationMode = false;
                    return false;
                } */

                this._inNavigationMode = true;
                break;
            }
            case keyEscape: {
                this._inNavigationMode = true;
                break;
            }

            default:
                break;
        }

        return true;
    };

    private handleNavigationRight(): boolean {
        if (this._focusedTotalRowIndex === undefined && this.focusableHeaderElements.length > 0) {
            if (this._focusedHeaderElementIndex < this.focusableHeaderElements.length - 1) {
                this._focusedHeaderElementIndex += 1;
                this.focusHeaderElement();
                return true;
            }
            return false;
        }

        if (!this.focusableRowElements.length) {
            if (this.getFocusedRowExpanded() === false) {
                this.toggleFocusedRowExpanded();
                return true;
            }
            return false;
        }

        if (this._focusedRowElementIndex === -1) {
            if (this.getFocusedRowExpanded() === false) {
                this.toggleFocusedRowExpanded();
            } else {
                this._focusedRowElementIndex = 0;
                this.focusRowElement();
            }
            return true;
        }

        if (this._focusedRowElementIndex !== undefined
            && this._focusedRowElementIndex < this.focusableRowElements.length - 1) {
            this._focusedRowElementIndex += 1;
            this.focusRowElement();
            return true;
        }

        return false;
    }

    private getFocusedRowExpanded(): boolean | undefined {
        if (this.focusedRow instanceof TableRow && this.focusedRow.isParentRow) {
            return this.focusedRow.expanded;
        }
        if (this.focusedRow instanceof TableGroupRow) {
            return this.focusedRow.expanded;
        }
        return undefined;
    }

    private onTabPressed(): void {
        // const focusedRow = this.getRowWithFocus();
        const activeElement = this.getActiveElement();
        const allTabbableElements = tabbable(this.table, { getShadowRoot: true });
        let index = activeElement !== null ? allTabbableElements.indexOf(activeElement) : -1;
        if (index > -1) {
            index += 1;
            if (index >= allTabbableElements.length) {
                index = 0;
            }
        } else {
            index = 0;
        }
        allTabbableElements[index]!.focus();
    }

    private toggleFocusedRowExpanded(): void {
        const focusedRow = this._focusedRow!;
        if (focusedRow instanceof TableGroupRow) {
            focusedRow.onGroupExpandToggle();
        } else {
            focusedRow.onRowExpandToggle();
        }
    }

    private setFocusOnHeader(): void {
        if (this._focusedRow) {
            this._focusedRow.blur();
            this._focusedRow.tabIndex = -1;
            this._focusedTotalRowIndex = undefined;
            this._focusedRow = undefined;
            this._focusedRowElementIndex = -1;
        }

        if (this.focusableHeaderElements.length === 0) {
            this.focusableHeaderElements = this.getTableHeaderFocusableElements();
        }
        if (this.focusableHeaderElements.length > 0) {
            if (this._focusedHeaderElementIndex === -1) {
                this._focusedHeaderElementIndex = 0;
            }
            const focusableElement = this.focusableHeaderElements[this._focusedHeaderElementIndex]!;
            focusableElement.tabIndex = 0;
            focusableElement.focus();
        }
    }

    private scrollToAndFocusRow(
        totalRowIndex: number,
        scrollOptions?: ScrollToOptions
    ): void {
        this._focusedTotalRowIndex = totalRowIndex;
        this.virtualizer.scrollToIndex(
            this._focusedTotalRowIndex,
            scrollOptions
        );
        this.focusVisibleRow();
    }

    private focusVisibleRow(): void {
        if (this._focusedRow) {
            // this._focusedRow.removeFocus();
            this._focusedRow.tabIndex = -1;
        }
        const visibleRowIndex = this.getVisibleRowIndex();
        if (visibleRowIndex < 0) {
            return;
        }
        this._focusedRow = this.table.rowElements[visibleRowIndex]!;

        // this._focusedRow.setFocus();
        this._focusedRow.tabIndex = 0;
        this._focusedRow.focus();

        this._focusedRow.addEventListener('focusout', e => this.focusOutHandler(e));
        this.focusableRowElements = this.getFocusedRowFocusableElements();
        if (this.focusableRowElements.length > 0 && this._focusedRowElementIndex !== -1) {
            this._focusedRow.removeAttribute('has-focus');
            if (this._focusedRowElementIndex >= this.focusableRowElements.length) {
                this._focusedRowElementIndex = this.focusableRowElements.length - 1;
            }
            this.focusRowElement();
        }
    }

    private focusRowElement(): void {
        const elementToFocus = this.focusableRowElements[this._focusedRowElementIndex]!;
        elementToFocus.tabIndex = 0;
        elementToFocus.focus({ preventScroll: true });
        elementToFocus.addEventListener('focusout', e => this.focusOutHandler(e));
    }

    private focusHeaderElement(): void {
        const elementToFocus = this.focusableHeaderElements[this._focusedHeaderElementIndex]!;
        elementToFocus.tabIndex = 0;
        elementToFocus.focus({ preventScroll: true });
    }

    private getFocusedRowFocusableElements(): HTMLElement[] {
        return this._focusedRow!.getFocusableElements();
    }

    private getVisibleRowIndex(): number {
        return this.table.rowElements.findIndex(
            row => row.dataIndex === this._focusedTotalRowIndex
        );
    }

    /*
    private getTableHeaderFocusableElement(): HTMLElement | undefined {
        if (this.table.selectionCheckbox) {
            return this.table.selectionCheckbox;
        }

        if (this.table.showCollapseAll) {
            return this.table.collapseAllButton;
        }

        return undefined;
    }
    */

    private getTableHeaderFocusableElements(): HTMLElement[] {
        const focusableElements: HTMLElement[] = [];
        if (this.table.selectionCheckbox) {
            focusableElements.push(this.table.selectionCheckbox);
        }

        if (this.table.showCollapseAll) {
            focusableElements.push(this.table.collapseAllButton!);
        }

        if (this.table.columns.find(c => !c.sortingDisabled)) {
            this.table.columnHeadersContainer.querySelectorAll('nimble-table-header').forEach(header => focusableElements.push(header));
        }

        return focusableElements;
    }

    private readonly focusOutHandler = (event: Event): void => {
        (event.target as HTMLElement).tabIndex = -1;

        (event.target as HTMLElement).removeEventListener(
            'focusout',
            this.focusOutHandler
        );
    };

    private readonly resetState = (resetRowIndex = true): void => {
        this._focusedRowElementIndex = -1;
        if (this._focusedRow) {
            this._focusedRow.tabIndex = -1;
            this._focusedRow.blur();
        }
        if (resetRowIndex) {
            this._focusedTotalRowIndex = undefined;
        }
    };

    // The row with focus is the row that either has focus or an element
    // inside of it has focus
    private getRowWithFocus(): TableRow | TableGroupRow | undefined {
        return this.getContainingRow(this.getActiveElement());
    }

    private getContainingRow(start: Element | undefined | null): TableRow | TableGroupRow | undefined {
        let possibleRow = start;
        while (possibleRow && possibleRow !== this.table) {
            if (possibleRow instanceof TableRow || possibleRow instanceof TableGroupRow) {
                return possibleRow;
            }
            possibleRow = possibleRow.parentElement ?? (possibleRow.parentNode as ShadowRoot)?.host;
        }

        return undefined;
    }

    private getActiveElement(): HTMLElement | null {
        let documentActiveElement = document.activeElement;
        while (documentActiveElement?.shadowRoot?.activeElement) {
            documentActiveElement = documentActiveElement.shadowRoot.activeElement;
        }

        return documentActiveElement as HTMLElement;
    }

    private readonly handleFocus = (event: FocusEvent): void => {
        const targetElement = event.composedPath()[0] as Element;
        this._tableActiveElement = targetElement;

        if (targetElement === this.table && this._focusedTotalRowIndex === undefined) {
            this.setFocusOnHeader();
        }
    };
}