import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnDurationTextGroupHeaderView as NimbleTableColumnDurationTextGroupHeaderViewBase } from '@ni/nimble-foundation/dist/esm/table-column/duration-text/group-header-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-duration-text-group-header': TableColumnDurationTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying duration fields as text.
 */
export class TableColumnDurationTextGroupHeaderView extends NimbleTableColumnDurationTextGroupHeaderViewBase { }

const tableColumnDurationTextGroupHeaderView = TableColumnDurationTextGroupHeaderView.compose({
    baseName: 'table-column-duration-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnDurationTextGroupHeaderView());
export const tableColumnDurationTextGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnDurationTextGroupHeaderView
);
