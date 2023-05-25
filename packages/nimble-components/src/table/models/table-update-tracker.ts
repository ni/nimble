import { DOM } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';
import type { ColumnInternals } from '../../table-column/base/models/column-internals';
import { UpdateTracker } from '../../utilities/models/update-tracker';

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
export class TableUpdateTracker<
    TData extends TableRecord
> extends UpdateTracker<
    [
        'rowIds',
        'groupRows',
        'columnIds',
        'columnSort',
        'columnWidths',
        'columnDefinition',
        'actionMenuSlots',
        'selectionMode'
    ]
    > {
    private updateQueued = false;

    public constructor(private readonly table: Table<TData>) {
        super([
            'rowIds',
            'groupRows',
            'columnIds',
            'columnSort',
            'columnWidths',
            'columnDefinition',
            'actionMenuSlots',
            'selectionMode'
        ]);
    }

    public get updateRowIds(): boolean {
        return this.trackedItemState('rowIds');
    }

    public get updateGroupRows(): boolean {
        return this.trackedItemState('groupRows');
    }

    public get updateColumnIds(): boolean {
        return this.trackedItemState('columnIds');
    }

    public get updateColumnSort(): boolean {
        return this.trackedItemState('columnSort');
    }

    public get updateColumnWidths(): boolean {
        return this.trackedItemState('columnWidths');
    }

    public get updateColumnDefinition(): boolean {
        return this.trackedItemState('columnDefinition');
    }

    public get updateActionMenuSlots(): boolean {
        return this.trackedItemState('actionMenuSlots');
    }

    public get updateSelectionMode(): boolean {
        return this.trackedItemState('selectionMode');
    }

    public get requiresTanStackUpdate(): boolean {
        return (
            this.trackedItemState('rowIds')
            || this.trackedItemState('columnSort')
            || this.trackedItemState('columnDefinition')
            || this.trackedItemState('groupRows')
            || this.trackedItemState('selectionMode')
        );
    }

    public get requiresTanStackDataReset(): boolean {
        return (
            this.trackedItemState('rowIds')
            || this.trackedItemState('columnDefinition')
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
        this.trackAndQueue('rowIds');
    }

    public trackSelectionModeChanged(): void {
        this.trackAndQueue('selectionMode');
    }

    protected override queueUpdate(): void {
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
