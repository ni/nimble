import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { TableColumnAlignment, TableColumnSortDirection } from '../../types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-header': TableHeader;
    }
}

/**
 * A styled header that is used within the nimble-table.
 * @internal
 */
export class TableHeader extends FoundationElement {
    @attr({ attribute: 'sort-direction' })
    public sortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

    @attr({ attribute: 'first-sorted-column', mode: 'boolean' })
    public firstSortedColumn = false;

    @attr({ attribute: 'indicators-hidden', mode: 'boolean' })
    public indicatorsHidden = false;

    @observable
    public alignment: TableColumnAlignment = TableColumnAlignment.left;

    @observable
    public isGrouped = false;

    protected sortDirectionChanged(
        _prev: TableColumnSortDirection | undefined,
        _next: TableColumnSortDirection
    ): void {
        this.updateAriaSort();
    }

    protected firstSortedColumnChanged(
        _prev: boolean | undefined,
        _next: boolean
    ): void {
        this.updateAriaSort();
    }

    private updateAriaSort(): void {
        if (
            !this.firstSortedColumn
            || this.sortDirection === TableColumnSortDirection.none
        ) {
            this.ariaSort = null;
        } else if (this.sortDirection === TableColumnSortDirection.ascending) {
            this.ariaSort = 'ascending';
        } else {
            this.ariaSort = 'descending';
        }
    }
}

const nimbleTableHeader = TableHeader.compose({
    baseName: 'table-header',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableHeader());
export const tableHeaderTag = 'nimble-table-header';
