import { attr, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
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

    @observable
    public isEditing = false;

    @observable
    public isFocused = false;

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

    public onCellFocusOut(): void {
        this.isFocused = false;
    }

    public onCellBlur(): void {
        this.$emit('cell-blur', this);
    }

    public onCellEditorBlur(event: CustomEvent): void {
        event.stopPropagation();
        this.isEditing = false;
        this.isFocused = false;
        this.$emit('cell-edit-end', this);
    }

    public handleClick(): void {
        const isEditable = this.cellView.isEditable;
        if (isEditable && !this.isFocused) {
            this.isFocused = true;
        } else if (isEditable && this.isFocused) {
            this.isEditing = true;
            this.isFocused = false;
        }
    }

    public startEdit(): void {
        this.cellView.onEditStart();
        this.$emit('cell-edit-start', this);
    }

    private isEditingChanged(): void {
        if (this.isEditing) {
            this.startEdit();
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
export const tableCellTag = 'nimble-table-cell';
