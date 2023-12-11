import type { Row as TanStackRow } from '@tanstack/table-core';
import type { TableNode, TableRecord } from '../types';

/**
 * Manages the expanded/collapsed state of group rows and parent rows in the table.
 */
export class ExpansionManager<TData extends TableRecord> {
    private isInDefaultState = true;
    private collapsedRows = new Set<string>();

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
    }

    public collapseAll(rows: TanStackRow<TableNode<TData>>[]): void {
        this.reset();

        this.isInDefaultState = false;
        for (const row of rows) {
            if (this.isRowExpandable(row)) {
                this.collapsedRows.add(row.id);
            }
        }
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
