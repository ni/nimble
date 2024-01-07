import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDurationTextCellRecord,
    TableColumnDurationTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

const baseName = 'table-column-duration-text-cell-view';
export const tableColumnDurationTextCellViewTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDurationTextCellViewTag]: TableColumnDurationTextCellView;
    }
}

/**
 * A cell view for displaying duration fields as text
 */
export class TableColumnDurationTextCellView extends TableColumnTextCellViewBase<
TableColumnDurationTextCellRecord,
TableColumnDurationTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = this.columnConfig?.formatter.format(this.cellRecord?.value) ?? '';
    }
}

const durationTextCellView = TableColumnDurationTextCellView.compose({
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(durationTextCellView());
