import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import type {
    TableCellRecord,
    TableCellState
} from '../../../table-column/base/types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell': TableCell;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableCell<
    TCellRecord extends TableCellRecord = TableCellRecord
> extends FoundationElement {
    @observable
    public cellState?: TableCellState<TCellRecord>;

    @attr({ attribute: 'has-action-menu', mode: 'boolean' })
    public hasActionMenu = false;

    @attr({ attribute: 'menu-open', mode: 'boolean' })
    public menuOpen = false;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    @observable
    public cellViewTag?: string;

    public readonly actionMenuButton?: MenuButton;

    public onActionMenuBeforeToggle(
        event: CustomEvent<MenuButtonToggleEventDetail>
    ): void {
        this.$emit('cell-action-menu-beforetoggle', event.detail);
    }

    public onActionMenuToggle(
        event: CustomEvent<MenuButtonToggleEventDetail>
    ): void {
        this.menuOpen = event.detail.newState;
        this.$emit('cell-action-menu-toggle', event.detail);
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
export const tableCellTag = DesignSystem.tagFor(TableCell);
