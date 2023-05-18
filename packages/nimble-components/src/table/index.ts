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
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import {
    TableActionMenuToggleEventDetail,
    TableColumnConfigurationChangeEventDetail,
    TableColumnSortDirection,
    TableFieldValue,
    TableRecord,
    TableRowSelectionEventDetail,
    TableRowSelectionMode,
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail,
    TableRowState,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';
import { getTanStackSortingFunction } from './models/sort-operations';
import { UpdateTracker } from './models/update-tracker';
import { TableLayoutHelper } from './models/table-layout-helper';
import type { TableRow } from './components/row';
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

    /**
     * @internal
     */
    @observable
    public documentShiftKeyDown = false;

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableValidator = new TableValidator();
    private readonly updateTracker = new UpdateTracker(this);
    private readonly selectionManager: InteractiveSelectionManager<TData>;
    private columnNotifiers: Notifier[] = [];
    private isInitialized = false;
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
        this.selectionManager = new InteractiveSelectionManager(
            this.table,
            this.selectionMode
        );
    }

    public async setData(newData: readonly TData[]): Promise<void> {
        await this.processPendingUpdates();

        const data = newData.map(record => {
            return { ...record };
        });
        const tanStackUpdates: Partial<TanStackTableOptionsResolved<TData>> = {
            data
        };
        this.validateWithData(data);
        if (this.tableValidator.areRecordIdsValid()) {
            // Update the selection state to remove previously selected records that no longer exist in the
            // data set while maintaining the selection state of records that still exist in the data set.
            const previousSelection = await this.getSelectedRecordIds();
            tanStackUpdates.state = {
                rowSelection:
                    this.calculateTanStackSelectionState(previousSelection)
            };
        }
        this.updateTableOptions(tanStackUpdates);
    }

    public async getSelectedRecordIds(): Promise<string[]> {
        await this.processPendingUpdates();

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
            this.updateTracker.trackColumnPropertyChanged(args);
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
    public handleGroupRowExpanded(rowIndex: number, event: Event): void {
        this.toggleGroupExpanded(rowIndex);
        event.stopPropagation();
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
        if (this.updateTracker.requiresTanStackUpdate) {
            this.updateTanStack();
        }

        if (this.updateTracker.updateActionMenuSlots) {
            this.updateActionMenuSlots();
        }

        if (this.updateTracker.updateColumnWidths) {
            this.updateRowGridColumns();
        }

        if (this.updateTracker.updateGroupRows) {
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
        this.updateTracker.trackAllStateChanged();
        this.observeColumns();
    }

    private async processPendingUpdates(): Promise<void> {
        this.initialize();
        await DOM.nextUpdate();

        if (this.updateTracker.hasPendingUpdates) {
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
            this.columnNotifiers.push(notifier);
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
            this.selectionManager.handleSelectionReset();
        }
        if (this.updateTracker.updateSelectionMode) {
            updatedOptions.enableMultiRowSelection = this.selectionMode === TableRowSelectionMode.multiple;
            updatedOptions.enableSubRowSelection = this.selectionMode === TableRowSelectionMode.multiple;
            updatedOptions.state.rowSelection = {};
            this.selectionManager.handleSelectionModeChanged(
                this.selectionMode
            );
        }
        if (this.updateTracker.requiresTanStackDataReset) {
            // Perform a shallow copy of the data to trigger tanstack to regenerate the row models and columns.
            updatedOptions.data = [...this.table.options.data];
        }
        if (this.updateTracker.updateGroupRows) {
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

    private updateRowGridColumns(): void {
        this.rowGridColumns = TableLayoutHelper.getGridTemplateColumns(
            this.columns
        );
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
        this.validateWithData(this.table.options.data);
    }

    private validateWithData(data: TableRecord[]): void {
        this.tableValidator.validateRecordIds(data, this.idFieldName);
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
            const rowState: TableRowState<TData> = {
                record: row.original,
                id: row.id,
                selectionState: this.getRowSelectionState(row),
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
        row: TanStackRow<TData>
    ): TableRowSelectionState {
        if (row.getIsGrouped()) {
            return this.getGroupedRowSelectionState(row);
        }

        return row.getIsSelected()
            ? TableRowSelectionState.selected
            : TableRowSelectionState.notSelected;
    }

    private getGroupedRowSelectionState(
        groupedRow: TanStackRow<TData>
    ): TableRowSelectionState {
        const subRows = groupedRow.subRows ?? [];
        let foundSelectedRow = false;
        let foundNotSelectedRow = false;
        for (const row of subRows) {
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
        row: TanStackRow<TData>
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

    private toggleGroupExpanded(rowIndex: number): void {
        const row = this.table.getRowModel().rows[rowIndex]!;
        const wasExpanded = row.getIsExpanded();
        // must update the collapsedRows before toggling expanded state
        if (wasExpanded) {
            this.collapsedRows.add(row.id);
        } else {
            this.collapsedRows.delete(row.id);
        }
        row.toggleExpanded();
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
                id: column.columnInternals.uniqueId,
                accessorFn: (data: TData): TableFieldValue => {
                    const fieldName = column.columnInternals.operandDataRecordFieldName;
                    if (typeof fieldName !== 'string') {
                        return undefined;
                    }
                    return data[fieldName];
                },
                sortingFn: getTanStackSortingFunction(
                    column.columnInternals.sortOperation
                )
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
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
export const tableTag = DesignSystem.tagFor(Table);
