import { DesignSystem } from '@microsoft/fast-foundation';
import { TableCellView } from '../../base/cell-view';
import type { TableColumnMenuButtonCellRecord, TableColumnMenuButtonColumnConfig } from '..';
import { template } from './templates';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-menu-button-cell-view': TableColumnMenuButtonCellView;
    }
}

/**
 * The cell view base class for displaying a string field as a menu button.
 */
export class TableColumnMenuButtonCellView extends TableCellView<TableColumnMenuButtonCellRecord, TableColumnMenuButtonColumnConfig> {
    public override focusedRecycleCallback(): void {
        // this.menuButton?.blur();
    }
}

const menuButtonCellView = TableColumnMenuButtonCellView.compose({
    baseName: 'table-column-menu-button-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(menuButtonCellView());
export const tableColumnMenuButtonCellViewTag = 'nimble-table-column-menu-button-cell-view';
