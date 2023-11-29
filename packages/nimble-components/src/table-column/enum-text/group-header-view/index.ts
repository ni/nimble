import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnEnumTextGroupHeaderView as NimbleTableColumnEnumTextGroupHeaderViewBase } from '@ni/nimble-foundation/dist/esm/table-column/enum-text/group-header-view';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-group-header-view': TableColumnEnumTextGroupHeaderView;
    }
}

/**
 * A group header view for enum columns
 */
export class TableColumnEnumTextGroupHeaderView extends NimbleTableColumnEnumTextGroupHeaderViewBase { }

const enumTextGroupHeaderView = TableColumnEnumTextGroupHeaderView.compose({
    baseName: 'table-column-enum-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(enumTextGroupHeaderView());
export const tableColumnEnumTextGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnEnumTextGroupHeaderView
);
