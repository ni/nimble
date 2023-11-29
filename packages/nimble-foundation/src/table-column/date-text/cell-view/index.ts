import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnDateTextCellRecord,
    TableColumnDateTextColumnConfig
} from '..';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { formatNumericDate } from '../models/format-helper';

/**
 * A cell view for displaying date/time fields as text
 */
export class TableColumnDateTextCellView extends TableColumnTextCellViewBase<
TableColumnDateTextCellRecord,
TableColumnDateTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        if (this.columnConfig) {
            this.text = formatNumericDate(
                this.columnConfig.formatter,
                this.cellRecord?.value
            );
        } else {
            this.text = '';
        }
    }
}

export const tableColumnDateTextCellViewTag = DesignSystem.tagFor(
    TableColumnDateTextCellView
);
