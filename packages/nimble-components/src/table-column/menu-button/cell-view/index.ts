import { DesignSystem } from '@ni/fast-foundation';
import { observable, volatile } from '@ni/fast-element';
import { TableCellView } from '../../base/cell-view';
import type {
    TableColumnMenuButtonCellRecord,
    TableColumnMenuButtonColumnConfig
} from '..';
import { template } from './templates';
import { styles } from './styles';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import type { CellViewSlotRequestEventDetail } from '../../../table/types';
import { cellViewMenuSlotName } from '../types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-menu-button-cell-view': TableColumnMenuButtonCellView;
    }
}

/**
 * The cell view base class for displaying a string field as a menu button.
 */
export class TableColumnMenuButtonCellView extends TableCellView<
TableColumnMenuButtonCellRecord,
TableColumnMenuButtonColumnConfig
> {
    /** @internal */
    public menuButton?: MenuButton;

    /** @internal */
    public valueSpan?: HTMLSpanElement;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    @volatile
    public get showMenuButton(): boolean {
        return !!this.cellRecord?.value;
    }

    public override get tabbableChildren(): HTMLElement[] {
        if (this.showMenuButton) {
            return [this.menuButton!];
        }
        return [];
    }

    /** @internal */
    public onMenuButtonBeforeToggle(
        event: CustomEvent<MenuButtonToggleEventDetail>
    ): boolean {
        const configuredSlotName = this.columnConfig?.menuSlot;
        if (configuredSlotName && event.detail.newState) {
            const eventDetail: CellViewSlotRequestEventDetail = {
                slots: [
                    { name: configuredSlotName, slot: cellViewMenuSlotName }
                ]
            };
            this.$emit('cell-view-slots-request', eventDetail);
        }
        return true;
    }

    /** @internal */
    public onMenuButtonMouseOver(): void {
        if (this.valueSpan) {
            this.hasOverflow = this.valueSpan.offsetWidth < this.valueSpan.scrollWidth;
        }
    }

    /** @internal */
    public onMenuButtonMouseOut(): void {
        this.hasOverflow = false;
    }

    /** @internal */
    public onMenuButtonClick(e: Event): void {
        // Stop propagation of the click event to prevent clicking the menu button
        // from affecting row selection.
        e.stopPropagation();
    }
}

const menuButtonCellView = TableColumnMenuButtonCellView.compose({
    baseName: 'table-column-menu-button-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(menuButtonCellView());
export const tableColumnMenuButtonCellViewTag = 'nimble-table-column-menu-button-cell-view';
