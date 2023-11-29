import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnIconGroupHeaderView as NimbleTableColumnIconGroupHeaderViewBase } from '@ni/nimble-foundation/dist/esm/table-column/icon/group-header-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/icon/group-header-view/template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-group-header-view': TableColumnIconGroupHeaderView;
    }
}

/**
 * The group header view for the icon column
 */
export class TableColumnIconGroupHeaderView
    extends NimbleTableColumnIconGroupHeaderViewBase { }

const iconGroupHeaderView = TableColumnIconGroupHeaderView.compose({
    baseName: 'table-column-icon-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconGroupHeaderView());
export const tableColumnIconGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnIconGroupHeaderView
);
