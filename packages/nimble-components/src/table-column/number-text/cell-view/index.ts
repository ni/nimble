import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnNumberTextCellRecord,
    TableColumnNumberTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { TextCellViewBaseAlignment } from '../../text-base/cell-view/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text-cell-view': TableColumnNumberTextCellView;
    }
}

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
        this.text = this.columnConfig?.formatter?.format(this.cellRecord?.value)
            ?? '';
    }
}

const numberTextCellView = TableColumnNumberTextCellView.compose({
    baseName: 'table-column-number-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(numberTextCellView());
export const tableColumnNumberTextCellViewTag = DesignSystem.tagFor(
    TableColumnNumberTextCellView
);
