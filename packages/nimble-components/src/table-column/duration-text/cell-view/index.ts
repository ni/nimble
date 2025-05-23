import { DesignSystem } from '@ni/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDurationTextCellRecord,
    TableColumnDurationTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-duration-text-cell-view': TableColumnDurationTextCellView;
    }
}

/**
 * A cell view for displaying duration fields as text
 */
export class TableColumnDurationTextCellView extends TableColumnTextCellViewBase<
TableColumnDurationTextCellRecord,
TableColumnDurationTextColumnConfig
> {
    protected updateText(): void {
        this.text = this.columnConfig?.formatter.format(this.cellRecord?.value) ?? '';
    }
}

const durationTextCellView = TableColumnDurationTextCellView.compose({
    baseName: 'table-column-duration-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(durationTextCellView());
export const tableColumnDurationTextCellViewTag = 'nimble-table-column-duration-text-cell-view';
