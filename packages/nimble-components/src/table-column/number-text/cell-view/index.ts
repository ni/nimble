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
    public static getText(cellRecord: TableColumnNumberTextCellRecord | undefined, columnConfig: TableColumnNumberTextColumnConfig | undefined): string {
        if (columnConfig?.formatter) {
            return columnConfig.formatter.format(
                cellRecord?.value
            );
        }
        return '';
    }

    private columnConfigChanged(): void {
        this.updateText();
        this.alignment = this.columnConfig?.alignment ?? TextCellViewBaseAlignment.left;
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = TableColumnNumberTextCellView.getText(this.cellRecord, this.columnConfig);
    }
}

const numberTextCellView = TableColumnNumberTextCellView.compose({
    baseName: 'table-column-number-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(numberTextCellView());
export const tableColumnNumberTextCellViewTag = 'nimble-table-column-number-text-cell-view';
