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
import type { TableRowExpandedEventDetail } from '../../types';

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

    @observable
    public isParentRow = false;

    @observable
    public isFirstCell = false;

    @attr({ mode: 'boolean' })
    public expanded = false;

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

    @observable
    public dataIndex?: number;

    public readonly actionMenuButton?: MenuButton;

    /**
     * @internal
     */
    public readonly expandIcon?: HTMLElement;

    /**
     * @internal
     */
    @observable
    public animationClass = '';

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

    public onRowExpandToggle(event: Event): void {
        const expandEventDetail: TableRowExpandedEventDetail = {
            oldState: this.expanded,
            newState: !this.expanded,
            recordId: this.recordId
        }
        this.$emit('row-expand-toggle', expandEventDetail);
        event.stopImmediatePropagation();
        // To avoid a visual glitch with improper expand/collapse icons performing an
        // animation, we apply a class to the appropriate group row such that we can have
        // a more targeted CSS animation. We use the 'transitionend' event to remove the
        // temporary class and register a function reference as the handler to avoid issues
        // that may result from the 'transitionend' event not firing, as it will never result
        // in multiple event listeners being registered.
        this.animationClass = 'animating';
        this.expandIcon?.addEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    }

    private readonly removeAnimatingClass = (): void => {
        this.animationClass = '';
        this.expandIcon?.removeEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    };
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
export const tableCellTag = DesignSystem.tagFor(TableCell);
