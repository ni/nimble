import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableStringFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnTextColumnConfig } from '..';

const baseName = 'table-column-text-group-header';
export const tableColumnTextGroupHeaderViewTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnTextGroupHeaderViewTag]: TableColumnTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying string fields as text.
 */
export class TableColumnTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableStringFieldValue,
TableColumnTextColumnConfig
> {
    private groupHeaderValueChanged(): void {
        this.text = typeof this.groupHeaderValue === 'string'
            ? this.groupHeaderValue
            : '';
    }
}

const tableColumnTextGroupHeaderView = TableColumnTextGroupHeaderView.compose({
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(tableColumnTextGroupHeaderView());
