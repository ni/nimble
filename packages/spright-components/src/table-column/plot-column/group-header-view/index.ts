import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberFieldValue } from '@ni/nimble-components/src/table/types';
import { TableColumnTextGroupHeaderViewBase } from '@ni/nimble-components/src/table-column/text-base/group-header-view';
import { template } from '@ni/nimble-components/src/table-column/text-base/group-header-view/template';
import { styles } from '@ni/nimble-components/src/table-column/text-base/group-header-view/styles';
import type { TableColumnPlotColumnConfig } from '..';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-plot-group-header': TableColumnPlotGroupHeaderView;
    }
}
/**
 * The group header view for displaying number fields as text.
 */
export class TableColumnPlotGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnPlotColumnConfig
> {
    protected updateText(): void {
        this.text = this.columnConfig?.formatter?.format(this.groupHeaderValue) ?? '';
    }
}

const tableColumnNumberTextGroupHeaderView = TableColumnPlotGroupHeaderView.compose({
    baseName: 'table-column-plot-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnNumberTextGroupHeaderView());
export const tableColumnPlotGroupHeaderTag = 'nimble-table-column-plot-group-header-view';
