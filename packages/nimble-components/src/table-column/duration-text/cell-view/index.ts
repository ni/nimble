import { customElement } from '@ni/fast-element';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDurationTextCellRecord,
    TableColumnDurationTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

export const tableColumnDurationTextCellViewTag = 'nimble-table-column-duration-text-cell-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDurationTextCellViewTag]: TableColumnDurationTextCellView;
    }
}

/**
 * A cell view for displaying duration fields as text
 */
@customElement({
    name: tableColumnDurationTextCellViewTag,
    template,
    styles
})
export class TableColumnDurationTextCellView extends TableColumnTextCellViewBase<
    TableColumnDurationTextCellRecord,
    TableColumnDurationTextColumnConfig
> {
    protected updateText(): void {
        this.text = this.columnConfig?.formatter.format(this.cellRecord?.value) ?? '';
    }
}
