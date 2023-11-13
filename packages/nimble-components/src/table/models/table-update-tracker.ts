import { DOM } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';
import { UpdateTracker } from '../../utilities/models/update-tracker';
import { isColumnInternalsProperty } from '../../table-column/base/models/column-internals';

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

const trackedItems = [
    'rowIds',
    'rowParentIds',
    'groupRows',
    'columnIds',
    'columnSort',
    'columnWidths',
    'columnDefinition',
    'actionMenuSlots',
    'selectionMode'
] as const;

/**
 * Helper class to track what updates are needed to the table based on configuration
 * changes.
 */
export class TableUpdateTracker<
    TData extends TableRecord
> extends UpdateTracker<typeof trackedItems> {
    private updateQueued = false;

    public constructor(private readonly table: Table<TData>) {
        super(trackedItems);
    }

    public get updateRowIds(): boolean {
        return this.isTracked('rowIds');
    }

    public get updateRowParentIds(): boolean {
        return this.isTracked('rowParentIds');
    }

    public get updateGroupRows(): boolean {
        return this.isTracked('groupRows');
    }

    public get updateColumnIds(): boolean {
        return this.isTracked('columnIds');
    }

    public get updateColumnSort(): boolean {
        return this.isTracked('columnSort');
    }

    public get updateColumnWidths(): boolean {
        return this.isTracked('columnWidths');
    }

    public get updateColumnDefinition(): boolean {
        return this.isTracked('columnDefinition');
    }

    public get updateActionMenuSlots(): boolean {
        return this.isTracked('actionMenuSlots');
    }

    public get updateSelectionMode(): boolean {
        return this.isTracked('selectionMode');
    }

    public get requiresTanStackUpdate(): boolean {
        return (
            this.isTracked('rowIds')
            || this.isTracked('rowParentIds')
            || this.isTracked('columnSort')
            || this.isTracked('columnDefinition')
            || this.isTracked('groupRows')
            || this.isTracked('selectionMode')
        );
    }

    public get requiresTanStackDataReset(): boolean {
        return (
            (this.isTracked('rowIds') || this.isTracked('columnDefinition'))
            && !this.isTracked('rowParentIds')
        );
    }

    public trackAllStateChanged(): void {
        this.trackAll();
        this.queueUpdate();
    }

    public get hasPendingUpdates(): boolean {
        return this.updateQueued;
    }

    public trackColumnPropertyChanged(changedColumnProperty: string): void {
        if (isColumnProperty(changedColumnProperty, 'columnId')) {
            this.track('columnIds');
        } else if (
            isColumnInternalsProperty(
                changedColumnProperty,
                'operandDataRecordFieldName',
                'sortOperation'
            )
        ) {
            this.track('columnDefinition');
        } else if (
            isColumnProperty(changedColumnProperty, 'sortingDisabled')
            || isColumnInternalsProperty(
                changedColumnProperty,
                'currentSortDirection',
                'currentSortIndex'
            )
        ) {
            this.track('columnSort');
        } else if (
            isColumnProperty(changedColumnProperty, 'columnHidden')
            || isColumnInternalsProperty(
                changedColumnProperty,
                'currentFractionalWidth',
                'currentPixelWidth',
                'minPixelWidth'
            )
        ) {
            this.track('columnWidths');
        } else if (isColumnProperty(changedColumnProperty, 'actionMenuSlot')) {
            this.track('actionMenuSlots');
        } else if (
            isColumnInternalsProperty(
                changedColumnProperty,
                'groupIndex',
                'groupingDisabled'
            )
        ) {
            this.track('groupRows');
        }

        this.queueUpdate();
    }

    public trackColumnInstancesChanged(): void {
        this.track('columnIds');
        this.track('columnDefinition');
        this.track('columnSort');
        this.track('columnWidths');
        this.track('actionMenuSlots');
        this.track('groupRows');

        this.queueUpdate();
    }

    public trackIdFieldNameChanged(): void {
        this.track('rowIds');
        this.queueUpdate();
    }

    public trackParentIdFieldNameChanged(): void {
        this.track('rowParentIds');
        this.queueUpdate();
    }

    public trackSelectionModeChanged(): void {
        this.track('selectionMode');
        this.queueUpdate();
    }

    protected override queueUpdate(): void {
        if (!this.table.$fastController.isConnected) {
            return;
        }

        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.table.update();
                this.untrackAll();
                this.updateQueued = false;
            });
        }
    }
}
