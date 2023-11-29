import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnDurationTextCellRecord,
    TableColumnDurationTextColumnConfig
} from '..';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

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

export const tableColumnDurationTextCellViewTag = DesignSystem.tagFor(
    TableColumnDurationTextCellView
);
