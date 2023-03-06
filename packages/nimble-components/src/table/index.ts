import {
    attr,
    Observable,
    observable,
    Notifier
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef as TanStackColumnDef,
    TableState as TanStackTableState,
    Updater as TanStackUpdater,
    Table as TanStackTable,
    Row as TanStackRow,
    createTable as tanStackCreateTable,
    getCoreRowModel as tanStackGetCoreRowModel,
    getSortedRowModel as tanStackGetSortedRowModel,
    TableOptionsResolved as TanStackTableOptionsResolved,
    SortingState as TanStackSortingState
} from '@tanstack/table-core';
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import {
    TableActionMenuToggleEventDetail,
    TableColumnSortDirection,
    TableRecord,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';
import { getTanStackSortingFunction } from './models/sort-operations';
import { UpdateTracker } from './models/update-tracker';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
}

/**
 * A nimble-styled table.
 */
export class Table<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @attr({ attribute: 'id-field-name' })
    public idFieldName?: string;

    /**
     * @internal
     */
    @observable
    public tableData: TableRowState<TData>[] = [];

    /**
     * @internal
     */
    @observable
    public columns: TableColumn[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    /**
     * @internal
     */
    @observable
    public actionMenuSlots: string[] = [];

    /**
     * @internal
     */
    @observable
    public openActionMenuRecordId?: string;

    /**
     * @internal
     */
    @observable
    public canRenderRows = true;

    public get validity(): TableValidity {
        return this.tableValidator.getValidity();
    }

    /**
     * @internal
     */
    public readonly viewport!: HTMLElement;

    /**
     * @internal
     */
    public readonly virtualizer: Virtualizer<TData>;

    /**
     * @internal
     */
    @observable
    public firstSortedColumn?: TableColumn;

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableValidator = new TableValidator();
    private readonly updateTracker = new UpdateTracker(this);
    private columnNotifiers: Notifier[] = [];

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            getCoreRowModel: tanStackGetCoreRowModel(),
            getSortedRowModel: tanStackGetSortedRowModel(),
            columns: [],
            state: {},
            enableSorting: true,
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.virtualizer = new Virtualizer(this);
    }

    public setData(newData: readonly TData[]): void {
        this.setTableData(newData);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.virtualizer.connectedCallback();
        this.updateTracker.connectedCallback();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.virtualizer.disconnectedCallback();
        this.removeColumnObservers();
    }

    public checkValidity(): boolean {
        return this.tableValidator.isValid();
    }

    /**
     * @internal
     *
     * The event handler that is called when a notifier detects a change. Notifiers are added
     * to each column, so `source` is expected to be an instance of `TableColumn`, and `args`
     * is the string name of the property that changed on that column.
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof TableColumn && (
            args === 'columnId'
            || args === 'operandDataRecordFieldName'
            || args === 'sortOperation'
            || args === 'sortIndex'
            || args === 'sortDirection'
            || args === 'actionMenuSlot'
        )) {
            this.updateTracker.trackColumnPropertyChange(args);
        }
    }

    public onRowActionMenuBeforeToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        this.openActionMenuRecordId = event.detail.recordIds[0];
        this.$emit('action-menu-beforetoggle', event.detail);
    }

    public onRowActionMenuToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        this.$emit('action-menu-toggle', event.detail);
    }

    /**
     * @internal
     */
    public update(): void {
        this.validate(this.table.options.data);
        if (this.updateTracker.requiresTanStackUpdate) {
            this.updateTanStack();
        }

        if (this.updateTracker.updateActionMenuSlots) {
            this.updateActionMenuSlots();
        }
    }

    protected childItemsChanged(): void {
        void this.updateColumnsFromChildItems();
    }

    protected idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.updateTracker.trackIdFieldNameChange();
    }

    protected columnsChanged(
        _prev: TableColumn[] | undefined,
        _next: TableColumn[]
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.observeColumns();
        this.updateTracker.trackColumnInstancesChange();
    }

    private removeColumnObservers(): void {
        this.columnNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.columnNotifiers = [];
    }

    private observeColumns(): void {
        this.removeColumnObservers();

        for (const column of this.columns) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
            this.columnNotifiers.push(notifier);
        }
    }

    private validateColumnIds(): void {
        this.tableValidator.validateColumnIds(
            this.columns.map(x => x.columnId)
        );
    }

    private validateColumnSortIndices(): void {
        this.tableValidator.validateColumnSortIndices(
            this.getColumnsParticipatingInSorting().map(x => x.sortIndex!)
        );
    }

    private getColumnsParticipatingInSorting(): TableColumn[] {
        return this.columns.filter(
            x => x.sortDirection !== TableColumnSortDirection.none
                && typeof x.sortIndex === 'number'
        );
    }

    private async updateColumnsFromChildItems(): Promise<void> {
        const definedElements = this.childItems.map(async item => (item.matches(':not(:defined)')
            ? customElements.whenDefined(item.localName)
            : Promise.resolve()));
        await Promise.all(definedElements);
        this.columns = this.childItems.filter(
            (x): x is TableColumn => x instanceof TableColumn
        );
    }

    private updateTanStack(): void {
        const updatedOptions: Partial<TanStackTableOptionsResolved<TData>> = {
            state: {}
        };

        if (this.updateTracker.updateColumnSort) {
            updatedOptions.state!.sorting = this.getTanStackSortState();
        }
        if (this.updateTracker.updateColumnDefinition) {
            updatedOptions.columns = this.getTanStackColumns();
        }
        if (this.updateTracker.updateRowIds) {
            updatedOptions.getRowId = this.getTanStackRowIdFunction();
        }
        if (this.updateTracker.requiresTanStackDataReset) {
            // Perform a shallow copy of the data to trigger tanstack to regenerate the row models and columns.
            updatedOptions.data = [...this.table.options.data];
        }

        this.updateTableOptions(updatedOptions);
    }

    private updateActionMenuSlots(): void {
        const slots = new Set<string>();
        for (const column of this.columns) {
            if (column.actionMenuSlot) {
                slots.add(column.actionMenuSlot);
            }
        }
        this.actionMenuSlots = Array.from(slots);
    }

    private validate(data: TData[]): void {
        this.validateColumnIds();
        this.validateColumnSortIndices();
        this.tableValidator.validateRecordIds(data, this.idFieldName);

        this.canRenderRows = this.checkValidity();
    }

    private setTableData(newData: readonly TData[]): void {
        const data = newData.map(record => {
            return { ...record };
        });
        this.tableValidator.validateRecordIds(data, this.idFieldName);
        this.canRenderRows = this.checkValidity();

        this.updateTableOptions({
            data
        });
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const rowState: TableRowState<TData> = {
                record: row.original,
                id: row.id
            };
            return rowState;
        });
        this.virtualizer.dataChanged();
    }

    private updateTableOptions(
        updatedOptions: Partial<TanStackTableOptionsResolved<TData>>
    ): void {
        this.options = {
            ...this.options,
            ...updatedOptions,
            state: { ...this.options.state, ...updatedOptions.state }
        };
        this.table.setOptions(this.options);
        this.refreshRows();
    }

    private getTanStackSortState(): TanStackSortingState {
        const sortedColumns = this.getColumnsParticipatingInSorting().sort(
            (x, y) => x.sortIndex! - y.sortIndex!
        );
        this.firstSortedColumn = sortedColumns.length
            ? sortedColumns[0]
            : undefined;

        return sortedColumns.map(column => {
            return {
                id: column.internalUniqueId,
                desc:
                    column.sortDirection === TableColumnSortDirection.descending
            };
        });
    }

    private getTanStackRowIdFunction():
    | ((
        originalRow: TData,
        index: number,
        parent?: TanStackRow<TData>
    ) => string)
    | undefined {
        return this.idFieldName === null || this.idFieldName === undefined
            ? undefined
            : (record: TData) => record[this.idFieldName!] as string;
    }

    private getTanStackColumns(): TanStackColumnDef<TData>[] {
        return this.columns.map(column => {
            return {
                id: column.internalUniqueId,
                accessorKey: column.operandDataRecordFieldName,
                sortingFn: getTanStackSortingFunction(column.sortOperation)
            };
        });
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
export const tableTag = DesignSystem.tagFor(Table);
