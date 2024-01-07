import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

const baseName = 'table-column-text-cell-view';
export const tableColumnTextCellViewTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnTextCellViewTag]: TableColumnTextCellView;
    }
}

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

const textCellView = TableColumnTextCellView.compose({
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
