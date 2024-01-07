import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDateTextCellRecord,
    TableColumnDateTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { formatNumericDate } from '../models/format-helper';

export const tableColumnDateTextCellViewTag = 'nimble-table-column-date-text-cell-view';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDateTextCellViewTag]: TableColumnDateTextCellView;
    }
}

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

const dateTextCellView = TableColumnDateTextCellView.compose({
    baseName: tableColumnDateTextCellViewTag,
    template,
    styles
});
DesignSystem.getOrCreate().register(dateTextCellView());
