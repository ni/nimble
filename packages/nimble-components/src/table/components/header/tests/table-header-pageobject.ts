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
        const icon = this.getSortAscendingIcon();
        return this.isVisible(icon);
    }

    public isSortDescendingIconVisible(): boolean {
        const icon = this.getSortDescendingIcon();
        return this.isVisible(icon);
    }

    public isGroupIndicatorIconVisible(): boolean {
        const icon = this.getGroupIndicatorIcon();
        return this.isVisible(icon);
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

    private isVisible(element: HTMLElement | null): boolean {
        if (element === null) {
            return false;
        }

        const display = window.getComputedStyle(element).display;
        return display !== 'none';
    }
}
