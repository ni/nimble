import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnIconCellView as NimbleTableColumnIconCellViewBase } from '@ni/nimble-foundation/dist/esm/table-column/icon/cell-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/icon/cell-view/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-cell-view': TableColumnIconCellView;
    }
}

/**
 * The cell view for the icon column
 */
export class TableColumnIconCellView extends NimbleTableColumnIconCellViewBase { }

const iconCellView = TableColumnIconCellView.compose({
    baseName: 'table-column-icon-cell-view',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconCellView());
export const tableColumnIconCellViewTag = DesignSystem.tagFor(
    TableColumnIconCellView
);
