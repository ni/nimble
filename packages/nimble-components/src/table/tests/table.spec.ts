import { html } from '@microsoft/fast-element';
import { DesignSystem, MenuItem, Menu } from '@microsoft/fast-foundation';
import { keyArrowDown, keyArrowUp, keyEscape } from '@microsoft/fast-web-utilities';
import { Table } from '..';
import { IconCheck } from '../../icons/check';
import type { TableColumn } from '../../table-column/base';
import { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { controlHeight } from '../../theme-provider/design-tokens';
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

const largeTableData = Array.from(Array(500), (_, i) => {
    return {
        stringData: `string ${i}`,
        numericData: i,
        moreStringData: 'foo'
    };
});

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table></nimble-table>`
    );
}

describe('Table', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumn;
    let column2: TableColumn;

    // The assumption being made here is that the values in the data are equal to their
    // rendered representation (no formatting).
    function retrieveExpectedData(
        tableData: readonly SimpleTableRecord[]
    ): TableRecord[] {
        const expectedData: TableRecord[] = [];
        for (const rowData of tableData) {
            const record: TableRecord = {};
            for (const column of element.columns) {
                const dataKey = column.getDataRecordFieldNames()[0]!;
                const expectedCellData = rowData[dataKey]!;
                record[dataKey] = expectedCellData;
            }
            expectedData.push(record);
        }
        return expectedData;
    }

    function verifyRenderedData(
        visibleTableDataSubset: readonly SimpleTableRecord[]
    ): void {
        const visibleData = retrieveExpectedData(visibleTableDataSubset);
        const expectedRowCount = visibleData.length;
        expect(pageObject.getRenderedRowCount()).toEqual(expectedRowCount);
        for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
            for (
                let columnIndex = 0;
                columnIndex < element.columns.length;
                columnIndex++
            ) {
                const dataKey = element.columns[columnIndex]!.getDataRecordFieldNames()[0]!;
                const expectedCellData = visibleData[rowIndex]![dataKey]!;
                expect(
                    pageObject.getRenderedCellContent(rowIndex, columnIndex)
                ).toEqual(expectedCellData.toString());
            }
        }
    }

    function verifyRecordIDs(expectedRecordIds: string[]): void {
        const expectedRowCount = expectedRecordIds.length;
        for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
            expect(pageObject.getRecordId(rowIndex)).toEqual(
                expectedRecordIds[rowIndex]
            );
        }
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);

        const tableColumnTextTag = DesignSystem.tagFor(TableColumnText);
        column1 = document.createElement(tableColumnTextTag) as TableColumn;
        column1.textContent = 'stringData';
        (column1 as TableColumnText).fieldName = 'stringData';

        const checkIcon = document.createElement(
            DesignSystem.tagFor(IconCheck)
        );
        column2 = document.createElement(tableColumnTextTag) as TableColumn;
        column2.appendChild(checkIcon);
        (column2 as TableColumnText).fieldName = 'moreStringData';

        element.appendChild(column1);
        element.appendChild(column2);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-table')).toBeInstanceOf(Table);
    });

    it('column header content should be the columns', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedHeaderCount()).toEqual(
            element.columns.length
        );
        for (
            let columnIndex = 0;
            columnIndex < element.columns.length;
            columnIndex++
        ) {
            expect(pageObject.getHeaderContent(columnIndex))
                .withContext(`for column${columnIndex}`)
                .toEqual(element.columns[columnIndex]);
        }
    });

    it('changing column content updates header rendered content', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        let headerContent = pageObject.getHeaderContent(0)!.firstChild;
        expect(headerContent?.textContent).toEqual('stringData');

        element.columns[0]!.textContent = 'foo';
        await waitForUpdatesAsync();

        headerContent = pageObject.getHeaderContent(0)!.firstChild;
        expect(headerContent?.textContent).toEqual('foo');
    });

    it('can set data before the element is connected', async () => {
        element.setData(simpleTableData);
        await connect();
        await waitForUpdatesAsync();

        verifyRenderedData(simpleTableData);
    });

    it('can set data after the element is connected', async () => {
        await connect();
        await waitForUpdatesAsync();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        verifyRenderedData(simpleTableData);
    });

    it('updating data can add a new row to the table', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        const updatedData: SimpleTableRecord[] = [
            ...simpleTableData,
            {
                stringData: 'a new string',
                numericData: -9,
                moreStringData: 'foo'
            }
        ];
        element.setData(updatedData);
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('updating data can remove rows from the table', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        const updatedData: SimpleTableRecord[] = [
            simpleTableData[0],
            simpleTableData[2]
        ];
        element.setData(updatedData);
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('updating data can reorder rows from the table', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        const updatedData: SimpleTableRecord[] = [
            simpleTableData[1],
            simpleTableData[2],
            simpleTableData[0]
        ];
        element.setData(updatedData);
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('can update to have empty array of data', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        element.setData([]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedRowCount()).toBe(0);
    });

    it('updating data already assigned to the table does not update the table', async () => {
        await connect();

        const tableData: SimpleTableRecord[] = [...simpleTableData];
        element.setData(tableData);
        await waitForUpdatesAsync();

        tableData.push({
            stringData: 'another record',
            moreStringData: 'with more data',
            numericData: 0
        });
        await waitForUpdatesAsync();

        verifyRenderedData(simpleTableData);
    });

    it('can update a record without making a copy of the data', async () => {
        await connect();
        await waitForUpdatesAsync();

        const data: SimpleTableRecord[] = [...simpleTableData];
        element.setData(data);
        await waitForUpdatesAsync();
        verifyRenderedData(data);

        const currentFieldValue = data[0]!.stringData;
        data[0]!.stringData = `${currentFieldValue} - updated value`;
        element.setData(data);
        await waitForUpdatesAsync();
        verifyRenderedData(data);
    });

    it('can update the rendered rows by pushing a new record', async () => {
        await connect();
        await waitForUpdatesAsync();

        const data: SimpleTableRecord[] = [...simpleTableData];
        element.setData(data);
        await waitForUpdatesAsync();
        verifyRenderedData(data);

        data.push({
            stringData: 'hello world 123',
            moreStringData: 'foo bar baz',
            numericData: 9999
        });
        element.setData(data);
        await waitForUpdatesAsync();
        verifyRenderedData(data);
    });

    it('adding column to end renders data for column at end of row', async () => {
        await connect();
        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        const dateColumn = new TableColumnText();
        dateColumn.fieldName = 'moreStringData';

        element.appendChild(dateColumn);
        await waitForUpdatesAsync();
        expect(element.columns[element.columns.length - 1]).toBe(dateColumn);

        verifyRenderedData(simpleTableData);
    });

    it('adding column to front renders data for column at front of row', async () => {
        await connect();
        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        const dateColumn = new TableColumnText();
        dateColumn.fieldName = 'moreStringData';

        element.insertBefore(dateColumn, element.columns[0]!);
        await waitForUpdatesAsync();
        expect(element.columns[0]).toBe(dateColumn);

        verifyRenderedData(simpleTableData);
    });

    it('transitioning the table state from valid to invalid and back to valid rerenders the table correctly', async () => {
        element.setData(simpleTableData);
        await connect();
        await waitForUpdatesAsync();

        element.idFieldName = 'missingFieldName';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedRowCount()).toBe(0);
        expect(element.checkValidity()).toBeFalse();

        element.idFieldName = undefined;
        await waitForUpdatesAsync();

        verifyRenderedData(simpleTableData);
        expect(element.checkValidity()).toBeTrue();
    });

    describe('record IDs', () => {
        it('setting ID field uses field value for ID', async () => {
            element.setData(simpleTableData);
            element.idFieldName = 'stringData';
            await connect();
            await waitForUpdatesAsync();

            verifyRecordIDs(simpleTableData.map(x => x.stringData));
        });

        it('not setting ID field uses generated ID', async () => {
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            verifyRecordIDs(
                simpleTableData.map((_, index: number) => index.toString())
            );
        });

        it('row IDs update when id-field-name attribute is updated', async () => {
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();
            verifyRecordIDs(simpleTableData.map(x => x.stringData));

            element.idFieldName = undefined;
            await waitForUpdatesAsync();
            verifyRecordIDs(
                simpleTableData.map((_, index: number) => index.toString())
            );
        });
    });

    describe('ID validation', () => {
        it('setting valid field for ID is valid and renders rows', async () => {
            element.setData(simpleTableData);
            element.idFieldName = 'stringData';
            await connect();
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateRecordId).toBeFalse();
            expect(element.validity.invalidRecordId).toBeFalse();
            expect(element.validity.missingRecordId).toBeFalse();
        });

        it('setting invalid field for ID  is invalid and renders no rows', async () => {
            element.setData(simpleTableData);
            element.idFieldName = 'numericData';
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateRecordId).toBeFalse();
            expect(element.validity.invalidRecordId).toBeTrue();
            expect(element.validity.missingRecordId).toBeFalse();
        });

        it('setting ID field name to undefined makes an invalid table valid', async () => {
            element.setData(simpleTableData);
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            element.idFieldName = undefined;
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();
        });

        it('setting a valid ID field name makes an invalid table valid', async () => {
            element.setData(simpleTableData);
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();
        });

        it('setting invalid ID field name on valid table makes it invalid', async () => {
            element.setData(simpleTableData);
            element.idFieldName = 'stringData';
            await connect();
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();

            element.idFieldName = 'missingFieldName';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
        });
    });

    describe('column IDs', () => {
        it('duplicate column IDs marks the table as invalid and rows are not rendered', async () => {
            element.setData(simpleTableData);
            column1.columnId = 'my-column-id';
            column2.columnId = 'my-column-id';
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateColumnId).toBeTrue();
            expect(element.validity.missingColumnId).toBeFalse();
        });

        it('missing column IDs marks the table as invalid and rows are not rendered', async () => {
            element.setData(simpleTableData);
            column1.columnId = 'my-column-id';
            column2.columnId = undefined;
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateColumnId).toBeFalse();
            expect(element.validity.missingColumnId).toBeTrue();
        });

        it('table validity updates if column IDs become valid', async () => {
            element.setData(simpleTableData);
            column1.columnId = 'my-column-id';
            column2.columnId = undefined;
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            column2.setAttribute('column-id', 'my-other-column-id');
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();
        });

        it('table validity updates if column IDs become invalid', async () => {
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();

            column1.setAttribute('column-id', 'my-column-id');
            column2.setAttribute('column-id', 'my-column-id');
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
        });
    });

    describe('uses virtualization', () => {
        it('to render fewer rows (based on viewport size)', async () => {
            await connect();

            const data = [...largeTableData];
            element.setData(data);
            await waitForUpdatesAsync();

            const actualRowCount = pageObject.getRenderedRowCount();
            const approximateRowHeight = parseFloat(
                controlHeight.getValueFor(element)
            );
            const expectedRowCountUpperBound = (element.offsetHeight / approximateRowHeight) * 3;
            expect(actualRowCount).toBeLessThan(data.length);
            expect(actualRowCount).toBeLessThan(expectedRowCountUpperBound);
            const dataSubset = data.slice(0, actualRowCount);
            verifyRenderedData(dataSubset);
        });

        it('and allows viewing the last rows in the data after scrolling to the bottom', async () => {
            await connect();

            const data = [...largeTableData];
            element.setData(data);
            await waitForUpdatesAsync();
            await pageObject.scrollToLastRowAsync();

            const actualRowCount = pageObject.getRenderedRowCount();
            expect(actualRowCount).toBeLessThan(data.length);
            const dataSubsetAtEnd = data.slice(-actualRowCount);
            verifyRenderedData(dataSubsetAtEnd);
        });

        it('and shows additional rows when the table height increases', async () => {
            await connect();

            const data = [...largeTableData];
            element.setData(data);
            await waitForUpdatesAsync();

            const originalRenderedRowCount = pageObject.getRenderedRowCount();

            element.style.height = '700px';
            await waitForUpdatesAsync();

            const newRenderedRowCount = pageObject.getRenderedRowCount();
            expect(newRenderedRowCount).toBeGreaterThan(
                originalRenderedRowCount
            );
        });
    });

    describe('action menu', () => {
        function createAndSlotMenu(slot: string): { menu: Menu, items: MenuItem[] } {
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

        function createTableListener(
            eventName: string
        ): {
                promise: Promise<void>,
                spy: jasmine.Spy
            } {
            const spy = jasmine.createSpy();
            return {
                promise: new Promise(resolve => {
                    const handler = (...args: unknown[]): void => {
                        element.removeEventListener(eventName, handler);
                        spy(...args);
                        resolve();
                    };
                    element.addEventListener(eventName, handler);
                }),
                spy
            };
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

            // Open the menu button
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            const toggleListener = createTableListener('action-menu-toggle');
            menuButton.toggleButton!.control.click();
            await toggleListener.promise;

            pageObject.setRowHoverState(1, false);
            await waitForUpdatesAsync();
            expect(pageObject.isCellActionMenuVisible(1, 0)).toBeTrue();
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

            pageObject.setRowHoverState(1, false);
            await waitForUpdatesAsync();
            expect(pageObject.isCellActionMenuVisible(1, 0)).toBeFalse();
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
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            const toggleListener = createTableListener('action-menu-toggle');
            // Open a menu button for the first row to cause all the menus to be slotted within that row
            menuButton.toggleButton!.control.click();
            await toggleListener.promise;

            const rowSlots = element.shadowRoot!.querySelectorAll('nimble-table-row')?.item(1).querySelectorAll<HTMLSlotElement>('slot');
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
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            const toggleListener = createTableListener('action-menu-toggle');
            // Open a menu button for the first row to cause all the menus to be slotted within that row
            menuButton.toggleButton!.control.click();
            await toggleListener.promise;

            const rowSlots = element.shadowRoot!.querySelectorAll('nimble-table-row')?.item(1).querySelectorAll<HTMLSlotElement>('slot');
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

            const beforetoggleListener = createTableListener('action-menu-beforetoggle');
            pageObject.setRowHoverState(1, true);
            await waitForUpdatesAsync();
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            menuButton.toggleButton!.control.click();

            await beforetoggleListener.promise;
            expect(beforetoggleListener.spy).toHaveBeenCalledTimes(1);
            const expectedDetails: TableActionMenuToggleEventDetail = {
                newState: true,
                oldState: false,
                columnId: column1.columnId,
                recordIds: [simpleTableData[1].stringData]
            };
            const event = beforetoggleListener.spy.calls.first()
                .args[0] as CustomEvent;
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
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            menuButton.toggleButton!.control.click();
            await waitForUpdatesAsync();
            const beforetoggleListener = createTableListener('action-menu-beforetoggle');
            const escEvent = new KeyboardEvent('keydown', {
                key: keyEscape
            } as KeyboardEventInit);
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
                .args[0] as CustomEvent;
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

            const toggleListener = createTableListener('action-menu-toggle');
            pageObject.setRowHoverState(1, true);
            await waitForUpdatesAsync();
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            menuButton.toggleButton!.control.click();

            await toggleListener.promise;
            expect(toggleListener.spy).toHaveBeenCalledTimes(1);
            const expectedDetails: TableActionMenuToggleEventDetail = {
                newState: true,
                oldState: false,
                columnId: column1.columnId,
                recordIds: [simpleTableData[1].stringData]
            };
            const event = toggleListener.spy.calls.first()
                .args[0] as CustomEvent;
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
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            menuButton.toggleButton!.control.click();
            await waitForUpdatesAsync();
            const toggleListener = createTableListener('action-menu-toggle');
            const escEvent = new KeyboardEvent('keydown', {
                key: keyEscape
            } as KeyboardEventInit);
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
                .args[0] as CustomEvent;
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
            const toggleListener = createTableListener('action-menu-toggle');
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
            const toggleListener = createTableListener('action-menu-toggle');
            const menuButton = pageObject.getCellActionMenu(1, 0)!;
            const event = new KeyboardEvent('keydown', {
                key: keyArrowUp
            } as KeyboardEventInit);
            menuButton.toggleButton!.dispatchEvent(event);

            await toggleListener.promise;
            expect(document.activeElement).toEqual(menuItems[menuItems.length - 1]!);
        });
    });
});
