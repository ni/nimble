import { DOM } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';
import type { ColumnInternals } from '../../table-column/base/models/column-internals';

interface BooleanCollection {
    [key: string]: boolean;
}

interface RequiredUpdates extends BooleanCollection {
    rowIds: boolean;
    groupRows: boolean;
    columnIds: boolean;
    columnSort: boolean;
    columnWidths: boolean;
    columnDefinition: boolean;
    actionMenuSlots: boolean;
    selectionMode: boolean;
}

const isColumnProperty = (
    changedProperty: string,
    ...args: (keyof TableColumn)[]
): boolean => {
    for (const arg of args) {
        if (changedProperty === arg) {
            return true;
        }
    }
    return false;
};

const isColumnInternalsProperty = (
    changedProperty: string,
    ...args: (keyof ColumnInternals<unknown>)[]
): boolean => {
    for (const arg of args) {
        if (changedProperty === arg) {
            return true;
        }
    }
    return false;
};

/**
 * Helper class to track what updates are needed to the table based on configuration
 * changes.
 */
export class UpdateTracker<TData extends TableRecord> {
    private readonly requiredUpdates: RequiredUpdates = {
        rowIds: false,
        groupRows: false,
        columnIds: false,
        columnSort: false,
        columnWidths: false,
        columnDefinition: false,
        actionMenuSlots: false,
        selectionMode: false
    };

    private readonly table: Table<TData>;
    private updateQueued = false;

    public constructor(table: Table<TData>) {
        this.table = table;
    }

    public get updateRowIds(): boolean {
        return this.requiredUpdates.rowIds;
    }

    public get updateGroupRows(): boolean {
        return this.requiredUpdates.groupRows;
    }

    public get updateColumnIds(): boolean {
        return this.requiredUpdates.columnIds;
    }

    public get updateColumnSort(): boolean {
        return this.requiredUpdates.columnSort;
    }

    public get updateColumnWidths(): boolean {
        return this.requiredUpdates.columnWidths;
    }

    public get updateColumnDefinition(): boolean {
        return this.requiredUpdates.columnDefinition;
    }

    public get updateActionMenuSlots(): boolean {
        return this.requiredUpdates.actionMenuSlots;
    }

    public get updateSelectionMode(): boolean {
        return this.requiredUpdates.selectionMode;
    }

    public get requiresTanStackUpdate(): boolean {
        return (
            this.requiredUpdates.rowIds
            || this.requiredUpdates.columnSort
            || this.requiredUpdates.columnDefinition
            || this.requiredUpdates.groupRows
            || this.requiredUpdates.selectionMode
        );
    }

    public get requiresTanStackDataReset(): boolean {
        return (
            this.requiredUpdates.rowIds || this.requiredUpdates.columnDefinition
        );
    }

    public trackAllStateChanged(): void {
        this.setAllKeys(true);
        this.queueUpdate();
    }

    public get hasPendingUpdates(): boolean {
        return this.updateQueued;
    }

    public trackColumnPropertyChanged(changedColumnProperty: string): void {
        if (isColumnProperty(changedColumnProperty, 'columnId')) {
            this.requiredUpdates.columnIds = true;
        } else if (
            isColumnInternalsProperty(
                changedColumnProperty,
                'operandDataRecordFieldName',
                'sortOperation'
            )
        ) {
            this.requiredUpdates.columnDefinition = true;
        } else if (
            isColumnProperty(
                changedColumnProperty,
                'sortIndex',
                'sortDirection'
            )
        ) {
            this.requiredUpdates.columnSort = true;
        } else if (
            isColumnProperty(
                changedColumnProperty,
                'currentFractionalWidth',
                'currentPixelWidth',
                'internalMinPixelWidth',
                'columnHidden'
            )
        ) {
            this.requiredUpdates.columnWidths = true;
        } else if (isColumnProperty(changedColumnProperty, 'actionMenuSlot')) {
            this.requiredUpdates.actionMenuSlots = true;
        } else if (
            isColumnInternalsProperty(
                changedColumnProperty,
                'groupIndex',
                'groupingDisabled'
            )
        ) {
            this.requiredUpdates.groupRows = true;
        }

        this.queueUpdate();
    }

    public trackColumnInstancesChanged(): void {
        this.requiredUpdates.columnIds = true;
        this.requiredUpdates.columnDefinition = true;
        this.requiredUpdates.columnSort = true;
        this.requiredUpdates.columnWidths = true;
        this.requiredUpdates.actionMenuSlots = true;
        this.requiredUpdates.groupRows = true;

        this.queueUpdate();
    }

    public trackIdFieldNameChanged(): void {
        this.requiredUpdates.rowIds = true;
        this.queueUpdate();
    }

    public trackSelectionModeChanged(): void {
        this.requiredUpdates.selectionMode = true;
        this.queueUpdate();
    }

    private setAllKeys(value: boolean): void {
        Object.keys(this.requiredUpdates).forEach(key => {
            this.requiredUpdates[key] = value;
        });
    }

    private queueUpdate(): void {
        if (!this.table.$fastController.isConnected) {
            return;
        }

        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.table.update();
                this.setAllKeys(false);
                this.updateQueued = false;
            });
        }
    }
}
