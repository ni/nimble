import { menuButtonTag, type MenuButton } from '../../../menu-button';
import { MenuButtonPageObject } from '../../../menu-button/testing/menu-button.pageobject';
import type { TablePageObject } from '../../../table/testing/table.pageobject';
import type { TableRecord } from '../../../table/types';

/**
 * Page object for `nimble-table-column-menu-button`.
 */
export class TableColumnMenuButtonPageObject<T extends TableRecord> {
    public constructor(private readonly tablePageObject: TablePageObject<T>) {}

    public getMenuButton(
        rowIndex: number,
        columnIndex: number
    ): MenuButtonPageObject | null {
        const cellView = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        const menuButtonElement = cellView.shadowRoot!.querySelector(menuButtonTag);
        return menuButtonElement ? new MenuButtonPageObject(menuButtonElement) : null;
    }
}
