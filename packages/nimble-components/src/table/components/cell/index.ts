import {
    attr,
    defaultExecutionContext,
    ElementStyles,
    HTMLView,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import type { TableCellRecord, TableCellState } from '../../types';
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

    @observable
    public cellTemplate?: ViewTemplate;

    @observable
    public cellStyles?: ElementStyles;

    @attr({ attribute: 'has-action-menu', mode: 'boolean' })
    public hasActionMenu = false;

    @attr({ attribute: 'menu-open', mode: 'boolean' })
    public menuOpen = false;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    /**
     * @internal
     */
    public readonly cellContentContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly actionMenuButton?: MenuButton;

    private customCellView?: HTMLView = undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.customCellView = this.cellTemplate?.render(
            this.cellState,
            this.cellContentContainer
        );
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.customCellView) {
            this.customCellView.dispose();
            this.customCellView = undefined;
        }
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

    /**
     * @internal
     */
    public onBeforeRecycled(): void {
        if (this.$fastController.isConnected) {
            // Option 1: Raise custom event on the cellContentContainer - this lets column implementations handle the
            // event from their template - see table-column/text/template.ts for an example.
            const event = new CustomEvent('cell-blur-option1');
            this.cellContentContainer.dispatchEvent(event);
            // Option 2: Raise an event on TableCell that TableRow handles, and delegates to column.onBeforeFocusedCellRecycled().
            // See row/template.ts for that event binding.
            this.$emit('cell-blur-option2');
        }
    }

    protected cellStateChanged(): void {
        this.customCellView?.bind(this.cellState, defaultExecutionContext);
    }

    protected cellTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            this.customCellView = this.cellTemplate?.render(
                this.cellState,
                this.cellContentContainer
            );
        }
    }

    protected cellStylesChanged(
        prev?: ElementStyles,
        next?: ElementStyles
    ): void {
        if (prev) {
            this.$fastController.removeStyles(prev);
        }

        if (next) {
            this.$fastController.addStyles(next);
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
