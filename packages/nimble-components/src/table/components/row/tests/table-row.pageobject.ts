import type { TableRow } from '..';
import type { TableRecord } from '../../../types';
import { tableCellTag, TableCell } from '../../cell';

/**
 * Page object for the `nimble-table-row` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableRowPageObject<T extends TableRecord = TableRecord> {
    public constructor(private readonly tableRowElement: TableRow<T>) {}

    public getRenderedCell(columnIndex: number): TableCell | undefined {
        return this.tableRowElement.shadowRoot!.querySelectorAll<TableCell>(
            tableCellTag
        )[columnIndex];
    }
}
