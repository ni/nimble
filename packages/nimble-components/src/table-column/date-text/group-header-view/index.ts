import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnDateTextColumnConfig } from '..';
import { formatNumericDate } from '../models/format-helper';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text-group-header': TableColumnDateTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying date/time fields as text.
 */
export class TableColumnDateTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnDateTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private groupHeaderValueChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        if (this.columnConfig) {
            this.text = formatNumericDate(
                this.columnConfig.formatter,
                this.groupHeaderValue
            );
        } else {
            this.text = '';
        }
    }
}

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
