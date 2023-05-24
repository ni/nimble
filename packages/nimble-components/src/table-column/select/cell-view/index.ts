import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnSelectCellRecord,
    TableColumnSelectColumnConfig
} from '..';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-select-cell-view': TableColumnSelectCellView;
    }
}

/**
 * A cell view for displaying dropdowns
 */
export class TableColumnSelectCellView extends TableCellView<
TableColumnSelectCellRecord,
TableColumnSelectColumnConfig
> {
    public get items(): string[] {
        if (typeof this.cellRecord.items === 'string') {
            return this.cellRecord.items.split(',');
        }
        return [] as string[];
    }
}

const selectCellView = TableColumnSelectCellView.compose({
    baseName: 'table-column-select-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(selectCellView());
export const tableColumnSelectCellViewTag = DesignSystem.tagFor(
    TableColumnSelectCellView
);
