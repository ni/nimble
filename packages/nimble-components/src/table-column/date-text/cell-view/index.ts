import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDateTextCellRecord,
    TableColumnDateTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { formatNumericDate } from '../models/format-helper';

const baseName = 'table-column-date-text-cell-view';
export const tableColumnDateTextCellViewTag = `nimble-${baseName}`;
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
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(dateTextCellView());
