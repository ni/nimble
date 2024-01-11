import type { Row as TanStackRow } from '@tanstack/table-core';
import type { TableNode, TableRecord } from '../types';

/**
 * Manages the expanded/collapsed state of group rows and parent rows in the table.
 */
export class ExpansionManager<TData extends TableRecord> {
    private isInDefaultState = true;
    private collapsedRows = new Set<string>();
    private expansionToggleVisibleFieldName: string | undefined;

    public isRowExpanded(row: TanStackRow<TableNode<TData>>): boolean {
        if (!this.isRowExpandable(row)) {
            return false;
        }

        if (this.isInDefaultState) {
            return this.getDefaultExpansionState(row);
        }
        return !this.collapsedRows.has(row.id);
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

    public isRowExpandable(row: TanStackRow<TableNode<TData>>): boolean {
        if (row.subRows.length !== 0) {
            return true;
        }

        if (typeof this.expansionToggleVisibleFieldName === 'string') {
            // Return whether or not the value associated with `expansionToggleVisibleFieldName` is truthy
            return !!row.original.clientRecord[this.expansionToggleVisibleFieldName];
        }
        return false;
    }

    public setExpansionToggleVisibleFieldName(expansionToggleVisibleFieldName: string | undefined): void {
        this.expansionToggleVisibleFieldName = expansionToggleVisibleFieldName;
    }

    private getDefaultExpansionState(row: TanStackRow<TableNode<TData>>): boolean {
        // Rows with children (group rows and parent rows with populated children)
        // default to expanded. Other rows (parent rows with lazy-loaded children)
        // default to collapsed.
        return row.subRows.length !== 0;
    }
}
