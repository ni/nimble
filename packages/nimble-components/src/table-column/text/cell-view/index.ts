import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-cell-view': TableColumnTextCellView;
    }
}

/**
 * A cell view for displaying string fields as text
 */
export class TableColumnTextCellView extends TableColumnTextCellViewBase<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.placeholder = this.columnConfig.placeholder;
    }

    private cellRecordChanged(): void {
        if (typeof this.cellRecord.value === 'string') {
            this.text = this.cellRecord.value;
            this.shouldUsePlaceholder = false;
        } else {
            this.shouldUsePlaceholder = true;
        }
    }
}

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = DesignSystem.tagFor(
    TableColumnTextCellView
);
