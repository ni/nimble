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
    TableColumnSortDirection,
    TableFieldValue,
    TableRecord,
    TableRowSelectionEventDetail,
    TableRowSelectionMode,
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail,
    TableValidity
} from './types';
import { Virtualizer } from './models/virtualizer';
import { getTanStackSortingFunction } from './models/sort-operations';
import { UpdateTracker } from './models/update-tracker';
import { TableLayoutHelper } from './models/table-layout-helper';
import type { TableRow } from './components/row';
import { ColumnInternals } from '../table-column/base/models/column-internals';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
    selectionState: TableRowSelectionState;
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
    private columnNotifiers: Notifier[] = [];
    private isInitialized = false;
    private readonly collapsedRows = new Set<string>();
    // Programmatically updating the selection state of a checkbox fires the 'change' event.
    // Therefore, selection change events that occur due to programmatically updating
    // the selection checkbox 'checked' value should be ingored.
    // https://github.com/microsoft/fast/issues/5750
    private ignoreSelectionChangeEvents = false;
    private shiftSelectStartRowId?: string;

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
    public async onRowSelectionToggle(
        rowIndex: number,
        event: CustomEvent<TableRowSelectionToggleEventDetail>
    ): Promise<void> {
        event.stopImmediatePropagation();

        if (this.selectionMode === TableRowSelectionMode.none) {
            return;
        }

        const isShiftSelect = this.documentShiftKeyDown
            && this.shiftSelectStartRowId !== undefined;
        if (isShiftSelect) {
            await this.selectRowsTo(rowIndex);
        } else {
            const rowState = this.tableData[rowIndex];
            this.shiftSelectStartRowId = rowState?.id;
            if (
                rowState?.isGrouped
                && rowState?.selectionState === TableRowSelectionState.selected
            ) {
                // Work around for https://github.com/TanStack/table/issues/4759
                // Manually deselect all leaf rows when a fully selected group is being deselected.
                this.deselectAllLeafRows(rowIndex);
            } else {
                this.table
                    .getRowModel()
                    .rows[rowIndex]?.toggleSelected(event.detail.newState);
            }
            await this.emitSelectionChangeEvent();
        }
    }

    /** @internal */
    public async onRowClick(
        rowIndex: number,
        event: MouseEvent
    ): Promise<void> {
        if (this.selectionMode === TableRowSelectionMode.none) {
            return;
        }

        const row = this.table.getRowModel().rows[rowIndex];
        if (!row) {
            return;
        }

        const isSingleRowSelection = this.selectionMode === TableRowSelectionMode.single
            || (!event.shiftKey && !event.ctrlKey)
            || (!event.ctrlKey
                && event.shiftKey
                && this.shiftSelectStartRowId === undefined);

        if (isSingleRowSelection) {
            this.shiftSelectStartRowId = row.id;
            await this.selectSingleRow(row);
        } else if (event.ctrlKey) {
            this.shiftSelectStartRowId = row.id;
            row.toggleSelected();
            await this.emitSelectionChangeEvent();
        } else if (event.shiftKey) {
            await this.selectRowsTo(rowIndex);
        }
    }

    /** @internal */
    public async onAllRowsSelectionChange(event: CustomEvent): Promise<void> {
        event.stopPropagation();

        if (this.ignoreSelectionChangeEvents) {
            return;
        }

        this.table.toggleAllRowsSelected(this.selectionCheckbox!.checked);
        await this.emitSelectionChangeEvent();
    }

    /** @internal */
    public async onRowActionMenuBeforeToggle(
        rowIndex: number,
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): Promise<void> {
        event.stopImmediatePropagation();

        let recordIds = event.detail.recordIds;
        if (this.selectionMode !== TableRowSelectionMode.none) {
            const row = this.table.getRowModel().rows[rowIndex];
            if (row && !row.getIsSelected()) {
                await this.selectSingleRow(row);
            } else {
                recordIds = await this.getSelectedRecordIds();
            }
        }

        this.openActionMenuRecordId = event.detail.recordIds[0];
        const detail: TableActionMenuToggleEventDetail = {
            ...event.detail,
            recordIds
        };
        this.$emit('action-menu-beforetoggle', detail);
    }

    /** @internal */
    public async onRowActionMenuToggle(
        event: CustomEvent<TableActionMenuToggleEventDetail>
    ): Promise<void> {
        event.stopImmediatePropagation();

        const recordIds = this.selectionMode === TableRowSelectionMode.multiple
            ? await this.getSelectedRecordIds()
            : event.detail.recordIds;
        const detail: TableActionMenuToggleEventDetail = {
            ...event.detail,
            recordIds
        };
        this.$emit('action-menu-toggle', detail);
        if (!event.detail.newState) {
            this.openActionMenuRecordId = undefined;
        }
    }

    /** @internal */
    public handleGroupRowExpanded(rowIndex: number, event: Event): void {
        this.toggleGroupExpanded(rowIndex);
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
            x => x.sortDirection !== TableColumnSortDirection.none
                && typeof x.sortIndex === 'number'
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
            this.shiftSelectStartRowId = undefined;
        }
        if (this.updateTracker.updateSelectionMode) {
            updatedOptions.enableMultiRowSelection = this.selectionMode === TableRowSelectionMode.multiple;
            updatedOptions.enableSubRowSelection = this.selectionMode === TableRowSelectionMode.multiple;
            updatedOptions.state.rowSelection = {};
            this.shiftSelectStartRowId = undefined;
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
            this.getColumnsParticipatingInSorting().map(x => x.sortIndex!)
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
                leafItemCount: this.getAllLeafRows(row).length,
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

    private async selectSingleRow(row: TanStackRow<TData>): Promise<void> {
        const currentSelection = await this.getSelectedRecordIds();
        if (currentSelection.length === 1 && currentSelection[0] === row.id) {
            // The clicked row is already the only selected row. Do nothing.
            return;
        }

        this.table.toggleAllRowsSelected(false);
        row.toggleSelected(true);
        await this.emitSelectionChangeEvent();
    }

    private getRowIndexRange(
        endRowIndex: number
    ): [number, number] {
        if (this.shiftSelectStartRowId === undefined) {
            return [endRowIndex, endRowIndex];
        }

        const startRow = this.table.getRowModel().rowsById[this.shiftSelectStartRowId];
        if (!startRow) {
            return [endRowIndex, endRowIndex];
        }

        const startRowIndex = startRow.index;
        const min = Math.min(startRowIndex, endRowIndex);
        const max = Math.max(startRowIndex, endRowIndex);
        return [min, max];
    }

    private async selectRowsTo(
        clickedRowIndex: number
    ): Promise<void> {
        const [startRowIndex, endRowIndex] = this.getRowIndexRange(
            clickedRowIndex
        );

        // Calling row.toggleSelected() on N number of rows can be very slow. Instead, create
        // the new selection state and only set it on TanStack once.
        const newSelection: TanStackRowSelectionState = {};
        for (let i = startRowIndex; i <= endRowIndex; i++) {
            const row = this.table.getRowModel().rows[i];
            if (!row) {
                continue;
            }

            // Do not modify the selection state of group rows because their selection state will
            // be determined by the selection state of all their leaf rows. However, if a group
            // row is the last in the range, all of its leaf rows should be selected.
            if (!row.getIsGrouped()) {
                newSelection[row.id] = true;
            } else if (i === endRowIndex) {
                // If the selection is explicitly ending on a group row, select all of its leaf rows.
                const leafRowIds = this.getAllLeafRows(row).map(x => x.id);
                for (const id of leafRowIds) {
                    newSelection[id] = true;
                }
            }
        }
        this.updateTableOptions({ state: { rowSelection: newSelection } });
        await this.emitSelectionChangeEvent();
    }

    private deselectAllLeafRows(rowIndex: number): void {
        const groupRow = this.table.getRowModel().rows[rowIndex]!;
        const leafRowIds = this.getAllLeafRows(groupRow).map(x => x.id);

        const selectionState = this.table.getState().rowSelection;
        for (const id of leafRowIds) {
            delete selectionState[id];
        }

        this.updateTableOptions({
            state: {
                rowSelection: selectionState
            }
        });
    }

    private getAllLeafRows(groupRow: TanStackRow<TData>): TanStackRow<TData>[] {
        return groupRow
            .getLeafRows()
            .filter(leafRow => leafRow.getLeafRows().length === 0);
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
            (x, y) => x.sortIndex! - y.sortIndex!
        );
        this.firstSortedColumn = sortedColumns.length
            ? sortedColumns[0]
            : undefined;

        return sortedColumns.map(column => {
            return {
                id: column.columnInternals.uniqueId,
                desc:
                    column.sortDirection === TableColumnSortDirection.descending
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
