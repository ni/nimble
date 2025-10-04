import { customElement } from '@ni/fast-element';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnNumberTextColumnConfig } from '..';

export const tableColumnNumberTextGroupHeaderTag = 'nimble-table-column-number-text-group-header-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnNumberTextGroupHeaderTag]: TableColumnNumberTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying number fields as text.
 */
@customElement({
    name: tableColumnNumberTextGroupHeaderTag,
    template,
    styles
})
export class TableColumnNumberTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
    TableNumberFieldValue,
    TableColumnNumberTextColumnConfig
> {
    protected updateText(): void {
        this.text = this.columnConfig?.formatter?.format(this.groupHeaderValue) ?? '';
    }
}
