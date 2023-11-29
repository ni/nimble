import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnDateTextGroupHeaderView as NimbleTableColumnDateTextGroupHeaderViewBase } from '@ni/nimble-foundation/dist/esm/table-column/date-text/group-header-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text-group-header': TableColumnDateTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying date/time fields as text.
 */
export class TableColumnDateTextGroupHeaderView extends NimbleTableColumnDateTextGroupHeaderViewBase { }

const tableColumnDateTextGroupHeaderView = TableColumnDateTextGroupHeaderView.compose({
    baseName: 'table-column-date-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnDateTextGroupHeaderView());
export const tableColumnDateTextGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnDateTextGroupHeaderView
);
