import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableStringFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnAnchorColumnConfig } from '..';
import { tableGroupRowNoAliasPlaceholder } from '../../../label-provider/table/label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor-group-header': TableColumnAnchorGroupHeaderView;
    }
}
/**
 * The group header view for displaying string fields as text.
 */
export class TableColumnAnchorGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableStringFieldValue,
TableColumnAnchorColumnConfig
> {
    protected override noValuePlaceholder = tableGroupRowNoAliasPlaceholder.getValueFor(this);

    private groupHeaderValueChanged(): void {
        if (this.applyPlaceholderTextIfNeeded(this.groupHeaderValue, true)) {
            return;
        }
        this.text = typeof this.groupHeaderValue === 'string'
            ? this.groupHeaderValue
            : '';
    }
}

const tableColumnAnchorGroupHeaderView = TableColumnAnchorGroupHeaderView.compose({
    baseName: 'table-column-anchor-group-header',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnAnchorGroupHeaderView());
export const tableColumnAnchorGroupHeaderViewTag = 'nimble-table-column-anchor-group-header';
