import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnTextGroupHeaderView as NimbleTableColumnTextGroupHeaderViewBase } from '@ni/nimble-foundation/dist/esm/table-column/text/group-header-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-group-header': TableColumnTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying string fields as text.
 */
export class TableColumnTextGroupHeaderView extends NimbleTableColumnTextGroupHeaderViewBase { }

const tableColumnTextGroupHeaderView = TableColumnTextGroupHeaderView.compose({
    baseName: 'table-column-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnTextGroupHeaderView());
export const tableColumnTextGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnTextGroupHeaderView
);
