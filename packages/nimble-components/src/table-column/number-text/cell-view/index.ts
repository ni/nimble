import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnNumberTextCellView as NimbleTableColumnNumberTextCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/number-text/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/cell-view/template';
import { styles } from '../../text-base/cell-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text-cell-view': TableColumnNumberTextCellView;
    }
}

/**
 * A cell view for displaying number fields as text
 */
export class TableColumnNumberTextCellView extends NimbleTableColumnNumberTextCellViewBase { }

const numberTextCellView = TableColumnNumberTextCellView.compose({
    baseName: 'table-column-number-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(numberTextCellView());
export const tableColumnNumberTextCellViewTag = DesignSystem.tagFor(
    TableColumnNumberTextCellView
);
