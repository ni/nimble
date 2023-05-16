import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnNumberTextCellRecord,
    TableColumnNumberTextColumnConfig
} from '..';
import { styles } from '../../base/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text-cell-view': TableColumnNumberTextCellView;
    }
}

/**
 * A cell view for displaying numbers as text
 */
export class TableColumnNumberTextCellView extends TableColumnTextCellViewBase<
TableColumnNumberTextCellRecord,
TableColumnNumberTextColumnConfig
> {
    public override get text(): string {
        return this.cellRecord.value?.toString()!;
    }

    public override get placeholder(): string {
        return this.columnConfig.placeholder;
    }

    public override get shouldUsePlaceholder(): boolean {
        return typeof this.cellRecord.value !== 'number';
    }
}

const numberTextCellView = TableColumnNumberTextCellView.compose({
    baseName: 'table-column-number-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(numberTextCellView());
export const tableColumnNumberTextCellViewTag = DesignSystem.tagFor(
    TableColumnNumberTextCellView
);
