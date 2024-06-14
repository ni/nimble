import { menuButtonTag, type MenuButton } from '../../../menu-button';
import { MenuButtonPageObject } from '../../../menu-button/testing/menu-button.pageobject';
import type { TablePageObject } from '../../../table/testing/table.pageobject';
import type { TableRecord } from '../../../table/types';
import { createEventListener } from '../../../utilities/tests/component';
import type { MenuButtonColumnToggleEventDetail } from '../types';

/**
 * Page object for `nimble-table-column-menu-button`.
 */
export class TableColumnMenuButtonPageObject<T extends TableRecord> {
    public constructor(private readonly tablePageObject: TablePageObject<T>) {}

    public getMenuButton(rowIndex: number, columnIndex: number): MenuButtonPageObject | null {
        const menuButton = this.getMenuButtonElement(rowIndex, columnIndex);
        return menuButton ? new MenuButtonPageObject(menuButton) : null;
    }

    public getMenuButtonText(rowIndex: number, columnIndex: number): string {
        const menuButton = this.getMenuButtonElement(rowIndex, columnIndex);
        return menuButton!.textContent?.trim() ?? '';
    }

    public getMenuButtonTitle(rowIndex: number, columnIndex: number): string {
        const menuButton = this.getMenuButtonElement(rowIndex, columnIndex);
        return menuButton!.title;
    }

    public dispatchEventToMenuButton(rowIndex: number, columnIndex: number, event: Event): void {
        const menuButton = this.getMenuButtonElement(rowIndex, columnIndex);
        menuButton!.dispatchEvent(event);
    }

    public createBeforeToggleListener(rowIndex: number, columnIndex: number): {
        promise: Promise<void>,
        spy: jasmine.Spy
    } {
        const menuButton = this.getMenuButtonElement(rowIndex, columnIndex);
        return createEventListener(menuButton!, 'menu-button-column-beforetoggle');
    }

    public createToggleListener(rowIndex: number, columnIndex: number): {
        promise: Promise<void>,
        spy: jasmine.Spy
    } {
        const menuButton = this.getMenuButtonElement(rowIndex, columnIndex);
        return createEventListener(menuButton!, 'menu-button-column-toggle');
    }

    private getMenuButtonElement(rowIndex: number, columnIndex: number): MenuButton | null {
        const cellView = this.tablePageObject.getRenderedCellView(rowIndex, columnIndex);
        return cellView.shadowRoot!.querySelector(menuButtonTag);
    }
}
