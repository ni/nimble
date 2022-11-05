import { attr, defaultExecutionContext, HTMLView, Observable, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';

export interface CellData {
    columnId: string;
    value: unknown;
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

    @observable
    public cellData?: unknown;

    @observable
    public cellItemTemplate?: ViewTemplate;

    @observable
    public hasMenu = false;

    private customCellView: HTMLView | undefined = undefined;

    public override connectedCallback(): void {
        this.updateCellView();
    }

    public override disconnectedCallback(): void {
        this.disconnectCellView();
    }

    public onMenuOpening(): void {
        this.$emit('action-menu-open');
    }

    private updateCellView(): void {
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
