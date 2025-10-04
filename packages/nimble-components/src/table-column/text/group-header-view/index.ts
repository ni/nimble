import { customElement } from '@ni/fast-element';
import type { TableStringFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnTextColumnConfig } from '..';

export const tableColumnTextGroupHeaderViewTag = 'nimble-table-column-text-group-header-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnTextGroupHeaderViewTag]: TableColumnTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying string fields as text.
 */
@customElement({
    name: tableColumnTextGroupHeaderViewTag,
    template,
    styles
})
export class TableColumnTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
    TableStringFieldValue,
    TableColumnTextColumnConfig
> {
    protected updateText(): void {
        this.text = typeof this.groupHeaderValue === 'string'
            ? this.groupHeaderValue
            : '';
    }
}
