import type { TableHeader } from '..';
import { iconArrowDownTag } from '../../../../icons/arrow-down';
import { iconArrowUpTag } from '../../../../icons/arrow-up';

/**
 * Page object for the `nimble-table-header` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableHeaderPageObject {
    public constructor(private readonly tableElement: TableHeader) {}

    public isSortAscendingIconVisible(): boolean {
        return this.getSortAscendingIcon() !== null;
    }

    public isSortDescendingIconVisible(): boolean {
        return this.getSortDescendingIcon() !== null;
    }

    public isGroupIndicatorIconVisible(): boolean {
        return this.getGroupIndicatorIcon() !== null;
    }

    private getSortAscendingIcon(): HTMLElement | null {
        return this.tableElement.shadowRoot!.querySelector(
            `${iconArrowUpTag}.sort-indicator`
        );
    }

    private getSortDescendingIcon(): HTMLElement | null {
        return this.tableElement.shadowRoot!.querySelector(
            `${iconArrowDownTag}.sort-indicator`
        );
    }

    private getGroupIndicatorIcon(): HTMLElement | null {
        return this.tableElement.shadowRoot!.querySelector(
            '.grouped-indicator'
        );
    }
}
