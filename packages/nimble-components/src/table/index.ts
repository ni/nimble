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
    SortingState as TanStackSortingState
} from '@tanstack/table-core';
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import {
    TableActionMenuToggleEventDetail,
    TableColumnSortDirection,
    TableFieldValue,
    TableRecord,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';
import { getTanStackSortingFunction } from './models/sort-operations';
import { TableLayoutHelper } from './models/table-layout-helper';

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

    /**
     * @internal
     */
    @observable
    public scrollX = 0;

    /**
     * @internal
     */
    @observable
    public rowGridColumns?: string;

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
        this.viewport.addEventListener('scroll', this.onViewPortScroll, {
            passive: true
        });
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.virtualizer.disconnectedCallback();
        this.removeColumnObservers();
        this.viewport.removeEventListener('scroll', this.onViewPortScroll);
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
            } else if (
                args === 'operandDataRecordFieldName'
                || args === 'sortOperation'
            ) {
                this.generateTanStackColumns();
            } else if (args === 'sortIndex' || args === 'sortDirection') {
                this.validateColumnSortIndices();
                this.setSortState();
            } else if (
                args === 'currentFractionalWidth'
                || args === 'currentPixelWidth'
                || args === 'internalMinPixelWidth'
                || args === 'columnHidden'
            ) {
                this.updateRowGridColumns();
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
        this.updateRowGridColumns();
    }

    private readonly onViewPortScroll = (event: Event): void => {
        this.scrollX = (event.target as HTMLElement).scrollLeft;
    };

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
            this.getColumnsParticipatingInSorting().map(x => x.sortIndex!)
        );
        this.canRenderRows = this.checkValidity();
    }

    private getColumnsParticipatingInSorting(): TableColumn[] {
        return this.columns.filter(
            x => x.sortDirection !== TableColumnSortDirection.none
                && typeof x.sortIndex === 'number'
        );
    }

    private updateRowGridColumns(): void {
        this.rowGridColumns = TableLayoutHelper.getGridTemplateColumns(
            this.columns
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

    private setTableData(newData: readonly TData[]): void {
        const data = newData.map(record => {
            return { ...record };
        });
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
        this.options = {
            ...this.options,
            ...updatedOptions,
            state: { ...this.options.state, ...updatedOptions.state }
        };
        this.table.setOptions(this.options);
        this.refreshRows();
    }

    private setSortState(): void {
        const sortedColumns = this.getColumnsParticipatingInSorting().sort(
            (x, y) => x.sortIndex! - y.sortIndex!
        );
        this.firstSortedColumn = sortedColumns.length
            ? sortedColumns[0]
            : undefined;

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

        this.updateTableOptions({
            state: {
                sorting: tanStackSortingState
            }
        });
    }

    private generateTanStackColumns(): void {
        const generatedColumns = this.columns.map(column => {
            const columnDef: TanStackColumnDef<TData> = {
                id: column.internalUniqueId,
                accessorFn: (data: TData): TableFieldValue => {
                    const fieldName = column.operandDataRecordFieldName;
                    if (typeof fieldName !== 'string') {
                        return undefined;
                    }
                    return data[fieldName];
                },
                sortingFn: getTanStackSortingFunction(column.sortOperation)
            };
            return columnDef;
        });

        this.updateTableOptions({
            // Force TanStack to detect a data update because a columns's accessor is
            // referenced when creating a new row model.
            data: [...this.table.options.data],
            columns: generatedColumns
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
