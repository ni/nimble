import { attr, HTMLView, Observable, observable, ViewTemplate, defaultExecutionContext, html } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';

const spanTemplate = html<TableCell>`
    <span>${x => x.cellData}</span>
`;

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

    public override connectedCallback(): void {
        this.updateCellView();
    }

    public override disconnectedCallback(): void {
        this.disconnectCellView();
    }

    private updateCellView(): void {
        // this.disconnectCellView();
        const newCellView = this.customCellView === undefined;
        if (newCellView) {
            this.customCellView = this.cellItemTemplate!.create(this);
            this.customCellView?.bind(this, defaultExecutionContext);
        }

        if (newCellView) {
            this.customCellView!.appendTo(this.shadowRoot!);
        }
    }

    private disconnectCellView(): void {
        this.customCellView?.remove();
        this.customCellView = undefined;
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
