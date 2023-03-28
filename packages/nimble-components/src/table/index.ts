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
    SortingState as TanStackSortingState,
    RowSelectionState as TanStackRowSelectionState,
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
    TableRowSelectionEventDetail,
    TableRowSelectionMode,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';
import { getTanStackSortingFunction } from './models/sort-operations';
import { UpdateTracker } from './models/update-tracker';
import { TableLayoutHelper } from './models/table-layout-helper';
import { TableRowSelectionState } from '../table-column/base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
    selectionState: TableRowSelectionState;
    ariaSelected: 'true' | 'false' | null;
}

/**
 * A nimble-styled table.
 */
export class Table<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @attr({ attribute: 'id-field-name' })
    public idFieldName?: string;

    @attr({ attribute: 'selection-mode' })
    public selectionMode: TableRowSelectionMode = TableRowSelectionMode.none;

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
    private readonly updateTracker = new UpdateTracker(this);
    private columnNotifiers: Notifier[] = [];

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            onRowSelectionChange: this.setRowSelection,
            getCoreRowModel: tanStackGetCoreRowModel(),
            getSortedRowModel: tanStackGetSortedRowModel(),
            columns: [],
            state: {
                rowSelection: {}
            },
            enableRowSelection: false,
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

    public getSelectedRecordIds(): string[] {
        const tanStackSelectionState = this.options.state.rowSelection;
        if (!tanStackSelectionState) {
            return [];
        }

        const selectedRecordIds: string[] = [];
        Object.entries(tanStackSelectionState).forEach(
            ([recordId, isSelected]) => {
                if (isSelected) {
                    selectedRecordIds.push(recordId);
                }
            }
        );
        return selectedRecordIds;
    }

    public setSelectedRecordIds(recordIds: string[]): void {
        if (this.selectionMode === TableRowSelectionMode.none) {
            return;
        }

        this.updateTableOptions({
            state: {
                rowSelection: this.calculateTanStackSelectionState(recordIds)
            }
        });
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

    /** @internal */
    public onRowClick(rowIndex: number): void {
        if (this.selectionMode === TableRowSelectionMode.none) {
            return;
        }

        const row = this.table.getRowModel().rows[rowIndex];
        if (!row) {
            return;
        }

        const currentSelection = this.getSelectedRecordIds();
        if (currentSelection.length === 1 && currentSelection[0] === row.id) {
            // The clicked row is already the only selected row. Do nothing.
            return;
        }

        this.table.toggleAllRowsSelected(false);
        row.toggleSelected(true);
        this.emitSelectionChangeEvent();
    }

    /** @internal */
    public onRowActionMenuBeforeToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        event.stopImmediatePropagation();

        this.openActionMenuRecordId = event.detail.recordIds[0];
        this.$emit('action-menu-beforetoggle', event.detail);
    }

    /** @internal */
    public onRowActionMenuToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        event.stopImmediatePropagation();

        this.$emit('action-menu-toggle', event.detail);
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

    protected selectionModeChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.updateTracker.trackSelectionModeChanged();
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
        const updatedOptions: Partial<TanStackTableOptionsResolved<TData>> = {};
        updatedOptions.state = {};

        if (this.updateTracker.updateColumnSort) {
            updatedOptions.state.sorting = this.calculateTanStackSortState();
        }
        if (this.updateTracker.updateColumnDefinition) {
            updatedOptions.columns = this.calculateTanStackColumns();
        }
        if (this.updateTracker.updateRowIds) {
            updatedOptions.getRowId = this.calculateTanStackRowIdFunction();
            updatedOptions.state.rowSelection = {};
        }
        if (this.updateTracker.updateSelectionMode) {
            updatedOptions.enableRowSelection = this.selectionMode !== TableRowSelectionMode.none;
            updatedOptions.state.rowSelection = {};
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

    private updateRowGridColumns(): void {
        this.rowGridColumns = TableLayoutHelper.getGridTemplateColumns(
            this.columns
        );
    }

    private validate(): void {
        this.tableValidator.validateCanSupportSelection(
            this.selectionMode,
            this.idFieldName
        );
        this.tableValidator.validateColumnIds(
            this.columns.map(x => x.columnId)
        );
        this.tableValidator.validateColumnSortIndices(
            this.getColumnsParticipatingInSorting().map(x => x.sortIndex!)
        );
        this.validateWithData(this.table.options.data);
    }

    private validateWithData(data: TableRecord[]): void {
        this.tableValidator.validateRecordIds(data, this.idFieldName);
        this.canRenderRows = this.checkValidity();
    }

    private emitSelectionChangeEvent(): void {
        const detail: TableRowSelectionEventDetail = {
            selectedRecordIds: this.getSelectedRecordIds()
        };

        this.$emit('selection-change', detail);
    }

    private setTableData(newData: readonly TData[]): void {
        const data = newData.map(record => {
            return { ...record };
        });
        this.validateWithData(data);

        if (this.tableValidator.areRecordIdsValid()) {
            this.updateTableOptions({
                data,
                state: {
                    rowSelection: this.calculateTanStackSelectionState(
                        this.getSelectedRecordIds()
                    )
                }
            });
        } else {
            this.updateTableOptions({
                data
            });
        }
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const rowState: TableRowState<TData> = {
                record: row.original,
                id: row.id,
                selectionState: row.getIsSelected()
                    ? TableRowSelectionState.selected
                    : TableRowSelectionState.notSelected,
                ariaSelected: this.getAriaSelectedForRow(row)
            };
            return rowState;
        });
        this.virtualizer.dataChanged();
    }

    private getAriaSelectedForRow(row: TanStackRow<TData>): 'true' | 'false' | null {
        if (this.selectionMode === TableRowSelectionMode.none) {
            return null;
        }

        return row.getIsSelected() ? 'true' : 'false';
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

    private readonly setRowSelection: TanStackOnChangeFn<TanStackRowSelectionState> = (updaterOrValue: TanStackUpdater<TanStackRowSelectionState>): void => {
        const rowSelectionState = updaterOrValue instanceof Function
            ? updaterOrValue(this.table.getState().rowSelection)
            : updaterOrValue;

        this.updateTableOptions({
            state: {
                rowSelection: rowSelectionState
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

    private calculateTanStackSelectionState(
        recordIds: string[]
    ): TanStackRowSelectionState {
        const tanstackSelectionState: TanStackRowSelectionState = {};
        for (const id of this.tableValidator.getPresentRecordIds(recordIds)) {
            tanstackSelectionState[id] = true;

            if (this.selectionMode === TableRowSelectionMode.single) {
                break;
            }
        }

        return tanstackSelectionState;
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
export const tableTag = DesignSystem.tagFor(Table);
