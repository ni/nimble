import type { TablePageObject } from '../../../table/testing/table.pageobject';
import type { TableRecord } from '../../../table/types';
import { TableColumnDateTextCellView } from '../cell-view';

/**
 * Page object for date text table column.
 */
export class TableColumnDateTextPageObject<T extends TableRecord> {
    // On Chrome, in a formatted date, the space before AM/PM is a narrow non-breaking space.
    // For testing consistency across browsers, replace it with a regular space.
    private readonly narrowNonBreakingSpace = '\u202f';

    public constructor(private readonly tablePageObject: TablePageObject<T>) {}

    public getRenderedCellContent(
        rowIndex: number,
        columnIndex: number
    ): string {
        this.verifyCellType(rowIndex, columnIndex);
        return this.tablePageObject
            .getRenderedCellTextContent(rowIndex, columnIndex)
            .replace(this.narrowNonBreakingSpace, ' ');
    }

    public getRenderedGroupHeaderContent(groupRowIndex: number): string {
        return this.tablePageObject
            .getRenderedGroupHeaderTextContent(groupRowIndex)
            .replace(this.narrowNonBreakingSpace, ' ');
    }

    public getCellTitle(rowIndex: number, columnIndex: number): string {
        this.verifyCellType(rowIndex, columnIndex);
        return this.tablePageObject
            .getCellTitle(rowIndex, columnIndex)
            .replace(this.narrowNonBreakingSpace, ' ');
    }

    private verifyCellType(rowIndex: number, columnIndex: number): void {
        const cell = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        if (!(cell instanceof TableColumnDateTextCellView)) {
            throw new Error('Cell is not in a date text column');
        }
    }
}
