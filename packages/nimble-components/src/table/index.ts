import {
    attr,
    Observable,
    observable,
    Notifier,
    DOM
} from '@microsoft/fast-element';
import {
    Checkbox,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
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
    RowSelectionState as TanStackRowSelectionState,
    GroupingState as TanStackGroupingState,
    ExpandedState as TanStackExpandedState,
    OnChangeFn as TanStackOnChangeFn
} from '@tanstack/table-core';
import { keyShift } from '@microsoft/fast-web-utilities';
import { arrayToTree } from 'performant-array-to-tree';
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import {
    InternalTableRecord,
    TableActionMenuToggleEventDetail,
    TableColumnConfigurationChangeEventDetail,
    TableColumnSortDirection,
    TableFieldValue,
    TableRecord,
    TableRowMetadata,
    TableRowSelectionEventDetail,
    TableRowSelectionMode,
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail,
    TableRowState,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';
import { getTanStackSortingFunction } from './models/sort-operations';
import { TableLayoutManager } from './models/table-layout-manager';
import { TableUpdateTracker } from './models/table-update-tracker';
import { TableRow } from './components/row';
import { ColumnInternals } from '../table-column/base/models/column-internals';
import { InteractiveSelectionManager } from './models/interactive-selection-manager';

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

    @attr({ attribute: 'parent-id-field-name' })
    public parentIdFieldName?: string;

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

    /**
     * @internal
     */
    @observable
    public selectionState: TableRowSelectionState = TableRowSelectionState.notSelected;

    public get validity(): TableValidity {
        return this.tableValidator.getValidity();
    }

    /**
     * @internal
     */
    public get showRowOperationColumn(): boolean {
        return (
            this.selectionMode === TableRowSelectionMode.multiple
            || this.showCollapseAll
        );
    }

    /**
     * @internal
     */
    public readonly viewport!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public readonly selectionCheckbox?: Checkbox;

    /**
     * @internal
     */
    @observable
    public showCollapseAll = false;

    /**
     * @internal
     */
    public readonly headerRowActionContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly rowContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly columnHeadersContainer!: Element;

    /**
     * @internal
     */
    public readonly virtualizer: Virtualizer<TData>;

    /**
     * @internal
     */
    public readonly layoutManager: TableLayoutManager<TData>;

    /**
     * @internal
     */
    @observable
    public firstSortedColumn?: TableColumn;

    /**
     * @internal
     */
    @observable
    public visibleColumns: TableColumn[] = [];

    /**
     * @internal
     * This value determines the size of the viewport area when a user has created horizontal scrollable
     * space through a column resize operation.
     */
    @observable
    public tableScrollableMinWidth = 0;

    @observable
    public documentShiftKeyDown = false;

    private readonly table: TanStackTable<InternalTableRecord<TData>>;
    private _data: InternalTableRecord<TData>[] = [];
    private readonly _rowMetadata: Map<TableFieldValue, TableRowMetadata> = new Map<TableFieldValue, TableRowMetadata>();

    private options: TanStackTableOptionsResolved<InternalTableRecord<TData>>;
    private readonly tableValidator = new TableValidator();
    private readonly tableUpdateTracker = new TableUpdateTracker(this);
    private readonly selectionManager: InteractiveSelectionManager<TData>;
    private columnNotifiers: Notifier[] = [];
    private readonly layoutManagerNotifier: Notifier;
    private isInitialized = false;
    private isDataOrdered = false;
    private readonly collapsedRows = new Set<string>();
    // Programmatically updating the selection state of a checkbox fires the 'change' event.
    // Therefore, selection change events that occur due to programmatically updating
    // the selection checkbox 'checked' value should be ingored.
    // https://github.com/microsoft/fast/issues/5750
    private ignoreSelectionChangeEvents = false;

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            onRowSelectionChange: this.handleRowSelectionChange,
            onExpandedChange: this.handleExpandedChange,
            getCoreRowModel: tanStackGetCoreRowModel(),
            getSortedRowModel: tanStackGetSortedRowModel(),
            getGroupedRowModel: tanStackGetGroupedRowModel(),
            getExpandedRowModel: tanStackGetExpandedRowModel(),
            getIsRowExpanded: this.getIsRowExpanded,
            getSubRows: r => r.subRows,
            columns: [],
            state: {
                rowSelection: {},
                grouping: [],
                expanded: true // Workaround until we can apply a fix to TanStack regarding leveraging our getIsRowExpanded implementation
            },
            enableRowSelection: row => !row.getIsGrouped(),
            enableMultiRowSelection: false,
            enableSubRowSelection: false,
            enableSorting: true,
            enableGrouping: true,
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.virtualizer = new Virtualizer(this, this.table);
        this.layoutManager = new TableLayoutManager(this);
        this.layoutManagerNotifier = Observable.getNotifier(this.layoutManager);
        this.layoutManagerNotifier.subscribe(this, 'isColumnBeingSized');
        this.selectionManager = new InteractiveSelectionManager(
            this.table,
            this.selectionMode
        );
    }

    public async setData(newData: readonly TData[]): Promise<void> {
        await this.processPendingUpdates();
        this.trackFlatDataOrder(newData);
        const tanstackUpdates = this.processFlatData(newData);
        this.updateTableOptions(tanstackUpdates);
    }

    public async getSelectedRecordIds(): Promise<string[]> {
        await this.processPendingUpdates();

        return this.getCurrentSelectedRecordIds();
    }

    public async setSelectedRecordIds(recordIds: string[]): Promise<void> {
        await this.processPendingUpdates();

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
        this.initialize();
        this.virtualizer.connectedCallback();
        this.viewport.addEventListener('scroll', this.onViewPortScroll, {
            passive: true
        });
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.virtualizer.disconnectedCallback();
        this.viewport.removeEventListener('scroll', this.onViewPortScroll);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
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
        if (
            (source instanceof TableColumn
                || source instanceof ColumnInternals)
            && typeof args === 'string'
        ) {
            if (args === 'validConfiguration') {
                this.tableValidator.validateColumnConfigurations(this.columns);
            } else {
                this.tableUpdateTracker.trackColumnPropertyChanged(args);
            }
        } else if (
            source instanceof TableLayoutManager
            && args === 'isColumnBeingSized'
            && !this.layoutManager.isColumnBeingSized
        ) {
            // 'isColumnBeingSized' changing to 'false' indicates an interactive
            // column sizing operation has been completed
            this.emitColumnConfigurationChangeEvent();
        }
    }

    /** @internal */
    public onRowSelectionToggle(
        rowIndex: number,
        event: CustomEvent<TableRowSelectionToggleEventDetail>
    ): void {
        event.stopImmediatePropagation();

        const selectionChanged = this.selectionManager.handleRowSelectionToggle(
            this.tableData[rowIndex],
            event.detail.newState,
            this.documentShiftKeyDown
        );

        if (selectionChanged) {
            void this.emitSelectionChangeEvent();
        }
    }

    /** @internal */
    public onRowClick(rowIndex: number, event: MouseEvent): boolean {
        const selectionChanged = this.selectionManager.handleRowClick(
            this.tableData[rowIndex],
            event.shiftKey,
            event.ctrlKey || event.metaKey
        );

        if (selectionChanged) {
            void this.emitSelectionChangeEvent();
        }

        return true;
    }

    /** @internal */
    public onAllRowsSelectionChange(event: CustomEvent): void {
        event.stopPropagation();

        if (this.ignoreSelectionChangeEvents) {
            return;
        }

        this.table.toggleAllRowsSelected(this.selectionCheckbox!.checked);
        void this.emitSelectionChangeEvent();
    }

    /** @internal */
    public onRowActionMenuBeforeToggle(
        rowIndex: number,
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        event.stopImmediatePropagation();
        void this.handleActionMenuBeforeToggleEvent(rowIndex, event);
    }

    /** @internal */
    public onRowActionMenuToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): void {
        event.stopImmediatePropagation();
        void this.handleRowActionMenuToggleEvent(event);
    }

    /** @internal */
    public handleCollapseAllGroupRows(): void {
        this.collapsedRows.clear();
        this.table
            .getRowModel()
            .flatRows.filter(row => row.getIsGrouped())
            .forEach(row => this.collapsedRows.add(row.id));
        this.table.toggleAllRowsExpanded(false);
    }

    /** @internal */
    public onRightDividerMouseDown(
        event: MouseEvent,
        columnIndex: number
    ): void {
        if (event.button === 0) {
            this.layoutManager.beginColumnInteractiveSize(
                event.clientX,
                columnIndex * 2
            );
        }
    }

    /** @internal */
    public onLeftDividerMouseDown(
        event: MouseEvent,
        columnIndex: number
    ): void {
        if (event.button === 0) {
            this.layoutManager.beginColumnInteractiveSize(
                event.clientX,
                columnIndex * 2 - 1
            );
        }
    }

    /** @internal */
    public handleRowExpanded(rowIndex: number): void {
        this.toggleRowExpanded(rowIndex);
    }

    /**
     * @internal
     */
    public toggleColumnSort(
        column: TableColumn,
        allowMultiSort: boolean
    ): void {
        if (column.sortingDisabled) {
            return;
        }

        const allSortedColumns = this.getColumnsParticipatingInSorting().sort(
            (x, y) => x.columnInternals.currentSortIndex!
                - y.columnInternals.currentSortIndex!
        );

        const columnIndex = allSortedColumns.indexOf(column);
        const columnAlreadySorted = columnIndex > -1;

        const oldSortDirection = column.columnInternals.currentSortDirection;
        let newSortDirection: TableColumnSortDirection = TableColumnSortDirection.ascending;

        if (columnAlreadySorted) {
            if (oldSortDirection === TableColumnSortDirection.descending) {
                allSortedColumns.splice(columnIndex, 1);
                newSortDirection = TableColumnSortDirection.none;
                column.columnInternals.currentSortIndex = undefined;
            } else {
                newSortDirection = TableColumnSortDirection.descending;
            }
        } else {
            allSortedColumns.push(column);
        }
        column.columnInternals.currentSortDirection = newSortDirection;

        for (let i = 0; i < allSortedColumns.length; i++) {
            const currentColumn = allSortedColumns[i]!;
            if (allowMultiSort) {
                allSortedColumns[i]!.columnInternals.currentSortIndex = i;
            } else if (currentColumn === column) {
                currentColumn.columnInternals.currentSortIndex = 0;
            } else {
                currentColumn.columnInternals.currentSortIndex = undefined;
                currentColumn.columnInternals.currentSortDirection = TableColumnSortDirection.none;
            }
        }

        this.emitColumnConfigurationChangeEvent();
    }

    /**
     * @internal
     */
    public update(): void {
        this.validate();
        if (this.tableUpdateTracker.requiresTanStackUpdate) {
            this.updateTanStack();
        }

        if (this.tableUpdateTracker.updateActionMenuSlots) {
            this.updateActionMenuSlots();
        }

        if (this.tableUpdateTracker.updateColumnWidths) {
            this.rowGridColumns = this.layoutManager.getGridTemplateColumns();
            this.visibleColumns = this.columns.filter(
                column => !column.columnHidden
            );
        }

        if (this.tableUpdateTracker.updateGroupRows) {
            this.showCollapseAll = this.getColumnsParticipatingInGrouping().length > 0;
        }
    }

    public override get ariaMultiSelectable(): 'true' | 'false' | null {
        switch (this.selectionMode) {
            case TableRowSelectionMode.multiple:
                return 'true';
            case TableRowSelectionMode.single:
                return 'false';
            default:
                return null;
        }
    }

    /**
     * @internal
     */
    public getHeaderContainerElements(): NodeListOf<Element> {
        return this.columnHeadersContainer.querySelectorAll(
            '.header-container'
        );
    }

    /**
     * @internal
     */
    public processFlatData(
        data: readonly TData[]
    ): Partial<TanStackTableOptionsResolved<InternalTableRecord<TData>>> {
        this._data = this.convertFlatDataToHierarchy(data) ?? [];
        const tanStackUpdates: Partial<
        TanStackTableOptionsResolved<InternalTableRecord<TData>>
        > = {
            data: this._data
        };
        this.validateWithData(this._data);
        if (this.tableValidator.areRecordIdsValid()) {
            // Update the selection state to remove previously selected records that no longer exist in the
            // data set while maintaining the selection state of records that still exist in the data set.
            const previousSelection = this.getCurrentSelectedRecordIds();
            tanStackUpdates.state = {
                rowSelection:
                    this.calculateTanStackSelectionState(previousSelection)
            };
        }
        this.updateTableOptions(tanStackUpdates);
        return tanStackUpdates;
    }

    protected selectionModeChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.tableUpdateTracker.trackSelectionModeChanged();
    }

    protected idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.tableUpdateTracker.trackIdFieldNameChanged();
    }

    protected parentIdFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        if (
            !this.$fastController.isConnected
            || this.table.options.data === undefined
        ) {
            return;
        }

        this.tableUpdateTracker.trackParentIdFieldNameChanged();
    }

    protected columnsChanged(
        _prev: TableColumn[] | undefined,
        _next: TableColumn[]
    ): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.observeColumns();
        this.tableUpdateTracker.trackColumnInstancesChanged();
    }

    private convertFlatDataToHierarchy(
        flatData: readonly TData[]
    ): InternalTableRecord<TData>[] {
        let hierarchicalData: InternalTableRecord<TData>[];
        if (this.idFieldName && this.parentIdFieldName) {
            try {
                // The call to arrayToTree will perform a deep copy of the data, but it does allow a
                // configuration that will do shallow copies, and thus it's signature doesn't support
                // immutable arrays. Thus, we need to cast to a mutable type.
                const data = flatData as TData[];
                hierarchicalData = arrayToTree(data, {
                    childrenField: 'subRows',
                    id: this.idFieldName,
                    parentId: this.parentIdFieldName,
                    nestedIds: false,
                    throwIfOrphans: true
                }) as unknown as InternalTableRecord<TData>[];
                this.isDataOrdered = false;
            } catch {
                this.tableValidator.setInvalidParentIdConfiguration(false);
                this.isDataOrdered = true;
                return flatData.map(record => {
                    return { data: { ...record } };
                });
            }
        } else {
            this.isDataOrdered = true;
            hierarchicalData = flatData.map(record => {
                return { data: { ...record } };
            });
        }

        this.tableValidator.setInvalidParentIdConfiguration(true);
        return hierarchicalData;
    }

    private getCurrentSelectedRecordIds(): string[] {
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

    private trackFlatDataOrder(data: readonly TData[]): void {
        if (this.idFieldName) {
            for (let i = 0; i < data.length; i++) {
                this._rowMetadata.set(data[i]![this.idFieldName], {
                    originalIndex: i
                });
            }
        }
    }

    private convertHierarchicalDataToFlatList(): TData[] {
        const flatData: TData[] = [];
        const tanstackData = this.table.options.data;
        tanstackData.forEach(record => {
            this.convertRecordToFlatList(record, flatData);
        });
        if (this.idFieldName && !this.isDataOrdered) {
            flatData.sort((a, b) => {
                const leftRecordIndex = this._rowMetadata.get(
                    a[this.idFieldName!]
                )!.originalIndex;
                const rightRecordIndex = this._rowMetadata.get(
                    b[this.idFieldName!]
                )!.originalIndex;

                if (leftRecordIndex < rightRecordIndex) {
                    return -1;
                }

                if (leftRecordIndex > rightRecordIndex) {
                    return 1;
                }

                return 0;
            });
        }

        return flatData;
    }

    private convertRecordToFlatList(
        record: InternalTableRecord<TData>,
        flatData: TData[]
    ): void {
        flatData.push(record.data);
        record.subRows?.forEach(subRow => {
            this.convertRecordToFlatList(subRow, flatData);
        });
    }

    private async handleActionMenuBeforeToggleEvent(
        rowIndex: number,
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): Promise<void> {
        const selectionChanged = this.selectionManager.handleActionMenuOpening(
            this.tableData[rowIndex]
        );
        if (selectionChanged) {
            await this.emitSelectionChangeEvent();
        }

        this.openActionMenuRecordId = event.detail.recordIds[0];
        const detail = await this.getActionMenuToggleEventDetail(event);
        this.$emit('action-menu-beforetoggle', detail);
    }

    private async handleRowActionMenuToggleEvent(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): Promise<void> {
        const detail = await this.getActionMenuToggleEventDetail(event);
        this.$emit('action-menu-toggle', detail);
        if (!event.detail.newState) {
            this.openActionMenuRecordId = undefined;
        }
    }

    private async getActionMenuToggleEventDetail(
        originalEvent: CustomEvent<TableActionMenuToggleEventDetail>
    ): Promise<TableActionMenuToggleEventDetail> {
        const recordIds = this.selectionMode === TableRowSelectionMode.multiple
            ? await this.getSelectedRecordIds()
            : [this.openActionMenuRecordId!];
        return {
            ...originalEvent.detail,
            recordIds
        };
    }

    private readonly onViewPortScroll = (event: Event): void => {
        this.scrollX = (event.target as HTMLElement).scrollLeft;
    };

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === keyShift) {
            this.documentShiftKeyDown = true;
        }
    };

    private readonly onKeyUp = (event: KeyboardEvent): void => {
        if (event.key === keyShift) {
            this.documentShiftKeyDown = false;
        }
    };

    private removeColumnObservers(): void {
        this.columnNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.columnNotifiers = [];
    }

    private initialize(): void {
        if (this.isInitialized) {
            // The table is already initialized. There is nothing more to do.
            return;
        }

        this.isInitialized = true;
        // Initialize the controller to ensure that FAST functionality such as Observables work as expected.
        this.$fastController.onConnectedCallback();
        this.tableUpdateTracker.trackAllStateChanged();
        this.observeColumns();
    }

    private async processPendingUpdates(): Promise<void> {
        this.initialize();
        await DOM.nextUpdate();

        if (this.tableUpdateTracker.hasPendingUpdates) {
            throw new Error('Expected pending updates to be resolved');
        }
    }

    private observeColumns(): void {
        this.removeColumnObservers();

        for (const column of this.columns) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
            this.columnNotifiers.push(notifier);
            const notifierInternals = Observable.getNotifier(
                column.columnInternals
            );
            notifierInternals.subscribe(this);
            this.columnNotifiers.push(notifierInternals);
        }
    }

    private getColumnsParticipatingInSorting(): TableColumn[] {
        return this.columns.filter(
            x => !x.sortingDisabled
                && x.columnInternals.currentSortDirection
                    !== TableColumnSortDirection.none
                && typeof x.columnInternals.currentSortIndex === 'number'
        );
    }

    private getColumnsParticipatingInGrouping(): TableColumn[] {
        return this.columns.filter(
            x => !x.columnInternals.groupingDisabled
                && typeof x.columnInternals.groupIndex === 'number'
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
        const updatedOptions: Partial<
        TanStackTableOptionsResolved<InternalTableRecord<TData>>
        > = {};
        updatedOptions.state = {};

        if (this.tableUpdateTracker.updateColumnSort) {
            updatedOptions.state.sorting = this.calculateTanStackSortState();
        }
        if (this.tableUpdateTracker.updateColumnDefinition) {
            updatedOptions.columns = this.calculateTanStackColumns();
        }
        if (this.tableUpdateTracker.updateRowIds) {
            updatedOptions.getRowId = this.calculateTanStackRowIdFunction();
            updatedOptions.state.rowSelection = {};
            this.selectionManager.handleSelectionReset();
        }
        if (this.tableUpdateTracker.updateRowParentIds) {
            const flatList = this.convertHierarchicalDataToFlatList();
            const tanstackUpdates = this.processFlatData(flatList);
            updatedOptions.data = tanstackUpdates.data;
        }
        if (this.tableUpdateTracker.updateSelectionMode) {
            updatedOptions.enableMultiRowSelection = this.selectionMode === TableRowSelectionMode.multiple;
            updatedOptions.enableSubRowSelection = this.selectionMode === TableRowSelectionMode.multiple;
            updatedOptions.state.rowSelection = {};
            this.selectionManager.handleSelectionModeChanged(
                this.selectionMode
            );
        }
        if (
            this.tableUpdateTracker.requiresTanStackDataReset
            && !this.tableUpdateTracker.updateRowParentIds
        ) {
            if (!this.parentIdFieldName) {
                // Perform a shallow copy of the data to trigger tanstack to regenerate the row models and columns.
                updatedOptions.data = [...this.table.options.data];
            } else {
                const flatList = this.convertHierarchicalDataToFlatList();
                this.trackFlatDataOrder(flatList);
                const tanstackUpdates = this.processFlatData(flatList);
                updatedOptions.data = tanstackUpdates.data;
            }
        }
        if (this.tableUpdateTracker.updateGroupRows) {
            updatedOptions.state.grouping = this.calculateTanStackGroupingState();
            updatedOptions.state.expanded = true;
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

    private validate(): void {
        this.tableValidator.validateSelectionMode(
            this.selectionMode,
            this.idFieldName
        );
        this.tableValidator.validateColumnIds(
            this.columns.map(x => x.columnId)
        );
        this.tableValidator.validateColumnSortIndices(
            this.getColumnsParticipatingInSorting().map(
                x => x.columnInternals.currentSortIndex!
            )
        );
        this.tableValidator.validateColumnGroupIndices(
            this.getColumnsParticipatingInGrouping().map(
                x => x.columnInternals.groupIndex!
            )
        );
        this.tableValidator.validateColumnConfigurations(this.columns);
        this.validateWithData(this.table.options.data);
    }

    private validateWithData(data: InternalTableRecord[]): void {
        this.tableValidator.validateRecordIds(
            data,
            this.idFieldName,
            this.parentIdFieldName
        );
        this.canRenderRows = this.checkValidity();
    }

    private emitColumnConfigurationChangeEvent(): void {
        const detail: TableColumnConfigurationChangeEventDetail = {
            columns: this.columns.map(column => ({
                columnId: column.columnId,
                sortIndex: column.columnInternals.currentSortIndex ?? undefined,
                sortDirection: column.columnInternals.currentSortDirection,
                groupIndex: column.columnInternals.groupIndex,
                hidden: column.columnHidden,
                fractionalWidth: column.columnInternals.currentFractionalWidth,
                pixelWidth: column.columnInternals.currentPixelWidth
            }))
        };
        this.$emit('column-configuration-change', detail);
    }

    private async emitSelectionChangeEvent(): Promise<void> {
        const detail: TableRowSelectionEventDetail = {
            selectedRecordIds: await this.getSelectedRecordIds()
        };

        this.$emit('selection-change', detail);
    }

    private selectionStateChanged(): void {
        this.setSelectionCheckboxState();
    }

    private selectionCheckboxChanged(): void {
        this.setSelectionCheckboxState();
    }

    private setSelectionCheckboxState(): void {
        if (this.selectionCheckbox) {
            this.ignoreSelectionChangeEvents = true;
            this.selectionCheckbox.checked = this.selectionState === TableRowSelectionState.selected;
            this.selectionCheckbox.indeterminate = this.selectionState
                === TableRowSelectionState.partiallySelected;
            this.ignoreSelectionChangeEvents = false;
        }
    }

    private refreshRows(): void {
        this.selectionState = this.getTableSelectionState();

        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const isGrouped = row.getIsGrouped();
            const hasParentRow = !isGrouped ? row.getParentRow() : false;
            const rowState: TableRowState<TData> = {
                record: row.original.data,
                id: row.id,
                selectionState: this.getRowSelectionState(row),
                isGrouped,
                isExpanded: row.getIsExpanded(),
                isParent: this.parentIdFieldName
                    ? row.original.subRows !== undefined
                      && row.original.subRows.length > 0
                    : false,
                isTopLevelRow: !isGrouped && !hasParentRow && row.depth === 0,
                groupRowValue: isGrouped
                    ? row.getValue(row.groupingColumnId!)
                    : undefined,
                nestingLevel: row.depth,
                immediateChildCount: row.subRows.length,
                groupColumn: this.getGroupRowColumn(row)
            };
            return rowState;
        });
        this.virtualizer.dataChanged();
    }

    private getTableSelectionState(): TableRowSelectionState {
        if (this.table.getIsAllRowsSelected()) {
            return TableRowSelectionState.selected;
        }
        if (this.table.getIsSomeRowsSelected()) {
            return TableRowSelectionState.partiallySelected;
        }
        return TableRowSelectionState.notSelected;
    }

    private getRowSelectionState(
        row: TanStackRow<InternalTableRecord<TData>>
    ): TableRowSelectionState {
        if (row.getIsGrouped()) {
            return this.getGroupedRowSelectionState(row);
        }

        return row.getIsSelected()
            ? TableRowSelectionState.selected
            : TableRowSelectionState.notSelected;
    }

    private getGroupedRowSelectionState(
        groupedRow: TanStackRow<InternalTableRecord<TData>>
    ): TableRowSelectionState {
        const leafRows = groupedRow.getLeafRows() ?? [];
        let foundSelectedRow = false;
        let foundNotSelectedRow = false;
        for (const row of leafRows) {
            if (row.getIsGrouped()) {
                const subGroupRowSelectionState = this.getGroupedRowSelectionState(row);
                switch (subGroupRowSelectionState) {
                    case TableRowSelectionState.notSelected:
                        foundNotSelectedRow = true;
                        break;
                    case TableRowSelectionState.selected:
                        foundSelectedRow = true;
                        break;
                    default:
                        return TableRowSelectionState.partiallySelected;
                }
            } else if (row.getIsSelected()) {
                foundSelectedRow = true;
            } else {
                foundNotSelectedRow = true;
            }

            if (foundSelectedRow && foundNotSelectedRow) {
                return TableRowSelectionState.partiallySelected;
            }
        }

        return foundSelectedRow
            ? TableRowSelectionState.selected
            : TableRowSelectionState.notSelected;
    }

    private getGroupRowColumn(
        row: TanStackRow<InternalTableRecord<TData>>
    ): TableColumn | undefined {
        const groupedId = row.groupingColumnId;
        if (groupedId !== undefined) {
            return this.columns.find(
                c => c.columnInternals.uniqueId === groupedId
            );
        }

        return undefined;
    }

    private updateTableOptions(
        updatedOptions: Partial<
        TanStackTableOptionsResolved<InternalTableRecord<TData>>
        >
    ): void {
        this.options = {
            ...this.options,
            ...updatedOptions,
            state: { ...this.options.state, ...updatedOptions.state }
        };
        this.table.setOptions(this.options);
        this.refreshRows();
    }

    private readonly getIsRowExpanded = (
        row: TanStackRow<InternalTableRecord<TData>>
    ): boolean => {
        const isGroupRow = row.getIsGrouped();
        if (!isGroupRow && !row.subRows.length) {
            return false;
        }

        const expandedState = this.table.options.state.expanded;
        if (expandedState === true && isGroupRow) {
            return true;
        }

        if (Object.keys(expandedState ?? {}).includes(row.id)) {
            return true;
        }

        return isGroupRow ? !this.collapsedRows.has(row.id) : false;
    };

    private readonly handleRowSelectionChange: TanStackOnChangeFn<TanStackRowSelectionState> = (updaterOrValue: TanStackUpdater<TanStackRowSelectionState>): void => {
        const rowSelectionState = updaterOrValue instanceof Function
            ? updaterOrValue(this.table.getState().rowSelection)
            : updaterOrValue;

        this.updateTableOptions({
            state: {
                rowSelection: rowSelectionState
            }
        });
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

    private toggleRowExpanded(rowIndex: number): void {
        const rows = this.table.getRowModel().rows;
        const row = rows[rowIndex]!;
        const wasExpanded = row.getIsExpanded();
        if (this.table.options.state.expanded === true) {
            // if expanded is set to "true" this means that the table is in a default state
            // so we need to go through each row and determine if it is really expanded or
            // collapsed and update our internal state to match
            this.updateExpandedStateToDefault();
        }
        // must update the collapsedRows before toggling expanded state
        if (wasExpanded) {
            this.collapsedRows.add(row.id);
        } else {
            this.collapsedRows.delete(row.id);
        }
        row.toggleExpanded();
        if (row instanceof TableRow) {
            this.$emit('rowExpanded');
        }
    }

    private calculateTanStackSortState(): TanStackSortingState {
        const sortedColumns = this.getColumnsParticipatingInSorting().sort(
            (x, y) => x.columnInternals.currentSortIndex!
                - y.columnInternals.currentSortIndex!
        );
        this.firstSortedColumn = sortedColumns.length
            ? sortedColumns[0]
            : undefined;

        return sortedColumns.map(column => {
            return {
                id: column.columnInternals.uniqueId,
                desc:
                    column.columnInternals.currentSortDirection
                    === TableColumnSortDirection.descending
            };
        });
    }

    private calculateTanStackGroupingState(): TanStackGroupingState {
        const groupedColumns = this.getColumnsParticipatingInGrouping().sort(
            (x, y) => x.columnInternals.groupIndex! - y.columnInternals.groupIndex!
        );

        return groupedColumns.map(column => column.columnInternals.uniqueId);
    }

    private calculateTanStackRowIdFunction():
    | ((
        originalRow: InternalTableRecord<TData>,
        index: number,
        parent?: TanStackRow<InternalTableRecord<TData>>
    ) => string)
    | undefined {
        return this.idFieldName === null || this.idFieldName === undefined
            ? undefined
            : (record: InternalTableRecord<TData>) => record.data[this.idFieldName!] as string;
    }

    private calculateTanStackColumns(): TanStackColumnDef<
    InternalTableRecord<TData>
    >[] {
        return this.columns.map(column => {
            return {
                id: column.columnInternals.uniqueId,
                accessorFn: (
                    data: InternalTableRecord<TData>
                ): TableFieldValue => {
                    const fieldName = column.columnInternals.operandDataRecordFieldName;
                    if (typeof fieldName !== 'string') {
                        return undefined;
                    }
                    return data.data[fieldName];
                },
                sortingFn: getTanStackSortingFunction(
                    column.columnInternals.sortOperation
                ),
                sortUndefined: false
            };
        });
    }

    private calculateTanStackSelectionState(
        recordIdsToSelect: string[]
    ): TanStackRowSelectionState {
        if (this.selectionMode === TableRowSelectionMode.none) {
            return {};
        }

        const tanstackSelectionState: TanStackRowSelectionState = {};
        const selectableRecordIds = this.tableValidator.getPresentRecordIds(recordIdsToSelect);
        for (const recordId of selectableRecordIds) {
            tanstackSelectionState[recordId] = true;

            if (this.selectionMode === TableRowSelectionMode.single) {
                // In single selection mode, only select the first record ID that is requested
                break;
            }
        }

        return tanstackSelectionState;
    }

    private updateExpandedStateToDefault(): void {
        const expandedState: { [key: string]: boolean } = {};
        const allRows = this.table.getGroupedRowModel().flatRows;
        for (const tanstackRow of allRows) {
            if (tanstackRow.getIsGrouped()) {
                expandedState[tanstackRow.id] = true;
            }
        }

        this.updateTableOptions({
            state: {
                expanded: expandedState
            }
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
