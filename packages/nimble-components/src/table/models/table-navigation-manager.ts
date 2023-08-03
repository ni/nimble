import { Notifier, Subscriber, Observable } from '@microsoft/fast-element';
import {
    keyArrowDown,
    keyArrowUp,
    keyEnd,
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
import type { TableRow } from '../components/row';

/**
 * This class manages the keyboard navigation within the table
 * @interal
 */
export class TableNavigationManager<TData extends TableRecord>
implements Subscriber {
    private _focusedTotalRowIndex?: number;
    private _focusedRow?: TableRow | TableGroupRow;
    private readonly virtualizerNotifier: Notifier;
    private readonly tableNotifier: Notifier;
    private visibleRowNotifiers: Notifier[] = [];

    public get focusedRow(): TableRow | TableGroupRow | undefined {
        return this._focusedRow;
    }

    public constructor(
        private readonly table: Table<TData>,
        private readonly virtualizer: Virtualizer<TData>
    ) {
        table.addEventListener('keydown', e => this.onKeyDown(e));
        table.addEventListener('focusout', () => this.resetState());
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

        switch (event.key) {
            case keyTab: {
                this.resetState(true);
                break;
            }
            case keyArrowDown: {
                const newFocusedTotalRowIndex = this._focusedTotalRowIndex === undefined
                    ? 0
                    : this._focusedTotalRowIndex + 1;
                if (newFocusedTotalRowIndex < this.table.tableData.length) {
                    this.scrollToAndFocusRow(newFocusedTotalRowIndex);
                    event.preventDefault();
                    return false;
                }
                break;
            }
            case keyArrowUp: {
                if (this._focusedTotalRowIndex === undefined) {
                    return true;
                }

                if (this._focusedTotalRowIndex === 0) {
                    this.setFocusOnHeader();
                    event.preventDefault();
                    return false;
                }

                if (this._focusedTotalRowIndex > 0) {
                    this.scrollToAndFocusRow(this._focusedTotalRowIndex - 1);
                    event.preventDefault();
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

            default:
                break;
        }

        return true;
    };

    private setFocusOnHeader(): void {
        if (this._focusedRow) {
            this._focusedRow.blur();
            this._focusedRow.tabIndex = -1;
            this._focusedTotalRowIndex = undefined;
            this._focusedRow = undefined;
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
            this._focusedRow.blur();
            this._focusedRow.tabIndex = -1;
        }
        const visibleRowIndex = this.getVisibleRowIndex();
        if (visibleRowIndex < 0) {
            return;
        }
        this._focusedRow = this.table.rowElements[visibleRowIndex]!;
        this._focusedRow.tabIndex = 0;
        this._focusedRow.focus({ preventScroll: true });
        this._focusedRow.addEventListener('focusout', e => this.focusOutHandler(e));
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

    private readonly resetState = (resetRowIndex = false): void => {
        if (this._focusedRow) {
            this._focusedRow.tabIndex = -1;
            this._focusedRow.blur();
        }
        if (resetRowIndex) {
            this._focusedTotalRowIndex = undefined;
        }
    };
}
