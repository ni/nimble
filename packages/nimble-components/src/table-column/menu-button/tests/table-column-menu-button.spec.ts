import { html, ref } from '@microsoft/fast-element';
import { parameterizeSpec, parameterizeSuite } from '@ni/jasmine-parameterized';
import { keyArrowDown, keyEscape, keyTab } from '@microsoft/fast-web-utilities';
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
import {
    waitForEvent,
    sendKeyDownEvent
} from '../../../utilities/testing/component';
import { Menu, menuTag } from '../../../menu';
import { MenuItem, menuItemTag } from '../../../menu-item';
import { MenuButton } from '../../../menu-button';

interface SimpleTableRecord extends TableRecord {
    id?: string;
    field?: string | null;
    anotherField?: string | null;
}

type MenuButtonColumnToggleEvent = (
    evt: CustomEvent<MenuButtonColumnToggleEventDetail>
) => void;

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
        return await fixture<Table<SimpleTableRecord>>(
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

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        expect(column.checkValidity()).toBeTrue();
    });

    it('renders a menu button with record value when data is a non-empty string value', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual('value');
    });

    it('cell view tabbableChildren contains the menu button when data is a non-empty string', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();

        const cellView = tablePageObject.getRenderedCellView(0, 0);
        expect(cellView.tabbableChildren.length).toEqual(1);
        const tabbableChild = cellView.tabbableChildren[0];
        expect(tabbableChild).toBeInstanceOf(MenuButton);
    });

    it('cell view tabbableChildren becomes empty when the data becomes empty', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();

        let cellView = tablePageObject.getRenderedCellView(0, 0);
        expect(cellView.tabbableChildren.length).toEqual(1);

        await table.setData([{ field: null }]);
        await waitForUpdatesAsync();
        cellView = tablePageObject.getRenderedCellView(0, 0);
        expect(cellView.tabbableChildren.length).toEqual(0);
    });

    it('updating table data updates menu button text', async () => {
        await table.setData([{ field: 'value' }]);
        await waitForUpdatesAsync();
        await table.setData([{ field: 'new value' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual(
            'new value'
        );
    });

    it('updating fieldName updates menu button text', async () => {
        await table.setData([
            { field: 'value', anotherField: 'another value' }
        ]);
        await waitForUpdatesAsync();

        column.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual(
            'another value'
        );
    });

    const emptyCellValues = [
        { name: 'empty string', value: '' },
        { name: 'null', value: null },
        { name: 'undefined', value: undefined }
    ] as const;
    parameterizeSuite(emptyCellValues, (suite, name, value) => {
        suite(`when data is ${name}`, () => {
            beforeEach(async () => {
                await table.setData([{ field: value.value }]);
                await waitForUpdatesAsync();
            });

            it('does not render a menu button', () => {
                expect(pageObject.getMenuButton(0, 0)).toBeFalsy();
            });

            it('cell view tabbableChildren is an empty array', () => {
                const cellView = tablePageObject.getRenderedCellView(0, 0);
                expect(cellView.tabbableChildren).toEqual([]);
            });
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

                expect(pageObject.getMenuButton(0, 0)?.getLabelText()).toEqual(
                    name
                );
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

        it('when closing a menu button by clicking', async () => {
            // Open the menu button
            menuButton.clickMenuButton();
            expect(menuButton.isOpen()).toBeTrue();

            // Close the menu button
            menuButton.clickMenuButton();
            expect(menuButton.isOpen()).toBeFalse();
            await waitForUpdatesAsync();

            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });
    });

    describe('menu button interactions', () => {
        let menuButton: MenuButtonPageObject;
        const recordId = 'id-0' as const;
        const originalData = [
            { id: recordId, field: 'value', anotherField: 'another value' }
        ] as const;

        beforeEach(async () => {
            table.idFieldName = 'id';
            await table.setData(originalData);
            await waitForUpdatesAsync();
            menuButton = pageObject.getMenuButton(0, 0)!;
        });

        it('opening menu button fires "menu-button-column-beforetoggle" followed by "menu-button-column-toggle"', async () => {
            const spy = jasmine.createSpy<MenuButtonColumnToggleEvent>();
            const beforetogglePromise = waitForEvent(
                column,
                'menu-button-column-beforetoggle',
                spy
            );
            const togglePromise = waitForEvent(
                column,
                'menu-button-column-toggle',
                spy
            );
            menuButton.clickMenuButton();
            await Promise.all([beforetogglePromise, togglePromise]);

            const expectedDetails: MenuButtonColumnToggleEventDetail = {
                recordId,
                newState: true,
                oldState: false
            };
            expect(spy).toHaveBeenCalledTimes(2);
            const beforetoggleEvent = spy.calls.argsFor(0)[0];
            expect(beforetoggleEvent.type).toEqual(
                'menu-button-column-beforetoggle'
            );
            expect(beforetoggleEvent.detail).toEqual(expectedDetails);
            const toggleEvent = spy.calls.argsFor(1)[0];
            expect(toggleEvent.type).toEqual('menu-button-column-toggle');
            expect(toggleEvent.detail).toEqual(expectedDetails);
        });

        it('closing menu button with ESC fires "menu-button-column-beforetoggle" followed by "menu-button-column-toggle"', async () => {
            await menuButton.openMenu();
            const spy = jasmine.createSpy<MenuButtonColumnToggleEvent>();
            const beforetogglePromise = waitForEvent(
                column,
                'menu-button-column-beforetoggle',
                spy
            );
            const togglePromise = waitForEvent(
                column,
                'menu-button-column-toggle',
                spy
            );
            menuButton.closeMenuWithEscape();
            await Promise.all([beforetogglePromise, togglePromise]);

            const expectedDetails: MenuButtonColumnToggleEventDetail = {
                recordId,
                newState: false,
                oldState: true
            };
            expect(spy).toHaveBeenCalledTimes(2);
            const beforetoggleEvent = spy.calls.argsFor(0)[0];
            expect(beforetoggleEvent.type).toEqual(
                'menu-button-column-beforetoggle'
            );
            expect(beforetoggleEvent.detail).toEqual(expectedDetails);
            const toggleEvent = spy.calls.argsFor(1)[0];
            expect(toggleEvent.type).toEqual('menu-button-column-toggle');
            expect(toggleEvent.detail).toEqual(expectedDetails);
            expect(menuButton.isOpen()).toBeFalse();
        });

        it('closing menu button by clicking fires "menu-button-column-beforetoggle" followed by "menu-button-column-toggle"', async () => {
            await menuButton.openMenu();
            const spy = jasmine.createSpy<MenuButtonColumnToggleEvent>();
            const beforetogglePromise = waitForEvent(
                column,
                'menu-button-column-beforetoggle',
                spy
            );
            const togglePromise = waitForEvent(
                column,
                'menu-button-column-toggle',
                spy
            );
            menuButton.clickMenuButton();
            await Promise.all([beforetogglePromise, togglePromise]);

            const expectedDetails: MenuButtonColumnToggleEventDetail = {
                recordId,
                newState: false,
                oldState: true
            };

            expect(spy).toHaveBeenCalledTimes(2);
            const beforetoggleEvent = spy.calls.argsFor(0)[0];
            expect(beforetoggleEvent.type).toEqual(
                'menu-button-column-beforetoggle'
            );
            expect(beforetoggleEvent.detail).toEqual(expectedDetails);
            const toggleEvent = spy.calls.argsFor(1)[0];
            expect(toggleEvent.type).toEqual('menu-button-column-toggle');
            expect(toggleEvent.detail).toEqual(expectedDetails);
            expect(menuButton.isOpen()).toBeFalse();
        });

        it('calling setData() closes the menu button', async () => {
            await menuButton.openMenu();
            expect(menuButton.isOpen()).toBeTrue();

            await table.setData([
                ...originalData,
                {
                    id: 'id-1',
                    field: 'value-1',
                    anotherField: 'another value-1'
                },
                {
                    id: 'id-2',
                    field: 'value-2',
                    anotherField: 'another value-2'
                }
            ]);
            await waitForUpdatesAsync();

            const menuButtonAfterSetData = pageObject.getMenuButton(0, 0)!;
            expect(menuButtonAfterSetData.isOpen()).toBeFalse();
        });

        it('scrolling the table closes the menu button', async () => {
            const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
                id: `id-${i}`,
                field: `value-${i}`
            }));
            await table.setData(largeDataSet);
            await waitForUpdatesAsync();

            expect(tablePageObject.isVerticalScrollbarVisible()).toBeTrue();

            await menuButton.openMenu();
            expect(menuButton.isOpen()).toBeTrue();

            await tablePageObject.scrollToLastRowAsync();
            await tablePageObject.scrollToFirstRowAsync();
            expect(menuButton.isOpen()).toBeFalse();
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

                    const togglePromise = waitForEvent(
                        column,
                        'menu-button-column-toggle'
                    );
                    value.action();
                    await togglePromise;
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
            const column1BeforeToggleSpy = jasmine.createSpy();
            elementReferences.column1.addEventListener(
                'menu-button-column-beforetoggle',
                column1BeforeToggleSpy
            );
            const column1ToggleSpy = jasmine.createSpy();
            elementReferences.column1.addEventListener(
                'menu-button-column-toggle',
                column1ToggleSpy
            );
            const column2BeforeToggleSpy = jasmine.createSpy();
            elementReferences.column2.addEventListener(
                'menu-button-column-beforetoggle',
                column2BeforeToggleSpy
            );
            const column2ToggleSpy = jasmine.createSpy();
            elementReferences.column2.addEventListener(
                'menu-button-column-toggle',
                column2ToggleSpy
            );

            await menuButtonToOpen.openMenu();
            elementReferences.column1.removeEventListener(
                'menu-button-column-beforetoggle',
                column1BeforeToggleSpy
            );
            elementReferences.column1.removeEventListener(
                'menu-button-column-toggle',
                column1ToggleSpy
            );
            elementReferences.column2.removeEventListener(
                'menu-button-column-beforetoggle',
                column2BeforeToggleSpy
            );
            elementReferences.column2.removeEventListener(
                'menu-button-column-toggle',
                column2ToggleSpy
            );

            return {
                column1BeforeToggleEmitCount:
                    column1BeforeToggleSpy.calls.count(),
                column1ToggleEmitCount: column1ToggleSpy.calls.count(),
                column2BeforeToggleEmitCount:
                    column2BeforeToggleSpy.calls.count(),
                column2ToggleEmitCount: column2ToggleSpy.calls.count()
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

    describe('keyboard navigation', () => {
        let menuButton: MenuButtonPageObject;

        beforeEach(async () => {
            const tableData = [{ field: 'value' }];
            await table.setData(tableData);
            await connect();
            await waitForUpdatesAsync();
            table.focus();
            await waitForUpdatesAsync();
            menuButton = pageObject.getMenuButton(0, 0)!;
        });

        afterEach(async () => {
            await disconnect();
        });

        describe('with cell[0, 0] focused,', () => {
            beforeEach(async () => {
                await sendKeyDownEvent(table, keyArrowDown);
            });

            it('menu button in cells are reachable via Tab', async () => {
                await sendKeyDownEvent(table, keyTab);

                expect(menuButton.isFocused()).toBeTrue();
            });

            it('when menu button is focused, pressing Esc will blur the menu button', async () => {
                await sendKeyDownEvent(table, keyTab);
                await sendKeyDownEvent(table, keyEscape);

                expect(menuButton.isFocused()).toBeFalse();
            });
        });
    });
});
