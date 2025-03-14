import type {
    Row as TanStackRow,
    RowSelectionState as TanStackRowSelectionState
} from '@tanstack/table-core';
import {
    type TableNode,
    type TableRecord,
    TableRowSelectionState,
    type TableRowState
} from '../../types';
import { SelectionManagerBase } from './selection-manager-base';

/**
 * Selection manager for interactive selection when the selection mode of the table is
 * `TableRowSelectionMode.multiple`.
 */
export class MultiSelectionManager<
    TData extends TableRecord
> extends SelectionManagerBase<TData> {
    private shiftSelectStartRowId?: string;
    private previousShiftSelectRowEndId?: string;

    public override handleRowSelectionToggle(
        rowState: TableRowState,
        isSelecting: boolean,
        shiftKey: boolean
    ): boolean {
        if (shiftKey) {
            if (this.tryUpdateRangeSelection(rowState.id, true)) {
                // Made a range selection
                return true;
            }
        }

        this.shiftSelectStartRowId = isSelecting ? rowState.id : undefined;
        this.previousShiftSelectRowEndId = undefined;
        this.toggleIsRowSelected(rowState, isSelecting);
        return true;
    }

    public override handleRowClick(
        rowState: TableRowState,
        shiftKey: boolean,
        ctrlKey: boolean
    ): boolean {
        if (shiftKey) {
            const additiveSelection = ctrlKey;
            if (this.tryUpdateRangeSelection(rowState.id, additiveSelection)) {
                // Made a range selection
                return true;
            }
        }

        if (ctrlKey) {
            const isSelecting = rowState.selectionState !== TableRowSelectionState.selected;
            this.shiftSelectStartRowId = isSelecting ? rowState.id : undefined;
            this.previousShiftSelectRowEndId = undefined;
            this.toggleIsRowSelected(rowState);
            return true;
        }

        this.shiftSelectStartRowId = rowState.id;
        this.previousShiftSelectRowEndId = undefined;
        return this.selectSingleRow(rowState);
    }

    public override handleActionMenuOpening(rowState: TableRowState): boolean {
        if (rowState.selectionState === TableRowSelectionState.selected) {
            return false;
        }
        return this.selectSingleRow(rowState);
    }

    public override reset(): void {
        this.shiftSelectStartRowId = undefined;
        this.previousShiftSelectRowEndId = undefined;
    }

    private tryUpdateRangeSelection(
        rowId: string,
        additiveSelection: boolean
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

        let selectionState: TanStackRowSelectionState = {};
        if (additiveSelection) {
            // If the range selection is additive to the existing selection, start with the initial selection state
            // and remove the previous range selection, if any. Otherwise, the range selection will start empty and
            // only contain the new range selection.
            selectionState = this.tanStackTable.getState().rowSelection;
            this.removePreviousRangeSelection(
                selectionState,
                selectionStartIndex,
                allRows
            );
        }

        this.addNewRangeSelection(
            selectionState,
            rowId,
            selectionStartIndex,
            allRows
        );
        this.previousShiftSelectRowEndId = rowId;
        this.tanStackTable.setRowSelection(selectionState);

        return true;
    }

    private removePreviousRangeSelection(
        selection: TanStackRowSelectionState,
        shiftSelectStartRowIndex: number,
        allRows: TanStackRow<TableNode<TData>>[]
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
        allRows: TanStackRow<TableNode<TData>>[]
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
        allRows: TanStackRow<TableNode<TData>>[],
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
            this.getAllLeafRowIds(endRangeRow.id).forEach(id => this.updateSelectionStateForRow(selection, id, isSelecting));
        }
    }

    private updateSelectionStateForRow(
        selection: TanStackRowSelectionState,
        rowId: string,
        isSelecting: boolean
    ): void {
        if (isSelecting) {
            selection[rowId] = true;
        } else {
            delete selection[rowId];
        }
    }

    private getRowIndexForId(
        id: string | undefined,
        rows: TanStackRow<TableNode<TData>>[]
    ): number {
        if (!id) {
            return -1;
        }
        return rows.findIndex(x => x.id === id);
    }
}
