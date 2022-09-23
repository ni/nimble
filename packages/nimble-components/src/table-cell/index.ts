import { attr, HTMLView, Observable, observable, ViewTemplate, defaultExecutionContext } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { dataGridCellTemplate } from './template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell': TableCell;
    }
}

/**
 * rdfg
 */
export class TableCell extends FoundationElement {
    /**
     * The column index of the cell.
     * This will be applied to the css grid-column-index value
     * applied to the cell
     *
     * @public
     * @remarks
     * HTML Attribute: grid-column
     */
    @attr({ attribute: 'grid-column' })
    public gridColumn?: string;

    public get cellData(): unknown {
        Observable.track(this, 'cellData');
        return this._cellData;
    }

    public set cellData(value: unknown) {
        this._cellData = value;
        Observable.notify(this, 'cellData');
        this.updateCellView();
    }

    @observable
    public cellItemTemplate?: ViewTemplate;

    private _cellData: unknown = null;
    private customCellView: HTMLView | undefined = undefined;

    public constructor() {
        super();
    }

    public override disconnectedCallback(): void {
        this.disconnectCellView();
    }

    private updateCellView(): void {
        this.disconnectCellView();
        this.customCellView = this.cellItemTemplate?.create(this);
        this.customCellView?.bind(this, defaultExecutionContext);
        this.customCellView?.appendTo(this.shadowRoot!);
    }

    private disconnectCellView(): void {
        if (this.customCellView !== null) {
            this.customCellView?.dispose();
            this.customCellView = undefined;
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template: dataGridCellTemplate(),
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
