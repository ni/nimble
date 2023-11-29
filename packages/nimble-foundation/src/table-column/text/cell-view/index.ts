import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '..';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

/**
 * A cell view for displaying string fields as text
 */
export class TableColumnTextCellView extends TableColumnTextCellViewBase<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    private cellRecordChanged(): void {
        this.text = typeof this.cellRecord?.value === 'string'
            ? this.cellRecord.value
            : '';
    }
}

export const tableColumnTextCellViewTag = DesignSystem.tagFor(
    TableColumnTextCellView
);
