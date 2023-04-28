import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type { TableColumnNumericTextCellRecord, TableColumnNumericTextColumnConfig } from '..';
import { styles } from '../../base/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-numeric-text-cell-view': TableColumnNumericTextCellView;
    }
}

/**
 * A cell view for displaying numbers as text
 */
export class TableColumnNumericTextCellView extends TableColumnTextCellViewBase<TableColumnNumericTextCellRecord, TableColumnNumericTextColumnConfig> {
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

const numericTextCellView = TableColumnNumericTextCellView.compose({
    baseName: 'table-column-numeric-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(numericTextCellView());
export const tableColumnNumericTextCellViewTag = DesignSystem.tagFor(
    TableColumnNumericTextCellView
);