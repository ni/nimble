import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnTextCellView as NimbleTableColumnTextCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/text/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/cell-view/template';
import { styles } from '../../text-base/cell-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-cell-view': TableColumnTextCellView;
    }
}

/**
 * A cell view for displaying string fields as text
 */
export class TableColumnTextCellView extends NimbleTableColumnTextCellViewBase { }

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = DesignSystem.tagFor(
    TableColumnTextCellView
);
