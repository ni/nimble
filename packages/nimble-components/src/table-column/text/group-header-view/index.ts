import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableStringFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnTextColumnConfig } from '..';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-group-header': TableColumnTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying string fields as text.
 */
export class TableColumnTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableStringFieldValue,
TableColumnTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.placeholder = this.columnConfig?.placeholder ?? '';
    }

    private groupHeaderValueChanged(): void {
        if (typeof this.groupHeaderValue === 'string') {
            this.text = this.groupHeaderValue;
            this.shouldUsePlaceholder = false;
        } else {
            this.text = '';
            this.shouldUsePlaceholder = true;
        }
    }
}

const tableColumnTextGroupHeaderView = TableColumnTextGroupHeaderView.compose({
    baseName: 'table-column-text-group-header',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnTextGroupHeaderView());
export const tableColumnTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnTextGroupHeaderView
);
