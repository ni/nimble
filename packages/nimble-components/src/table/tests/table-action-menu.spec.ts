import { html } from '@ni/fast-element';
import { keyArrowDown, keyArrowUp, keyEscape } from '@ni/fast-web-utilities';
import { tableTag, type Table } from '..';
import type { TableColumn } from '../../table-column/base';
import { menuTag, type Menu } from '../../menu';
import { menuItemTag, type MenuItem } from '../../menu-item';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { waitForEvent } from '../../utilities/testing/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    type TableActionMenuToggleEventDetail,
    type TableRecord,
    TableRowSelectionMode
} from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import { tableRowTag } from '../components/row';
import { tableColumnTextTag } from '../../table-column/text';
import { iconCheckTag } from '../../icons/check';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    numericData: number;
    moreStringData: string;
}

type TableActionMenuToggleEventHandler = (
    evt: CustomEvent<TableActionMenuToggleEventDetail>
) => void;

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
    return await fixture<Table<SimpleTableRecord>>(
        html`<${tableTag}>
            <${tableColumnTextTag} id="first-column" field-name="stringData">stringData</${tableColumnTextTag}>
            <${tableColumnTextTag} id="second-column" field-name="moreStringData">
                <${iconCheckTag}></${iconCheckTag}>
            </${tableColumnTextTag}>
        </${tableTag}>`
    );
}

