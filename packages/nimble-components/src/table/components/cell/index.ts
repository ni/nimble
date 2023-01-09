import {
    defaultExecutionContext,
    ElementStyles,
    HTMLView,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
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
export class TableCell<
    TCellData extends TableRecord = TableRecord
> extends FoundationElement {
    @observable
    public data?: TableCellState<TCellData>;

    @observable
    public cellTemplate?: ViewTemplate;

    @observable
    public cellStyles?: ElementStyles;

    /**
     * @internal
     */
    public readonly cellContainer: HTMLElement | undefined = undefined;

    private customCellView: HTMLView | undefined = undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.customCellView = this.cellTemplate?.render(
            this.data,
            this.cellContainer!
        );
    }

    private dataChanged(): void {
        this.customCellView?.bind(this.data, defaultExecutionContext);
    }

    private cellStylesChanged(
        prev?: ElementStyles,
        next?: ElementStyles
    ): void {
        if (prev) {
            this.$fastController.removeStyles(prev);
        }

        if (next) {
            this.$fastController.addStyles(next);
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
