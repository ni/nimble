import { DesignSystem } from '@microsoft/fast-foundation';
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
 * A cell view for displaying date/time fields as text
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
        if (this.columnConfig) {
            this.text = this.columnConfig.formatter.format(this.cellRecord?.value)
                ?? '';
        } else {
            this.text = '';
        }
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
export const tableColumnDurationTextCellViewTag = DesignSystem.tagFor(
    TableColumnDurationTextCellView
);
