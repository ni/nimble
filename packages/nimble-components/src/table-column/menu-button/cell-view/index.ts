import { DesignSystem } from '@microsoft/fast-foundation';
import { TableCellView } from '../../base/cell-view';
import type { TableColumnMenuButtonCellRecord, TableColumnMenuButtonColumnConfig } from '..';
import { template } from './templates';
import { styles } from './styles';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import type { CellViewSlotRequestedEventDetail } from '../../../table/types';
import { menuSlotName } from '../types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-menu-button-cell-view': TableColumnMenuButtonCellView;
    }
}

/**
 * The cell view base class for displaying a string field as a menu button.
 */
export class TableColumnMenuButtonCellView extends TableCellView<TableColumnMenuButtonCellRecord, TableColumnMenuButtonColumnConfig> {
    /** @internal */
    public menuButton?: MenuButton;

    public override focusedRecycleCallback(): void {
        this.menuButton?.blur();
    }

    public onMenuButtonBeforeToggle(event: CustomEvent<MenuButtonToggleEventDetail>): void {
        const configuredSlotName = this.columnConfig?.menuSlot;
        if (configuredSlotName && event.detail.newState) {
            const eventDetail: CellViewSlotRequestedEventDetail = {
                slotNames: [configuredSlotName]
            };
            this.$emit('cell-view-slots-requested', eventDetail);
        }
    }
}

const menuButtonCellView = TableColumnMenuButtonCellView.compose({
    baseName: 'table-column-menu-button-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(menuButtonCellView());
export const tableColumnMenuButtonCellViewTag = 'nimble-table-column-menu-button-cell-view';
