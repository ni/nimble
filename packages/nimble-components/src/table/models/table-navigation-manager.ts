import { Notifier, Subscriber, Observable } from '@microsoft/fast-element';
import { keyArrowDown, keyArrowUp, keyEnd, keyHome, keyTab } from '@microsoft/fast-web-utilities';
import type { Table } from '..';
import type { TableRecord } from '../types';
import type { Virtualizer } from './virtualizer';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { TableGroupRow } from '../components/group-row';
import type { TableRow } from '../components/row';

/**
 * This class manages the keyboard navigation within the table
 * @interal
 */
export class TableNavigationManager<TData extends TableRecord> implements Subscriber {
    private _focusedVisibleRowIndex?: number;
    private _firstVisibleTotalIndex?: number;
    private _lastVisibleTotalIndex?: number;
    private _focusedTotalRowIndex?: number;
    private _visibleRowCount?: number;
    private _focusedCellIndex?: number;
    private readonly virtualizerNotifier: Notifier;
    private readonly tableNotifier: Notifier;
    private scrollAction?: () => void;
    private visibleRowNotifiers: Notifier[] = [];

    public constructor(private readonly table: Table<TData>, private readonly virtualizer: Virtualizer<TData>) {
        table.addEventListener('keydown', e => this.onKeyDown(e));
        table.addEventListener('focusout', this.resetState);
        this.tableNotifier = Observable.getNotifier(this.table);
        this.tableNotifier.subscribe(this, 'rowElements');
        this.virtualizerNotifier = Observable.getNotifier(this.virtualizer);
        this.virtualizerNotifier.subscribe(this, 'visibleItems');
    }

    public handleChange(source: unknown, args: unknown): void {
        if (source === this.virtualizer && args === 'visibleItems') {
            const visibleItems = this.virtualizer.visibleItems;
            this._firstVisibleTotalIndex = visibleItems[0]?.index;
            this._lastVisibleTotalIndex = visibleItems[visibleItems.length - 1]?.index;
        } else if (source === this.table && args === 'rowElements') {
            for (const notifier of this.visibleRowNotifiers) {
                notifier.unsubscribe(this);
            }
            this.visibleRowNotifiers = [];
            for (const visibleRow of this.table.rowElements) {
                const rowNotifier = Observable.getNotifier(visibleRow);
                rowNotifier.subscribe(this, 'dataIndex');
            }
            this.scrollAction?.();
            this.scrollAction = undefined;
        } else if (args === 'dataIndex') {
            const dataIndex = (source as (TableRow | TableGroupRow)).dataIndex;
            if (dataIndex === this._focusedTotalRowIndex) {
                this.scrollAction?.();
                this.scrollAction = undefined;
            }
        }
    }

