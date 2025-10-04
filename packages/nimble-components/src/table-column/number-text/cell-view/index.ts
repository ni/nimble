import { customElement } from '@ni/fast-element';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnNumberTextCellRecord,
    TableColumnNumberTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { TableColumnAlignment } from '../../../table/types';

export const tableColumnNumberTextCellViewTag = 'nimble-table-column-number-text-cell-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnNumberTextCellViewTag]: TableColumnNumberTextCellView;
    }
}

/**
 * A cell view for displaying number fields as text
 */
@customElement({
    name: tableColumnNumberTextCellViewTag,
    template,
    styles
})
export class TableColumnNumberTextCellView extends TableColumnTextCellViewBase<
    TableColumnNumberTextCellRecord,
    TableColumnNumberTextColumnConfig
> {
    protected override columnConfigChanged(): void {
        super.columnConfigChanged();
        this.alignment = this.columnConfig?.alignment ?? TableColumnAlignment.left;
    }

    protected updateText(): void {
        this.text = this.columnConfig?.formatter?.format(this.cellRecord?.value) ?? '';
    }
}
