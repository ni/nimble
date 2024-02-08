import type {
    Row as TanStackRow,
    Table as TanStackTable
} from '@tanstack/table-core';
import {
    type TableNode,
    type TableRecord,
    type TableSetRecordHierarchyOptions,
    type TableRecordHierarchyOptions,
    TableRecordDelayedHierarchyState
} from '../types';

/**
 * Manages the expanded/collapsed state of rows in the table.
 *
 * We must track the expansion state separately from TanStack because:
 *   1. TanStack does not support having a different initial expansion state per row unless explicitly
 *      specified for each row by ID. This causes problems in the nimble-table because we could have
 *      a different initial expansion state for group rows, parent rows, and parent rows with delay-loaded
 *      children.
 *   2. TanStack does not remove entries from its expanded state when those rows are no longer present
 *      in the data. This is not ideal because the object maintaining the expansion state can grow unbounded.
 */
export class ExpansionManager<TData extends TableRecord> {
    private nonDefaultExpansionStates = new Map<string, boolean>();
    private hierarchyOptions = new Map<string, TableRecordHierarchyOptions>();
    private isHierarchyEnabled = false;
    private expandableRowsWithoutChildren = new Set<string>();

    public constructor(
        private readonly tanStackTable: TanStackTable<TableNode<TData>>
    ) {}

    public isRowExpanded(row: TanStackRow<TableNode<TData>>): boolean {
        if (!this.isRowExpandable(row)) {
            return false;
        }

        const expansionState = this.nonDefaultExpansionStates.get(row.id);
        return expansionState ?? this.getDefaultExpansionState(row);
    }

    public toggleRowExpansion(row: TanStackRow<TableNode<TData>>): void {
        if (!this.isRowExpandable(row)) {
            return;
        }

        const wasExpanded = this.isRowExpanded(row);
        this.nonDefaultExpansionStates.set(row.id, !wasExpanded);

        row.toggleExpanded();
    }

    public collapseAll(): void {
        this.resetExpansionState();

        const rows = this.tanStackTable.getRowModel().flatRows;
        for (const row of rows) {
            if (this.isRowExpandable(row)) {
                this.nonDefaultExpansionStates.set(row.id, false);
            }
        }
        this.tanStackTable.toggleAllRowsExpanded(false);
    }

    public resetExpansionState(): void {
        this.nonDefaultExpansionStates.clear();
    }

    public resetHierarchyOptions(): void {
        this.hierarchyOptions.clear();
    }

    public processDataUpdate(rows: TanStackRow<TableNode<TData>>[]): void {
        if (
            this.nonDefaultExpansionStates.size === 0
            && this.hierarchyOptions.size === 0
        ) {
            return;
        }

        const updatedNonDefaultExpansionStates = new Map<string, boolean>();
        const updatedHierarchyOptions = new Map<
        string,
        TableRecordHierarchyOptions
        >();
        const updatedExpandableRowsWithoutChildren = new Set<string>();
        for (const row of rows) {
            const rowId = row.id;
            const rowHierarchyOptions = this.hierarchyOptions.get(rowId);
            if (!row.getIsGrouped() && rowHierarchyOptions) {
                updatedHierarchyOptions.set(rowId, rowHierarchyOptions);
            }

            if (this.isRowExpandable(row)) {
                const expansionState = this.nonDefaultExpansionStates.get(rowId);
                if (expansionState !== undefined) {
                    updatedNonDefaultExpansionStates.set(rowId, expansionState);
                }

                if (row.subRows.length === 0) {
                    if (this.expandableRowsWithoutChildren.has(rowId)) {
                        updatedExpandableRowsWithoutChildren.add(rowId);
                    } else {
                        // The row used to have children, but now it does not. Therefore,
                        // collapse the row.
                        updatedNonDefaultExpansionStates.set(rowId, false);
                        this.expandableRowsWithoutChildren.add(rowId);
                    }
                }
            }
        }

        this.nonDefaultExpansionStates = updatedNonDefaultExpansionStates;
        this.hierarchyOptions = updatedHierarchyOptions;
        this.expandableRowsWithoutChildren = updatedExpandableRowsWithoutChildren;
    }

    public setHierarchyOptions(
        hierarchyOptions: TableSetRecordHierarchyOptions[]
    ): void {
        this.hierarchyOptions.clear();
        for (const { recordId, options } of hierarchyOptions) {
            this.hierarchyOptions.set(recordId, options);
        }
    }

    public isRowExpandable(row: TanStackRow<TableNode<TData>>): boolean {
        return row.subRows.length > 0 || this.canLoadDelayedChildren(row.id);
    }

    public setHierarchyEnabled(isHierarchyEnabled: boolean): void {
        this.isHierarchyEnabled = isHierarchyEnabled;
    }

    private canLoadDelayedChildren(id: string): boolean {
        if (!this.isHierarchyEnabled) {
            return false;
        }

        return (
            this.hierarchyOptions.get(id)?.delayedHierarchyState
                === TableRecordDelayedHierarchyState.canLoadChildren ?? false
        );
    }

    private getDefaultExpansionState(
        row: TanStackRow<TableNode<TData>>
    ): boolean {
        // Rows with children (group rows and parent rows with populated children)
        // default to expanded. Other rows (parent rows with lazy-loaded children)
        // default to collapsed.
        return row.subRows.length !== 0;
    }
}
