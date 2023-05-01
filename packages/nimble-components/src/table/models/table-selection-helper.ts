/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable max-classes-per-file */
import type {
    Table as TanStackTable,
    Row as TanStackRow,
    RowSelectionState as TanStackRowSelectionState
} from '@tanstack/table-core';
import { TableRecord, TableRowSelectionMode, TableRowSelectionState, TableRowState } from '../types';

export abstract class SelectionStateManager<TData extends TableRecord> {
    protected tanStackTable: TanStackTable<TData>;

    public constructor(tanStackTable: TanStackTable<TData>) {
        this.tanStackTable = tanStackTable;
    }

    public abstract handleRowSelectionToggle(
        rowState: TableRowState | undefined,
        isSelecting: boolean,
        shiftKey: boolean
    ): boolean;

    public abstract handleRowClick(
        rowState: TableRowState | undefined,
        shiftKey: boolean,
        ctrlKey: boolean
    ): boolean;

    public abstract handleActionMenuOpening(
        rowState: TableRowState | undefined
    ): boolean;

    public reset(): void {}

    protected toggleIsRowSelected(
        rowState: TableRowState,
        isSelecting?: boolean
    ): void {
        if (
            rowState.isGrouped
            && rowState.selectionState === TableRowSelectionState.selected
        ) {
            // Work around for https://github.com/TanStack/table/issues/4759
            // Manually deselect all leaf rows when a fully selected group is being deselected.
            this.deselectAllLeafRows(rowState.id);
        } else {
            this.tanStackTable.getRow(rowState.id).toggleSelected(isSelecting);
        }
    }

    protected selectSingleRow(rowState: TableRowState): boolean {
        if (rowState.isGrouped) {
            throw new Error('function not intended to select grouped rows');
        }

        const currentSelection = this.tanStackTable.getState().rowSelection;
        const selectedRecordIds: string[] = [];
        Object.entries(currentSelection).forEach(
            ([recordId, isSelected]) => {
                if (isSelected) {
                    selectedRecordIds.push(recordId);
                }
            }
        );

        if (selectedRecordIds.length === 1 && selectedRecordIds[0] === rowState.id) {
            // The clicked row is already the only selected row. Do nothing.
            return false;
        }

        const newSelectionState: TanStackRowSelectionState = {};
        newSelectionState[rowState.id] = true;
        this.tanStackTable.setRowSelection(newSelectionState);
        return true;
    }

    protected deselectAllLeafRows(rowId: string): void {
        const groupRow = this.tanStackTable.getRow(rowId);
        const leafRowIds = this.getAllLeafRowIds(groupRow.id);

        const selectionState = this.tanStackTable.getState().rowSelection;
        for (const id of leafRowIds) {
            delete selectionState[id];
        }

        this.tanStackTable.setRowSelection(selectionState);
    }

    protected getAllLeafRowIds(id: string): string[] {
        const row = this.tanStackTable.getRowModel().flatRows.find(x => x.id === id);
        if (!row?.getIsGrouped()) {
            return [];
        }

        return row
            .getLeafRows()
            .filter(leafRow => leafRow.getLeafRows().length === 0)
            .map(leafRow => leafRow.id);
    }

    protected getAllOrderedRows(): TanStackRow<TData>[] {
        const topLevelRows = this.tanStackTable.getPreExpandedRowModel().rows;
        return this.getOrderedRows(topLevelRows);
    }

    private getOrderedRows(
        topLevelRows: TanStackRow<TData>[]
    ): TanStackRow<TData>[] {
        const allRows: TanStackRow<TData>[] = [];
        for (const row of topLevelRows) {
            allRows.push(row);
            if (row.subRows?.length) {
                allRows.push(...this.getOrderedRows(row.subRows));
            }
        }
        return allRows;
    }
}

export class NoSelectionStateManager<
    TData extends TableRecord
> extends SelectionStateManager<TData> {
    public override handleRowSelectionToggle(
        _rowState: TableRowState | undefined,
        _isSelecting: boolean,
        _shiftKey: boolean
    ): boolean {
        return false;
    }

    public override handleRowClick(
        _rowState: TableRowState | undefined,
        _shiftKey: boolean,
        _ctrlKey: boolean
    ): boolean {
        return false;
    }

    public override handleActionMenuOpening(_rowState: TableRowState | undefined): boolean {
        return false;
    }
}

export class SingleSelectionStateManager<
    TData extends TableRecord
> extends SelectionStateManager<TData> {
    public override handleRowSelectionToggle(
        rowState: TableRowState | undefined,
        isSelecting: boolean,
        _shiftKey: boolean
    ): boolean {
        if (!rowState) {
            return false;
        }

        this.toggleIsRowSelected(rowState, isSelecting);
        return true;
    }

    public override handleRowClick(
        rowState: TableRowState | undefined,
        _shiftKey: boolean,
        _ctrlKey: boolean
    ): boolean {
        if (!rowState) {
            return false;
        }

        return this.selectSingleRow(rowState);
    }

    public override handleActionMenuOpening(rowState: TableRowState | undefined): boolean {
        return this.handleRowClick(rowState, false, false);
    }
}

export class MultiSelectionStateManager<
    TData extends TableRecord
