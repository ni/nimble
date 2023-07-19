import type { TablePageObject } from '../../../table/testing/table.pageobject';
import type { TableRecord } from '../../../table/types';
import { TableColumnDateTextCellView } from '../cell-view';

/**
 * Page object for date text table column
 */
export class TableColumnDateTextPageObject<T extends TableRecord> {
    public constructor(private readonly tablePageObject: TablePageObject<T>) {}

    public getRenderedCellContent(
        rowIndex: number,
        columnIndex: number
    ): string {
        const cell = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        if (!(cell instanceof TableColumnDateTextCellView)) {
            throw new Error('Cell is not in a date text column');
        }
        const rawValue = cell.shadowRoot!.textContent;

        // on Chrome, the space before AM/PM is a narrow non-breaking space.
        // For testing consistency across browsers, replace it with a regular space.
        return rawValue?.trim().replace('\u202f', ' ') ?? '';
    }
}
