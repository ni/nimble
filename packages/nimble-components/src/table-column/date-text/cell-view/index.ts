import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDateTextCellRecord,
    TableColumnDateTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { formatNumericDate } from '../models/format-helper';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text-cell-view': TableColumnDateTextCellView;
    }
}

/**
 * A cell view for displaying date/time fields as text
 */
export class TableColumnDateTextCellView extends TableColumnTextCellViewBase<
TableColumnDateTextCellRecord,
TableColumnDateTextColumnConfig
> {
    public static getText(cellRecord: TableColumnDateTextCellRecord | undefined, columnConfig: TableColumnDateTextColumnConfig | undefined): string {
        if (columnConfig) {
            return formatNumericDate(
                columnConfig.formatter,
                cellRecord?.value
            );
        }
        return '';
    }

    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = TableColumnDateTextCellView.getText(this.cellRecord, this.columnConfig);
    }
}

const dateTextCellView = TableColumnDateTextCellView.compose({
    baseName: 'table-column-date-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(dateTextCellView());
export const tableColumnDateTextCellViewTag = 'nimble-table-column-date-text-cell-view';