> extends SelectionStateManager<TData> {
    private shiftSelectStartRowId?: string;
    private previousShiftSelectRowEndId?: string;

    public override handleRowSelectionToggle(
        rowState: TableRowState | undefined,
        isSelecting: boolean,
        shiftKey: boolean
    ): boolean {
        if (!rowState) {
            return false;
        }

        if (shiftKey) {
            const madeRangeSelection = this.tryUpdateRangeSelection(
                rowState.id
            );
            if (madeRangeSelection) {
                return true;
            }
        }

        this.shiftSelectStartRowId = rowState.id;
        this.previousShiftSelectRowEndId = undefined;
        this.toggleIsRowSelected(rowState, isSelecting);
        return true;
    }

    public override handleRowClick(
        rowState: TableRowState | undefined,
        shiftKey: boolean,
        ctrlKey: boolean
    ): boolean {
        if (!rowState) {
            return false;
        }

        if (ctrlKey) {
            this.shiftSelectStartRowId = rowState.id;
            this.previousShiftSelectRowEndId = undefined;
            this.toggleIsRowSelected(rowState);
            return true;
        }

        if (shiftKey) {
            const madeRangeSelection = this.tryUpdateRangeSelection(
                rowState.id
            );
            if (madeRangeSelection) {
                return true;
            }
        }

        this.shiftSelectStartRowId = rowState.id;
        this.previousShiftSelectRowEndId = undefined;
        return this.selectSingleRow(rowState);
    }

    public override handleActionMenuOpening(rowState: TableRowState | undefined): boolean {
        if (!rowState || rowState.selectionState === TableRowSelectionState.selected) {
            return false;
        }
        return this.selectSingleRow(rowState);
    }

    public override reset(): void {
        this.shiftSelectStartRowId = undefined;
        this.previousShiftSelectRowEndId = undefined;
    }

    private tryUpdateRangeSelection(
        rowId: string
    ): boolean {
        if (this.shiftSelectStartRowId === undefined) {
            return false;
        }

        const allRows = this.getAllOrderedRows();
        const selectionStartIndex = this.getRowIndexForId(
            this.shiftSelectStartRowId,
            allRows
        );
        if (selectionStartIndex === -1) {
            return false;
        }

        const updatedSelection = this.tanStackTable.getState().rowSelection;
        this.removePreviousRangeSelection(
            updatedSelection,
            selectionStartIndex,
            allRows
        );
        this.addNewRangeSelection(
            updatedSelection,
            rowId,
            selectionStartIndex,
            allRows
        );
        this.previousShiftSelectRowEndId = rowId;
        this.tanStackTable.setRowSelection(updatedSelection);

        return true;
    }

    private removePreviousRangeSelection(
        selection: TanStackRowSelectionState,
        shiftSelectStartRowIndex: number,
        allRows: TanStackRow<TData>[]
    ): void {
        const previousRangeEndIndex = this.getRowIndexForId(
            this.previousShiftSelectRowEndId,
            allRows
        );
        this.updateSelectionStateForRange(
            selection,
            shiftSelectStartRowIndex,
            previousRangeEndIndex,
            allRows,
            false
        );
    }

    private addNewRangeSelection(
        selection: TanStackRowSelectionState,
        endRangeRowId: string,
        shiftSelectStartRowIndex: number,
        allRows: TanStackRow<TData>[]
    ): void {
        const newRangeEndIndex = this.getRowIndexForId(endRangeRowId, allRows);
        this.updateSelectionStateForRange(
            selection,
            shiftSelectStartRowIndex,
            newRangeEndIndex,
            allRows,
            true
        );
    }

    private updateSelectionStateForRange(
        selection: TanStackRowSelectionState,
        rangeStartIndex: number,
        rangeEndIndex: number,
        allRows: TanStackRow<TData>[],
        isSelecting: boolean
    ): void {
        if (rangeStartIndex === -1 || rangeEndIndex === -1) {
            return;
        }

        const firstRowIndex = Math.min(rangeStartIndex, rangeEndIndex);
        const lastRowIndex = Math.max(rangeStartIndex, rangeEndIndex);
        for (let i = firstRowIndex; i <= lastRowIndex; i++) {
            const row = allRows[i]!;
            if (row.getIsGrouped()) {
                continue;
            }

            this.updateSelectionStateForRow(selection, row.id, isSelecting);
        }

        const endRangeRow = allRows[rangeEndIndex]!;
        if (endRangeRow.getIsGrouped()) {
            this.getAllLeafRowIds(endRangeRow.id)
                .forEach(id => this.updateSelectionStateForRow(selection, id, isSelecting));
        }
    }

    private updateSelectionStateForRow(selection: TanStackRowSelectionState, rowId: string, isSelecting: boolean): void {
        if (isSelecting) {
            selection[rowId] = true;
        } else {
            delete selection[rowId];
        }
    }

    private getRowIndexForId(
        id: string | undefined,
        rows: TanStackRow<TData>[]
    ): number {
        if (!id) {
            return -1;
        }

        return rows.findIndex(x => x.id === id);
    }
}

export function createSelectionManager<TData extends TableRecord>(
    tanstackTable: TanStackTable<TData>,
    selectionMode: TableRowSelectionMode
): SelectionStateManager<TData> {
    switch (selectionMode) {
        case TableRowSelectionMode.multiple:
            return new MultiSelectionStateManager(tanstackTable);
        case TableRowSelectionMode.single:
            return new SingleSelectionStateManager(tanstackTable);
        case TableRowSelectionMode.none:
            return new NoSelectionStateManager(tanstackTable);
        default:
            throw new Error('unknown selection mode found');
    }
}
