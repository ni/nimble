import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnDateTextCellView as NimbleTableColumnDateTextCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/date-text/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/cell-view/template';
import { styles } from '../../text-base/cell-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text-cell-view': TableColumnDateTextCellView;
    }
}

/**
 * A cell view for displaying date/time fields as text
 */
export class TableColumnDateTextCellView extends NimbleTableColumnDateTextCellViewBase { }

const dateTextCellView = TableColumnDateTextCellView.compose({
    baseName: 'table-column-date-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(dateTextCellView());
export const tableColumnDateTextCellViewTag = DesignSystem.tagFor(
    TableColumnDateTextCellView
);
