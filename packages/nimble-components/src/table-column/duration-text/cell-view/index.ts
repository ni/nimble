import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDurationTextCellRecord,
    TableColumnDurationTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

export const tableColumnDurationTextCellViewTag = 'nimble-table-column-duration-text-cell-view';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDurationTextCellViewTag]: TableColumnDurationTextCellView;
    }
}

/**
 * A cell view for displaying duration fields as text
 */
export class TableColumnDurationTextCellView extends TableColumnTextCellViewBase<
TableColumnDurationTextCellRecord,
TableColumnDurationTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = this.columnConfig?.formatter.format(this.cellRecord?.value) ?? '';
    }
}

const durationTextCellView = TableColumnDurationTextCellView.compose({
    baseName: tableColumnDurationTextCellViewTag,
    template,
    styles
});
DesignSystem.getOrCreate().register(durationTextCellView());
