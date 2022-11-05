import { Observable, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { TableCell } from '../table-cell';
import type { TableRowData } from '../table-row-data/table-row-data';
import { template } from './template';

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

    public get rowData(): TableRowData | undefined {
        Observable.track(this, 'rowData');
        return this._rowData;
    }

    public set rowData(value: TableRowData | undefined) {
        this._rowData = value;
        Observable.notify(this, 'rowData');
        if (this._rowData) {
            this.renderCells();
        }
    }

    public readonly rowContainer!: HTMLElement;

    private _rowData?: TableRowData;
    private readonly _cellViews: TableCell[] = [];

    public constructor() {
        super();
        this.ready = true;
    }

    public getColumnTemplateById(columnId: string): ViewTemplate | undefined {
        return this._rowData?.parent?.getColumnTemplateById(columnId);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this._cellViews.length === 0) {
            this.renderCells();
        } else {
            this.updateCellsData();
        }
    }

    private renderCells(): void {
        if (!this.isConnected) {
            return;
        }

        if (this._cellViews.length === 0 && this.rowData) {
            this.rowData.data?.forEach(cell => {
                const nimbleCellView = new TableCell();
                nimbleCellView.cellItemTemplate = this.getColumnTemplateById(cell.columnId);
                nimbleCellView.cellData = cell.value;
                this.rowContainer.appendChild(nimbleCellView);

                this._cellViews.push(nimbleCellView);
            });
        } else {
            this.updateCellsData();
        }
    }

    private updateCellsData(): void {
        this.rowData?.data?.forEach((cell, i) => {
            const cellView = this._cellViews[i];
            cellView!.cellData = cell.value;
        });
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