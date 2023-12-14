import type { TableRecord } from '../../../table/types';
import { TableColumnFormattedTextPageObject } from '../../testing/table-column-formatted-text.pageobject';
import { TableColumnDateTextCellView } from '../cell-view';

/**
 * Page object for date text table column.
 */
export class TableColumnDateTextPageObject<
    T extends TableRecord
> extends TableColumnFormattedTextPageObject<T> {
    protected override verifyCellType(
        rowIndex: number,
        columnIndex: number
    ): void {
        const cell = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        if (!(cell instanceof TableColumnDateTextCellView)) {
            throw new Error('Cell is not in a date text column');
        }
    }
}
