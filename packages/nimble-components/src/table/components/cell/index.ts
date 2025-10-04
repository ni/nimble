import { attr, customElement, observable, ViewTemplate } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import type { TableColumn } from '../../../table-column/base';
import type {
    TableCellRecord,
    TableCellState
} from '../../../table-column/base/types';
import { styles } from './styles';
import { template } from './template';
import type { TableCellView } from '../../../table-column/base/cell-view';

export const tableCellTag = 'nimble-table-cell';

declare global {
    interface HTMLElementTagNameMap {
        [tableCellTag]: TableCell;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
@customElement({
    name: tableCellTag,
    template,
    styles
})
export class TableCell<
    TCellRecord extends TableCellRecord = TableCellRecord
> extends FoundationElement {
    @observable
    public cellState?: TableCellState<TCellRecord>;

    @observable
    public column?: TableColumn;

    @observable
    public recordId?: string;

    @attr({ attribute: 'column-id' })
    public columnId?: string;

    @attr({ attribute: 'has-action-menu', mode: 'boolean' })
    public hasActionMenu = false;

    @attr({ attribute: 'menu-open', mode: 'boolean' })
    public menuOpen = false;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    @observable
    public cellViewTemplate?: ViewTemplate<TableCell>;

    /** @internal */
    @observable
    public cellViewContainer!: HTMLElement;

    @observable
    public nestingLevel = 0;

    public readonly actionMenuButton?: MenuButton;

    /** @internal */
    public get cellView(): TableCellView<TCellRecord> {
        return this.cellViewContainer
            .firstElementChild as TableCellView<TCellRecord>;
    }

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

    public onActionMenuBlur(): void {
        this.$emit('cell-action-menu-blur', this);
    }

    public onCellViewFocusIn(): void {
        this.$emit('cell-view-focus-in', this);
    }

    public onCellFocusIn(): void {
        this.$emit('cell-focus-in', this);
    }

    public onCellBlur(): void {
        this.$emit('cell-blur', this);
    }
}
