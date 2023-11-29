import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnEnumTextCellView as NimbleTableColumnEnumTextCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/enum-text/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/cell-view/template';
import { styles } from '../../text-base/cell-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-cell-view': TableColumnEnumTextCellView;
    }
}

/**
 * A cell view for displaying mapped text
 */
export class TableColumnEnumTextCellView extends NimbleTableColumnEnumTextCellViewBase { }

const enumTextCellView = TableColumnEnumTextCellView.compose({
    baseName: 'table-column-enum-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(enumTextCellView());
export const tableColumnEnumTextCellViewTag = DesignSystem.tagFor(
    TableColumnEnumTextCellView
);
