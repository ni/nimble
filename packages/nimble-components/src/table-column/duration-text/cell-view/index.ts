import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnDurationTextCellView as NimbleTableColumnDurationTextCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/duration-text/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/cell-view/template';
import { styles } from '../../text-base/cell-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-duration-text-cell-view': TableColumnDurationTextCellView;
    }
}

/**
 * A cell view for displaying duration fields as text
 */
export class TableColumnDurationTextCellView extends NimbleTableColumnDurationTextCellViewBase { }

const durationTextCellView = TableColumnDurationTextCellView.compose({
    baseName: 'table-column-duration-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(durationTextCellView());
export const tableColumnDurationTextCellViewTag = DesignSystem.tagFor(
    TableColumnDurationTextCellView
);
