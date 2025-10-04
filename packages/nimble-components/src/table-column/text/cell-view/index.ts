import { customElement } from '@ni/fast-element';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

export const tableColumnTextCellViewTag = 'nimble-table-column-text-cell-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnTextCellViewTag]: TableColumnTextCellView;
    }
}

/**
 * A cell view for displaying string fields as text
 */
@customElement({
    name: tableColumnTextCellViewTag,
    template,
    styles
})
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
