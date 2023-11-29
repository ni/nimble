import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnNumberTextGroupHeaderView as NimbleTableColumnNumberTextGroupHeaderViewBase } from '@ni/nimble-foundation/dist/esm/table-column/number-text/group-header-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text-group-header': TableColumnNumberTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying number fields as text.
 */
export class TableColumnNumberTextGroupHeaderView extends NimbleTableColumnNumberTextGroupHeaderViewBase { }

const tableColumnNumberTextGroupHeaderView = TableColumnNumberTextGroupHeaderView.compose({
    baseName: 'table-column-number-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnNumberTextGroupHeaderView());
export const tableColumnNumberTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnNumberTextGroupHeaderView
);
