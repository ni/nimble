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

    @observable
    public cellWidth: number;

    @observable
    public nestingLevel = 0;

    public readonly actionMenuButton?: MenuButton;
    private readonly resizeObserver: ResizeObserver;

    public constructor() {
        super();

        this.cellWidth = this.getBoundingClientRect().width;
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    const contentBoxSize = entry.contentBoxSize[0];
                    if (contentBoxSize) {
                        this.cellWidth = contentBoxSize.inlineSize;
                    }
                }
            }
        });
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.cellWidth = this.getBoundingClientRect().width;
        this.resizeObserver.observe(this);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.resizeObserver.unobserve(this);
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
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
export const tableCellTag = DesignSystem.tagFor(TableCell);
