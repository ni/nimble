import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnAnchorCellView as NimbleTableColumnAnchorCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/anchor/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/anchor/cell-view/template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor-cell-view': TableColumnAnchorCellView;
    }
}

/**
 * A cell view for displaying links
 */
export class TableColumnAnchorCellView extends NimbleTableColumnAnchorCellViewBase { }

const anchorCellView = TableColumnAnchorCellView.compose({
    baseName: 'table-column-anchor-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(anchorCellView());
export const tableColumnAnchorCellViewTag = DesignSystem.tagFor(
    TableColumnAnchorCellView
);
