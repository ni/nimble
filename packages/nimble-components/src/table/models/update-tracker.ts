import { DOM } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';

interface BooleanCollection {
    [key: string]: boolean;
}

interface RequiredUpdates extends BooleanCollection {
    rowIds: boolean;
    columnIds: boolean;
    columnSort: boolean;
    columnDefinition: boolean;
    actionMenuSlots: boolean;
}

/**
 * Helper class to track what updates are needed to the table based on configuration
 * changes.
 */
export class UpdateTracker<TData extends TableRecord> {
    private readonly requiredUpdates: RequiredUpdates = {
        rowIds: false,
        columnIds: false,
        columnSort: false,
        columnDefinition: false,
        actionMenuSlots: false
    };

    private readonly table: Table<TData>;
    private updateQueued = false;

    public constructor(table: Table<TData>) {
        this.table = table;
    }

    public get updateRowIds(): boolean {
        return this.requiredUpdates.rowIds;
    }

    public get updateColumnIds(): boolean {
        return this.requiredUpdates.columnIds;
    }

    public get updateColumnSort(): boolean {
        return this.requiredUpdates.columnSort;
    }

    public get updateColumnDefinition(): boolean {
        return this.requiredUpdates.columnDefinition;
    }

    public get updateActionMenuSlots(): boolean {
        return this.requiredUpdates.actionMenuSlots;
    }

    public get requiresTanStackUpdate(): boolean {
        return (
            this.requiredUpdates.rowIds
            || this.requiredUpdates.columnSort
            || this.requiredUpdates.columnDefinition
        );
    }

    public get requiresTanStackDataReset(): boolean {
        return (
            this.requiredUpdates.rowIds || this.requiredUpdates.columnDefinition
        );
    }

    public trackAllStateChange(): void {
        this.setAllKeys(true);
        this.queueUpdate();
    }

    public trackColumnPropertyChange(changedColumnProperty: string): void {
        if (this.isSameProperty(changedColumnProperty, 'columnId')) {
            this.requiredUpdates.columnIds = true;
        } else if (
            this.isSameProperty(
                changedColumnProperty,
                'operandDataRecordFieldName'
            )
            || this.isSameProperty(changedColumnProperty, 'sortOperation')
        ) {
            this.requiredUpdates.columnDefinition = true;
        } else if (
            this.isSameProperty(changedColumnProperty, 'sortIndex')
            || this.isSameProperty(changedColumnProperty, 'sortDirection')
        ) {
            this.requiredUpdates.columnSort = true;
        } else if (
            this.isSameProperty(changedColumnProperty, 'actionMenuSlot')
        ) {
            this.requiredUpdates.actionMenuSlots = true;
        }

        this.queueUpdate();
    }

    public trackColumnInstancesChange(): void {
        this.requiredUpdates.columnIds = true;
        this.requiredUpdates.columnDefinition = true;
        this.requiredUpdates.columnSort = true;
        this.requiredUpdates.actionMenuSlots = true;

        this.queueUpdate();
    }

    public trackIdFieldNameChange(): void {
        this.requiredUpdates.rowIds = true;
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

    private isSameProperty(
        changedProperty: string,
        columnProperty: keyof TableColumn
    ): boolean {
        return changedProperty === columnProperty;
    }
}
