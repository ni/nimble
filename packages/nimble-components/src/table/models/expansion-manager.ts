import type {
    Row as TanStackRow,
    Table as TanStackTable
} from '@tanstack/table-core';
import type { TableNode, TableRecord } from '../types';

/**
* Manages the expanded/collapsed state of rows in the table.
*
* We must track the expansion state separately from TanStack because:
*   1. TanStack does not support having a different initial expansion state per row unless explicitly
*      specified for each row by ID. This causes problems in the nimble-table because we could have
*      a different initial expansion state for group rows, parent rows, and parent rows with lazy
*      loaded children.
*   2. TanStack does not remove entries from its expanded state when those rows are no longer present
*      in the data. This is not ideal because the object maintaining the expansion state can grow unbounded.
*/
export class ExpansionManager<TData extends TableRecord> {
    // this field represents whether or not the expanded state of all rows is in the default state or not.
    private isInDefaultState = true;
    private collapsedRows = new Set<string>();

    public constructor(private readonly table: TanStackTable<TableNode<TData>>) { }

    public isRowExpanded(row: TanStackRow<TableNode<TData>>): boolean {
        if (!this.isRowExpandable(row)) {
            return false;
        }

        return this.isInDefaultState || !this.collapsedRows.has(row.id);
    }

    public toggleRowExpansion(row: TanStackRow<TableNode<TData>>): void {
        if (!this.isRowExpandable(row)) {
            return;
        }

        const wasExpanded = this.isRowExpanded(row);
        this.isInDefaultState = false;
        if (wasExpanded) {
            this.collapsedRows.add(row.id);
        } else {
            this.collapsedRows.delete(row.id);
        }

        row.toggleExpanded();
    }

    public collapseAll(): void {
        this.reset();

        this.isInDefaultState = false;
        const rows = this.table.getRowModel().flatRows;
        for (const row of rows) {
            if (this.isRowExpandable(row)) {
                this.collapsedRows.add(row.id);
            }
        }
        this.table.toggleAllRowsExpanded(false);
    }

    public reset(): void {
        this.collapsedRows.clear();
        this.isInDefaultState = true;
    }

    public processDataUpdate(rows: TanStackRow<TableNode<TData>>[]): void {
        if (this.isInDefaultState) {
            return;
        }

        const updatedCollapsedRows = new Set<string>();
        for (const row of rows) {
            const rowId = row.id;
            if (this.collapsedRows.has(rowId)) {
                updatedCollapsedRows.add(rowId);
            }
        }

        this.collapsedRows = updatedCollapsedRows;
    }

    private isRowExpandable(row: TanStackRow<TableNode<TData>>): boolean {
        return row.getIsGrouped() || row.subRows.length > 0;
    }
}
