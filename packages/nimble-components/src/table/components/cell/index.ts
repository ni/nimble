import { attr, defaultExecutionContext, ElementStyles, HTMLView, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { MenuButton } from '../../../menu-button';
import type { TableCellState, TableRecord } from '../../types';
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
export class TableCell<TCellData extends TableRecord = TableRecord> extends FoundationElement {
    @attr({ attribute: 'show-action-menu', mode: 'boolean' })
    public showActionMenu = false;

    // TODO: This should be replaced with an instance of TableCellState<TCellData>
    @observable
    public data?: TableCellState<TCellData>;

    @observable
    public cellTemplate?: ViewTemplate;

    @observable
    public cellStyles?: ElementStyles;

    public menuIsOpen = false;

    public cellContentContainer!: HTMLSpanElement;

    private customCellView: HTMLView | undefined = undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    public onMenuOpening(): void {
        this.$emit('action-menu-opening');
    }

    public onMenuOpenChange(event: Event): void {
        const menu = event.target as MenuButton;
        this.menuIsOpen = menu.open;
        this.$emit('action-menu-open-change', this);
    }

    private updateView(): void {
        const newCellView = this.customCellView === undefined;
        if (newCellView) {
            this.customCellView = this.cellTemplate!.create(this);
            this.customCellView?.bind(this.data, defaultExecutionContext);
            if (this.cellStyles) {
                this.$fastController.addStyles(this.cellStyles);
            }
        }

        if (newCellView) {
            this.customCellView!.appendTo(this.cellContentContainer);
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
