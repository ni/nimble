import type {
    Table as TanStackTable,
    Row as TanStackRow,
    RowSelectionState as TanStackRowSelectionState
} from '@tanstack/table-core';
import { TableRecord, TableRowSelectionState, TableRowState } from '../../types';

/**
 * Abstract base class for handling behavior associated with interactive row selection of the table.
 */
export abstract class SelectionManagerBase<TData extends TableRecord> {
    protected tanStackTable: TanStackTable<TData>;

    public constructor(tanStackTable: TanStackTable<TData>) {
        this.tanStackTable = tanStackTable;
    }

    public abstract handleRowSelectionToggle(
        rowState: TableRowState,
        isSelecting: boolean,
        shiftKey: boolean
    ): boolean;

    public abstract handleRowClick(
        rowState: TableRowState,
        shiftKey: boolean,
        ctrlKey: boolean
    ): boolean;

    public abstract handleActionMenuOpening(
        rowState: TableRowState
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