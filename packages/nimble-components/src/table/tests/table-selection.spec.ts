import { html } from '@microsoft/fast-element';
import type { Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    TableRecord,
    TableRowSelectionEventDetail,
    TableRowSelectionMode
} from '../types';
import { TablePageObject } from './table.pageobject';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
}

const simpleTableData = [
    {
        stringData: '0',
        stringData2: 'a'
    },
    {
        stringData: '1',
        stringData2: 'b'
    },
    {
        stringData: '2',
        stringData2: 'c'
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text field-name="stringData">stringData</nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table row selection', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let selectionChangeListener: {
        promise: Promise<void>,
        spy: jasmine.Spy
    };

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        selectionChangeListener = createEventListener(
            element,
            'selection-change'
        );

        await connect();
        element.setData(simpleTableData);
        await waitForUpdatesAsync();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('defaults to selection mode of "none"', () => {
        expect(element.selectionMode).toBe(TableRowSelectionMode.none);
    });

    it('configuration is valid when selection mode is "none" and an id field name is set', async () => {
        element.selectionMode = TableRowSelectionMode.none;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeTrue();
    });

    it('configuration is valid when selection mode is "none" and an id field name is not set', async () => {
        element.selectionMode = TableRowSelectionMode.none;
        element.idFieldName = undefined;
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeTrue();
    });

    it('configuration is valid when selection mode is "single" and an id field name is set', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeTrue();
    });

    it('configuration is invalid when selection mode is "single" and an id field name is not set', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = undefined;
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeFalse();
        expect(element.validity.idFieldNameNotConfigured).toBeTrue();
    });

    it('is cleared when selection mode changes', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.selectionMode = TableRowSelectionMode.none;
        await waitForUpdatesAsync();

        expect(element.getSelectedRecordIds()).toEqual([]);
    });

    it('does not fire selection-change event when selection is cleared when selection mode changes', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.selectionMode = TableRowSelectionMode.none;
        await waitForUpdatesAsync();

        expect(selectionChangeListener.spy).not.toHaveBeenCalled();
    });

    it('is cleared when id field name changes', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.idFieldName = 'stringData2';
        await waitForUpdatesAsync();

        expect(element.getSelectedRecordIds()).toEqual([]);
    });

    it('does not fire selection-change event when selection is cleared when id field name changes', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.idFieldName = 'stringData2';
        await waitForUpdatesAsync();

        expect(selectionChangeListener.spy).not.toHaveBeenCalled();
    });

    it('is updated when data is updated and no longer includes selected record', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.setData([
            {
                stringData: 'new-record',
                stringData2: 'with new values'
            }
        ]);
        await waitForUpdatesAsync();

        expect(element.getSelectedRecordIds()).toEqual([]);
    });

    it('is unchanged when data is updated but still includes selected record', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.setData([
            {
                stringData: 'new-record',
                stringData2: 'with new values'
            },
            {
                stringData: '1',
                stringData2: 'updated value'
            }
        ]);
        await waitForUpdatesAsync();

        expect(element.getSelectedRecordIds()).toEqual(['1']);
    });

    it('does not fire selection-change event when selection is changed when updating data', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.setData([
            {
                stringData: 'new-record',
                stringData2: 'with new values'
            }
        ]);
        await waitForUpdatesAsync();

        expect(selectionChangeListener.spy).not.toHaveBeenCalled();
    });

    it('does not update selection when data is updated to be invalid', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        element.setSelectedRecordIds(['1']);
        element.setData([
            {
                stringData: 'new-record',
                stringData2: 'with new values'
            },
            {
                stringData: 'new-record',
                stringData2: 'with same id'
            }
        ]);
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeFalse();
        expect(element.getSelectedRecordIds()).toEqual(['1']);
    });

    it('configures rows not to be selectable when selection mode is "none"', async () => {
        element.selectionMode = TableRowSelectionMode.none;
        await waitForUpdatesAsync();

        const rowCount = simpleTableData.length;
        for (let i = 0; i < rowCount; i++) {
            expect(pageObject.getIsRowSelectable(i)).toBeFalse();
        }
    });

    it('configures rows to be selected when a record ID is selected', async () => {
        element.selectionMode = TableRowSelectionMode.single;
        element.idFieldName = 'stringData';
        await waitForUpdatesAsync();

        const selectedIndex = 1;
        element.setSelectedRecordIds([
            simpleTableData[selectedIndex].stringData
        ]);
        await waitForUpdatesAsync();

        const rowCount = simpleTableData.length;
        for (let i = 0; i < rowCount; i++) {
            expect(pageObject.getIsRowSelectable(i)).toBeTrue();
            expect(pageObject.getIsRowSelected(i)).toBe(i === selectedIndex);
        }
    });

    describe('programmatic selection', () => {
        describe('with selection mode of "none"', () => {
            beforeEach(async () => {
                element.selectionMode = TableRowSelectionMode.none;
                element.idFieldName = 'stringData';
                await waitForUpdatesAsync();
            });

            it('nothing is selected by default', () => {
                expect(element.getSelectedRecordIds()).toEqual([]);
            });

            it('setting selection does not apply', () => {
                const selection = ['1'];
                element.setSelectedRecordIds(selection);
                expect(element.getSelectedRecordIds()).toEqual([]);
            });
        });

        describe('with selection mode of "single"', () => {
            beforeEach(async () => {
                element.selectionMode = TableRowSelectionMode.single;
                element.idFieldName = 'stringData';
                await waitForUpdatesAsync();
            });

            it('nothing is selected by default', () => {
                expect(element.getSelectedRecordIds()).toEqual([]);
            });

            it('can get and set selection with one record ID', () => {
                const selection = ['1'];
                element.setSelectedRecordIds(selection);
                expect(element.getSelectedRecordIds()).toEqual(selection);
            });

            it('does not apply selection when the record ID is not in the data set', () => {
                const selection = ['not-there'];
                element.setSelectedRecordIds(selection);
                expect(element.getSelectedRecordIds()).toEqual([]);
            });

            it('filters out selection when some record IDs are not in the data set', () => {
                const selection = ['not-there', '1'];
                element.setSelectedRecordIds(selection);
                expect(element.getSelectedRecordIds()).toEqual(['1']);
            });

            it('only applies first record ID', () => {
                const selection = ['1', '2'];
                element.setSelectedRecordIds(selection);
                expect(element.getSelectedRecordIds()).toEqual(['1']);
            });

            it('can clear selection', () => {
                element.setSelectedRecordIds(['1']);
                element.setSelectedRecordIds([]);
                expect(element.getSelectedRecordIds()).toEqual([]);
            });

            it('does not fire selection-change event when selection is changed by calling setSelectedRecordIds', () => {
                element.setSelectedRecordIds(['0']);
                expect(selectionChangeListener.spy).not.toHaveBeenCalled();
            });
        });
    });

    describe('interactive selection', () => {
        describe('with selection mode of "none"', () => {
            beforeEach(async () => {
                element.selectionMode = TableRowSelectionMode.none;
                element.idFieldName = 'stringData';
                await waitForUpdatesAsync();
            });

            it('clicking a row does not select it', () => {
                pageObject.clickRow(0);
                expect(element.getSelectedRecordIds()).toEqual([]);
            });

            it('clicking a row does not emit a selection-change event', () => {
                pageObject.clickRow(0);
                expect(selectionChangeListener.spy).not.toHaveBeenCalled();
            });
        });

        describe('with selection mode of "single"', () => {
            beforeEach(async () => {
                element.selectionMode = TableRowSelectionMode.single;
                element.idFieldName = 'stringData';
                await waitForUpdatesAsync();
            });

            it('clicking a row with no previous selection selects the clicked row and emits an event', () => {
                pageObject.clickRow(0);

                expect(element.getSelectedRecordIds()).toEqual(['0']);
                const expectedDetail: TableRowSelectionEventDetail = {
                    selectedRecordIds: ['0']
                };
                const event = selectionChangeListener.spy.calls.first()
                    .args[0] as CustomEvent<TableRowSelectionEventDetail>;
                expect(event.detail).toEqual(expectedDetail);
            });

            it('clicking a row with a different row previously selected selects the clicked row and deselects the other row and emits an event', () => {
                element.setSelectedRecordIds(['1']);

                pageObject.clickRow(0);
                expect(element.getSelectedRecordIds()).toEqual(['0']);
                const expectedDetail: TableRowSelectionEventDetail = {
                    selectedRecordIds: ['0']
                };
                const event = selectionChangeListener.spy.calls.first()
                    .args[0] as CustomEvent<TableRowSelectionEventDetail>;
                expect(event.detail).toEqual(expectedDetail);
            });

            it('clicking the already selected row maintains its selection and does not emit an event', () => {
                element.setSelectedRecordIds(['0']);

                pageObject.clickRow(0);

                expect(element.getSelectedRecordIds()).toEqual(['0']);
                expect(selectionChangeListener.spy).not.toHaveBeenCalled();
            });
        });
    });
});
