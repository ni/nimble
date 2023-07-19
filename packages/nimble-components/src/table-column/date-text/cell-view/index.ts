import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDateTextCellRecord,
    TableColumnDateTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

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
    private columnConfigChanged(): void {
        this.placeholder = this.columnConfig.placeholder;
    }

    private cellRecordChanged(): void {
        if (typeof this.cellRecord.value === 'number') {
            const formatter = new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'medium'
            });
            try {
                this.text = formatter.format(this.cellRecord.value);
                this.shouldUsePlaceholder = false;
            } catch (e) {
                this.text = '';
                this.shouldUsePlaceholder = true;
            }
        } else {
            this.text = '';
            this.shouldUsePlaceholder = true;
        }
    }
}

const dateTextCellView = TableColumnDateTextCellView.compose({
    baseName: 'table-column-date-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(dateTextCellView());
export const tableColumnDateTextCellViewTag = DesignSystem.tagFor(
    TableColumnDateTextCellView
);
