import type { Checkbox } from '@microsoft/fast-foundation';
import type { TableGroupRow } from '..';

/**
 * Page object for the `nimble-table-group-row` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableGroupRowPageObject {
    public constructor(private readonly tableGroupRowElement: TableGroupRow) {}

    public getSelectionCheckbox(): Checkbox | null {
        return this.tableGroupRowElement.shadowRoot!.querySelector(
            '.selection-checkbox'
        );
    }
}
