import type { Table as TanStackTable } from '@tanstack/table-core';
import { TableRecord, TableRowState, TableRowSelectionMode } from '../types';
import type { SelectionManagerBase } from './selection-managers/selection-manager-base';
import { DisabledSelectionManager } from './selection-managers/disabled-selection-manager';
import { MultiSelectionManager } from './selection-managers/multi-selection-manager';
import { SingleSelectionManager } from './selection-managers/single-selection-manager';

/**
 * Manages the behavior associated with interactive row selection for the table, including
 * handling when the selection mode of the table is changed.
 */
export class InteractiveSelectionManager<TData extends TableRecord> {
    private readonly tanStackTable: TanStackTable<TData>;
    private selectionManager: SelectionManagerBase<TData>;

    public constructor(
        tanStackTable: TanStackTable<TData>,
        selectionMode: TableRowSelectionMode
    ) {
        this.tanStackTable = tanStackTable;
        this.selectionManager = this.createSelectionManager(selectionMode);
    }

    public handleRowSelectionToggle(
        rowState: TableRowState | undefined,
        isSelecting: boolean,
        shiftKey: boolean
    ): boolean {
        if (!rowState) {
            return false;
        }

        return this.selectionManager.handleRowSelectionToggle(
            rowState,
            isSelecting,
            shiftKey
        );
    }

    public handleRowClick(
        rowState: TableRowState | undefined,
        shiftKey: boolean,
        ctrlKey: boolean
    ): boolean {
        if (!rowState) {
            return false;
        }

        return this.selectionManager.handleRowClick(
            rowState,
            shiftKey,
            ctrlKey
        );
    }

    public handleActionMenuOpening(
        rowState: TableRowState | undefined
    ): boolean {
        if (!rowState) {
            return false;
        }

        return this.selectionManager.handleActionMenuOpening(rowState);
    }

    public handleSelectionModeChanged(
        selectionMode: TableRowSelectionMode
    ): void {
        this.selectionManager = this.createSelectionManager(selectionMode);
    }

    public handleSelectionReset(): void {
        this.selectionManager.reset();
    }

    private createSelectionManager(
        selectionMode: TableRowSelectionMode
    ): SelectionManagerBase<TData> {
        switch (selectionMode) {
            case TableRowSelectionMode.multiple:
                return new MultiSelectionManager(this.tanStackTable);
            case TableRowSelectionMode.single:
                return new SingleSelectionManager(this.tanStackTable);
            case TableRowSelectionMode.none:
                return new DisabledSelectionManager(this.tanStackTable);
            default:
                throw new Error('unknown selection mode found');
        }
    }
}
