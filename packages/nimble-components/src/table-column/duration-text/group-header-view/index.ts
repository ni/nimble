import { customElement } from '@ni/fast-element';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnDurationTextColumnConfig } from '..';

export const tableColumnDurationTextGroupHeaderViewTag = 'nimble-table-column-duration-text-group-header-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDurationTextGroupHeaderViewTag]: TableColumnDurationTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying duration fields as text.
 */
@customElement({
    name: tableColumnDurationTextGroupHeaderViewTag,
    template,
    styles
})
export class TableColumnDurationTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
    TableNumberFieldValue,
    TableColumnDurationTextColumnConfig
> {
    protected updateText(): void {
        if (this.columnConfig) {
            this.text = this.columnConfig.formatter.format(
                this.groupHeaderValue
            );
        } else {
            this.text = '';
        }
    }
}
