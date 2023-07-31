import {
    attr,
    Notifier,
    observable,
    Observable,
    ViewTemplate
} from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { MenuButton } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { TableColumn } from '../../../table-column/base';
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
    public nestingLevel = 0;

    public readonly actionMenuButton?: MenuButton;

    private columnNotifier?: Notifier;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.observeColumn();
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
     *
     * The event handler that is called when a notifier detects a change. Notifiers are added
     * to the column, so `source` is expected to be an instance of `TableColumn`, and `args`
     * is the string name of the property that changed on that column.
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof TableColumn && args === 'columnId') {
            this.columnId = this.column?.columnId;
        }
    }

    private columnChanged(): void {
        this.columnId = this.column?.columnId;
        this.observeColumn();
    }

    private observeColumn(): void {
        if (this.columnNotifier) {
            this.columnNotifier.unsubscribe(this);
            this.columnNotifier = undefined;
        }

        if (this.column) {
            const notifier = Observable.getNotifier(this.column);
            notifier.subscribe(this);
            this.columnNotifier = notifier;
        }
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
export const tableCellTag = DesignSystem.tagFor(TableCell);
