import type { TableCell } from '..';
import type { TableCellRecord } from '../../../types';

/**
 * Page object for the `nimble-table-cell` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableCellPageObject<T extends TableCellRecord = TableCellRecord> {
    public constructor(private readonly tableCellElement: TableCell<T>) {}

    public getRenderedCellContent(): Element | undefined {
        const cellContent = this.tableCellElement.shadowRoot!.querySelector(
            '.cell-content-container'
        );

        return cellContent?.children[0];
    }
}