describe('Table action menu', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumn;
    let column2: TableColumn;
    let beforetoggleSpy: jasmine.Spy<TableActionMenuToggleEventHandler>;
    let beforetoggleListener: Promise<void>;
    let toggleSpy: jasmine.Spy<TableActionMenuToggleEventHandler>;
    let toggleListener: Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        column1 = element.querySelector<TableColumn>('#first-column')!;
        column2 = element.querySelector<TableColumn>('#second-column')!;

        beforetoggleSpy = jasmine.createSpy();
        beforetoggleListener = waitForEvent(
            element,
            'action-menu-beforetoggle',
            beforetoggleSpy
        );
        toggleSpy = jasmine.createSpy();
        toggleListener = waitForEvent(element, 'action-menu-toggle', toggleSpy);
    });

    afterEach(async () => {
        await disconnect();
    });

    function createAndSlotMenu(slot: string): {
        menu: Menu,
        items: MenuItem[]
    } {
        const menu = document.createElement(menuTag);
        menu.slot = slot;

        const menuItem1 = document.createElement(menuItemTag);
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);

        const menuItem2 = document.createElement(menuItemTag);
        menuItem2.textContent = 'menu item 2';
        menu.appendChild(menuItem2);

        const menuItem3 = document.createElement(menuItemTag);
        menuItem3.textContent = 'menu item 3';
        menu.appendChild(menuItem3);

        element.appendChild(menu);

        return { menu, items: [menuItem1, menuItem2, menuItem3] };
    }

    function getEmittedRecordIdsFromSpy(
        spy: jasmine.Spy<TableActionMenuToggleEventHandler>
    ): string[] {
        const event = spy.calls.first().args[0];
        return event.detail.recordIds;
    }

    beforeEach(async () => {
        await element.setData(simpleTableData);
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
        await pageObject.clickCellActionMenu(1, 0);
        await toggleListener;

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

    it('button is included in row getFocusableElements() result', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        createAndSlotMenu(slot);
        await connect();
        await waitForUpdatesAsync();

        const row = pageObject.getRow(0);
        const focusableElements = row.getFocusableElements();
        expect(focusableElements.cells.length).toBe(2);
        expect(focusableElements.cells[0]!.actionMenuButton).toBe(
            pageObject.getCellActionMenu(0, 0)!
        );
        expect(focusableElements.cells[1]!.actionMenuButton).toBeUndefined();
    });

    it('when action menu button is blurred, cell fires cell-action-menu-blur event', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        createAndSlotMenu(slot);
        await connect();
        await waitForUpdatesAsync();
        pageObject.setRowHoverState(1, true);
        await waitForUpdatesAsync();
        const cell = pageObject.getCell(1, 0);
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        const spy = jasmine.createSpy();
        const blurListener = waitForEvent(cell, 'cell-action-menu-blur', spy);
        menuButton.focus();
        await waitForUpdatesAsync();

        expect(spy).not.toHaveBeenCalled();

        menuButton.blur();
        await blurListener;

        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: cell })
        );
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

        // Open a menu button for the first row to cause all the menus to be slotted within that row
        await pageObject.clickCellActionMenu(1, 0);
        await toggleListener;

        const rowSlots = element
            .shadowRoot!.querySelectorAll(tableRowTag)
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

        // Open a menu button for the first row to cause all the menus to be slotted within that row
        await pageObject.clickCellActionMenu(1, 0);
        await toggleListener;

        const rowSlots = element
            .shadowRoot!.querySelectorAll(tableRowTag)
            ?.item(1)
            .querySelectorAll<HTMLSlotElement>('slot');
        expect(rowSlots.length).toBe(1);
        expect(rowSlots.item(0).name).toBe(slot1);
    });

    it('table updates slots when `action-menu-slot` value changes', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        createAndSlotMenu(slot1);
        await connect();
        await waitForUpdatesAsync();

        // Open a menu button for the first row to cause all the menus to be slotted within that row
        await pageObject.clickCellActionMenu(1, 0);
        await toggleListener;

        const updatedSlot = 'my-new-slot';
        column1.actionMenuSlot = updatedSlot;
        await waitForUpdatesAsync();

        const rowSlots = element
            .shadowRoot!.querySelectorAll(tableRowTag)
            ?.item(1)
            .querySelectorAll<HTMLSlotElement>('slot');
        expect(rowSlots.length).toBe(1);
        expect(rowSlots.item(0).name).toBe(updatedSlot);
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

        await pageObject.clickCellActionMenu(1, 0);

        await beforetoggleListener;
        expect(beforetoggleSpy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: true,
            oldState: false,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = beforetoggleSpy.calls.first().args[0];
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

        await pageObject.clickCellActionMenu(1, 0);
        await waitForUpdatesAsync();
        const spy = jasmine.createSpy<TableActionMenuToggleEventHandler>();
        const listener = waitForEvent(element, 'action-menu-beforetoggle', spy);
        const escEvent = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        menuButton.region!.dispatchEvent(escEvent);

        await listener;
        expect(spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: false,
            oldState: true,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = spy.calls.first().args[0];
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

        await pageObject.clickCellActionMenu(1, 0);

        await toggleListener;
        expect(toggleSpy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: true,
            oldState: false,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = toggleSpy.calls.first().args[0];
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

        await pageObject.clickCellActionMenu(1, 0);
        await waitForUpdatesAsync();
        const escEvent = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        menuButton.region!.dispatchEvent(escEvent);

        await toggleListener;
        expect(toggleSpy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableActionMenuToggleEventDetail = {
            newState: false,
            oldState: true,
            columnId: column1.columnId,
            recordIds: [simpleTableData[1].stringData]
        };
        const event = toggleSpy.calls.first().args[0];
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
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        const event = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        menuButton.toggleButton!.dispatchEvent(event);

        await toggleListener;
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
        const menuButton = pageObject.getCellActionMenu(1, 0)!;
        const event = new KeyboardEvent('keydown', {
            key: keyArrowUp
        } as KeyboardEventInit);
        menuButton.toggleButton!.dispatchEvent(event);

        await toggleListener;
        expect(document.activeElement).toEqual(
            menuItems[menuItems.length - 1]!
        );
    });

    it('when open, closes if the table data is updated', async () => {
        const slot1 = 'my-action-menu';
        column1.actionMenuSlot = slot1;
        const menuItems = createAndSlotMenu(slot1).items;
        await connect();
        await waitForUpdatesAsync();
        pageObject.setRowHoverState(0, true);
        await pageObject.clickCellActionMenu(0, 0);
        await toggleListener;

        const closeToggleListener = waitForEvent(element, 'action-menu-toggle');
        const newTableData: SimpleTableRecord[] = [
            {
                stringData: 'new string 1',
                numericData: 8,
                moreStringData: 'new string 2'
            }
        ];
        await element.setData(newTableData);
        await closeToggleListener;

        expect(pageObject.getCell(0, 0).menuOpen).toBeFalse();
        expect(document.activeElement).not.toBe(menuItems[0]!);
    });

    describe('with single row selection', () => {
        beforeEach(async () => {
            const slot = 'my-action-menu';
            column1.actionMenuSlot = slot;
            createAndSlotMenu(slot);

            element.selectionMode = TableRowSelectionMode.single;
            await connect();
            await waitForUpdatesAsync();
        });

        it('action menu button is visible when row is selected', async () => {
            const rowIndex = 0;
            await element.setSelectedRecordIds([
                simpleTableData[rowIndex].stringData
            ]);
            await waitForUpdatesAsync();

            expect(pageObject.isCellActionMenuVisible(rowIndex, 0)).toBeTrue();
        });

        it('clicking action menu button selects the row when nothing was previously selected', async () => {
            const rowIndex = 0;
            pageObject.setRowHoverState(rowIndex, true);
            await pageObject.clickCellActionMenu(rowIndex, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[rowIndex].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });

        it('clicking action menu button with a different row selected selects the new row and deselects the previous row', async () => {
            await element.setSelectedRecordIds([simpleTableData[1].stringData]);

            const rowIndex = 0;
            pageObject.setRowHoverState(rowIndex, true);
            await pageObject.clickCellActionMenu(rowIndex, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[rowIndex].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });

        it('clicking action menu button for an already selected row keeps it selected', async () => {
            const rowIndex = 0;
            await element.setSelectedRecordIds([
                simpleTableData[rowIndex].stringData
            ]);

            pageObject.setRowHoverState(rowIndex, true);
            await pageObject.clickCellActionMenu(rowIndex, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[rowIndex].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });
    });

    describe('with multi row selection', () => {
        beforeEach(async () => {
            const slot = 'my-action-menu';
            column1.actionMenuSlot = slot;
            createAndSlotMenu(slot);

            element.selectionMode = TableRowSelectionMode.multiple;
            await connect();
            await waitForUpdatesAsync();
        });

        it('action menu button is visible on all selected rows', async () => {
            await element.setSelectedRecordIds([
                simpleTableData[0].stringData,
                simpleTableData[2].stringData
            ]);
            await waitForUpdatesAsync();

            expect(pageObject.isCellActionMenuVisible(0, 0)).toBeTrue();
            expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
            expect(pageObject.isCellActionMenuVisible(2, 0)).toBeTrue();
        });

        it('clicking action menu button selects the row when nothing was previously selected', async () => {
            const rowIndex = 0;
            pageObject.setRowHoverState(rowIndex, true);
            await pageObject.clickCellActionMenu(rowIndex, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[rowIndex].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });

        it('clicking action menu button with a different row selected selects the new row and deselects the previous row', async () => {
            await element.setSelectedRecordIds([simpleTableData[1].stringData]);

            const rowIndex = 0;
            pageObject.setRowHoverState(rowIndex, true);
            await pageObject.clickCellActionMenu(rowIndex, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[rowIndex].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });

        it('clicking action menu button for an already selected row keeps it selected', async () => {
            const rowIndex = 0;
            await element.setSelectedRecordIds([
                simpleTableData[rowIndex].stringData
            ]);

            pageObject.setRowHoverState(rowIndex, true);
            await pageObject.clickCellActionMenu(rowIndex, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[rowIndex].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });

        it('clicking action menu button for an already selected row keeps entire selection selected', async () => {
            await element.setSelectedRecordIds([
                simpleTableData[0].stringData,
                simpleTableData[2].stringData
            ]);

            pageObject.setRowHoverState(2, true);
            await pageObject.clickCellActionMenu(2, 0);
            await toggleListener;

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([
                simpleTableData[0].stringData,
                simpleTableData[2].stringData
            ]);
            expect(getEmittedRecordIdsFromSpy(beforetoggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
            expect(getEmittedRecordIdsFromSpy(toggleSpy)).toEqual(
                jasmine.arrayWithExactContents(currentSelection)
            );
        });
    });
});
