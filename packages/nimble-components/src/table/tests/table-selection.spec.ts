import { html } from '@microsoft/fast-element';
import { Table, tableTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    TableRecord,
    TableRowSelectionEventDetail,
    TableRowSelectionMode
} from '../types';
import { TablePageObject } from './table.pageobject';
import { TableColumnText, tableColumnTextTag } from '../../table-column/text';

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
    describe('with connection', () => {
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
            await element.setData(simpleTableData);
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

            await element.setSelectedRecordIds(['1']);
            element.selectionMode = TableRowSelectionMode.none;
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([]);
        });

        it('does not fire selection-change event when selection is cleared when selection mode changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.selectionMode = TableRowSelectionMode.none;
            await waitForUpdatesAsync();

            expect(selectionChangeListener.spy).not.toHaveBeenCalled();
        });

        it('is cleared when id field name changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.idFieldName = 'stringData2';
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([]);
        });

        it('does not fire selection-change event when selection is cleared when id field name changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.idFieldName = 'stringData2';
            await waitForUpdatesAsync();

            expect(selectionChangeListener.spy).not.toHaveBeenCalled();
        });

        it('is updated when data is updated and no longer includes selected record', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
                {
                    stringData: 'new-record',
                    stringData2: 'with new values'
                }
            ]);
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([]);
        });

        it('is unchanged when data is updated but still includes selected record', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
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

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual(['1']);
        });

        it('does not fire selection-change event when selection is changed when updating data', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
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

            await element.setSelectedRecordIds(['1']);
            await element.setData([
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
            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual(['1']);
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
            await element.setSelectedRecordIds([
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

                it('nothing is selected by default', async () => {
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                });

                it('setting selection does not apply', async () => {
                    const selection = ['1'];
                    await element.setSelectedRecordIds(selection);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                });
            });

            describe('with selection mode of "single"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.single;
                    element.idFieldName = 'stringData';
                    await waitForUpdatesAsync();
                });

                it('nothing is selected by default', async () => {
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                });

                it('can get and set selection with one record ID', async () => {
                    const selection = ['1'];
                    await element.setSelectedRecordIds(selection);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(selection);
                });

                it('does not apply selection when the record ID is not in the data set', async () => {
                    const selection = ['not-there'];
                    await element.setSelectedRecordIds(selection);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                });

                it('filters out selection when some record IDs are not in the data set', async () => {
                    const selection = ['not-there', '1'];
                    await element.setSelectedRecordIds(selection);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(['1']);
                });

                it('only applies first record ID', async () => {
                    const selection = ['1', '2'];
                    await element.setSelectedRecordIds(selection);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(['1']);
                });

                it('can clear selection', async () => {
                    await element.setSelectedRecordIds(['1']);
                    await element.setSelectedRecordIds([]);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                });

                it('does not fire selection-change event when selection is changed by calling setSelectedRecordIds', async () => {
                    await element.setSelectedRecordIds(['0']);
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

                it('clicking a row does not select it', async () => {
                    await pageObject.clickRow(0);
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                });

                it('clicking a row does not emit a selection-change event', async () => {
                    await pageObject.clickRow(0);
                    expect(selectionChangeListener.spy).not.toHaveBeenCalled();
                });
            });

            describe('with selection mode of "single"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.single;
                    element.idFieldName = 'stringData';
                    await waitForUpdatesAsync();
                });

                it('clicking a row with no previous selection selects the clicked row and emits an event', async () => {
                    await pageObject.clickRow(0);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(['0']);
                    const expectedDetail: TableRowSelectionEventDetail = {
                        selectedRecordIds: ['0']
                    };
                    const event = selectionChangeListener.spy.calls.first()
                        .args[0] as CustomEvent<TableRowSelectionEventDetail>;
                    expect(event.detail).toEqual(expectedDetail);
                });

                it('clicking a row with a different row previously selected selects the clicked row and deselects the other row and emits an event', async () => {
                    await element.setSelectedRecordIds(['1']);

                    await pageObject.clickRow(0);
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(['0']);
                    const expectedDetail: TableRowSelectionEventDetail = {
                        selectedRecordIds: ['0']
                    };
                    const event = selectionChangeListener.spy.calls.first()
                        .args[0] as CustomEvent<TableRowSelectionEventDetail>;
                    expect(event.detail).toEqual(expectedDetail);
                });

                it('clicking the already selected row maintains its selection and does not emit an event', async () => {
                    await element.setSelectedRecordIds(['0']);

                    await pageObject.clickRow(0);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(['0']);
                    expect(selectionChangeListener.spy).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('without connection', () => {
        let table: Table;

        beforeEach(async () => {
            table = Object.assign(document.createElement(tableTag), {
                selectionMode: TableRowSelectionMode.single,
                idFieldName: 'stringData'
            }) as Table;
            await table.setData(simpleTableData);
        });

        it('validates selection mode', async () => {
            table.idFieldName = undefined;
            await waitForUpdatesAsync();

            expect(table.checkValidity()).toBeFalse();
            expect(table.validity.idFieldNameNotConfigured).toBeTrue();
        });

        it('can get and set selection', async () => {
            const expectedSelection = [simpleTableData[1].stringData];
            await table.setSelectedRecordIds(expectedSelection);

            const selection = await table.getSelectedRecordIds();
            expect(selection).toEqual(jasmine.arrayWithExactContents(expectedSelection));
        });

        it('should not select records that do not exist', async () => {
            await table.setSelectedRecordIds(['not-a-real-record']);

            const selection = await table.getSelectedRecordIds();
            expect(selection).toEqual([]);
        });

        it('should not allow selection when selection mode is "none"', async () => {
            table.selectionMode = TableRowSelectionMode.none;
            await table.setSelectedRecordIds([simpleTableData[1].stringData]);

            const selection = await table.getSelectedRecordIds();
            expect(selection).toEqual([]);
        });

        it('should clear the selection when the selection mode changes', async () => {
            await table.setSelectedRecordIds([simpleTableData[1].stringData]);

            table.selectionMode = TableRowSelectionMode.none;

            const selection = await table.getSelectedRecordIds();
            expect(selection).toEqual([]);
        });

        it('updating data removes removed selection', async () => {
            await table.setSelectedRecordIds([simpleTableData[1].stringData]);
            await table.setData([]);

            const selection = await table.getSelectedRecordIds();
            expect(selection).toEqual([]);
        });

        it('updating data keeps selection that is still in the data array', async () => {
            const expectedSelection = [simpleTableData[1].stringData];
            await table.setSelectedRecordIds(expectedSelection);
            await table.setData(simpleTableData);

            const selection = await table.getSelectedRecordIds();
            expect(selection).toEqual(expectedSelection);
        });
    });
});
