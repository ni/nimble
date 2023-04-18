import { html } from '@microsoft/fast-element';
import { Table, tableTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    TableRecord,
    TableRowSelectionEventDetail,
    TableRowSelectionMode,
    TableRowSelectionState
} from '../types';
import { TablePageObject } from './table.pageobject';
import type { TableColumnText } from '../../table-column/text';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

interface SimpleTableRecord extends TableRecord {
    id: string;
    stringData: string;
    stringData2: string;
}

const simpleTableData = [
    {
        id: '0',
        stringData: '0',
        stringData2: 'a'
    },
    {
        id: '1',
        stringData: '1',
        stringData2: 'b'
    },
    {
        id: '2',
        stringData: '2',
        stringData2: 'c'
    },
    {
        id: '3',
        stringData: '3',
        stringData2: 'd'
    },
    {
        id: '4',
        stringData: '4',
        stringData2: 'e'
    },
    {
        id: '5',
        stringData: '5',
        stringData2: 'f'
    },
    {
        id: '6',
        stringData: '6',
        stringData2: 'g'
    },
    {
        id: '7',
        stringData: '7',
        stringData2: 'h'
    },
    {
        id: '8',
        stringData: '8',
        stringData2: 'i'
    }
] as const;

const groupableTableData = [
    {
        id: 'blue-cat-0',
        stringData: 'blue',
        stringData2: 'cat'
    },
    {
        id: 'green-dog-0',
        stringData: 'green',
        stringData2: 'dog'
    },
    {
        id: 'green-cat-0',
        stringData: 'green',
        stringData2: 'cat'
    },
    {
        id: 'green-cat-1',
        stringData: 'green',
        stringData2: 'cat'
    },
    {
        id: 'blue-dog-0',
        stringData: 'blue',
        stringData2: 'dog'
    },
    {
        id: 'green-cat-2',
        stringData: 'green',
        stringData2: 'cat'
    },
    {
        id: 'blue-cat-1',
        stringData: 'blue',
        stringData2: 'cat'
    },
    {
        id: 'purple-cat-0',
        stringData: 'purple',
        stringData2: 'cat'
    },
    {
        id: 'purple-dog-0',
        stringData: 'purple',
        stringData2: 'dog'
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text id="column1" field-name="stringData">stringData</nimble-table-column-text>
            <nimble-table-column-text id="column2" field-name="stringData2">stringData2</nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table row selection', () => {
    function getEmittedRecordIdsFromSpy(spy: jasmine.Spy): string[] {
        const event = spy.calls.first()
            .args[0] as CustomEvent<TableRowSelectionEventDetail>;
        return event.detail.selectedRecordIds;
    }

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

        it('aria-multiselectable is not set with a selection mode of "none"', async () => {
            element.selectionMode = TableRowSelectionMode.none;
            await connect();
            await waitForUpdatesAsync();

            expect(element.hasAttribute('aria-multiselectable')).toBeFalse();
        });

        it('aria-multiselectable is "false" with a selection mode of "single"', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            await connect();
            await waitForUpdatesAsync();

            expect(element.getAttribute('aria-multiselectable')).toEqual(
                'false'
            );
        });

        it('aria-multiselectable is "true" with a selection mode of "multiple"', async () => {
            element.selectionMode = TableRowSelectionMode.multiple;
            await connect();
            await waitForUpdatesAsync();

            expect(element.getAttribute('aria-multiselectable')).toEqual(
                'true'
            );
        });

        it('configuration is valid when selection mode is "none" and an id field name is set', async () => {
            element.selectionMode = TableRowSelectionMode.none;
            element.idFieldName = 'id';
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
            element.idFieldName = 'id';
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

        it('configuration is valid when selection mode is "multiple" and an id field name is set', async () => {
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeTrue();
        });

        it('configuration is invalid when selection mode is "multiple" and an id field name is not set', async () => {
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = undefined;
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.idFieldNameNotConfigured).toBeTrue();
        });

        it('is cleared when selection mode changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.selectionMode = TableRowSelectionMode.none;
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([]);
        });

        it('does not fire selection-change event when selection is cleared when selection mode changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.selectionMode = TableRowSelectionMode.none;
            await waitForUpdatesAsync();

            expect(selectionChangeListener.spy).not.toHaveBeenCalled();
        });

        it('is cleared when id field name changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.idFieldName = 'stringData2';
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([]);
        });

        it('does not fire selection-change event when selection is cleared when id field name changes', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            element.idFieldName = 'stringData2';
            await waitForUpdatesAsync();

            expect(selectionChangeListener.spy).not.toHaveBeenCalled();
        });

        it('is updated when data is updated and no longer includes selected record', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
                {
                    id: 'new-id',
                    stringData: 'new-record',
                    stringData2: 'with new values'
                }
            ]);
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([]);
        });

        it('is updated when data is updated and includes only some of the currently selected records', async () => {
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds([
                simpleTableData[0].stringData,
                simpleTableData[1].stringData
            ]);
            await element.setData([simpleTableData[1]]);
            await waitForUpdatesAsync();

            const currentSelection = await element.getSelectedRecordIds();
            expect(currentSelection).toEqual([simpleTableData[1].stringData]);
        });

        it('is unchanged when data is updated but still includes selected record', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
                {
                    id: 'new-record-id',
                    stringData: 'new-record',
                    stringData2: 'with new values'
                },
                {
                    id: '1',
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
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
                {
                    id: 'new-record-id',
                    stringData: 'new-record',
                    stringData2: 'with new values'
                }
            ]);
            await waitForUpdatesAsync();

            expect(selectionChangeListener.spy).not.toHaveBeenCalled();
        });

        it('does not update selection when data is updated to be invalid', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds(['1']);
            await element.setData([
                {
                    id: 'record-id',
                    stringData: 'new-record',
                    stringData2: 'with new values'
                },
                {
                    id: 'record-id',
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

        it('configures rows to hide selection checkbox when selection mode is "single"', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            const rowCount = simpleTableData.length;
            for (let i = 0; i < rowCount; i++) {
                expect(pageObject.getIsRowSelectable(i)).toBeTrue();
                expect(pageObject.isRowSelectionCheckboxVisible(i)).toBeFalse();
            }
        });

        it('configures rows to show selection checkbox when selection mode is "multiple"', async () => {
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            const rowCount = simpleTableData.length;
            for (let i = 0; i < rowCount; i++) {
                expect(pageObject.getIsRowSelectable(i)).toBeTrue();
                expect(pageObject.isRowSelectionCheckboxVisible(i)).toBeTrue();
            }
        });

        it('configures rows to be selected when a record ID is selected', async () => {
            element.selectionMode = TableRowSelectionMode.single;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            const selectedIndex = 1;
            await element.setSelectedRecordIds([
                simpleTableData[selectedIndex].stringData
            ]);
            await waitForUpdatesAsync();

            const rowCount = simpleTableData.length;
            for (let i = 0; i < rowCount; i++) {
                expect(pageObject.getIsRowSelectable(i)).toBeTrue();
                expect(pageObject.getIsRowSelected(i)).toBe(
                    i === selectedIndex
                );
            }
        });

        it('configures multiple rows to be selected when a multiple record IDs are selected', async () => {
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = 'id';
            await waitForUpdatesAsync();

            await element.setSelectedRecordIds([
                simpleTableData[0].stringData,
                simpleTableData[1].stringData
            ]);
            await waitForUpdatesAsync();

            expect(pageObject.getIsRowSelected(0)).toBeTrue();
            expect(pageObject.getIsRowSelected(1)).toBeTrue();
            expect(pageObject.getIsRowSelected(2)).toBeFalse();
        });

        describe('programmatic selection', () => {
            describe('with selection mode of "none"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.none;
                    element.idFieldName = 'id';
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
                    element.idFieldName = 'id';
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

            describe('with selection mode of "multiple"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.multiple;
                    element.idFieldName = 'id';
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

                it('only applies all record IDs', async () => {
                    const selection = ['1', '2'];
                    await element.setSelectedRecordIds(selection);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(selection);
                });

                it('can clear selection', async () => {
                    await element.setSelectedRecordIds(['1', '2']);
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
                    element.idFieldName = 'id';
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

                it('selection checkbox is not shown in header', () => {
                    expect(
                        pageObject.isTableSelectionCheckboxVisible()
                    ).toBeFalse();
                });
            });

            describe('with selection mode of "single"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.single;
                    element.idFieldName = 'id';
                    await waitForUpdatesAsync();
                });

                const configurations: {
                    name: string,
                    initialSelection: string[],
                    rowToClick: number,
                    clickModifiers: { shiftKey?: boolean, ctrlKey?: boolean },
                    expectedSelection: string[],
                    fireEvent: boolean
                }[] = [
                    {
                        name: 'clicking a row with no previous selection selects the clicked row and emits an event',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'CTRL + clicking a row with no previous selection selects the clicked row and emits an event',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'SHIFT + clicking a row with no previous selection selects the clicked row and emits an event',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: { shiftKey: true },
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'clicking a row with a different row previously selected selects the clicked row and deselects the other row and emits an event',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'CTRL + clicking a row with a different row previously selected selects the clicked row and deselects the other row and emits an event',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'SHIFT + clicking a row with a different row previously selected selects the clicked row and deselects the other row and emits an event',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: { shiftKey: true },
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'clicking the already selected row maintains its selection and does not emit an event',
                        initialSelection: ['0'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: false
                    },
                    {
                        name: 'CTRL + clicking the already selected row maintains its selection and does not emit an event',
                        initialSelection: ['0'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0'],
                        fireEvent: false
                    },
                    {
                        name: 'SHIFT + clicking the already selected row maintains its selection and does not emit an event',
                        initialSelection: ['0'],
                        rowToClick: 0,
                        clickModifiers: { shiftKey: true },
                        expectedSelection: ['0'],
                        fireEvent: false
                    }
                ];
                const focused: string[] = [];
                const disabled: string[] = [];
                for (const configuration of configurations) {
                    const specType = getSpecTypeByNamedList(
                        configuration,
                        focused,
                        disabled
                    );
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    specType(configuration.name, async () => {
                        await element.setSelectedRecordIds(
                            configuration.initialSelection
                        );
                        await pageObject.clickRow(
                            configuration.rowToClick,
                            configuration.clickModifiers
                        );

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(
                                configuration.expectedSelection
                            )
                        );
                        if (configuration.fireEvent) {
                            expect(
                                selectionChangeListener.spy
                            ).toHaveBeenCalledTimes(1);
                            const emittedIds = getEmittedRecordIdsFromSpy(
                                selectionChangeListener.spy
                            );
                            expect(emittedIds).toEqual(
                                jasmine.arrayWithExactContents(
                                    configuration.expectedSelection
                                )
                            );
                        } else {
                            expect(
                                selectionChangeListener.spy
                            ).not.toHaveBeenCalled();
                        }
                    });
                }

                it('selection checkbox is not shown in header', () => {
                    expect(
                        pageObject.isTableSelectionCheckboxVisible()
                    ).toBeFalse();
                });
            });

            describe('with selection mode of "multiple"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.multiple;
                    element.idFieldName = 'id';
                    await waitForUpdatesAsync();
                });

                const configurations: {
                    name: string,
                    initialSelection: string[],
                    rowToClick: number,
                    clickModifiers: { shiftKey?: boolean, ctrlKey?: boolean },
                    expectedSelection: string[],
                    fireEvent: boolean
                }[] = [
                    {
                        name: 'clicking a row with no previous selection selects the clicked row and emits an event',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'CTRL + clicking a row with no previous selection selects the clicked row and emits an event',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'clicking a row with one different row previously selected selects the clicked row and deselects the other row and emits an event',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'CTRL + clicking a row with one different row previously selected selects the clicked row, keeps the other row selected, and emits an event',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0', '1'],
                        fireEvent: true
                    },
                    {
                        name: 'clicking the already selected row maintains its selection and does not emit an event',
                        initialSelection: ['0'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: false
                    },
                    {
                        name: 'CTRL + clicking the already selected row deselects it and emits an event',
                        initialSelection: ['0'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: [],
                        fireEvent: true
                    },
                    {
                        name: 'clicking a row with multiple different rows previously selected selects the clicked row and deselects the other row and emits an event',
                        initialSelection: ['1', '2'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0'],
                        fireEvent: true
                    },
                    {
                        name: 'CTRL + clicking a row with multiple different rows previously adds the clicked row to the selection and emits an event',
                        initialSelection: ['1', '2'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0', '1', '2'],
                        fireEvent: true
                    },
                    {
                        name: 'clicking a selected row with multiple rows selected keeps the clicked row selected and deselects others emits an event',
                        initialSelection: ['1', '2'],
                        rowToClick: 1,
                        clickModifiers: {},
                        expectedSelection: ['1'],
                        fireEvent: true
                    },
                    {
                        name: 'CTRL + clicking a selected row with multiple rows selected deselects the clicked row, keeps others selected, and emits an event',
                        initialSelection: ['1', '2'],
                        rowToClick: 1,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['2'],
                        fireEvent: true
                    }
                ];
                const focused: string[] = [];
                const disabled: string[] = [];
                for (const configuration of configurations) {
                    const specType = getSpecTypeByNamedList(
                        configuration,
                        focused,
                        disabled
                    );
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    specType(configuration.name, async () => {
                        await element.setSelectedRecordIds(
                            configuration.initialSelection
                        );
                        await pageObject.clickRow(
                            configuration.rowToClick,
                            configuration.clickModifiers
                        );

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(
                                configuration.expectedSelection
                            )
                        );
                        if (configuration.fireEvent) {
                            expect(
                                selectionChangeListener.spy
                            ).toHaveBeenCalledTimes(1);
                            const emittedIds = getEmittedRecordIdsFromSpy(
                                selectionChangeListener.spy
                            );
                            expect(emittedIds).toEqual(
                                jasmine.arrayWithExactContents(
                                    configuration.expectedSelection
                                )
                            );
                        } else {
                            expect(
                                selectionChangeListener.spy
                            ).not.toHaveBeenCalled();
                        }
                    });
                }

                it('can select a row range by clicking a row and then clicking a row farther down the table', async () => {
                    const firstRowToSelect = 1;
                    const lastRowToSelect = simpleTableData.length - 2;
                    const expectedSelection = simpleTableData
                        .slice(1, -1)
                        .map(x => x.id);

                    await pageObject.clickRow(firstRowToSelect);

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    await pageObject.clickRow(lastRowToSelect, {
                        shiftKey: true
                    });
                    await multiSelectListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                    expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        multiSelectListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                });

                it('can select a row range by clicking a row and then clicking a row farther up the table', async () => {
                    const firstRowToSelect = simpleTableData.length - 2;
                    const lastRowToSelect = 1;
                    const expectedSelection = simpleTableData
                        .slice(1, -1)
                        .map(x => x.id);

                    await pageObject.clickRow(firstRowToSelect);

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    await pageObject.clickRow(lastRowToSelect, {
                        shiftKey: true
                    });
                    await multiSelectListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                    expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        multiSelectListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                });

                it('range selection with shift is based on row clicked prior to holding shift', async () => {
                    const firstRowToSelect = 3;
                    const lastRowToSelect = simpleTableData.length - 2;
                    const expectedSelection = simpleTableData
                        .slice(3, -1)
                        .map(x => x.id);

                    await pageObject.clickRow(firstRowToSelect);
                    await pageObject.clickRow(0, { shiftKey: true });

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    await pageObject.clickRow(lastRowToSelect, {
                        shiftKey: true
                    });
                    await multiSelectListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                    expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        multiSelectListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                });

                it('can select multiple rows by clicking their selection checkboxes', async () => {
                    pageObject.clickRowSelectionCheckbox(0);
                    pageObject.clickRowSelectionCheckbox(1);
                    await waitForUpdatesAsync();

                    const selectedRecordIds = await element.getSelectedRecordIds();
                    expect(selectedRecordIds).toEqual(
                        jasmine.arrayWithExactContents([
                            simpleTableData[0].stringData,
                            simpleTableData[1].stringData
                        ])
                    );
                });

                it('can deselect a single row by clicking the selection checkbox for the row', async () => {
                    const recordIds = simpleTableData.map(x => x.stringData);
                    await element.setSelectedRecordIds(recordIds);
                    await waitForUpdatesAsync();

                    pageObject.clickRowSelectionCheckbox(0);
                    await waitForUpdatesAsync();

                    recordIds.splice(0, 1);
                    const selectedRecordIds = await element.getSelectedRecordIds();
                    expect(selectedRecordIds).toEqual(
                        jasmine.arrayWithExactContents(recordIds)
                    );
                });

                it('can select a range using row checkboxes', async () => {
                    const firstRowToSelect = 1;
                    const lastRowToSelect = simpleTableData.length - 2;
                    const expectedSelection = simpleTableData
                        .slice(1, -1)
                        .map(x => x.id);

                    pageObject.clickRowSelectionCheckbox(firstRowToSelect);

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    pageObject.clickRowSelectionCheckbox(lastRowToSelect, true);
                    await multiSelectListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                    expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        multiSelectListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                });

                it('can select a row range by clicking a row and then clicking a row farther up the table', async () => {
                    const firstRowToSelect = simpleTableData.length - 2;
                    const lastRowToSelect = 1;
                    const expectedSelection = simpleTableData
                        .slice(1, -1)
                        .map(x => x.id);

                    await pageObject.clickRow(firstRowToSelect);

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    await pageObject.clickRow(lastRowToSelect, {
                        shiftKey: true
                    });
                    await multiSelectListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                    expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        multiSelectListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                });

                it('range selection with shift is based on row clicked prior to holding shift', async () => {
                    const firstRowToSelect = 3;
                    const lastRowToSelect = simpleTableData.length - 2;
                    const expectedSelection = simpleTableData
                        .slice(3, -1)
                        .map(x => x.id);

                    await pageObject.clickRow(firstRowToSelect);
                    await pageObject.clickRow(0, { shiftKey: true });

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    await pageObject.clickRow(lastRowToSelect, {
                        shiftKey: true
                    });
                    await multiSelectListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                    expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        multiSelectListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(expectedSelection)
                    );
                });

                fit('ending range selection by clicking selected checkbox keeps the row selected', async () => {
                    const firstRowToSelect = 1;
                    const lastRowToSelect = simpleTableData.length - 2;

                    // Start with "lastRowToSelect" already selected
                    await element.setSelectedRecordIds([simpleTableData[lastRowToSelect]!.id]);
                    await waitForUpdatesAsync();

                    pageObject.clickRowSelectionCheckbox(firstRowToSelect);

                    const multiSelectListener = createEventListener(
                        element,
                        'selection-change'
                    );
                    pageObject.clickRowSelectionCheckbox(lastRowToSelect, true);
                    await multiSelectListener.promise;

                    expect(pageObject.getRowSelectionState(lastRowToSelect)).toBe(TableRowSelectionState.selected);
                });

                describe('header selection checkbox', () => {
                    it('is shown', () => {
                        expect(
                            pageObject.isTableSelectionCheckboxVisible()
                        ).toBeTrue();
                    });

                    it('is unchecked by default', () => {
                        expect(pageObject.getTableSelectionState()).toBe(
                            TableRowSelectionState.notSelected
                        );
                    });

                    it('is indeterminate with a partial selection', async () => {
                        await element.setSelectedRecordIds([
                            simpleTableData[0].stringData
                        ]);
                        expect(pageObject.getTableSelectionState()).toBe(
                            TableRowSelectionState.partiallySelected
                        );
                    });

                    it('is checked with a complete selection', async () => {
                        const allRecordIds = simpleTableData.map(
                            x => x.stringData
                        );
                        await element.setSelectedRecordIds(allRecordIds);

                        expect(pageObject.getTableSelectionState()).toBe(
                            TableRowSelectionState.selected
                        );
                    });

                    it('is unchecked when selection is cleared', async () => {
                        const allRecordIds = simpleTableData.map(
                            x => x.stringData
                        );
                        await element.setSelectedRecordIds(allRecordIds);
                        await element.setSelectedRecordIds([]);

                        expect(pageObject.getTableSelectionState()).toBe(
                            TableRowSelectionState.notSelected
                        );
                    });

                    it('selects all rows and fires event when clicked while unchecked', async () => {
                        const allRecordIds = simpleTableData.map(
                            x => x.stringData
                        );
                        pageObject.clickTableSelectionCheckbox();

                        await selectionChangeListener.promise;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(allRecordIds)
                        );
                        expect(
                            selectionChangeListener.spy
                        ).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(
                            selectionChangeListener.spy
                        );
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(allRecordIds)
                        );
                    });

                    it('selects all rows and fires event when clicked while indeterminate', async () => {
                        const allRecordIds = simpleTableData.map(
                            x => x.stringData
                        );
                        await element.setSelectedRecordIds([
                            simpleTableData[0].stringData
                        ]);
                        pageObject.clickTableSelectionCheckbox();

                        await selectionChangeListener.promise;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(allRecordIds)
                        );
                        expect(
                            selectionChangeListener.spy
                        ).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(
                            selectionChangeListener.spy
                        );
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(allRecordIds)
                        );
                    });

                    it('deselects all rows and fires event when clicked while checked', async () => {
                        const allRecordIds = simpleTableData.map(
                            x => x.stringData
                        );
                        await element.setSelectedRecordIds(allRecordIds);
                        pageObject.clickTableSelectionCheckbox();

                        await selectionChangeListener.promise;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual([]);
                        const emittedIds = getEmittedRecordIdsFromSpy(
                            selectionChangeListener.spy
                        );
                        expect(emittedIds).toEqual([]);
                    });
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
            expect(selection).toEqual(
                jasmine.arrayWithExactContents(expectedSelection)
            );
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

    describe('multi-select with grouping', () => {
        let element: Table<SimpleTableRecord>;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: TablePageObject<SimpleTableRecord>;
        let selectionChangeListener: {
            promise: Promise<void>,
            spy: jasmine.Spy
        };
        let column1: TableColumnText;
        let column2: TableColumnText;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = 'id';
            column1 = element.querySelector<TableColumnText>('#column1')!;
            column2 = element.querySelector<TableColumnText>('#column2')!;

            pageObject = new TablePageObject<SimpleTableRecord>(element);
            selectionChangeListener = createEventListener(
                element,
                'selection-change'
            );

            await connect();
            await element.setData(groupableTableData);
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        describe('one level of grouping', () => {
            const blueGroupIndex = 0;
            const greenGroupIndex = 1;

            beforeEach(async () => {
                column1.groupIndex = 0;
                await waitForUpdatesAsync();
            });

            it('table selection checkbox is not checked when no rows are selected', () => {
                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.notSelected
                );
            });

            it('table selection checkbox is checked when all leaf rows are selected', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds(allRecordIds);

                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.selected
                );
            });

            it('table selection checkbox is indeterminate when some leaf rows are selected', async () => {
                // Select all records in the "Green" group
                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);
                await element.setSelectedRecordIds(allGreenRecordIds);

                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.partiallySelected
                );
            });

            it('clicking unchecked selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                pageObject.clickTableSelectionCheckbox();

                await selectionChangeListener.promise;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    selectionChangeListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            it('clicking checked selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds(allRecordIds);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener.promise;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual([]);
                expect(selectionChangeListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    selectionChangeListener.spy
                );
                expect(emittedIds).toEqual([]);
            });

            it('clicking indeterminate selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds([groupableTableData[0].id]);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener.promise;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    selectionChangeListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            it('shift clicking across a group row does not select all items in the group', async () => {
                const allBlueRecordIds = groupableTableData
                    .filter(x => x.id.includes('blue-'))
                    .map(x => x.id);
                const lastBlueRecordId = allBlueRecordIds[allBlueRecordIds.length - 1];
                const lastBlueRowIndex = allBlueRecordIds.length - 1;

                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);
                const firstGreenRecordId = allGreenRecordIds[0];
                const firstGreenRowIndex = allBlueRecordIds.length;

                await pageObject.clickRow(lastBlueRowIndex);

                const multiSelectListener = createEventListener(
                    element,
                    'selection-change'
                );
                await pageObject.clickRow(firstGreenRowIndex, {
                    shiftKey: true
                });
                await multiSelectListener.promise;

                const expectedSelection = [
                    lastBlueRecordId,
                    firstGreenRecordId
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    multiSelectListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
            });

            it('shift clicking to a group row selects all rows in the group', async () => {
                const allBlueRecordIds = groupableTableData
                    .filter(x => x.id.includes('blue-'))
                    .map(x => x.id);
                const lastBlueRecordId = allBlueRecordIds[allBlueRecordIds.length - 1];
                const lastBlueRowIndex = allBlueRecordIds.length - 1;

                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);

                await pageObject.clickRow(lastBlueRowIndex);

                const multiSelectListener = createEventListener(
                    element,
                    'selection-change'
                );
                pageObject.clickGroupRowSelectionCheckbox(
                    greenGroupIndex,
                    true
                );
                await multiSelectListener.promise;

                const expectedSelection = [
                    lastBlueRecordId,
                    ...allGreenRecordIds
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    multiSelectListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
            });

            fit('shift clicking to an already selected group keeps it selected', async () => {
                const allBlueRecordIds = groupableTableData
                    .filter(x => x.id.includes('blue-'))
                    .map(x => x.id);
                const lastBlueRecordId = allBlueRecordIds[allBlueRecordIds.length - 1];
                const lastBlueRowIndex = allBlueRecordIds.length - 1;

                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);

                // Start with the "green" group selected
                pageObject.clickGroupRowSelectionCheckbox(
                    greenGroupIndex
                );
                await pageObject.clickRow(lastBlueRowIndex);

                const multiSelectListener = createEventListener(
                    element,
                    'selection-change'
                );
                pageObject.clickGroupRowSelectionCheckbox(
                    greenGroupIndex,
                    true
                );
                await multiSelectListener.promise;

                const expectedSelection = [
                    lastBlueRecordId,
                    ...allGreenRecordIds
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    multiSelectListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(pageObject.getGroupRowSelectionState(greenGroupIndex)).toBe(TableRowSelectionState.selected);
            });

            describe('group selection checkbox', () => {
                it('group selection checkbox default to not checked', () => {
                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.notSelected);
                });

                it('clicking unchecked group selection checkbox selects all children and emits event', async () => {
                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                });

                it('clicking checked group selection checkbox deselects all children and emits event', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    await element.setSelectedRecordIds(allBlueRecordIds);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual([]);
                });

                it('clicking group selection checkbox does not modify selection of rows not in the group', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstGreenRecordId = groupableTableData.filter(x => x.id.includes('green-'))[0]!.id;
                    const recordIdsToSelect = [
                        ...allBlueRecordIds,
                        firstGreenRecordId
                    ];
                    await element.setSelectedRecordIds(recordIdsToSelect);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([firstGreenRecordId]);
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual([firstGreenRecordId]);
                });

                it('clicking indeterminate group selection checkbox selects all children and emits event', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstBlueRecordId = allBlueRecordIds[0]!;
                    await element.setSelectedRecordIds([firstBlueRecordId]);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                });

                it('selecting a row within a group makes the group row indeterminate', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstBlueRecordId = allBlueRecordIds[0]!;
                    await element.setSelectedRecordIds([firstBlueRecordId]);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.partiallySelected);
                });

                it('selecting all rows within a group makes the group row checked', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    await element.setSelectedRecordIds(allBlueRecordIds);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.selected);
                });

                it('deselecting all rows within a group makes the group row unchecked', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    await element.setSelectedRecordIds(allBlueRecordIds);
                    await element.setSelectedRecordIds([]);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.notSelected);
                });
            });
        });

        describe('two levels of grouping', () => {
            beforeEach(async () => {
                column1.groupIndex = 0;
                column2.groupIndex = 1;
                await waitForUpdatesAsync();
            });

            it('table selection checkbox is not checked when no rows are selected', () => {
                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.notSelected
                );
            });

            it('table selection checkbox is checked when all leaf rows are selected', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds(allRecordIds);

                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.selected
                );
            });

            it('table selection checkbox is indeterminate when some leaf rows are selected', async () => {
                // Select all records in the "Green" group
                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);
                await element.setSelectedRecordIds(allGreenRecordIds);

                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.partiallySelected
                );
            });

            it('clicking unchecked selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                pageObject.clickTableSelectionCheckbox();

                await selectionChangeListener.promise;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    selectionChangeListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            it('clicking checked selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds(allRecordIds);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener.promise;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual([]);
                expect(selectionChangeListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    selectionChangeListener.spy
                );
                expect(emittedIds).toEqual([]);
            });

            it('clicking indeterminate selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds([groupableTableData[0].id]);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener.promise;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeListener.spy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(
                    selectionChangeListener.spy
                );
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            describe('group selection checkbox', () => {
                const blueGroupIndex = 0;

                it('group selection checkbox default to not checked', () => {
                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.notSelected);
                });

                it('clicking unchecked group selection checkbox selects all children and emits event', async () => {
                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                });

                it('clicking checked group selection checkbox deselects all children and emits event', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    await element.setSelectedRecordIds(allBlueRecordIds);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual([]);
                });

                it('clicking group selection checkbox does not modify selection of rows not in the group', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstGreenRecordId = groupableTableData.filter(x => x.id.includes('green-'))[0]!.id;
                    const recordIdsToSelect = [
                        ...allBlueRecordIds,
                        firstGreenRecordId
                    ];
                    await element.setSelectedRecordIds(recordIdsToSelect);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([firstGreenRecordId]);
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual([firstGreenRecordId]);
                });

                it('clicking indeterminate group selection checkbox selects all children and emits event', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstBlueRecordId = allBlueRecordIds[0]!;
                    await element.setSelectedRecordIds([firstBlueRecordId]);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener.promise;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeListener.spy).toHaveBeenCalledTimes(
                        1
                    );
                    const emittedIds = getEmittedRecordIdsFromSpy(
                        selectionChangeListener.spy
                    );
                    expect(emittedIds).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                });

                it('selecting a row within a group makes the group row indeterminate', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstBlueRecordId = allBlueRecordIds[0]!;
                    await element.setSelectedRecordIds([firstBlueRecordId]);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.partiallySelected);
                });

                it('selecting all rows within a group makes the group row checked', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    await element.setSelectedRecordIds(allBlueRecordIds);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.selected);
                });

                it('deselecting all rows within a group makes the group row unchecked', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    await element.setSelectedRecordIds(allBlueRecordIds);
                    await element.setSelectedRecordIds([]);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.notSelected);
                });

                describe('subgroup selection checkbox', () => {
                    const blueCatGroupIndex = 1;
                    const blueDogGroupIndex = 2;

                    it('selecting a row within a group makes the group row indeterminate', async () => {
                        const allBlueRecordIds = groupableTableData
                            .filter(x => x.id.includes('blue-cat-'))
                            .map(x => x.id);
                        const firstBlueRecordId = allBlueRecordIds[0]!;
                        await element.setSelectedRecordIds([firstBlueRecordId]);
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.partiallySelected);
                    });

                    it('selecting all rows within a group makes the group row checked', async () => {
                        const allBlueRecordIds = groupableTableData
                            .filter(x => x.id.includes('blue-cat-'))
                            .map(x => x.id);
                        await element.setSelectedRecordIds(allBlueRecordIds);
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.selected);
                    });

                    it('deselecting all rows within a group makes the group row unchecked', async () => {
                        const allBlueRecordIds = groupableTableData
                            .filter(x => x.id.includes('blue-cat-'))
                            .map(x => x.id);
                        await element.setSelectedRecordIds(allBlueRecordIds);
                        await element.setSelectedRecordIds([]);
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.notSelected);
                    });

                    it('deselecting all rows within a group makes the group row unchecked', async () => {
                        const allBlueRecordIds = groupableTableData
                            .filter(x => x.id.includes('blue-cat-'))
                            .map(x => x.id);
                        await element.setSelectedRecordIds(allBlueRecordIds);
                        await element.setSelectedRecordIds([]);
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.notSelected);
                    });

                    it('selecting all sub groups within a group makes the group row checked', async () => {
                        pageObject.clickGroupRowSelectionCheckbox(
                            blueCatGroupIndex
                        );
                        pageObject.clickGroupRowSelectionCheckbox(
                            blueDogGroupIndex
                        );
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getGroupRowSelectionState(blueGroupIndex)
                        ).toBe(TableRowSelectionState.selected);
                    });

                    it('selecting all parent group makes all sub groups selected', async () => {
                        pageObject.clickGroupRowSelectionCheckbox(
                            blueGroupIndex
                        );
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.selected);
                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueDogGroupIndex
                            )
                        ).toBe(TableRowSelectionState.selected);
                    });

                    it('selecting single leaf row updates all its group parents to be indeterminate', async () => {
                        const firstBlueCatRecordId = groupableTableData
                            .filter(x => x.id.includes('blue-cat-'))
                            .map(x => x.id)[0]!;
                        await element.setSelectedRecordIds([
                            firstBlueCatRecordId
                        ]);
                        await waitForUpdatesAsync();

                        expect(pageObject.getTableSelectionState()).toBe(
                            TableRowSelectionState.partiallySelected
                        );
                        expect(
                            pageObject.getGroupRowSelectionState(blueGroupIndex)
                        ).toBe(TableRowSelectionState.partiallySelected);
                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.partiallySelected);
                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueDogGroupIndex
                            )
                        ).toBe(TableRowSelectionState.notSelected);
                    });

                    it('deselecting single leaf row updates all its group parents to be indeterminate', async () => {
                        const allRecordIds = groupableTableData.map(x => x.id);
                        await element.setSelectedRecordIds(allRecordIds);
                        await waitForUpdatesAsync();

                        const firstBlueCatRecordId = groupableTableData
                            .filter(x => x.id.includes('blue-cat-'))
                            .map(x => x.id)[0]!;
                        const newSelection = allRecordIds.filter(
                            x => x !== firstBlueCatRecordId
                        );
                        await element.setSelectedRecordIds(newSelection);
                        await waitForUpdatesAsync();

                        expect(pageObject.getTableSelectionState()).toBe(
                            TableRowSelectionState.partiallySelected
                        );
                        expect(
                            pageObject.getGroupRowSelectionState(blueGroupIndex)
                        ).toBe(TableRowSelectionState.partiallySelected);
                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueCatGroupIndex
                            )
                        ).toBe(TableRowSelectionState.partiallySelected);
                        expect(
                            pageObject.getGroupRowSelectionState(
                                blueDogGroupIndex
                            )
                        ).toBe(TableRowSelectionState.selected);
                    });
                });
            });
        });
    });
});
