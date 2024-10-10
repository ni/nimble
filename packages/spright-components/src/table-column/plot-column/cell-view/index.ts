import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnAlignment } from '@ni/nimble-components/src/table/types';
import { styles } from '@ni/nimble-components/src/table-column/text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '@ni/nimble-components/src/table-column/text-base/cell-view';
import type {
    TableColumnPlotCellRecord,
    TableColumnPlotColumnConfig
} from '..';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-plot-cell-view': TableColumnPlotCellView;
    }
}

/**
 * A cell view for displaying number fields as text
 */
export class TableColumnPlotCellView extends TableColumnTextCellViewBase<
TableColumnPlotCellRecord,
TableColumnPlotColumnConfig
> {
    protected override columnConfigChanged(): void {
        super.columnConfigChanged();
        this.alignment = this.columnConfig?.alignment ?? TableColumnAlignment.left;
    }

    protected updateText(): void {
        this.text = this.columnConfig?.formatter?.format(this.cellRecord?.value) ?? '';
    }
}

const plotCellView = TableColumnPlotCellView.compose({
    baseName: 'table-column-plot-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(plotCellView());
export const tableColumnPlotCellViewTag = 'nimble-table-column-plot-cell-view';
