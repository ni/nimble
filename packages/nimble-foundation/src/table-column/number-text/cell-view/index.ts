import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnNumberTextCellRecord,
    TableColumnNumberTextColumnConfig
} from '..';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { TextCellViewBaseAlignment } from '../../text-base/cell-view/types';

/**
 * A cell view for displaying number fields as text
 */
export class TableColumnNumberTextCellView extends TableColumnTextCellViewBase<
TableColumnNumberTextCellRecord,
TableColumnNumberTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
        this.alignment = this.columnConfig?.alignment ?? TextCellViewBaseAlignment.left;
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = this.columnConfig?.formatter?.formatValue(this.cellRecord?.value)
            ?? '';
    }
}

export const tableColumnNumberTextCellViewTag = DesignSystem.tagFor(
    TableColumnNumberTextCellView
);
