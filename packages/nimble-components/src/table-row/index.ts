import { Observable, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { PerspectiveViewerNimbleTable } from '../perspective-viewer-nimble-table';
import type { CellData } from '../table-cell';
import { template } from './template';

export interface VirtualTableRowData {
    data?: CellData[];
    parent: PerspectiveViewerNimbleTable;
    start: number;
    size: number;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

/**
 *sdf
 */
export class TableRow extends FoundationElement {
    @observable
    public ready = false;

    public get rowData(): VirtualTableRowData {
        Observable.track(this, 'rowData');
        return this._rowData;
    }

    public set rowData(value: VirtualTableRowData) {
        this._rowData = value;
        Observable.notify(this, 'rowData');
    }

    public readonly rowContainer!: HTMLElement;

    private _rowData!: VirtualTableRowData;

    public constructor() {
        super();
        this.ready = true;
    }

    public getColumnTemplateById(columnId: string): ViewTemplate | undefined {
        return this._rowData.parent.getColumnTemplateById(columnId);
    }

    // public columnHasMenu(cell: Cell<unknown, unknown>): boolean {
    //     const columnId = cell.column.id;
    //     return this._rowData.parent.getColumnHasMenuById(columnId);
    // }

    // public onCellActionMenuOpen(cell: Cell<unknown, unknown>): void {
    //     const rowId = cell.row.id;
    //     this._rowData.parent.activeActionMenuRowId = rowId;
    // }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());