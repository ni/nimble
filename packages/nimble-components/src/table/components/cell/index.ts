import { defaultExecutionContext, ElementStyles, HTMLView, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { TableCellState, TableRecord } from '../../types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell': TableCell;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableCell<TCellData extends TableRecord = TableRecord> extends FoundationElement {
    // TODO: This should be replaced with an instance of TableCellState<TCellData>
    @observable
    public data?: TableCellState<TCellData>;

    @observable
    public cellTemplate?: ViewTemplate;

    @observable
    public cellStyles?: ElementStyles;

    private customCellView: HTMLView | undefined = undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    private updateView(): void {
        const newCellView = this.customCellView === undefined;
        if (newCellView) {
            this.customCellView = this.cellTemplate!.create(this);
            if (this.cellStyles) {
                this.$fastController.addStyles(this.cellStyles);
            }
        }

        this.customCellView?.bind(this.data, defaultExecutionContext);

        if (newCellView) {
            this.customCellView!.appendTo(this.shadowRoot!);
        }
    }

    private dataChanged(): void {
        this.updateView();
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
