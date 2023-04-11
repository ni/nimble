import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnAnchorCellRecord,
    TableColumnAnchorColumnConfig
} from '..';
import type { Anchor } from '../../../anchor';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor-cell-view': TableColumnAnchorCellView;
    }
}

/**
 * A cell view for displaying links
 */
export class TableColumnAnchorCellView extends TableCellView<
TableColumnAnchorCellRecord,
TableColumnAnchorColumnConfig
> {
    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    /** @internal */
    public anchor?: Anchor;

    @volatile
    public get content(): string {
        return typeof this.cellRecord.label === 'string'
            ? this.cellRecord.label
            : this.columnConfig.placeholder;
    }

    public override focusedRecycleCallback(): void {
        if (this.anchor) {
            this.anchor.blur();
        }
    }
}

const anchorCellView = TableColumnAnchorCellView.compose({
    baseName: 'table-column-anchor-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(anchorCellView());
export const tableColumnAnchorCellViewTag = DesignSystem.tagFor(
    TableColumnAnchorCellView
);
