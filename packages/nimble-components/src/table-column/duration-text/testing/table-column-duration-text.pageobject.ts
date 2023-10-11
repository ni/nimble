import type { TableRecord } from '../../../table/types';
import { TableColumnFormattedTextPageObject } from '../../testing/table-column-formatted-text.pageobject';
import { TableColumnDurationTextCellView } from '../cell-view';

/**
 * Page object for date text table column.
 */
export class TableColumnDurationTextPageObject<T extends TableRecord> extends TableColumnFormattedTextPageObject<T> {
    protected override verifyCellType(rowIndex: number, columnIndex: number): void {
        const cell = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        if (!(cell instanceof TableColumnDurationTextCellView)) {
            throw new Error('Cell is not in a duration text column');
        }
    }
}
