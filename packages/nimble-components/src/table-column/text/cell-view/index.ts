import { DesignSystem } from '@ni/fast-foundation';
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
    protected updateText(): void {
        this.text = typeof this.cellRecord?.value === 'string'
            ? this.cellRecord.value
            : '';
    }
}

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = 'nimble-table-column-text-cell-view';
