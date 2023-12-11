import type { TablePageObject } from '../../table/testing/table.pageobject';
import type { TableRecord } from '../../table/types';

/**
 * Page object for table columns that format their text for display.
 */
export abstract class TableColumnFormattedTextPageObject<
    T extends TableRecord
> {
    // When text is localized to different languages, the space character
    // can get changed to a different unicode variant. This regular expression
    // matches both known unicode variants so we can change them back to a
    // regular space to perform consistent checks for testing purposes.
    private readonly spaceUnicodeCharsRegEx = /\u202f|\u00a0/g;

    public constructor(
        protected readonly tablePageObject: TablePageObject<T>
    ) {}

    public getRenderedCellContent(
        rowIndex: number,
        columnIndex: number
    ): string {
        return this.tablePageObject
            .getRenderedCellTextContent(rowIndex, columnIndex)
            .replace(this.spaceUnicodeCharsRegEx, ' ');
    }

    public getRenderedGroupHeaderContent(groupRowIndex: number): string {
        return this.tablePageObject
            .getRenderedGroupHeaderTextContent(groupRowIndex)
            .replace(this.spaceUnicodeCharsRegEx, ' ');
    }

    public getCellTitle(rowIndex: number, columnIndex: number): string {
        this.verifyCellType(rowIndex, columnIndex);
        return this.tablePageObject
            .getCellTitle(rowIndex, columnIndex)
            .replace(this.spaceUnicodeCharsRegEx, ' ');
    }

    protected abstract verifyCellType(
        rowIndex: number,
        columnIndex: number
    ): void;
}
