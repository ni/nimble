import { html } from '@microsoft/fast-element';
import type { MenuItem, Menu } from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowUp,
    keyEscape
} from '@microsoft/fast-web-utilities';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableActionMenuToggleEventDetail, TableRecord } from '../types';
import { TablePageObject } from './table.pageobject';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    numericData: number;
    moreStringData: string;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        numericData: 8,
        moreStringData: 'foo'
    },
    {
        stringData: 'hello world',
        numericData: 0,
        moreStringData: 'foo'
    },
    {
        stringData: 'another string',
        numericData: -9,
        moreStringData: 'foo'
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text id="first-column" field-name="stringData">stringData</nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="moreStringData">
                <nimble-icon-check></nimble-icon-check>
            </nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table action menu', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumn;
    let column2: TableColumn;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        column1 = element.querySelector<TableColumn>('#first-column')!;
        column2 = element.querySelector<TableColumn>('#second-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    function createAndSlotMenu(slot: string): {
        menu: Menu,
        items: MenuItem[]
    } {
        const menu = document.createElement('nimble-menu');
        menu.slot = slot;

        const menuItem1 = document.createElement('nimble-menu-item');
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);

        const menuItem2 = document.createElement('nimble-menu-item');
        menuItem2.textContent = 'menu item 2';
        menu.appendChild(menuItem2);

        const menuItem3 = document.createElement('nimble-menu-item');
        menuItem3.textContent = 'menu item 3';
        menu.appendChild(menuItem3);

        element.appendChild(menu);

        return { menu, items: [menuItem1, menuItem2, menuItem3] };
    }

    beforeEach(() => {
        element.setData(simpleTableData);
        element.idFieldName = 'stringData';
    });

    it('button is present based on row hover when `action-menu-slot` is set', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        createAndSlotMenu(slot);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeTrue();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();

        pageObject.setRowHoverState(1, false);
        await waitForUpdatesAsync();
        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();
    });

    it('button is present when open if row is not hovered', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        createAndSlotMenu(slot);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeTrue();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();

        // Open the menu button
        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        pageObject.clickCellActionMenu(1, 0);
        await toggleListener.promise;

        pageObject.setRowHoverState(1, false);
        await waitForUpdatesAsync();
        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeTrue();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();
    });

    it('button is present on all columns configured with `action-menu-slot`', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        column2.actionMenuSlot = slot;
        createAndSlotMenu(slot);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeTrue();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeTrue();

        pageObject.setRowHoverState(1, false);
        await waitForUpdatesAsync();
        expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
        expect(pageObject.isCellActionMenuVisible(1, 1)).toBeFalse();
    });

    it('button has correct label', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        const label = 'Configure row';
        column1.actionMenuLabel = label;
        createAndSlotMenu(slot);
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        expect(menuButton.textContent?.trim()).toEqual(label);
    });

    it('table creates two slots for two unique `action-menu-slot` values', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        const slot2 = 'my-other-action-menu';
        column2.actionMenuSlot = slot2;
        createAndSlotMenu(slot2);
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        // Open a menu button for the first row to cause all the menus to be slotted within that row
        pageObject.clickCellActionMenu(1, 0);
        await toggleListener.promise;

        const rowSlots = element
            .shadowRoot!.querySelectorAll('nimble-table-row')
            ?.item(1)
            .querySelectorAll<HTMLSlotElement>('slot');
        expect(rowSlots.length).toBe(2);
        expect(rowSlots.item(0).name).toBe(slot1);
        expect(rowSlots.item(1).name).toBe(slot2);
    });

    it('table creates one slot for duplicate `action-menu-slot` values', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        column2.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        // Open a menu button for the first row to cause all the menus to be slotted within that row
        pageObject.clickCellActionMenu(1, 0);
        await toggleListener.promise;

        const rowSlots = element
            .shadowRoot!.querySelectorAll('nimble-table-row')
            ?.item(1)
            .querySelectorAll<HTMLSlotElement>('slot');
        expect(rowSlots.length).toBe(1);
        expect(rowSlots.item(0).name).toBe(slot1);
    });

    it('`beforetoggle` event is emitted before the action menu is opened', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        const slot2 = 'my-other-action-menu';
        column2.actionMenuSlot = slot2;
        createAndSlotMenu(slot2);
        await connect();
        await waitForUpdatesAsync();

        const beforetoggleListener = createEventListener(
            element,
            'action-menu-beforetoggle'
        );
        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        pageObject.clickCellActionMenu(1, 0);

        await beforetoggleListener.promise;
        expect(beforetoggleListener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: true,
            oldState: false,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = beforetoggleListener.spy.calls.first()
            .args[0] as CustomEvent<TableActionMenuToggleEventDetail>;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('`beforetoggle` event is emitted before the action menu is closed', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        const slot2 = 'my-other-action-menu';
        column2.actionMenuSlot = slot2;
        createAndSlotMenu(slot2);
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        pageObject.clickCellActionMenu(1, 0);
        await waitForUpdatesAsync();
        const beforetoggleListener = createEventListener(
            element,
            'action-menu-beforetoggle'
        );
        const escEvent = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        menuButton.region!.dispatchEvent(escEvent);

        await beforetoggleListener.promise;
        expect(beforetoggleListener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: false,
            oldState: true,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = beforetoggleListener.spy.calls.first()
            .args[0] as CustomEvent<TableActionMenuToggleEventDetail>;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('`toggle` event is emitted when action menu is opened', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        const slot2 = 'my-other-action-menu';
        column2.actionMenuSlot = slot2;
        createAndSlotMenu(slot2);
        await connect();
        await waitForUpdatesAsync();

        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        pageObject.clickCellActionMenu(1, 0);

        await toggleListener.promise;
        expect(toggleListener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: true,
            oldState: false,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = toggleListener.spy.calls.first()
            .args[0] as CustomEvent<TableActionMenuToggleEventDetail>;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('`toggle` event is emitted when the action menu is closed', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        const slot2 = 'my-other-action-menu';
        column2.actionMenuSlot = slot2;
        createAndSlotMenu(slot2);
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        pageObject.clickCellActionMenu(1, 0);
        await waitForUpdatesAsync();
        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        const escEvent = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        menuButton.region!.dispatchEvent(escEvent);

        await toggleListener.promise;
        expect(toggleListener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: false,
            oldState: true,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = toggleListener.spy.calls.first()
            .args[0] as CustomEvent<TableActionMenuToggleEventDetail>;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('opens and focuses first item when the down arrow is pressed', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        const menuItems = createAndSlotMenu(slot1).items;
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        const event = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        menuButton.toggleButton!.dispatchEvent(event);

        await toggleListener.promise;
        expect(document.activeElement).toEqual(menuItems[0]!);
    });

    it('opens and focuses last item when the up arrow is pressed', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        const menuItems = createAndSlotMenu(slot1).items;
        await connect();
        await waitForUpdatesAsync();

        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        const toggleListener = createEventListener(
            element,
            'action-menu-toggle'
        );
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        const event = new KeyboardEvent('keydown', {
            key: keyArrowUp
        } as KeyboardEventInit);
        menuButton.toggleButton!.dispatchEvent(event);

        await toggleListener.promise;
        expect(document.activeElement).toEqual(
            menuItems[menuItems.length - 1]!
        );
    });
});
