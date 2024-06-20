import { html, ref } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '../../../table';
import { TableColumnMenuButton, tableColumnMenuButtonTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { TableColumnMenuButtonPageObject } from '../testing/table-column-menu-button.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { MenuButtonPageObject } from '../../../menu-button/testing/menu-button.pageobject';
import type { MenuButtonColumnToggleEventDetail } from '../types';
import { createEventListener } from '../../../utilities/tests/component';
import { Menu, menuTag } from '../../../menu';
import { MenuItem, menuItemTag } from '../../../menu-item';

interface SimpleTableRecord extends TableRecord {
    id?: string;
    field?: string | null;
    anotherField?: string | null;
}

class ElementReferences {
    public table!: Table;
    public column1!: TableColumnMenuButton;
    public column2!: TableColumnMenuButton;
    public menu!: Menu;
    public firstMenuItem!: MenuItem;
    public lastMenuItem!: MenuItem;
}

describe('TableColumnMenuButton', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let pageObject: TableColumnMenuButtonPageObject<SimpleTableRecord>;
    let column: TableColumnMenuButton;

    // prettier-ignore
    async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
        return fixture<Table<SimpleTableRecord>>(
            html`<${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnMenuButtonTag} ${ref('column1')} field-name="field">
                        Menu button column 1
                    </${tableColumnMenuButtonTag}>
                    <${tableColumnMenuButtonTag} ${ref('column2')} field-name="anotherField">
                        Menu button column 2
                    </${tableColumnMenuButtonTag}>

                    <${menuTag} ${ref('menu')}>
                        <${menuItemTag} ${ref('firstMenuItem')}>Menu item 1</${menuItemTag}>
                        <${menuItemTag}>Menu item 2</${menuItemTag}>
                        <${menuItemTag}>Menu item 3</${menuItemTag}>
                        <${menuItemTag} ${ref('lastMenuItem')}>Menu item 4</${menuItemTag}>
                    </${menuTag}>
                </${tableTag}>`,
            { source }
        );
    }

    beforeEach(async () => {
        elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        tablePageObject = new TablePageObject<SimpleTableRecord>(table);
        pageObject = new TableColumnMenuButtonPageObject(tablePageObject);
        await connect();
        await waitForUpdatesAsync();
        column = elementReferences.column1;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(tableColumnMenuButtonTag).toBe(
            'nimble-table-column-menu-button'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-menu-button')
        ).toBeInstanceOf(TableColumnMenuButton);
    });

    it('renders a menu button with record value when data is a non-empty string value', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual('value');
    });

    it('updating table data updates menu button text', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();
        await table.setData([{ field: 'new value' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual('new value');
    });

    it('updating table data updates menu button text', async () => {
        await table.setData([
            { field: 'value', anotherField: 'another value' }
        ]);
        await waitForUpdatesAsync();

        column.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual('another value');
    });

    const emptyCellValues = [
        { name: 'empty string', value: '' },
        { name: 'null', value: null },
        { name: 'undefined', value: undefined }
    ] as const;
    parameterizeSpec(emptyCellValues, (spec, name, value) => {
        spec(`does not render a menu button when data is ${name}`, async () => {
            await table.setData([{ field: value.value }]);
            await waitForUpdatesAsync();

            expect(pageObject.getMenuButton(0, 0)).toBeFalsy();
        });
    });

    it('changing data from value to null displays blank', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();
        await table.setData([{ field: null }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)).toBeFalsy();
    });

    it('changing data from undefined to non-empty string displays menu button with value', async () => {
        await table.setData([{ field: undefined }]);
        await waitForUpdatesAsync();
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toBe('value');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        column.fieldName = undefined;
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)).toBeFalsy();
    });

    describe('various string values render as expected', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                await connect();

                await table.setData([{ field: name }]);
                await waitForUpdatesAsync();

                expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual(name);
            });
        });
    });

    describe('overflow', () => {
        it('sets title on menu button when button text is ellipsized', async () => {
            const longValue = 'long button text that is too long to fit in the space allocated';
            table.style.width = '100px';
            await table.setData([{ field: longValue }]);
            await waitForUpdatesAsync();
            const menuButton = pageObject.getMenuButton(0, 0)!;
            menuButton.dispatchEvent(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(menuButton.getTitle()).toEqual(longValue);
        });

        it('does not set title when cell text is fully visible', async () => {
            await table.setData([{ field: 'a' }]);
            await waitForUpdatesAsync();
            const menuButton = pageObject.getMenuButton(0, 0)!;
            menuButton.dispatchEvent(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(menuButton.getTitle()).toEqual('');
        });

        it('removes title on mouseout of cell', async () => {
            const longValue = 'long button text that is too long to fit in the space allocated';
            table.style.width = '100px';
            await table.setData([{ field: longValue }]);
            await waitForUpdatesAsync();
            const menuButton = pageObject.getMenuButton(0, 0)!;
            menuButton.dispatchEvent(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            menuButton.dispatchEvent(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(menuButton.getTitle()).toEqual('');
        });
    });

    describe('table selection does not change', () => {
        let menuButton: MenuButtonPageObject;

        beforeEach(async () => {
            table.idFieldName = 'id';
            table.selectionMode = 'multiple';
            await waitForUpdatesAsync();

            await table.setData([{ id: '0', field: 'value' }]);
            await waitForUpdatesAsync();
            menuButton = pageObject.getMenuButton(0, 0)!;
        });

        it('when opening a menu button by clicking', async () => {
            menuButton.clickMenuButton();
            expect(menuButton.isOpen()).toBeTrue();
            await waitForUpdatesAsync();
            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });

        it('when opening a menu button by pressing Enter', async () => {
            menuButton.pressEnterKey();
            expect(menuButton.isOpen()).toBeTrue();
            await waitForUpdatesAsync();
            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });
    });

    describe('menu button interactions', () => {
        let menuButton: MenuButtonPageObject;
        const recordId = 'id-0' as const;

        function getEventDetailFromSpy(
            spy: jasmine.Spy
        ): MenuButtonColumnToggleEventDetail {
            const event = spy.calls.first()
                .args[0] as CustomEvent<MenuButtonColumnToggleEventDetail>;
            return event.detail;
        }

        beforeEach(async () => {
            table.idFieldName = 'id';
            await table.setData([
                { id: recordId, field: 'value', anotherField: 'another value' }
            ]);
            await waitForUpdatesAsync();
            menuButton = pageObject.getMenuButton(0, 0)!;
        });

        it('opening menu button fires "menu-button-column-beforetoggle" followed by "menu-button-column-toggle"', async () => {
            const beforeToggleListener = createEventListener(
                column,
                'menu-button-column-beforetoggle'
            );
            const toggleListener = createEventListener(
                column,
                'menu-button-column-toggle'
            );

            menuButton.clickMenuButton();

            const expectedDetails: MenuButtonColumnToggleEventDetail = {
                recordId,
                newState: true,
                oldState: false
            };

            await beforeToggleListener.promise;
            expect(beforeToggleListener.spy).toHaveBeenCalledTimes(1);
            let eventDetail = getEventDetailFromSpy(beforeToggleListener.spy);
            expect(eventDetail).toEqual(expectedDetails);
            beforeToggleListener.spy.calls.reset();

            await toggleListener.promise;
            expect(beforeToggleListener.spy).not.toHaveBeenCalled();
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
            eventDetail = getEventDetailFromSpy(toggleListener.spy);
            expect(eventDetail).toEqual(expectedDetails);
        });

        it('closing menu button fires "menu-button-column-beforetoggle" followed by "menu-button-column-toggle"', async () => {
            await menuButton.openMenu();

            const beforeToggleListener = createEventListener(
                column,
                'menu-button-column-beforetoggle'
            );
            const toggleListener = createEventListener(
                column,
                'menu-button-column-toggle'
            );

            menuButton.closeMenuWithEscape();

            const expectedDetails: MenuButtonColumnToggleEventDetail = {
                recordId,
                newState: false,
                oldState: true
            };

            await beforeToggleListener.promise;
            expect(beforeToggleListener.spy).toHaveBeenCalledTimes(1);
            let eventDetail = getEventDetailFromSpy(beforeToggleListener.spy);
            expect(eventDetail).toEqual(expectedDetails);
            beforeToggleListener.spy.calls.reset();

            await toggleListener.promise;
            expect(beforeToggleListener.spy).not.toHaveBeenCalled();
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
            eventDetail = getEventDetailFromSpy(toggleListener.spy);
            expect(eventDetail).toEqual(expectedDetails);
        });

        describe('opens and focuses menu item', () => {
            const openActions = [
                {
                    name: 'when button is clicked',
                    action: () => menuButton.clickMenuButton(),
                    expectedFocus: 'first'
                },
                {
                    name: 'when Space is pressed',
                    action: () => menuButton.pressSpaceKey(),
                    expectedFocus: 'first'
                },
                {
                    name: 'when Enter is pressed',
                    action: () => menuButton.pressEnterKey(),
                    expectedFocus: 'first'
                },
                {
                    name: 'when ArrowDown is pressed',
                    action: () => menuButton.pressArrowDownKey(),
                    expectedFocus: 'first'
                },
                {
                    name: 'when ArrowUp is pressed',
                    action: () => menuButton.pressArrowUpKey(),
                    expectedFocus: 'last'
                }
            ] as const;
            parameterizeSpec(openActions, (spec, name, value) => {
                spec(name, async () => {
                    const slotName = 'column-1-menu';
                    column.menuSlot = slotName;
                    elementReferences.menu.slot = slotName;
                    await waitForUpdatesAsync();

                    const toggleListener = createEventListener(
                        column,
                        'menu-button-column-toggle'
                    );
                    value.action();
                    await toggleListener.promise;
                    const expectedFocusedItem = value.expectedFocus === 'first'
                        ? elementReferences.firstMenuItem
                        : elementReferences.lastMenuItem;
                    expect(document.activeElement).toBe(expectedFocusedItem);
                });
            });
        });

        async function openMenuAndListenForColumnToggleEvents(
            menuButtonToOpen: MenuButtonPageObject
        ): Promise<{
                column1BeforeToggleEmitCount: number,
                column1ToggleEmitCount: number,
                column2BeforeToggleEmitCount: number,
                column2ToggleEmitCount: number
            }> {
            const column1BeforeToggleListener = createEventListener(
                elementReferences.column1,
                'menu-button-column-beforetoggle'
            );
            const column1ToggleListener = createEventListener(
                elementReferences.column1,
                'menu-button-column-toggle'
            );
            const column2BeforeToggleListener = createEventListener(
                elementReferences.column2,
                'menu-button-column-beforetoggle'
            );
            const column2ToggleListener = createEventListener(
                elementReferences.column2,
                'menu-button-column-toggle'
            );

            await menuButtonToOpen.openMenu();

            return {
                column1BeforeToggleEmitCount:
                    column1BeforeToggleListener.spy.calls.count(),
                column1ToggleEmitCount: column1ToggleListener.spy.calls.count(),
                column2BeforeToggleEmitCount:
                    column2BeforeToggleListener.spy.calls.count(),
                column2ToggleEmitCount: column2ToggleListener.spy.calls.count()
            };
        }

        describe('shared menu', () => {
            let column1MenuButton: MenuButtonPageObject;
            let column2MenuButton: MenuButtonPageObject;

            beforeEach(async () => {
                const slotName = 'shared-menu';
                elementReferences.column1.actionMenuSlot = slotName;
                elementReferences.column1.menuSlot = slotName;
                elementReferences.column2.menuSlot = slotName;
                elementReferences.menu.slot = slotName;
                await waitForUpdatesAsync();

                column1MenuButton = menuButton;
                column2MenuButton = pageObject.getMenuButton(0, 1)!;
            });

            it('menu opens and closes when column1 menu button is clicked and then column2 menu button is clicked', async () => {
                let eventCounts = await openMenuAndListenForColumnToggleEvents(
                    column1MenuButton
                );
                expect(eventCounts.column1BeforeToggleEmitCount).toBe(1);
                expect(eventCounts.column1ToggleEmitCount).toBe(1);
                expect(eventCounts.column2BeforeToggleEmitCount).toBe(0);
                expect(eventCounts.column2ToggleEmitCount).toBe(0);
                expect(column1MenuButton.isOpen()).toBeTrue();
                expect(column2MenuButton.isOpen()).toBeFalse();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );

                eventCounts = await openMenuAndListenForColumnToggleEvents(
                    column2MenuButton
                );
                expect(eventCounts.column1BeforeToggleEmitCount).toBe(1);
                expect(eventCounts.column1ToggleEmitCount).toBe(1);
                expect(eventCounts.column2BeforeToggleEmitCount).toBe(1);
                expect(eventCounts.column2ToggleEmitCount).toBe(1);
                expect(column1MenuButton.isOpen()).toBeFalse();
                expect(column2MenuButton.isOpen()).toBeTrue();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );
            });

            it('menu opens and closes when column1 menu button is clicked, closed, and then column2 menu button is clicked', async () => {
                let eventCounts = await openMenuAndListenForColumnToggleEvents(
                    column1MenuButton
                );
                expect(eventCounts.column1BeforeToggleEmitCount).toBe(1);
                expect(eventCounts.column1ToggleEmitCount).toBe(1);
                expect(eventCounts.column2BeforeToggleEmitCount).toBe(0);
                expect(eventCounts.column2ToggleEmitCount).toBe(0);
                expect(column1MenuButton.isOpen()).toBeTrue();
                expect(column2MenuButton.isOpen()).toBeFalse();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );

                column1MenuButton.closeMenuWithEscape();
                expect(column1MenuButton.isOpen()).toBeFalse();
                expect(column2MenuButton.isOpen()).toBeFalse();
                expect(document.activeElement).not.toBe(
                    elementReferences.firstMenuItem
                );

                eventCounts = await openMenuAndListenForColumnToggleEvents(
                    column2MenuButton
                );
                expect(eventCounts.column1BeforeToggleEmitCount).toBe(0);
                expect(eventCounts.column1ToggleEmitCount).toBe(0);
                expect(eventCounts.column2BeforeToggleEmitCount).toBe(1);
                expect(eventCounts.column2ToggleEmitCount).toBe(1);
                expect(column1MenuButton.isOpen()).toBeFalse();
                expect(column2MenuButton.isOpen()).toBeTrue();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );
            });

            it('menu button column can share menu with action menu', async () => {
                // Make the action menu visible by enabling selection and selecting the row
                table.selectionMode = 'single';
                await table.setSelectedRecordIds([recordId]);
                const actionMenu = new MenuButtonPageObject(
                    tablePageObject.getCellActionMenu(0, 0)!
                );

                // Open column1 menu button
                await column1MenuButton.openMenu();
                expect(column1MenuButton.isOpen()).toBeTrue();
                expect(column2MenuButton.isOpen()).toBeFalse();
                expect(actionMenu.isOpen()).toBeFalse();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );

                // Close column1 menu button
                column1MenuButton.closeMenuWithEscape();
                expect(column1MenuButton.isOpen()).toBeFalse();
                expect(column2MenuButton.isOpen()).toBeFalse();
                expect(actionMenu.isOpen()).toBeFalse();
                expect(document.activeElement).not.toBe(
                    elementReferences.firstMenuItem
                );

                // Open column1 action menu
                await actionMenu.openMenu();
                expect(column1MenuButton.isOpen()).toBeFalse();
                expect(column2MenuButton.isOpen()).toBeFalse();
                expect(actionMenu.isOpen()).toBeTrue();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );

                // Open column2 menu button
                await column2MenuButton.openMenu();
                expect(column1MenuButton.isOpen()).toBeFalse();
                expect(column2MenuButton.isOpen()).toBeTrue();
                expect(actionMenu.isOpen()).toBeFalse();
                expect(document.activeElement).toBe(
                    elementReferences.firstMenuItem
                );
            });
        });
    });
});
