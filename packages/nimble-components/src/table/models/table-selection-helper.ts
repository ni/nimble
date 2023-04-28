/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable max-classes-per-file */
import { TableRecord, TableRowSelectionMode, TableRowState } from '../types';
import type { Table } from '..';

export abstract class SelectionStateManager<TData extends TableRecord> {
    protected table: Table<TData>;

    public constructor(table: Table<TData>) {
        this.table = table;
    }

    public abstract handleRowSelectionToggle(rowId: string, isSelecting: boolean, currentSelection: { [rowId: string]: boolean }, shiftKey: boolean): Promise<void>;

    public abstract handleRowClick(rowId: string, currentSelection: { [rowId: string]: boolean }, shiftKey: boolean, ctrlKey: boolean): Promise<void>;

    public reset(): void {}
}

export class NoSelectionStateManager<TData extends TableRecord> extends SelectionStateManager<TData> {
    public override async handleRowSelectionToggle(_rowId: string, _isSelecting: boolean, _currentSelection: { [rowId: string]: boolean }, _shiftKey: boolean): Promise<void> {
        return Promise.resolve();
    }

    public override async handleRowClick(_rowId: string, _currentSelection: { [rowId: string]: boolean }, _shiftKey: boolean, _ctrlKey: boolean): Promise<void> {
        return Promise.resolve();
    }
}

export class SingleSelectionStateManager<TData extends TableRecord> extends SelectionStateManager<TData> {
    public override async handleRowSelectionToggle(rowId: string, isSelecting: boolean, _currentSelection: { [rowId: string]: boolean }, _shiftKey: boolean): Promise<void> {
        await this.table.toggleIsRowSelected(rowId, isSelecting);
    }

    public override async handleRowClick(rowId: string, _currentSelection: { [rowId: string]: boolean }, _shiftKey: boolean, _ctrlKey: boolean): Promise<void> {
        await this.table.selectSingleRow(rowId);
    }
}

export class MultiSelectionStateManager<TData extends TableRecord> extends SelectionStateManager<TData> {
    private shiftSelectStartRowId?: string;
    private previousShiftSelectRowEndId?: string;

    public override async handleRowSelectionToggle(rowId: string, isSelecting: boolean, currentSelection: { [rowId: string]: boolean }, shiftKey: boolean): Promise<void> {
        if (shiftKey) {
            const madeRangeSelection = await this.tryUpdateRangeSelection(rowId, currentSelection);
            if (madeRangeSelection) {
                return;
            }
        }

        this.shiftSelectStartRowId = rowId;
        await this.table.toggleIsRowSelected(rowId, isSelecting);
    }

    public override async handleRowClick(rowId: string, currentSelection: { [rowId: string]: boolean }, shiftKey: boolean, ctrlKey: boolean): Promise<void> {
        if (ctrlKey) {
            this.shiftSelectStartRowId = rowId;
            await this.table.toggleIsRowSelected(rowId);
            return;
        }

        if (shiftKey) {
            const madeRangeSelection = await this.tryUpdateRangeSelection(rowId, currentSelection);
            if (madeRangeSelection) {
                return;
            }
        }

        this.shiftSelectStartRowId = rowId;
        await this.table.selectSingleRow(rowId);
    }

    public override reset(): void {
        this.shiftSelectStartRowId = undefined;
        this.previousShiftSelectRowEndId = undefined;
    }

    private async tryUpdateRangeSelection(rowId: string, currentSelection: { [rowId: string]: boolean }): Promise<boolean> {
        if (this.shiftSelectStartRowId === undefined) {
            return false;
        }

        const allRows = this.table.getAllOrderedRows();
        const selectionStartIndex = this.getRowIndexForId(this.shiftSelectStartRowId, allRows);
        if (selectionStartIndex === -1) {
            return false;
        }

        const updatedSelection: { [rowId: string]: boolean } = { ...currentSelection };
        this.removePreviousRangeSelection(updatedSelection, selectionStartIndex, allRows);
        this.addNewRangeSelection(updatedSelection, rowId, selectionStartIndex, allRows);
        this.previousShiftSelectRowEndId = rowId;
        await this.table.updateSelectionState(updatedSelection);

        return true;
    }

    private removePreviousRangeSelection(selection: { [rowId: string]: boolean }, shiftSelectStartRowIndex: number, allRows: TableRowState[]): void {
        const previousRangeEndIndex = this.getRowIndexForId(this.previousShiftSelectRowEndId, allRows);
        this.updateSelectionStateForRange(selection, shiftSelectStartRowIndex, previousRangeEndIndex, allRows, false);
    }

    private addNewRangeSelection(selection: { [rowId: string]: boolean }, endRangeRowId: string, shiftSelectStartRowIndex: number, allRows: TableRowState[]): void {
        const newRangeEndIndex = this.getRowIndexForId(endRangeRowId, allRows);
        this.updateSelectionStateForRange(selection, shiftSelectStartRowIndex, newRangeEndIndex, allRows, true);
    }

    private updateSelectionStateForRange(selection: { [rowId: string]: boolean }, rangeStartIndex: number, rangeEndIndex: number, allRows: TableRowState[], isSelecting: boolean): void {
        if (rangeStartIndex === -1 || rangeEndIndex === -1) {
            return;
        }

        const firstRowIndex = Math.min(rangeStartIndex, rangeEndIndex);
        const lastRowIndex = Math.max(rangeStartIndex, rangeEndIndex);
        for (let i = firstRowIndex; i <= lastRowIndex; i++) {
            const row = allRows[i]!;
            if (row.isGrouped) {
                continue;
            }

            if (isSelecting) {
                selection[row.id] = true;
            } else {
                delete selection[row.id];
            }
        }

        const endRangeRow = allRows[rangeEndIndex]!;
        if (endRangeRow.isGrouped) {
            this.handleGroupRowToggle(selection, endRangeRow.id, isSelecting);
        }
    }

    private handleGroupRowToggle(selection: { [rowId: string]: boolean }, groupRowId: string, isSelecting: boolean): void {
        const leafIds = this.table.getAllLeafRowIds(groupRowId);
        for (const id of leafIds) {
            if (isSelecting) {
                selection[id] = true;
            } else {
                delete selection[id];
            }
        }
    }

    private getRowIndexForId(id: string | undefined, rows: TableRowState[]): number {
        if (!id) {
            return -1;
        }

        return rows.findIndex(x => x.id === id);
    }
}

export function rowSelectionStateManagerFactory<TData extends TableRecord>(table: Table<TData>): SelectionStateManager<TData> {
    switch (table.selectionMode) {
        case TableRowSelectionMode.multiple:
            return new MultiSelectionStateManager(table);
        case TableRowSelectionMode.single:
            return new SingleSelectionStateManager(table);
        case TableRowSelectionMode.none:
            return new NoSelectionStateManager(table);
        default:
            throw new Error('unknown selection mode found');
    }
}
