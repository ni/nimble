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
    createTable as tanStackCreateTable,
    getCoreRowModel as tanStackGetCoreRowModel,
    getSortedRowModel as tanStackGetSortedRowModel,
    TableOptionsResolved as TanStackTableOptionsResolved,
    SortingFnOption as TanStackSortingFnOption,
    SortingFn as TanStackSortingFn,
    Row as TanStackRow,
    SortingState as TanStackSortingState
} from '@tanstack/table-core';
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import {
    TableActionMenuToggleEventDetail,
    TableColumnSortDirection,
    TableColumnSortOperation,
    TableRecord,
    TableRowState,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
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

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableValidator = new TableValidator();
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
        this.validateAndObserveColumns();
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
        if (source instanceof TableColumn) {
            if (args === 'columnId') {
                this.validateColumnIds();
            }
            if (
                args === 'operandDataRecordFieldName'
                || args === 'sortOperation'
            ) {
                this.generateTanStackColumns();
            }
            if (args === 'sortIndex' || args === 'sortDirection') {
                if (args === 'sortIndex') {
                    this.validateColumnSortIndices();
                }
                this.setSortState();
            }
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

    protected childItemsChanged(): void {
        void this.updateColumnsFromChildItems();
    }

    protected idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        // Force TanStack to detect a data update because a row's ID is only
        // generated when creating a new row model.
        this.setTableData(this.table.options.data);
    }

    protected columnsChanged(
        _prev: TableColumn[] | undefined,
        _next: TableColumn[]
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.validateAndObserveColumns();
        this.generateTanStackColumns();
        this.setSortState();

        const slots = new Set<string>();
        for (const column of this.columns) {
            if (column.actionMenuSlot) {
                slots.add(column.actionMenuSlot);
            }
        }
        this.actionMenuSlots = Array.from(slots);
    }

    private removeColumnObservers(): void {
        this.columnNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.columnNotifiers = [];
    }

    private validateAndObserveColumns(): void {
        this.removeColumnObservers();

        for (const column of this.columns) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
            this.columnNotifiers.push(notifier);
        }

        this.validateColumnIds();
        this.validateColumnSortIndices();
    }

    private validateColumnIds(): void {
        this.tableValidator.validateColumnIds(
            this.columns.map(x => x.columnId)
        );
        this.canRenderRows = this.checkValidity();
    }

    private validateColumnSortIndices(): void {
        this.tableValidator.validateColumnSortIndices(
            this.columns
                .map(x => x.sortIndex)
                .filter((x): x is number => x !== null)
        );
        this.canRenderRows = this.checkValidity();
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

    private setTableData(newData: readonly TData[]): void {
        const data = this.copyData(newData);
        this.tableValidator.validateRecordIds(data, this.idFieldName);
        this.canRenderRows = this.checkValidity();

        const getRowIdFunction = this.idFieldName === null || this.idFieldName === undefined
            ? undefined
            : (record: TData) => record[this.idFieldName!] as string;
        this.updateTableOptions({
            data,
            getRowId: getRowIdFunction
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
        this.options = { ...this.options, ...updatedOptions };
        this.update({ ...this.table.getState(), ...this.options.state });
        this.refreshRows();
    }

    private readonly update = (state: TanStackTableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this.options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function'
                    ? (updater(state) as TanStackTableState)
                    : (updater as TanStackTableState);
                this.update(updatedState);
            }
        }));
    };

    private setSortState(): void {
        const sortedColumns = this.columns
            .filter(
                x => x.sortIndex !== null
                    && x.sortDirection !== TableColumnSortDirection.none
            )
            .sort((x, y) => x.sortIndex! - y.sortIndex!);

        const tanStackSortingState: TanStackSortingState = sortedColumns.map(
            column => {
                return {
                    id: column.internalUniqueId,
                    desc:
                        column.sortDirection
                        === TableColumnSortDirection.descending
                };
            }
        );

        const updatedState = { ...this.table.options.state, sorting: tanStackSortingState };
        this.updateTableOptions({ state: updatedState });
    }

    private generateTanStackColumns(): void {
        const generatedColumns = this.columns.map(column => {
            const columnDef: TanStackColumnDef<TData> = {
                id: column.internalUniqueId,
                accessorKey: column.operandDataRecordFieldName,
                sortingFn: this.getTanStackSortingFunction(column.sortOperation)
            };
            return columnDef;
        });

        this.updateTableOptions({
            // Force TanStack to detect a data update because a columns's accessor is
            // referenced when creating a new row model.
            data: this.copyData(this.table.options.data),
            columns: generatedColumns
        });
    }

    private copyData(data: readonly TData[]): TData[] {
        return data.map(record => {
            return { ...record };
        });
    }

    private getTanStackSortingFunction(
        sortOperation: TableColumnSortOperation
    ): TanStackSortingFnOption<TData> {
        switch (sortOperation) {
            case TableColumnSortOperation.basic:
                return 'basic';
            case TableColumnSortOperation.localeAwareCaseSensitive:
                return this.localeAwareCaseSensitiveSortFunction;
            default:
                return 'basic';
        }
    }

    private readonly localeAwareCaseSensitiveSortFunction: TanStackSortingFn<TData> = (
        rowA: TanStackRow<TData>,
        rowB: TanStackRow<TData>,
        columnId: string
    ) => {
        const valueA = rowA.getValue<string | null | undefined>(columnId) ?? '';
        const valueB = rowB.getValue<string | null | undefined>(columnId) ?? '';

        return valueA.localeCompare(valueB);
    };
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