    private readonly onKeyDown = (event: KeyboardEvent): boolean => {
        if (!this.table.rowElements.length) {
            return true;
        }

        switch (event.key) {
            case keyTab: {
                if (document.activeElement === this.table) {
                    this.table.blur();
                }
                break;
            }
            case keyArrowDown:
            {
                if (this._focusedTotalRowIndex === undefined) {
                    this._focusedVisibleRowIndex = 0;
                    this.focusVisibleRow();
                    this._focusedTotalRowIndex = this._firstVisibleTotalIndex;
                    event.preventDefault();
                    return false;
                }

                if (this._focusedTotalRowIndex < this.table.tableData.length - 1) {
                    this.table.rowElements[this._focusedVisibleRowIndex!]!.tabIndex = -1;
                    const shiftFocusDownOneRow = (): void => {
                        this._focusedVisibleRowIndex! += 1;
                        this._focusedTotalRowIndex! += 1;
                        this.focusVisibleRow();
                    };
                    if (this._focusedVisibleRowIndex === this.virtualizer.visibleItems.length - 1) {
                        this.virtualizer.scrollToIndex(this.virtualizer.visibleItems[1]!.index);
                        this.scrollAction = shiftFocusDownOneRow;
                    } else {
                        shiftFocusDownOneRow();
                    }
                    event.preventDefault();
                    return false;
                }
                break;
            }
            case keyArrowUp:
            {
                if (this._focusedTotalRowIndex === undefined) {
                    return true;
                }

                if (this._focusedTotalRowIndex === 0) {
                    this.table.rowElements[this._focusedVisibleRowIndex!]!.tabIndex = -1;
                    this.table.rowElements[this._focusedVisibleRowIndex!]!.blur();
                    this.setFocusOnHeader();
                    event.preventDefault();
                    return false;
                }

                if (this._focusedTotalRowIndex > 0) {
                    this.table.rowElements[this._focusedVisibleRowIndex!]!.tabIndex = -1;
                    const shiftFocusUpOneRow = (): void => {
                        this._focusedVisibleRowIndex! -= 1;
                        this._focusedTotalRowIndex! -= 1;
                        this.focusVisibleRow();
                    };
                    if (this._focusedVisibleRowIndex === 0) {
                        this.virtualizer.scrollToIndex(this.virtualizer.visibleItems[0]!.index - 1);
                        this.scrollAction = shiftFocusUpOneRow;
                    } else {
                        shiftFocusUpOneRow();
                    }
                    event.preventDefault();
                    return false;
                }
                break;
            }
            case keyHome:
            {
                if (event.ctrlKey) {
                    this._focusedTotalRowIndex = 0;
                    const indexInRange = this._focusedTotalRowIndex >= this.table.rowElements[0]!.dataIndex!
                        && this._focusedTotalRowIndex <= this.table.rowElements[this.table.rowElements.length - 1]!.dataIndex!;
                    this.virtualizer.scrollToIndex(this._focusedTotalRowIndex);
                    if (this._focusedVisibleRowIndex) {
                        this.table.rowElements[this._focusedVisibleRowIndex]!.tabIndex = -1;
                    }
                    const scrollToTop = (): void => {
                        this._focusedVisibleRowIndex = 0;
                        this._focusedTotalRowIndex = 0;
                        this.focusVisibleRow();
                    };
                    if (indexInRange) {
                        scrollToTop();
                    } else {
                        this.scrollAction = scrollToTop;
                    }
                }
                event.preventDefault();
                return false;
            }
            case keyEnd:
            {
                if (event.ctrlKey) {
                    this._focusedTotalRowIndex = this.table.tableData.length - 1;
                    const indexInRange = this._focusedTotalRowIndex >= this.table.rowElements[0]!.dataIndex!
                        && this._focusedTotalRowIndex <= this.table.rowElements[this.table.rowElements.length - 1]!.dataIndex!;
                    this.virtualizer.scrollToIndex(this._focusedTotalRowIndex);
                    if (this._focusedVisibleRowIndex) {
                        this.table.rowElements[this._focusedVisibleRowIndex]!.tabIndex = -1;
                    }
                    const scrollToBottom = (): void => {
                        this._focusedVisibleRowIndex = this.table.rowElements.length - 1;
                        this._focusedTotalRowIndex = this.table.tableData.length - 1;
                        this.focusVisibleRow();
                    };
                    if (indexInRange) {
                        scrollToBottom();
                    } else {
                        this.scrollAction = scrollToBottom;
                    }
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
        const focusableElement = this.getTableHeaderFocusableElement();
        if (focusableElement) {
            focusableElement.focus();
        } else {
            this.table.focus();
        }
    }

    private focusVisibleRow(): void {
        if (this._focusedVisibleRowIndex === undefined) {
            return;
        }
        const focusedRow = this.table.rowElements[this._focusedVisibleRowIndex]!;
        focusedRow.tabIndex = 0;
        focusedRow.focus({ preventScroll: true });
        focusedRow.addEventListener('focusout', e => {
            (e.target as HTMLElement).tabIndex = -1;
        });
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

    private readonly resetState = (): void => {
        this._focusedVisibleRowIndex = undefined;
        this._focusedTotalRowIndex = undefined;
    };
}