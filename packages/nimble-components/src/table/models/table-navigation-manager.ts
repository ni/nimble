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
import type { TableGroupRow } from '../components/group-row';
import { TableRow } from '../components/row';
import type { TableCell } from '../components/cell';

const TableFocusState = {
    none: 0,
    tableFocused: 1,
    rowFocused: 2,
    cellFocused: 3,
    cellContentFocused: 4
};

/**
 * This class manages the keyboard navigation within the table
 * @interal
 */
export class TableNavigationManager<TData extends TableRecord>
implements Subscriber {
    private _focusedTotalRowIndex?: number;
    private _focusedRowElementIndex = -1;
    private _focusedRow?: TableRow | TableGroupRow;
    private _focusedCell?: TableCell;
    private readonly virtualizerNotifier: Notifier;
    private readonly tableNotifier: Notifier;
    private visibleRowNotifiers: Notifier[] = [];
    private focusableRowElements: HTMLElement[] = [];
    private _inNavigationMode = true;
    private _tableFocusState = TableFocusState.none;

    public get focusedRow(): TableRow | TableGroupRow | undefined {
        return this._focusedRow;
    }

    public constructor(
        private readonly table: Table<TData>,
        private readonly virtualizer: Virtualizer<TData>
    ) {
        table.addEventListener('keydown', e => this.onKeyDown(e), { capture: true });
        table.addEventListener('focusout', () => this.resetState);
        table.addEventListener('focusin', e => this.handleFocus(e), { capture: true });
        table.addEventListener('blur', () => this.resetState);
        this.tableNotifier = Observable.getNotifier(this.table);
        this.tableNotifier.subscribe(this, 'rowElements');
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
                this.resetState(true);
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
                if (!this.focusableRowElements.length || this._focusedRowElementIndex === -1) {
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
                    this.scrollToAndFocusRow(newFocusedTotalRowIndex);
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                break;
            }
            case keyArrowUp: {
                const rowWithFocus = this.getRowWithFocus();
                const newFocusedTotalRowIndex = rowWithFocus === undefined
                    ? 0
                    : rowWithFocus.dataIndex! + 1;

                if (this._focusedTotalRowIndex === undefined) {
                    return true;
                }

                if (this._focusedTotalRowIndex === 0) {
                    this.setFocusOnHeader();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }

                if (this._focusedTotalRowIndex > 0) {
                    this.scrollToAndFocusRow(this._focusedTotalRowIndex - 1);
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
                if (this._inNavigationMode && this._focusedRowElementIndex >= 0) {
                    this._inNavigationMode = false;
                    return false;
                }

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
        if (!this.focusableRowElements.length) {
            return false;
        }

        if (this._focusedRowElementIndex === undefined) {
            this._focusedRowElementIndex = 0;
            this.focusRowElement();
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

    private setFocusOnHeader(): void {
        if (this._focusedRow) {
            this._focusedRow.blur();
            this._focusedRow.tabIndex = -1;
            this._focusedTotalRowIndex = undefined;
            this._focusedRow = undefined;
            this._focusedRowElementIndex = -1;
        }

        const focusableElement = this.getTableHeaderFocusableElement();
        if (focusableElement) {
            focusableElement.focus();
        } else {
            this.table.focus();
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
            this._focusedRow.removeFocus();
        }
        const visibleRowIndex = this.getVisibleRowIndex();
        if (visibleRowIndex < 0) {
            return;
        }
        this._focusedRow = this.table.rowElements[visibleRowIndex]!;
        this._focusedRow.setFocus();
        this._focusedRow.addEventListener('focusout', e => this.focusOutHandler(e));
        this.focusableRowElements = this.getFocusedRowFocusableElements();
        if (this._focusedRowElementIndex !== -1 && this._focusedRowElementIndex < this.focusableRowElements.length) {
            this._focusedRow.removeAttribute('has-focus');
            this.focusRowElement();
        }
    }

    private focusRowElement(): void {
        const elementToFocus = this.focusableRowElements[this._focusedRowElementIndex!]!;
        elementToFocus.tabIndex = 0;
        elementToFocus.focus({ preventScroll: true });
        elementToFocus.addEventListener('focusout', e => this.focusOutHandler(e));
    }

    private getFocusedRowFocusableElements(): HTMLElement[] {
        return this._focusedRow!.getFocusableElements();
    }

    private getVisibleRowIndex(): number {
        return this.table.rowElements.findIndex(
            row => row.dataIndex === this._focusedTotalRowIndex
        );
    }

    private getTableHeaderFocusableElement(): HTMLElement | undefined {
        if (this.table.selectionCheckbox) {
            return this.table.selectionCheckbox;
        }

        if (this.table.showCollapseAll) {
            return this.table.collapseAllButton;
        }

        return undefined;
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
    private getRowWithFocus(): TableRow | undefined {
        return this.getContainingRow(document.activeElement);
    }

    private getContainingRow(start: Element | null): TableRow | undefined {
        let possibleRow = start;
        if (this.table.contains(possibleRow)) {
            while (possibleRow && possibleRow !== this.table) {
                if (possibleRow instanceof TableRow) {
                    return possibleRow;
                }
                possibleRow = possibleRow.parentElement;
            }
        }

        return undefined;
    }

    private readonly handleFocus = (event: FocusEvent): void => {
        console.log("focus target = " + (event.target as HTMLElement).localName);
    };
}
