import type { TableGroupRow } from '..';
import type { TableGroupHeaderView } from '../../group-header-view/table-group-header-view';

/**
 * Page object for the `nimble-table-row` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableGroupRowPageObject {
    public constructor(private readonly tableGroupRowElement: TableGroupRow) {}

    public getRenderedGroupHeader(): TableGroupHeaderView | null {
        return this.tableGroupRowElement.shadowRoot!.querySelector(
            this.tableGroupRowElement.groupColumn!.internalGroupHeaderViewTag!
        );
    }
}
