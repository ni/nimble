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
    getGroupedRowModel as tanStackGetGroupedRowModel,
    getExpandedRowModel as tanStackGetExpandedRowModel,
    TableOptionsResolved as TanStackTableOptionsResolved,
    SortingState as TanStackSortingState,
    GroupingState as TanStackGroupingState,
    ExpandedState as TanStackExpandedState,
    OnChangeFn as TanStackOnChangeFn
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
import { UpdateTracker } from './models/update-tracker';
import { TableLayoutHelper } from './models/table-layout-helper';
import type { TableRow } from './components/row';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
    isGrouped: boolean;
    groupRowValue?: unknown;
    isExpanded: boolean;
    nestingLevel?: number;
    leafItemCount?: number;
    groupColumn?: TableColumn;
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
    public readonly rowElements: TableRow[] = [];

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
    public readonly rowContainer!: HTMLElement;

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
    private readonly collapsedRows = new Set<string>();

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            onExpandedChange: this.handleExpandedChange,
            getCoreRowModel: tanStackGetCoreRowModel(),
            getSortedRowModel: tanStackGetSortedRowModel(),
            getGroupedRowModel: tanStackGetGroupedRowModel(),
            getExpandedRowModel: tanStackGetExpandedRowModel(),
            getIsRowExpanded: this.getIsRowExpanded,
            columns: [],
            state: {
                grouping: [],
                expanded: true // Workaround until we can apply a fix to TanStack regarding leveraging our getIsRowExpanded implementation
            },
            enableSorting: true,
            enableGrouping: true,
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.virtualizer = new Virtualizer(this, this.table);
    }

    public setData(newData: readonly TData[]): void {
        this.setTableData(newData);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.virtualizer.connectedCallback();
        this.updateTracker.trackAllStateChanged();
        this.observeColumns();
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
        if (source instanceof TableColumn && typeof args === 'string') {
            this.updateTracker.trackColumnPropertyChanged(args);
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
        if (!event.detail.newState) {
            this.openActionMenuRecordId = undefined;
        }
    }

    public toggleGroupExpanded(rowIndex: number, event: Event): void {
        const row = this.table.getRowModel().rows[rowIndex]!;
        const wasExpanded = row.getIsExpanded();
        // must update the collapsedRows before toggling expanded state
        if (wasExpanded) {
            this.collapsedRows.add(row.id);
        } else {
            this.collapsedRows.delete(row.id);
        }
        row.toggleExpanded();
        event.stopPropagation();
    }

    /**
     * @internal
     */
    public update(): void {
        this.validate();
        if (this.updateTracker.requiresTanStackUpdate) {
            this.updateTanStack();
        }

        if (this.updateTracker.updateActionMenuSlots) {
            this.updateActionMenuSlots();
        }

        if (this.updateTracker.updateColumnWidths) {
            this.updateRowGridColumns();
        }
    }

    protected idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.updateTracker.trackIdFieldNameChanged();
    }

    protected columnsChanged(
        _prev: TableColumn[] | undefined,
        _next: TableColumn[]
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.observeColumns();
        this.updateTracker.trackColumnInstancesChanged();
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

    private observeColumns(): void {
        this.removeColumnObservers();

        for (const column of this.columns) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
            this.columnNotifiers.push(notifier);
        }
    }

    private getColumnsParticipatingInSorting(): TableColumn[] {
        return this.columns.filter(
            x => x.sortDirection !== TableColumnSortDirection.none
                && typeof x.sortIndex === 'number'
        );
    }

    private getColumnsParticipatingInGrouping(): TableColumn[] {
        return this.columns.filter(
            x => !x.internalGroupingDisabled
                && typeof x.internalGroupIndex === 'number'
        );
    }

    private childItemsChanged(): void {
        void this.updateColumnsFromChildItems();
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
            updatedOptions.state!.sorting = this.calculateTanStackSortState();
        }
        if (this.updateTracker.updateColumnDefinition) {
            updatedOptions.columns = this.calculateTanStackColumns();
        }
        if (this.updateTracker.updateRowIds) {
            updatedOptions.getRowId = this.calculateTanStackRowIdFunction();
        }
        if (this.updateTracker.requiresTanStackDataReset) {
            // Perform a shallow copy of the data to trigger tanstack to regenerate the row models and columns.
            updatedOptions.data = [...this.table.options.data];
        }
        if (this.updateTracker.updateGroupRows) {
            updatedOptions.state!.grouping = this.calculateTanStackGroupingState();
            updatedOptions.state!.expanded = true;
            this.collapsedRows.clear();
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

    private updateRowGridColumns(): void {
        this.rowGridColumns = TableLayoutHelper.getGridTemplateColumns(
            this.columns
        );
    }

    private validate(): void {
        this.tableValidator.validateColumnIds(
            this.columns.map(x => x.columnId)
        );
        this.tableValidator.validateColumnSortIndices(
            this.getColumnsParticipatingInSorting().map(x => x.sortIndex!)
        );
        this.tableValidator.validateColumnGroupIndices(
            this.getColumnsParticipatingInGrouping().map(
                x => x.internalGroupIndex!
            )
        );
        this.validateWithData(this.table.options.data);
    }

    private validateWithData(data: TableRecord[]): void {
        this.tableValidator.validateRecordIds(data, this.idFieldName);
        this.canRenderRows = this.checkValidity();
    }

    private setTableData(newData: readonly TData[]): void {
        const data = newData.map(record => {
            return { ...record };
        });
        this.validateWithData(data);
        this.updateTableOptions({
            data
        });
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const rowState: TableRowState<TData> = {
                record: row.original,
                id: row.id,
                isGrouped: row.getIsGrouped(),
                isExpanded: row.getIsExpanded(),
                groupRowValue: row.getIsGrouped()
                    ? row.getValue(row.groupingColumnId!)
                    : undefined,
                nestingLevel: row.depth,
                leafItemCount: row
                    .getLeafRows()
                    .filter(leafRow => leafRow.getLeafRows().length === 0)
                    .length,
                groupColumn: this.getGroupRowColumn(row)
            };
            return rowState;
        });
        this.virtualizer.dataChanged();
    }

    private getGroupRowColumn(
        row: TanStackRow<TData>
    ): TableColumn | undefined {
        const groupedId = row.groupingColumnId;
        if (groupedId !== undefined) {
            return this.columns.find(c => c.internalUniqueId === groupedId);
        }

        return undefined;
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

    private readonly getIsRowExpanded = (row: TanStackRow<TData>): boolean => {
        if (!row.getIsGrouped()) {
            return false;
        }

        const expandedState = this.table.options.state.expanded;

        if (expandedState === true) {
            return true;
        }

        if (Object.keys(expandedState ?? {}).includes(row.id)) {
            return expandedState![row.id]!;
        }

        return !this.collapsedRows.has(row.id);
    };

    private readonly handleExpandedChange: TanStackOnChangeFn<TanStackExpandedState> = (updaterOrValue: TanStackUpdater<TanStackExpandedState>): void => {
        const expandedState = updaterOrValue instanceof Function
            ? updaterOrValue(this.table.getState().expanded)
            : updaterOrValue;

        this.updateTableOptions({
            state: {
                expanded: expandedState
            }
        });
    };

    private calculateTanStackSortState(): TanStackSortingState {
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

    private calculateTanStackGroupingState(): TanStackGroupingState {
        const groupedColumns = this.getColumnsParticipatingInGrouping().sort(
            (x, y) => x.internalGroupIndex! - y.internalGroupIndex!
        );

        return groupedColumns.map(column => column.internalUniqueId);
    }

    private calculateTanStackRowIdFunction():
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

    private calculateTanStackColumns(): TanStackColumnDef<TData>[] {
        return this.columns.map(column => {
            return {
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
