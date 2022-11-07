/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import type { View } from '@finos/perspective';
import type { IPerspectiveViewerPlugin } from '@finos/perspective-viewer';
import { observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Virtualizer, VirtualizerOptions, elementScroll, observeElementOffset, observeElementRect, VirtualItem } from '@tanstack/virtual-core';
import type { MenuButton } from '../menu-button';
import type { Table } from '../table';
import type { CellData } from '../table-cell';
import type { TableColumn } from '../table-column/table-column';
import type { TableRow } from '../table-row';
import { TableRowData } from '../table-row-data/table-row-data';
import { VirtualTableRowData } from '../table-row-data/virtual-table-row-data';

import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'perspective-viewer-nimble-table': PerspectiveViewerNimbleTable;
    }
}

interface ObjectInterface {
    [key: string]: unknown;
}

/**
 * A nimble-based perspctive plugin for a table
 */
export class PerspectiveViewerNimbleTable
    extends FoundationElement
    implements IPerspectiveViewerPlugin {
    public readonly name = 'NimbleTablePlugin';
    public readonly rowContainer!: HTMLElement;
    public readonly viewport!: HTMLElement;
    public readonly tableContainer!: HTMLElement;
    public virtualizer?: Virtualizer;

    @observable
    public content = '';

    /** @internal */
    @observable
    public readonly slottedActionMenus: HTMLElement[] | undefined;

    @observable
    public visibleItems: VirtualItem<TableRow>[] = [];

    // Why can't I call this "rowData"?!?!
    @observable
    public rowData1: VirtualTableRowData[] = [];

    @observable
    public columns: TableColumn[] = [];

    @observable
    public rowContainerHeight = 0;

    private _actionMenuClone: Node | undefined;
    private _rowData?: Record<string, string | number | boolean | Date>[];
    private _numRows = 0;
    private _currentView?: View;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeVirtualizer();
        const table = ((this.parentElement!.getRootNode()! as ShadowRoot).host) as Table;
        const columns: TableColumn[] = [];
        for (const columnProvider of table.slottedColumns) {
            if (this.isColumnProvider(columnProvider)) {
                const tableColumn = { columnDataKey: columnProvider.columnId, title: columnProvider.columnTitle, cellTemplate: columnProvider.getColumnTemplate() } as TableColumn;
                columns.push(tableColumn);
            }
        }

        this.columns = columns;
    }

    public slottedActionMenusChanged(
        _prev: HTMLElement[] | undefined,
        _next: HTMLElement[] | undefined
    ): void {
        if (this.slottedActionMenus?.length) {
            this._actionMenuClone = this.slottedActionMenus[0]?.cloneNode(true);
        } else {
            this._actionMenuClone = undefined;
        }
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style, @typescript-eslint/naming-convention, camelcase
    public get select_mode(): 'select' | 'toggle' {
        return 'select';
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    public get min_config_columns(): number | undefined {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    public get config_column_names(): string[] | undefined {
        return undefined;
    }

    public async update(view: View): Promise<void> {
        return this.draw(view);
    }

    public async draw(view: View): Promise<void> {
        this._currentView = view;
        const numRows = await view.num_rows();
        if (numRows !== this._numRows) {
            this._numRows = numRows;
            if (!this.virtualizer) {
                this.initializeVirtualizer();
            } else {
                this.virtualizer.options.count = numRows;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
                (this.virtualizer as any).calculateRange();
                this.virtualizer.measure();
            }
        }
        this.rowContainerHeight = this.virtualizer!.getTotalSize();
    }

    public async clear(): Promise<void> {
        this.content = '';
    }

    public async resize(): Promise<void> {
        // Not Implemented
    }

    public async restyle(): Promise<void> {
        // Not Implemented
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async save(): Promise<any> {
        // Not Implemented
    }

    public async restore(): Promise<void> {
        // Not Implemented
    }

    public async delete(): Promise<void> {
        // Not Implemented
    }

    // public getColumnTemplate(index: number): ViewTemplate {
    //     const column = this.columns[index]!;
    //     return column.cellTemplate!;
    // }

    public getColumnTemplateById(columnId: string): ViewTemplate | undefined {
        const column = this.columns.find(x => x.columnDataKey === columnId);
        return column?.cellTemplate;
    }

    // public getColumnHasMenuById(columnId: string): boolean {
    //     const column = this.columns.find(x => x.columnDataKey === columnId);
    //     return column?.showMenu || false;
    // }

    public onMenuOpenChange(_rowData: VirtualTableRowData, event: CustomEvent): void {
        // debugger;
        if (!this._actionMenuClone) {
            return;
        }

        const menuButton = (event.target as MenuButton);
        if (!menuButton) {
            return;
        }

        if (menuButton.open) {
            menuButton.appendChild(this._actionMenuClone);
        } else {
            menuButton.removeChild(this._actionMenuClone);
        }
    }

    private initializeVirtualizer(): void {
        const nimbleTable = this;
        const virtualizerOptions = {
            count: this._numRows,
            getScrollElement: () => {
                return nimbleTable.viewport;
            },
            estimateSize: (_: number) => {
                return 32;
            },
            enableSmoothScroll: true,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: (virtualizer: Virtualizer) => {
                nimbleTable.visibleItems = virtualizer.getVirtualItems();
                if (nimbleTable.visibleItems.length > 0) {
                    const startRow = nimbleTable.visibleItems[0]!.index;
                    const endRow = nimbleTable.visibleItems[nimbleTable.visibleItems.length - 1]!.index;
                    this.setVisibleRowData();
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/naming-convention
                    const promise = nimbleTable._currentView!.to_json({ start_row: startRow, end_row: endRow });
                    void promise.then(result => {
                        nimbleTable._rowData = result;
                        if (nimbleTable.rowData1.length !== result.length) {
                            nimbleTable.setVisibleRowData();
                        }
                        nimbleTable.updateVisibleRowData();
                    });
                }
            }
        } as VirtualizerOptions;
        this.virtualizer = new Virtualizer(virtualizerOptions);
        this.virtualizer._willUpdate();
    }

    private isColumnProvider(object: unknown): boolean {
        return 'columnId' in (object as ObjectInterface) && 'getColumnTemplate' in (object as ObjectInterface);
    }

    private setVisibleRowData(): void {
        const tableRowData: VirtualTableRowData[] = [];
        const rowCount = Math.min(this.visibleItems.length, (this._rowData?.length ?? 0));
        for (let i = 0; i < rowCount; i++) {
            const visibleItem = this.visibleItems[i];
            const virtualRowData = new VirtualTableRowData();
            virtualRowData.start = visibleItem!.start;
            virtualRowData.size = visibleItem!.size;
            tableRowData.push(virtualRowData);
        }

        this.rowData1 = tableRowData;
    }

    private updateVisibleRowData(): void {
        const rowCount = Math.min(this.visibleItems.length, (this._rowData?.length ?? 0));
        const columnIds = rowCount > 0 ? Object.keys(this._rowData![0] as any) : [];
        for (let i = 0; i < rowCount; i++) {
            const rowData = Object.values(this._rowData![i] as any);
            const rowCellData = rowData.map((v, index) => ({ value: v, columnId: columnIds[index] } as CellData));
            const tableRowData = new TableRowData();
            tableRowData.parent = this;
            tableRowData.data = rowCellData;
            this.rowData1[i]!.rowData = tableRowData;
        }
    }
}

const perspectiveViewerNimbleTable = PerspectiveViewerNimbleTable.compose({
    baseName: 'perspective-viewer-nimble-table',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(perspectiveViewerNimbleTable());

void (async () => {
    await customElements.whenDefined('perspective-viewer');
    const viewerClass = customElements.get('perspective-viewer');
    const promise = viewerClass.registerPlugin(
        'nimble-perspective-viewer-nimble-table'
    );
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const result = await promise;
    return result;
})();
