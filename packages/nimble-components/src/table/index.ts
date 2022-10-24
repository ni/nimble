/* eslint-disable @typescript-eslint/member-ordering */
import { defaultExecutionContext, DOM, ExecutionContext, html, HTMLView, Observable, observable, ViewTemplate, when } from '@microsoft/fast-element';
import { DataGridCell, DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef,
    TableState,
    Updater,
    Table as TanstackTable,
    createTable,
    getCoreRowModel,
    TableOptionsResolved,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    SortingState,
    SortDirection,
    GroupingState,
    Column,
    Row,
    ExpandedState
} from '@tanstack/table-core';
import { Virtualizer, VirtualizerOptions, elementScroll, observeElementOffset, observeElementRect, VirtualItem } from '@tanstack/virtual-core';
import { template } from './template';
import { styles } from './styles';
import type { TableCell } from '../table-cell';
import type { TableRowData, TableRow } from '../table-row';
import type { MenuButton } from '../menu-button';

import '../table-row';
import '../table-cell';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

export interface TableColumn {
    columnDataKey: string;
    gridColumn?: string;
    title?: string;
    headerCellTemplate?: ViewTemplate;
    headerCellInternalFocusQueue?: boolean;
    headerCellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
    cellTemplate?: ViewTemplate<TableCell, TableCell>;
    cellInternalFocusQueue?: boolean;
    cellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
    isRowHeader?: boolean;
    showMenu?: boolean;
}

export interface TableHeader {
    title: string;
    sortingState: SortDirection | false;
    column: Column<unknown>;
}

export interface ColumnSortState {
    id: string;
    sortDirection: SortDirection | undefined;
}

interface ObjectInterface {
    [key: string]: unknown;
}

/**
 * Table
 */
export class Table<TData = unknown> extends FoundationElement {
    public readonly rowContainer!: HTMLElement;
    public readonly viewport!: HTMLElement;
    public readonly tableContainer!: HTMLElement;
    public virtualizer?: Virtualizer;

