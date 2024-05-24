import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import type { TableColumnMenuButtonCellRecord, TableColumnMenuButtonColumnConfig } from '..';
import { template } from './templates';
import { styles } from './styles';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import type { CellViewSlotRequestEventDetail } from '../../../table/types';
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

    // TODO: This doesn't work the way it should because the title is only added to the button when hovering over the span.
    /** @internal */
    @observable
    public hasOverflow = false;

    public override focusedRecycleCallback(): void {
        this.menuButton?.blur();
    }

    public onMenuButtonBeforeToggle(event: CustomEvent<MenuButtonToggleEventDetail>): boolean {
        const configuredSlotName = this.columnConfig?.menuSlot;
        if (configuredSlotName && event.detail.newState) {
            const eventDetail: CellViewSlotRequestEventDetail = {
                slots: [{ name: configuredSlotName, slot: menuSlotName }]
            };
            this.$emit('cell-view-slots-request', eventDetail);
        }
        return true;
    }
}

const menuButtonCellView = TableColumnMenuButtonCellView.compose({
    baseName: 'table-column-menu-button-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(menuButtonCellView());
export const tableColumnMenuButtonCellViewTag = 'nimble-table-column-menu-button-cell-view';
