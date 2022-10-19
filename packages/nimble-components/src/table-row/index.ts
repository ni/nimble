import { html, Observable, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { Cell, Row } from '@tanstack/table-core';
import type { Table } from '../table';
import type { TableCell } from '../table-cell';
import { template } from './template';

export interface TableRowData<TData> {
    row: Row<TData>;
    parent: Table;
    visibleCells?: Cell<unknown, unknown>[];
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}
/**
 *sdf
 */
export class TableRow<TData = unknown> extends FoundationElement {
    @observable
    public ready = false;

    public get rowData(): TableRowData<TData> {
        Observable.track(this, 'rowData');
        return this._rowData;
    }

    public set rowData(value: TableRowData<TData>) {
        this._rowData = value;
        this.visibleCells = this._rowData.row.getVisibleCells();
        Observable.notify(this, 'rowData');
        // this.renderCells();
    }

    public readonly rowContainer!: HTMLElement;

    @observable
    public visibleCells: Cell<TData, unknown>[] = [];

    private _rowData!: TableRowData<TData>;
    // private readonly _cellViews: TableCell[] = [];

    public constructor() {
        super();
        this.ready = true;
    }

    // public override connectedCallback(): void {
    //     super.connectedCallback();
    //     if (this._cellViews.length === 0) {
    //         this.renderCells();
    //     } else {
    //         this.updateCellsData();
    //     }
    // }

    public getColumnTemplate(cell: Cell<unknown, unknown>): ViewTemplate | undefined {
        const columnId = cell.column.id;
        return this._rowData.parent.getColumnTemplateById(columnId);
    }

    public columnHasMenu(cell: Cell<unknown, unknown>): boolean {
        const columnId = cell.column.id;
        return this._rowData.parent.getColumnHasMenuById(columnId);
    }

    public onCellActionMenuOpen(cell: Cell<unknown, unknown>): void {
        const rowId = cell.row.id;
        this._rowData.parent.activeActionMenuRowId = rowId;
    }

    // private renderCells(): void {
    //     if (!this.isConnected) {
    //         return;
    //     }

    //     if (this._cellViews.length === 0) {
    //         this.visibleCells?.forEach((cell, i) => {
    //             cell.column.id
    //             const nimbleCellView = new TableCell();
    //             nimbleCellView.cellItemTemplate = this._rowData.parent.getColumnTemplate(i);
    //             nimbleCellView.cellData = cell.getValue();
    //             this.rowContainer.appendChild(nimbleCellView);

    //             this._cellViews.push(nimbleCellView);
    //         });
    //     } else {
    //         this.updateCellsData();
    //     }
    // }

    // private updateCellsData(): void {
    //     this.visibleCells?.forEach((cell, i) => {
    //         const cellView = this._cellViews[i];
    //         cellView!.cellData = cell.getValue();
    //     });
    // }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());