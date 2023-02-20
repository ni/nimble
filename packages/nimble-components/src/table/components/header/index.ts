import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { TableColumnSortDirection } from '../../types';
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

    protected sortDirectionChanged(_prev: TableColumnSortDirection | undefined, _next: TableColumnSortDirection): void {
        if (this.sortDirection === TableColumnSortDirection.ascending) {
            this.ariaSort = 'ascending';
        } else if (this.sortDirection === TableColumnSortDirection.descending) {
            this.ariaSort = 'descending';
        } else {
            this.ariaSort = null;
        }
    }
}

const nimbleTableHeader = TableHeader.compose({
    baseName: 'table-header',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableHeader());
