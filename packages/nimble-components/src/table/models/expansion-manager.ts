import type { Row as TanStackRow } from '@tanstack/table-core';
import type { TableNode, TableRecord } from '../types';

/**
 * Manages the expanded/collapsed state of group rows and parent rows in the table. We must track
 * expansion state separately from TanStack to support use-cases such as lazy loading, where even
 * in TanStack's default state of 'true' (everything is expanded) we need the ability for a row
 * to indicate that it is not expanded (namely when it has no child rows). Additionally, when removing
 * records from the data and setting the table's data we prefer the removed row's previous expanded
 * state not be maintained if that record were to be reintroduced, which also requires us to track
 * expanded state independent of TanStack.
 */
export class ExpansionManager<TData extends TableRecord> {
    private allRowsExpanded = true;
    private collapsedRows = new Set<string>();

    public isRowExpanded(row: TanStackRow<TableNode<TData>>): boolean {
        if (!this.isRowExpandable(row)) {
            return false;
        }

        return this.allRowsExpanded || !this.collapsedRows.has(row.id);
    }

    public toggleRowExpansion(row: TanStackRow<TableNode<TData>>): void {
        if (!this.isRowExpandable(row)) {
            return;
        }

        const wasExpanded = this.isRowExpanded(row);
        this.allRowsExpanded = false;
        if (wasExpanded) {
            this.collapsedRows.add(row.id);
        } else {
            this.collapsedRows.delete(row.id);
        }

        row.toggleExpanded();
    }

    public collapseAll(rows: TanStackRow<TableNode<TData>>[]): void {
        this.reset();

        this.allRowsExpanded = false;
        for (const row of rows) {
            if (this.isRowExpandable(row)) {
                this.collapsedRows.add(row.id);
            }
        }
    }

    public reset(): void {
        this.collapsedRows.clear();
        this.allRowsExpanded = true;
    }

    public processDataUpdate(rows: TanStackRow<TableNode<TData>>[]): void {
        if (this.allRowsExpanded) {
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