    private readonly rowGroupTemplate = html<VirtualItem<Row<TData>>, Table>`
    <span class="group-row-content"
    style="
        height: ${x => x.size}px;
        position: absolute;
        width: calc(100% - ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row.depth || 0)}px);
        margin-top: ${x => x.start}px;
        padding-left: ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row.depth || 0)}px;
        ">
        <nimble-button
            appearance="ghost"
            content-hidden
            @click=${(x, c) => (c.parent as Table).tableData[x.index]?.row.toggleExpanded()}>
            ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
            `)}
            ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
            `)}
            Expand/Collapse
        </nimble-button>
        <!-- TODO: 'subrows' doesn't correctly account for sub groups. -->
        <span class="group-text">
            ${(x, c) => (c.parent as Table).tableData[x.index]?.row.groupingValue} (${(x, c) => (c.parent as Table).tableData[x.index]?.row.subRows.length})
        </span>
    </span>
    `;

    private readonly rowChildTemplate = html<VirtualItem<Row<TData>>, Table>`
    <span id=${(x, c) => `row-${c.parent.tableData[x.index]?.row.id || ''}`} class="foo"
    style="
        position: absolute;
        width: calc(100% - ${(x, c) => 16 * (c.parent.tableData[x.index]?.row?.depth || 0)}px);
        margin-top: ${x => x.start}px;
        padding-left: ${(x, c) => 16 * (c.parent.tableData[x.index]?.row?.depth || 0)}px;
        ">
        <span class="group-row-content" style="height: 32px">
        ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getCanExpand(), html<VirtualItem<Row<TData>>>`
            <nimble-button
                appearance="ghost"
                content-hidden
                @click=${(x, c) => (c.parent as Table).tableData[x.index]?.row.toggleExpanded()}>
                ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                    <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
                `)}
                ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                    <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
                `)}
                Expand/Collapse
            </nimble-button>
        `)}
        <nimble-table-row :rowData="${(x, c) => c.parent.tableData[x.index]}">
            <slot name="${(x, c) => (c.parent.isActiveRow(x.index) ? 'actionMenu' : 'zzz')}" slot="rowActionMenu"></slot>
        </nimble-table-row>                                
        </span>
        <div style="margin-left: 40px">
        ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded() && (c.parent as Table).rowTemplate !== undefined, html<VirtualItem<Row<TData>>>`
            ${(x, c) => (c.parent as Table).rowTemplate!(x.index)}
        `)}
        </div>
    </span>
    `;

    /** @internal */
    @observable
    public readonly slottedActionMenus: HTMLElement[] | undefined;

    private _activeActionMenuRowId = '';

    @observable
    public viewportReady = false;

    private readonly table: TanstackTable<TData>;
    private _data: TData[] = [];
    private _columns: TableColumn[] = [];
    private _rows: TableRowData<TData>[] = [];
    private _headers: TableHeader[] = [];
    private _options: TableOptionsResolved<TData>;
    private _sorting: SortingState = [];
    private _grouping: GroupingState = [];
    private _expanded: ExpandedState = {};
    private _tanstackcolumns: ColumnDef<TData>[] = [];
    private _visibleItems: VirtualItem<Row<TData>>[] = [];
    private readonly _renderedRows: { element: Element, view: HTMLView }[] = [];
    private _rowContainerHeight = 0;
    private _ready = false;
    private readonly _tableExecutionContext;
    private readonly _tableRowResizeCache = new Map<string, { top: number | undefined, height: number | undefined }>();
    // private _rowIdProperty = '';
    // private _rowHierarchyProperty = '';
    private readonly resizeObserver: ResizeObserver;
    private readonly tableRowResizeObserver: ResizeObserver;

    public rowTemplate?: (index: number) => ViewTemplate<unknown, Table<TData>>;

    public expandedDataAccessor?: () => unknown[];

    public constructor() {
        super();
        const data = this.data;
        const tanstackColumns = this._tanstackcolumns;
        const sorting = this._sorting;
        const grouping = this._grouping;
        const expanded = this._expanded;
        this._options = {
            get data(): TData[] {
                return data ?? [];
            },
            onStateChange: (_: Updater<TableState>) => { },
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getGroupedRowModel: getGroupedRowModel(),
            getExpandedRowModel: getExpandedRowModel(),
            getRowCanExpand: r => {
                // const castValue = r.original as { children: [], age: number };
                // return castValue.children?.length || castValue.age > 35;
                return true;
            },
            getSubRows: r => {
                const castValue = (r as unknown) as { children: [] };
                return castValue.children;
            },
            getRowId: r => {
                const castValue = (r as unknown) as { id: string };
                return castValue.id;
            },
            onSortingChange: this.setSorting,
            onGroupingChange: this.setGrouping,
            onExpandedChange: this.setExpanded,
            columns: tanstackColumns,
            state: {
                sorting,
                grouping,
                expanded
            },
            renderFallbackValue: null,
            enableGrouping: true,
            groupedColumnMode: false,
            autoResetAll: false
        };
        this._tableExecutionContext = new ExecutionContext<Table<TData>>();
        this._tableExecutionContext.parent = this;
        this.table = createTable(this._options);
        const nimbleTable = this;
        this.resizeObserver = new ResizeObserver(entries => {
            if (entries.map(entry => entry.target).includes(this.viewport)) {
                nimbleTable.initializeVirtualizer();
                nimbleTable.virtualizer!._willUpdate();
                nimbleTable.renderRows();
                this.resizeObserver.unobserve(this.viewport);
            }
        });

        this.tableRowResizeObserver = new ResizeObserver(entries => {
            const cachedRect = nimbleTable._tableRowResizeCache.get(entries[0]!.target.id);
            if (cachedRect && cachedRect.top === entries[0]?.contentRect.top && cachedRect.height === entries[0]?.contentRect.height) {
                return;
            }

            nimbleTable._tableRowResizeCache.clear();
            nimbleTable._tableRowResizeCache.set(entries[0]!.target.id, { top: entries[0]!.contentRect.top, height: entries[0]!.contentRect.height });
            nimbleTable.updateVirtualizer();
            // nimbleTable.tableRowResizeObserver.unobserve(entries[0]!.target);
            // nimbleTable.renderRows();
        });

        // this.columns = [{
        //     columnDataKey: 'firstName',
        //     title: 'First Name',
        //     cellTemplate: html<TableCell>`
        //         <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        //         </nimble-text-field>
        //     `,
        //     showMenu: true
        // },
        // {
        //     columnDataKey: 'lastName',
        //     title: 'Last Name',
        //     cellTemplate: html<TableCell, TableCell>`
        //     <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        //     </nimble-text-field>
        //     `,
        // }, {
        //     columnDataKey: 'age',
        //     title: 'Age',
        //     cellTemplate: html<TableCell, TableCell>`
        //     <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        //     </nimble-text-field>
        // `,
        // },
        // {
        //     columnDataKey: 'visits',
        //     title: 'Visits',
        //     cellTemplate: html<TableCell, TableCell>`
        //     <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        //     </nimble-text-field>
        // `,
        // },
        // {
        //     columnDataKey: 'status',
        //     title: 'Status',
        //     cellTemplate: html<TableCell, TableCell>`
        //     <nimble-select value=${x => x.cellData}>
        //         <nimble-list-option value="relationship">In Relationship</nimble-list-option>
        //         <nimble-list-option value="single">Single</nimble-list-option>
        //         <nimble-list-option value="complicated">Complicated</nimble-list-option>
        //     </nimble-select>
        // `,
        // },
        // {
        //     columnDataKey: 'progress',
        //     title: 'Progress',
        //     cellTemplate: html<TableCell, TableCell>`
        //     <nimble-number-field value=${x => x.cellData}>
        //     </nimble-number-field>
        //     `,
        // }];
    }

    private updateVirtualizer(): void {
        if (!this.virtualizer) {
            return;
        }
        this.virtualizer.getVirtualItems().forEach(x => {
            const rows = this.table.getRowModel().rows;
            const row = rows[x.index];
            const rowEl = this.shadowRoot?.querySelector(`#row-${row?.id || ''}`);
            x.measureElement(rowEl);
        });
        this.virtualizer.options.count = this.table.getRowModel().rows.length;
        this.rowContainerHeight = this.virtualizer.getTotalSize();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver.observe(this.viewport);
    }

    public override disconnectedCallback(): void {
        console.log('disconnected');
    }

    public get data(): TData[] {
        Observable.track(this, 'data');
        return this._data;
    }

    public set data(value: TData[]) {
        this._data = value;
        Observable.notify(this, 'data');
        this._options = { ...this._options, data: this.data };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
    }

    public get activeActionMenuRowId(): string {
        Observable.track(this, 'activeActionMenuRowId');
        return this._activeActionMenuRowId;
    }

    public set activeActionMenuRowId(value: string) {
        this._activeActionMenuRowId = value;
        Observable.notify(this, 'activeActionMenuRowId');
    }

    public isActiveRow(rowIndex: number): boolean {
        return this.tableData[rowIndex]?.row.id === this.activeActionMenuRowId;
    }

    public get columns(): TableColumn[] {
        return this._columns;
    }

    public set columns(value: TableColumn[]) {
        this._tanstackcolumns = [];
        this._columns = value;
        value.forEach(column => {
            const tanstackColumn: ColumnDef<TData> = {
                id: column.columnDataKey,
                accessorFn: (row: TData) => {
                    const keys = Object.keys((row as unknown) as ObjectInterface);
                    const valueIndex = keys.indexOf(column.columnDataKey);
                    return Object.values((row as unknown) as ObjectInterface)[valueIndex];
                },
                header: column.title,
                footer: info => info.column.id
            };
            this._tanstackcolumns.push(tanstackColumn);
        });
        this._options = { ...this._options, columns: this._tanstackcolumns };
        this.update(this.table.initialState);
        this.refreshRows();
        this.refreshHeaders();
        this.table.getColumn(this.columns[0]?.columnDataKey ?? '').toggleSorting();
        this.ready = true;
    }

    public get ready(): boolean {
        Observable.track(this, 'ready');
        return this._ready;
    }

    public set ready(value: boolean) {
        this._ready = value;
        Observable.notify(this, 'ready');
    }

    public get tableData(): TableRowData<TData>[] {
        Observable.track(this, 'tableData');
        return this._rows;
    }

    public set tableData(value: TableRowData<TData>[]) {
        this._rows = value;
        Observable.notify(this, 'tableData');
    }

    public get tableHeaders(): TableHeader[] {
        Observable.track(this, 'tableHeaders');
        return this._headers;
    }

    public set tableHeaders(value: TableHeader[]) {
        this._headers = value;
        Observable.notify(this, 'tableHeaders');
    }

    /**
     * @internal
     */
    public get visibleItems(): VirtualItem<Row<TData>>[] {
        Observable.track(this, 'visibleItems');
        return this._visibleItems;
    }

    public set visibleItems(value: VirtualItem<Row<TData>>[]) {
        this._visibleItems = value;
        Observable.notify(this, 'visibleItems');
    }

    public get rowContainerHeight(): number {
        Observable.track(this, 'rowContainerHeight');
        return this._rowContainerHeight;
    }

    public set rowContainerHeight(value: number) {
        this._rowContainerHeight = value;
        Observable.notify(this, 'rowContainerHeight');
    }

    public getColumnTemplate(index: number): ViewTemplate {
        const column = this.columns[index]!;
        return column.cellTemplate!;
    }

    public getColumnTemplateById(columnId: string): ViewTemplate | undefined {
        const column = this.columns.find(x => x.columnDataKey === columnId);
        return column?.cellTemplate;
    }

    public getColumnHasMenuById(columnId: string): boolean {
        const column = this.columns.find(x => x.columnDataKey === columnId);
        return column?.showMenu || false;
    }

    private readonly setSorting = (updater: unknown): void => {
        if (updater instanceof Function) {
            this._sorting = updater(this._sorting) as SortingState;
        } else {
            this._sorting = (updater as SortingState);
        }

        this._options.state = { ...this._options.state, sorting: this._sorting };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        this.refreshHeaders();
    };

    private readonly setGrouping = (updater: unknown): void => {
        if (updater instanceof Function) {
            this._grouping = updater(this._grouping) as GroupingState;
        } else {
            this._grouping = (updater as GroupingState);
        }

        this._options.state = { ...this._options.state, grouping: this._grouping };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        this.refreshHeaders();
    };

    private readonly setExpanded = (updater: unknown): void => {
        const originalExpandedIds = Object.keys(this._expanded);
        if (updater instanceof Function) {
            this._expanded = updater(this._expanded) as ExpandedState;
        } else {
            this._expanded = (updater as ExpandedState);
        }
        const updatedExpandedIds = Object.keys(this._expanded);

        this._options.state = { ...this._options.state, expanded: this._expanded };
        this.update({ ...this.table.initialState, sorting: this._sorting, grouping: this._grouping, expanded: this._expanded });
        this.refreshRows();
        this.refreshHeaders();

        const newlyCollapsedIds = originalExpandedIds.filter(x => !updatedExpandedIds.find(y => x === y));
        const newlyExpandedIds = updatedExpandedIds.filter(x => !originalExpandedIds.find(y => x === y));
        // for (const row of this._renderedRows) {
        //     this.tableRowResizeObserver.observe(row.element);
        // }

        for (const newCollapsedId of newlyCollapsedIds) {
            this.$emit('row-collapse', { id: newCollapsedId });
        }
        for (const newExpandedId of newlyExpandedIds) {
            this.$emit('row-expand', { id: newExpandedId });
        }
    };

    private initializeVirtualizer(): void {
        const nimbleTable = this;
        const virtualizerOptions = {
            count: this.data.length,
            getScrollElement: () => {
                return nimbleTable.viewport;
            },
            estimateSize: () => 32,
            enableSmoothScroll: true,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: (virtualizer: Virtualizer) => {
                // nimbleTable.visibleItems = virtualizer.getVirtualItems();
                nimbleTable.renderRows();
            }
        } as VirtualizerOptions;
        this.virtualizer = new Virtualizer(virtualizerOptions);
    }

    private renderRows(): void {
        const currentVisibleItems = this.visibleItems;

        this.visibleItems = this.virtualizer!.getVirtualItems();
        const scrollDown = currentVisibleItems.length > 0 && currentVisibleItems[0]!.index < this.visibleItems[0]!.index;
        const rowsToRecycleCount = currentVisibleItems?.map(item => item.index).filter(x => !this.visibleItems.map(item => item.index).includes(x)).length ?? 0;
        const newRowsToRender = this.visibleItems.filter(item => !currentVisibleItems.map(currentItem => currentItem.index).includes(item.index));
        const rowsToRecyle = this._renderedRows?.splice(0, rowsToRecycleCount) ?? [];
        if (newRowsToRender.length > 0) {
            for (let i = 0; i < newRowsToRender.length; i++) {
                if (i < rowsToRecycleCount) {
                    rowsToRecyle[i]!.view.bind(newRowsToRender[i], this._tableExecutionContext);
                } else if (newRowsToRender.length > 0 && this.tableData[newRowsToRender[i]!.index]?.row.getIsGrouped()) {
                    const groupElement = this.rowGroupTemplate.create(this);
                    groupElement.bind(newRowsToRender[i], this._tableExecutionContext);
                    groupElement.appendTo(this.rowContainer);
                    this._renderedRows.push({ element: this.rowContainer.children.item(this.rowContainer.children.length - 1)!, view: groupElement });
                } else {
                    const rowChild = this.rowChildTemplate.create(this);
                    rowChild.bind(newRowsToRender[i], this._tableExecutionContext);
                    rowChild.appendTo(this.rowContainer);
                    this._renderedRows.push({ element: this.rowContainer.children.item(this.rowContainer.children.length - 1)!, view: rowChild });
                    this.tableRowResizeObserver.observe(this.rowContainer.children.item(this.rowContainer.children.length - 1)!);
                }
            }
        } else {
            for (let i = 0; i < this._renderedRows.length && i < this.visibleItems.length; i++) {
                this.tableRowResizeObserver.unobserve(this._renderedRows[i]!.element);
                this._renderedRows[i]?.view.bind(this.visibleItems[i], this._tableExecutionContext);
            }

            DOM.queueUpdate(() => {
                for (const row of this._renderedRows) {
                    this.tableRowResizeObserver.observe(row.element);
                }
            });
        }
    }

    private refreshRows(): void {
        this.updateVirtualizer();
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const tableRow = { row, parent: this } as TableRowData<TData>;
            return tableRow;
        });
        DOM.queueUpdate(() => {
            this.updateVirtualizer();
        });
    }

    private refreshHeaders(): void {
        const headerGroups = this.table.getHeaderGroups();
        const headers = headerGroups.length > 0 ? headerGroups[0]?.headers : [];
        this.tableHeaders = headers!.map(header => {
            return ({
                title: this.columns.length > 0 ? this.columns[header.index]!.title : '',
                sortingState: header.column.getIsSorted(),
                column: header.column
            }) as TableHeader;
        });
    }

    private readonly update = (state: TableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this._options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function' ? updater(state) as TableState : updater as TableState;
                this.update(updatedState);
            },
        }));
    };
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
