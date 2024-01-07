import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnDurationTextColumnConfig } from '..';

export const tableColumnDurationTextGroupHeaderViewTag = 'nimble-table-duration-text-group-header';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDurationTextGroupHeaderViewTag]: TableColumnDurationTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying duration fields as text.
 */
export class TableColumnDurationTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnDurationTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private groupHeaderValueChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        if (this.columnConfig) {
            this.text = this.columnConfig.formatter.format(
                this.groupHeaderValue
            );
        } else {
            this.text = '';
        }
    }
}

const tableColumnDurationTextGroupHeaderView = TableColumnDurationTextGroupHeaderView.compose({
    baseName: tableColumnDurationTextGroupHeaderViewTag,
    template,
    styles
});
DesignSystem.getOrCreate()
    .register(tableColumnDurationTextGroupHeaderView());
