import { html } from '@ni/fast-element';
import { keyArrowDown, keySpace, keyTab } from '@ni/fast-web-utilities';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Table, tableTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import {
    waitForEvent,
    sendKeyDownEvents
} from '../../utilities/testing/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    type TableRecord,
    type TableRowSelectionEventDetail,
    TableRowSelectionMode,
    TableRowSelectionState
} from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import {
    tableColumnTextTag,
    type TableColumnText
} from '../../table-column/text';

interface SimpleTableRecord extends TableRecord {
    id: string;
    stringData: string;
    stringData2: string;
    parentId?: string;
}

type TableRowSelectionEventHandler = (
    evt: CustomEvent<TableRowSelectionEventDetail>
) => void;

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

/**
 * Hierarchical data that creates the following tree:
 * 0 (purple dog)
 *   0.0
 *     0.0.0
 *     0.0.1
 *   0.1
 *   0.2
 *     0.2.0
 * 1 (green dog)
 * 2 (green cat)
 *   2.0
 * 3 (purple dog)
 */
const hierarchicalData = [
    {
        id: '0',
        stringData: 'purple',
        stringData2: 'dog',
        parentId: undefined
    },
    {
        id: '0.0',
        stringData: 'red',
        stringData2: 'llama',
        parentId: '0'
    },
    {
        id: '0.0.0',
        stringData: 'yellow',
        stringData2: 'dog',
        parentId: '0.0'
    },
    {
        id: '0.0.1',
        stringData: 'purple',
        stringData2: 'cat',
        parentId: '0.0'
    },
    {
        id: '0.1',
        stringData: 'yellow',
        stringData2: 'cat',
        parentId: '0'
    },
    {
        id: '0.2',
        stringData: 'orange',
        stringData2: 'ant',
        parentId: '0'
    },
    {
        id: '0.2.0',
        stringData: 'blue',
        stringData2: 'dog',
        parentId: '0.2'
    },
    {
        id: '1',
        stringData: 'green',
        stringData2: 'dog',
        parentId: undefined
    },
    {
        id: '2',
        stringData: 'green',
        stringData2: 'cat',
        parentId: undefined
    },
    {
        id: '2.0',
        stringData: '2',
        stringData2: 'c',
        parentId: '2'
    },
    {
        id: '3',
        stringData: 'purple',
        stringData2: 'dog',
        parentId: undefined
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return await fixture<Table<SimpleTableRecord>>(
        html`<${tableTag}>
            <${tableColumnTextTag} id="column1" field-name="stringData">stringData</${tableColumnTextTag}>
            <${tableColumnTextTag} id="column2" field-name="stringData2">stringData2</${tableColumnTextTag}>
        </${tableTag}>`
    );
}

describe('Table row selection', () => {
    function getEmittedRecordIdsFromSpy(
        spy: jasmine.Spy<TableRowSelectionEventHandler>
    ): string[] {
        const event = spy.calls.first().args[0];
        return event.detail.selectedRecordIds;
    }

    describe('with connection', () => {
        let element: Table<SimpleTableRecord>;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: TablePageObject<SimpleTableRecord>;
        let column1: TableColumnText;
        let selectionChangeSpy: jasmine.Spy;
        let selectionChangeListener: Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            pageObject = new TablePageObject<SimpleTableRecord>(element);
            column1 = element.querySelector<TableColumnText>('#column1')!;
            selectionChangeSpy = jasmine.createSpy();
            selectionChangeListener = waitForEvent(
                element,
                'selection-change',
                selectionChangeSpy
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

            expect(selectionChangeSpy).not.toHaveBeenCalled();
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

            expect(selectionChangeSpy).not.toHaveBeenCalled();
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

            expect(selectionChangeSpy).not.toHaveBeenCalled();
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
                    expect(selectionChangeSpy).not.toHaveBeenCalled();
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
                    expect(selectionChangeSpy).not.toHaveBeenCalled();
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
                    expect(selectionChangeSpy).not.toHaveBeenCalled();
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

                it('selection checkbox is not shown in header', () => {
                    expect(
                        pageObject.isTableSelectionCheckboxVisible()
                    ).toBeFalse();
                });

                describe('interactions that modify the selection', () => {
                    const configurations = [
                        {
                            name: 'clicking a row with no previous selection selects the clicked row',
                            initialSelection: [],
                            rowToClick: 0,
                            clickModifiers: {},
                            expectedSelection: ['0']
                        },
                        {
                            name: 'CTRL + clicking a row with no previous selection selects the clicked row',
                            initialSelection: [],
                            rowToClick: 0,
                            clickModifiers: { ctrlKey: true },
                            expectedSelection: ['0']
                        },
                        {
                            name: 'SHIFT + clicking a row with no previous selection selects the clicked row',
                            initialSelection: [],
                            rowToClick: 0,
                            clickModifiers: { shiftKey: true },
                            expectedSelection: ['0']
                        },
                        {
                            name: 'clicking a row with a different row previously selected selects the clicked row and deselects the other row',
                            initialSelection: ['1'],
                            rowToClick: 0,
                            clickModifiers: {},
                            expectedSelection: ['0']
                        },
                        {
                            name: 'CTRL + clicking a row with a different row previously selected selects the clicked row and deselects the other row',
                            initialSelection: ['1'],
                            rowToClick: 0,
                            clickModifiers: { ctrlKey: true },
                            expectedSelection: ['0']
                        },
                        {
                            name: 'SHIFT + clicking a row with a different row previously selected selects the clicked row and deselects the other row',
                            initialSelection: ['1'],
                            rowToClick: 0,
                            clickModifiers: { shiftKey: true },
                            expectedSelection: ['0']
                        }
                    ] as const;
                    parameterizeSpec(configurations, (spec, name, value) => {
                        spec(name, async () => {
                            await element.setSelectedRecordIds(
                                value.initialSelection
                            );
                            await pageObject.clickRow(
                                value.rowToClick,
                                value.clickModifiers
                            );

                            const currentSelection = await element.getSelectedRecordIds();
                            expect(currentSelection).toEqual(
                                jasmine.arrayWithExactContents(
                                    value.expectedSelection
                                )
                            );
                            expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                            const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                            expect(emittedIds).toEqual(
                                jasmine.arrayWithExactContents(
                                    value.expectedSelection
                                )
                            );
                        });
                    });
                });

                describe('interactions that do not modify the selection', () => {
                    const configurations = [
                        {
                            name: 'clicking the already selected row maintains its selection',
                            initialSelection: ['0'],
                            rowToClick: 0,
                            clickModifiers: {}
                        },
                        {
                            name: 'CTRL + clicking the already selected row maintains its selection',
                            initialSelection: ['0'],
                            rowToClick: 0,
                            clickModifiers: { ctrlKey: true }
                        },
                        {
                            name: 'SHIFT + clicking the already selected row maintains its selection',
                            initialSelection: ['0'],
                            rowToClick: 0,
                            clickModifiers: { shiftKey: true }
                        }
                    ] as const;
                    parameterizeSpec(configurations, (spec, name, value) => {
                        spec(name, async () => {
                            await element.setSelectedRecordIds(
                                value.initialSelection
                            );
                            await pageObject.clickRow(
                                value.rowToClick,
                                value.clickModifiers
                            );

                            const currentSelection = await element.getSelectedRecordIds();
                            expect(currentSelection).toEqual(
                                jasmine.arrayWithExactContents(
                                    value.initialSelection
                                )
                            );
                            expect(selectionChangeSpy).not.toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('with selection mode of "multiple"', () => {
                beforeEach(async () => {
                    element.selectionMode = TableRowSelectionMode.multiple;
                    element.idFieldName = 'id';
                    await waitForUpdatesAsync();
                });

                const configurations = [
                    {
                        name: 'clicking a row with no previous selection selects the clicked row',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0']
                    },
                    {
                        name: 'CTRL + clicking a row with no previous selection selects the clicked row',
                        initialSelection: [],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0']
                    },
                    {
                        name: 'clicking a row with one different row previously selected selects the clicked row and deselects the other row',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0']
                    },
                    {
                        name: 'CTRL + clicking a row with one different row previously selected selects the clicked row and keeps the other row selected',
                        initialSelection: ['1'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0', '1']
                    },
                    {
                        name: 'CTRL + clicking the already selected row deselects it',
                        initialSelection: ['0'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: []
                    },
                    {
                        name: 'clicking a row with multiple different rows previously selected selects the clicked row and deselects the other row',
                        initialSelection: ['1', '2'],
                        rowToClick: 0,
                        clickModifiers: {},
                        expectedSelection: ['0']
                    },
                    {
                        name: 'CTRL + clicking a row with multiple different rows previously adds the clicked row to the selection',
                        initialSelection: ['1', '2'],
                        rowToClick: 0,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['0', '1', '2']
                    },
                    {
                        name: 'clicking a selected row with multiple rows selected keeps the clicked row selected and deselects others',
                        initialSelection: ['1', '2'],
                        rowToClick: 1,
                        clickModifiers: {},
                        expectedSelection: ['1']
                    },
                    {
                        name: 'CTRL + clicking a selected row with multiple rows selected deselects the clicked row and keeps others selected',
                        initialSelection: ['1', '2'],
                        rowToClick: 1,
                        clickModifiers: { ctrlKey: true },
                        expectedSelection: ['2']
                    }
                ] as const;
                parameterizeSpec(configurations, (spec, name, value) => {
                    spec(name, async () => {
                        await element.setSelectedRecordIds(
                            value.initialSelection
                        );
                        await pageObject.clickRow(
                            value.rowToClick,
                            value.clickModifiers
                        );

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(
                                value.expectedSelection
                            )
                        );
                        expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(
                                value.expectedSelection
                            )
                        );
                    });
                });

                it('clicking the already selected row maintains its selection and does not emit an event', async () => {
                    await element.setSelectedRecordIds(['0']);
                    await pageObject.clickRow(0);

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(['0'])
                    );
                    expect(selectionChangeSpy).not.toHaveBeenCalled();
                });

                describe('SHIFT + click selection', () => {
                    it('can select a row range by clicking a row and then SHIFT + clicking a row farther down the table', async () => {
                        const firstRowToSelect = 1;
                        const lastRowToSelect = simpleTableData.length - 2;
                        const expectedSelection = simpleTableData
                            .slice(1, -1)
                            .map(x => x.id);

                        await pageObject.clickRow(firstRowToSelect);
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        await pageObject.clickRow(lastRowToSelect, {
                            shiftKey: true
                        });
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('can select a row range by clicking a row and then SHIFT + clicking a row farther up the table', async () => {
                        const firstRowToSelect = simpleTableData.length - 2;
                        const lastRowToSelect = 1;
                        const expectedSelection = simpleTableData
                            .slice(1, -1)
                            .map(x => x.id);

                        await pageObject.clickRow(firstRowToSelect);
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        await pageObject.clickRow(lastRowToSelect, {
                            shiftKey: true
                        });
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('can select a range using row checkboxes', async () => {
                        const firstRowToSelect = 1;
                        const lastRowToSelect = simpleTableData.length - 2;
                        const expectedSelection = simpleTableData
                            .slice(1, -1)
                            .map(x => x.id);

                        pageObject.clickRowSelectionCheckbox(firstRowToSelect);
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        pageObject.clickRowSelectionCheckbox(
                            lastRowToSelect,
                            true
                        );
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('range selection with SHIFT is based on row clicked prior to holding SHIFT', async () => {
                        const firstRowToSelect = 3;
                        const lastRowToSelect = simpleTableData.length - 2;
                        const expectedSelection = simpleTableData
                            .slice(3, -1)
                            .map(x => x.id);

                        await pageObject.clickRow(firstRowToSelect);
                        await selectionChangeListener;
                        const firstMultiSelectListener = waitForEvent(
                            element,
                            'selection-change'
                        );
                        await pageObject.clickRow(0, { shiftKey: true });
                        await firstMultiSelectListener;

                        const secondMultiSelectSpy = jasmine.createSpy();
                        const secondMultiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            secondMultiSelectSpy
                        );
                        await pageObject.clickRow(lastRowToSelect, {
                            shiftKey: true
                        });
                        await secondMultiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(secondMultiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(secondMultiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('ending range selection by clicking selected checkbox keeps the row selected', async () => {
                        const firstRowToSelect = 1;
                        const lastRowToSelect = simpleTableData.length - 2;

                        // Start with "lastRowToSelect" already selected
                        await element.setSelectedRecordIds([
                            simpleTableData[lastRowToSelect]!.id
                        ]);
                        await waitForUpdatesAsync();

                        pageObject.clickRowSelectionCheckbox(firstRowToSelect);
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        pageObject.clickRowSelectionCheckbox(
                            lastRowToSelect,
                            true
                        );
                        await multiSelectListener;

                        expect(
                            pageObject.getRowSelectionState(lastRowToSelect)
                        ).toBe(TableRowSelectionState.selected);
                    });

                    it('selecting a range using SHIFT + click does not deselect existing selection when ending the selection with a selection checkbox', async () => {
                        await element.setSelectedRecordIds(['0']);
                        await waitForUpdatesAsync();

                        const firstRowToSelect = 3;
                        const lastRowToSelect = simpleTableData.length - 2;
                        const expectedSelection = [
                            '0',
                            ...simpleTableData.slice(3, -1).map(x => x.id)
                        ];

                        // Select the first row while pressing CTRL so that the initial selection isn't cleared
                        await pageObject.clickRow(firstRowToSelect, {
                            ctrlKey: true
                        });
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        pageObject.clickRowSelectionCheckbox(
                            lastRowToSelect,
                            true
                        );
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('selecting a range using SHIFT + CTRL + click does not deselect existing selection when ending the selection with a row click', async () => {
                        await element.setSelectedRecordIds(['0']);
                        await waitForUpdatesAsync();

                        const firstRowToSelect = 3;
                        const lastRowToSelect = simpleTableData.length - 2;
                        const expectedSelection = [
                            '0',
                            ...simpleTableData.slice(3, -1).map(x => x.id)
                        ];

                        // Select the first row while pressing CTRL so that the initial selection isn't cleared
                        await pageObject.clickRow(firstRowToSelect, {
                            ctrlKey: true
                        });
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        await pageObject.clickRow(lastRowToSelect, {
                            shiftKey: true,
                            ctrlKey: true
                        });
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('selecting a range using SHIFT + click deselects existing selection when ending the selection with a row click', async () => {
                        await element.setSelectedRecordIds(['0']);
                        await waitForUpdatesAsync();

                        const firstRowToSelect = 3;
                        const lastRowToSelect = simpleTableData.length - 2;
                        const expectedSelection = [
                            ...simpleTableData.slice(3, -1).map(x => x.id)
                        ];

                        // Select the first row while pressing CTRL so that the initial selection isn't cleared
                        await pageObject.clickRow(firstRowToSelect, {
                            ctrlKey: true
                        });
                        await selectionChangeListener;

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        await pageObject.clickRow(lastRowToSelect, {
                            shiftKey: true
                        });
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('updating data during SHIFT + click selection selects expected range if starting point is still in the data set', async () => {
                        pageObject.clickRowSelectionCheckbox(1);
                        await selectionChangeListener;

                        // Update data to have more rows at the top of the table
                        const newData = [
                            {
                                id: 'new-id-1',
                                stringData: 'hello',
                                stringData2: 'world'
                            },
                            {
                                id: 'new-id-2',
                                stringData: 'foo',
                                stringData2: 'bar'
                            },
                            {
                                id: 'new-id-3',
                                stringData: 'abc',
                                stringData2: '123'
                            },
                            ...simpleTableData
                        ];
                        await element.setData(newData);
                        await waitForUpdatesAsync();

                        const lastRowToSelect = newData.length - 2;
                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        pageObject.clickRowSelectionCheckbox(
                            lastRowToSelect,
                            true
                        );
                        await multiSelectListener;

                        const expectedSelection = simpleTableData
                            .slice(1, -1)
                            .map(x => x.id);
                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('updating data during SHIFT + click selection selects only last row clicked if the first row is removed from the data set', async () => {
                        pageObject.clickRowSelectionCheckbox(0);
                        await selectionChangeListener;

                        // Remove a few rows from the data set, including the row
                        const newData = [
                            {
                                id: 'new-id-1',
                                stringData: 'hello',
                                stringData2: 'world'
                            },
                            {
                                id: 'new-id-2',
                                stringData: 'foo',
                                stringData2: 'bar'
                            },
                            {
                                id: 'new-id-3',
                                stringData: 'abc',
                                stringData2: '123'
                            }
                        ];
                        const lastRowToSelect = 2;
                        const expectedSelection = [
                            newData[lastRowToSelect]!.id
                        ];
                        await element.setData([
                            {
                                id: 'new-id-1',
                                stringData: 'hello',
                                stringData2: 'world'
                            },
                            {
                                id: 'new-id-2',
                                stringData: 'foo',
                                stringData2: 'bar'
                            },
                            {
                                id: 'new-id-3',
                                stringData: 'abc',
                                stringData2: '123'
                            }
                        ]);
                        await waitForUpdatesAsync();

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        pageObject.clickRowSelectionCheckbox(
                            lastRowToSelect,
                            true
                        );
                        await multiSelectListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('can select a range after sorting a column', async () => {
                        pageObject.clickRowSelectionCheckbox(0);
                        await selectionChangeListener;

                        column1.sortDirection = 'descending';
                        column1.sortIndex = 0;
                        await waitForUpdatesAsync();

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        pageObject.clickRowSelectionCheckbox(3, true);
                        await multiSelectListener;

                        const expectedSelection = [
                            '0',
                            '1',
                            '2',
                            '3',
                            '4',
                            '5'
                        ];
                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('SHIFT selection state is reset when the selection mode is changed', async () => {
                        await pageObject.clickRow(0);
                        await selectionChangeListener;

                        // Change the selection mode to 'single' and then back to 'multiple' again
                        element.selectionMode = TableRowSelectionMode.single;
                        await waitForUpdatesAsync();
                        element.selectionMode = TableRowSelectionMode.multiple;
                        await waitForUpdatesAsync();

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        await pageObject.clickRow(3, { shiftKey: true });
                        await multiSelectListener;

                        const expectedSelection = [simpleTableData[3].id];
                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('SHIFT selection state is not affected by programmatic selection', async () => {
                        await pageObject.clickRow(0);
                        await selectionChangeListener;

                        await element.setSelectedRecordIds([]);

                        const multiSelectSpy = jasmine.createSpy();
                        const multiSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            multiSelectSpy
                        );
                        await pageObject.clickRow(3, { shiftKey: true });
                        await multiSelectListener;

                        const expectedSelection = [...simpleTableData]
                            .slice(0, 4)
                            .map(x => x.id);
                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('SHIFT + click selects only the clicked row if the previous click deselected a row (by clicking the checkbox)', async () => {
                        // Start with the first row selected
                        await element.setSelectedRecordIds(['0']);
                        await waitForUpdatesAsync();

                        // Deselect the first row by clicking the selection checkbox
                        pageObject.clickRowSelectionCheckbox(0);
                        await selectionChangeListener;

                        // Shift + click a different row
                        const shiftSelectSpy = jasmine.createSpy();
                        const shiftSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            shiftSelectSpy
                        );
                        await pageObject.clickRow(3, { shiftKey: true });
                        await shiftSelectListener;

                        const expectedSelection = ['3'];
                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(shiftSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(shiftSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });

                    it('SHIFT + click selects only the clicked row if the previous click deselected the row (by CTRL + click)', async () => {
                        // Start with the first row selected
                        await element.setSelectedRecordIds(['0']);
                        await waitForUpdatesAsync();

                        // Deselect the first row by CTRL + clicking it
                        await pageObject.clickRow(0, { ctrlKey: true });
                        await selectionChangeListener;

                        // Shift + click a different row
                        const shiftSelectSpy = jasmine.createSpy();
                        const shiftSelectListener = waitForEvent(
                            element,
                            'selection-change',
                            shiftSelectSpy
                        );
                        await pageObject.clickRow(3, { shiftKey: true });
                        await shiftSelectListener;

                        const expectedSelection = ['3'];
                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                        expect(shiftSelectSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(shiftSelectSpy);
                        expect(emittedIds).toEqual(
                            jasmine.arrayWithExactContents(expectedSelection)
                        );
                    });
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

                describe('with SHIFT pressed in the window then let go outside the window', () => {
                    beforeEach(() => {
                        const shiftKeyDownEvent = new KeyboardEvent('keydown', {
                            key: keyTab, // could be any key
                            shiftKey: true,
                            bubbles: true
                        } as KeyboardEventInit);
                        window.dispatchEvent(shiftKeyDownEvent);
                        window.dispatchEvent(new FocusEvent('blur'));
                        // No SHIFT keyup event. This simulates the user letting go of the SHIFT key outside the window.
                    });

                    it('selects only the rows whose checkboxes were clicked', async () => {
                        pageObject.clickRowSelectionCheckbox(0);
                        pageObject.clickRowSelectionCheckbox(3);
                        await waitForUpdatesAsync();

                        const selectedRecordIds = await element.getSelectedRecordIds();
                        expect(selectedRecordIds).toEqual(
                            jasmine.arrayWithExactContents([
                                simpleTableData[0].id,
                                simpleTableData[3].id
                            ])
                        );
                    });

                    it('selects only the rows that SPACE was pressed on', async () => {
                        element.focus();
                        await sendKeyDownEvents(element, [
                            keyArrowDown,
                            keySpace,
                            keyArrowDown,
                            keyArrowDown,
                            keyArrowDown,
                            keySpace
                        ]);

                        const selectedRecordIds = await element.getSelectedRecordIds();
                        expect(selectedRecordIds).toEqual(
                            jasmine.arrayWithExactContents([
                                simpleTableData[0].id,
                                simpleTableData[3].id
                            ])
                        );
                    });
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

                        await selectionChangeListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(allRecordIds)
                        );
                        expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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

                        await selectionChangeListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual(
                            jasmine.arrayWithExactContents(allRecordIds)
                        );
                        expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                        const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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

                        await selectionChangeListener;

                        const currentSelection = await element.getSelectedRecordIds();
                        expect(currentSelection).toEqual([]);
                        const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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
        let selectionChangeSpy: jasmine.Spy;
        let selectionChangeListener: Promise<void>;
        let column1: TableColumnText;
        let column2: TableColumnText;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            element.selectionMode = TableRowSelectionMode.multiple;
            element.idFieldName = 'id';
            column1 = element.querySelector<TableColumnText>('#column1')!;
            column2 = element.querySelector<TableColumnText>('#column2')!;

            pageObject = new TablePageObject<SimpleTableRecord>(element);
            selectionChangeSpy = jasmine.createSpy();
            selectionChangeListener = waitForEvent(
                element,
                'selection-change',
                selectionChangeSpy
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

                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            it('clicking checked selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds(allRecordIds);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual([]);
                expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                expect(emittedIds).toEqual([]);
            });

            it('clicking indeterminate selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds([groupableTableData[0].id]);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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
                await selectionChangeListener;

                const multiSelectSpy = jasmine.createSpy();
                const multiSelectListener = waitForEvent(
                    element,
                    'selection-change',
                    multiSelectSpy
                );
                await pageObject.clickRow(firstGreenRowIndex, {
                    shiftKey: true
                });
                await multiSelectListener;

                const expectedSelection = [
                    lastBlueRecordId,
                    firstGreenRecordId
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
            });

            it('shift clicking from a row that becomes hidden selects expected range', async () => {
                const allBlueRecordIds = groupableTableData
                    .filter(x => x.id.includes('blue-'))
                    .map(x => x.id);
                const lastBlueRecordId = allBlueRecordIds[allBlueRecordIds.length - 1];
                const lastBlueRowIndex = allBlueRecordIds.length - 1;

                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);
                const firstGreenRecordId = allGreenRecordIds[0];

                await pageObject.clickRow(lastBlueRowIndex);
                await selectionChangeListener;
                // Collapse the group that the shift starting point was in
                pageObject.toggleGroupRowExpandedState(blueGroupIndex);
                await waitForUpdatesAsync();

                const multiSelectSpy = jasmine.createSpy();
                const multiSelectListener = waitForEvent(
                    element,
                    'selection-change',
                    multiSelectSpy
                );
                // The first green row is now the first non-group row in the table because the blue group is collapsed
                const firstGreenRowIndex = 0;
                await pageObject.clickRow(firstGreenRowIndex, {
                    shiftKey: true
                });
                await multiSelectListener;

                const expectedSelection = [
                    lastBlueRecordId,
                    firstGreenRecordId
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
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
                await selectionChangeListener;

                const multiSelectSpy = jasmine.createSpy();
                const multiSelectListener = waitForEvent(
                    element,
                    'selection-change',
                    multiSelectSpy
                );
                pageObject.clickGroupRowSelectionCheckbox(
                    greenGroupIndex,
                    true
                );
                await multiSelectListener;

                const expectedSelection = [
                    lastBlueRecordId,
                    ...allGreenRecordIds
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
            });

            it('shift clicking to an already selected group keeps it selected', async () => {
                const allBlueRecordIds = groupableTableData
                    .filter(x => x.id.includes('blue-'))
                    .map(x => x.id);
                const lastBlueRecordId = allBlueRecordIds[allBlueRecordIds.length - 1];
                const lastBlueRowIndex = allBlueRecordIds.length - 1;

                const allGreenRecordIds = groupableTableData
                    .filter(x => x.id.includes('green-'))
                    .map(x => x.id);

                // Start with the "green" group selected
                pageObject.clickGroupRowSelectionCheckbox(greenGroupIndex);
                await pageObject.clickRow(lastBlueRowIndex);
                await selectionChangeListener;

                const multiSelectSpy = jasmine.createSpy();
                const multiSelectListener = waitForEvent(
                    element,
                    'selection-change',
                    multiSelectSpy
                );
                pageObject.clickGroupRowSelectionCheckbox(
                    greenGroupIndex,
                    true
                );
                await multiSelectListener;

                const expectedSelection = [
                    lastBlueRecordId,
                    ...allGreenRecordIds
                ];
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(multiSelectSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(multiSelectSpy);
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(expectedSelection)
                );
                expect(
                    pageObject.getGroupRowSelectionState(greenGroupIndex)
                ).toBe(TableRowSelectionState.selected);
            });

            describe('group selection checkbox', () => {
                it('group selection checkbox default to not checked', () => {
                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.notSelected);
                });

                it('clicking unchecked group selection checkbox selects all children and emits event', async () => {
                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener;

                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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
                    await selectionChangeListener;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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
                    await selectionChangeListener;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([firstGreenRecordId]);
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                    expect(emittedIds).toEqual([firstGreenRecordId]);
                });

                it('clicking indeterminate group selection checkbox selects all children and emits event', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstBlueRecordId = allBlueRecordIds[0]!;
                    await element.setSelectedRecordIds([firstBlueRecordId]);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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

                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            it('clicking checked selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds(allRecordIds);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual([]);
                expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                expect(emittedIds).toEqual([]);
            });

            it('clicking indeterminate selection checkbox selects all leaf rows and fires event', async () => {
                const allRecordIds = groupableTableData.map(x => x.id);
                await element.setSelectedRecordIds([groupableTableData[0].id]);

                pageObject.clickTableSelectionCheckbox();
                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
                expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                expect(emittedIds).toEqual(
                    jasmine.arrayWithExactContents(allRecordIds)
                );
            });

            describe('group selection checkbox', () => {
                const blueGroupIndex = 0;
                const greenGroupIndex = 3;

                it('shift + select ending with top-level group does not track selection of subgroups', async () => {
                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    pageObject.clickGroupRowSelectionCheckbox(
                        greenGroupIndex,
                        true
                    );
                    await waitForUpdatesAsync();

                    const blueAndGreenRecordIds = groupableTableData
                        .filter(
                            x => x.id.includes('blue-')
                                || x.id.includes('green-')
                        )
                        .map(x => x.id);
                    const selection = await element.getSelectedRecordIds();
                    expect(selection).toEqual(
                        jasmine.arrayWithExactContents(blueAndGreenRecordIds)
                    );
                });

                it('group selection checkbox default to not checked', () => {
                    expect(
                        pageObject.getGroupRowSelectionState(blueGroupIndex)
                    ).toBe(TableRowSelectionState.notSelected);
                });

                it('clicking unchecked group selection checkbox selects all children and emits event', async () => {
                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener;

                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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
                    await selectionChangeListener;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([]);
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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
                    await selectionChangeListener;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual([firstGreenRecordId]);
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
                    expect(emittedIds).toEqual([firstGreenRecordId]);
                });

                it('clicking indeterminate group selection checkbox selects all children and emits event', async () => {
                    const allBlueRecordIds = groupableTableData
                        .filter(x => x.id.includes('blue-'))
                        .map(x => x.id);
                    const firstBlueRecordId = allBlueRecordIds[0]!;
                    await element.setSelectedRecordIds([firstBlueRecordId]);

                    pageObject.clickGroupRowSelectionCheckbox(blueGroupIndex);
                    await selectionChangeListener;

                    const currentSelection = await element.getSelectedRecordIds();
                    expect(currentSelection).toEqual(
                        jasmine.arrayWithExactContents(allBlueRecordIds)
                    );
                    expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
                    const emittedIds = getEmittedRecordIdsFromSpy(selectionChangeSpy);
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

    describe('with data hierarchy', () => {
        let element: Table<SimpleTableRecord>;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: TablePageObject<SimpleTableRecord>;
        let selectionChangeSpy: jasmine.Spy;
        let selectionChangeListener: Promise<void>;
        let column1: TableColumnText;

        function getUnsortedExpandedIndexOfRecord(id: string): number {
            return hierarchicalData.findIndex(x => x.id === id);
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            element.idFieldName = 'id';
            pageObject = new TablePageObject<SimpleTableRecord>(element);
            column1 = element.querySelector<TableColumnText>('#column1')!;
            element.parentIdFieldName = 'parentId';
            selectionChangeSpy = jasmine.createSpy();
            selectionChangeListener = waitForEvent(
                element,
                'selection-change',
                selectionChangeSpy
            );

            await connect();
            await element.setData(hierarchicalData);
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        describe('with single selection', () => {
            beforeEach(async () => {
                element.selectionMode = TableRowSelectionMode.single;
                await waitForUpdatesAsync();
            });

            it('can programmatically select parent row', async () => {
                await element.setSelectedRecordIds(['0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['0']);
            });

            it('can programmatically select leaf row', async () => {
                await element.setSelectedRecordIds(['0.0.0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['0.0.0']);
            });

            it('can interactively select parent row', async () => {
                const rowIndex = getUnsortedExpandedIndexOfRecord('0');
                await pageObject.clickRow(rowIndex);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['0']);
            });

            it('can interactively select child row', async () => {
                const rowIndex = getUnsortedExpandedIndexOfRecord('2.0');
                await pageObject.clickRow(rowIndex);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['2.0']);
            });
        });

        describe('with multi-selection', () => {
            beforeEach(async () => {
                element.selectionMode = TableRowSelectionMode.multiple;
                await waitForUpdatesAsync();
            });

            it('can programmatically select parent row', async () => {
                await element.setSelectedRecordIds(['0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['0']);
            });

            it('can programmatically select leaf row', async () => {
                await element.setSelectedRecordIds(['0.0.0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['0.0.0']);
            });

            it('can programmatically select parent row and its children', async () => {
                await element.setSelectedRecordIds(['0', '0.0', '0.0.0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(['0', '0.0', '0.0.0'])
                );
            });

            it('can programmatically select parent row and its leaf, skipping a level in the hierarchy', async () => {
                await element.setSelectedRecordIds(['0', '0.0.0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(['0', '0.0.0'])
                );
            });

            it('can programmatically select rows at different levels of the heirarchy', async () => {
                await element.setSelectedRecordIds(['0.0.1', '1', '2.0']);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(['0.0.1', '1', '2.0'])
                );
            });

            it('can interactively select parent row', async () => {
                const rowIndex = getUnsortedExpandedIndexOfRecord('0');
                await pageObject.clickRow(rowIndex);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['0']);
            });

            it('can interactively select child row', async () => {
                const rowIndex = getUnsortedExpandedIndexOfRecord('2.0');
                await pageObject.clickRow(rowIndex);
                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(['2.0']);
            });

            it('shift-selecting across expanded parents selects children', async () => {
                const startRowIndex = getUnsortedExpandedIndexOfRecord('0.0.1');
                const endRowIndex = getUnsortedExpandedIndexOfRecord('1');
                await pageObject.clickRow(startRowIndex);
                await pageObject.clickRow(endRowIndex, { shiftKey: true });

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents([
                        '0.0.1',
                        '0.1',
                        '0.2',
                        '0.2.0',
                        '1'
                    ])
                );
            });

            it('shift-selecting across collapsed parents selects children', async () => {
                const rowIndexToCollapse = getUnsortedExpandedIndexOfRecord('0.2');
                pageObject.clickDataRowExpandCollapseButton(rowIndexToCollapse);
                await waitForUpdatesAsync();

                const startRowIndex = getUnsortedExpandedIndexOfRecord('0.0.1');
                // Subtract 1 because collapsing record 0.2 shifts all rows up by 1 since it has one child
                const endRowIndex = getUnsortedExpandedIndexOfRecord('1') - 1;
                await pageObject.clickRow(startRowIndex);
                await pageObject.clickRow(endRowIndex, { shiftKey: true });

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents([
                        '0.0.1',
                        '0.1',
                        '0.2',
                        '0.2.0',
                        '1'
                    ])
                );
            });

            it('can ctrl-select rows from different parts of the tree', async () => {
                const rowIndex0 = getUnsortedExpandedIndexOfRecord('0.0.1');
                const rowIndex1 = getUnsortedExpandedIndexOfRecord('1');
                await pageObject.clickRow(rowIndex0);
                await pageObject.clickRow(rowIndex1, { ctrlKey: true });

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(['0.0.1', '1'])
                );
            });

            it('can ctrl-select parent row and a child', async () => {
                const rowIndex0 = getUnsortedExpandedIndexOfRecord('0.0');
                const rowIndex1 = getUnsortedExpandedIndexOfRecord('0.0.1');
                await pageObject.clickRow(rowIndex0);
                await pageObject.clickRow(rowIndex1, { ctrlKey: true });

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents(['0.0', '0.0.1'])
                );
            });

            it('table selection checkbox is indeterminate when only parent rows are selected', async () => {
                // Select all records in the "Green" group
                const allTopLevelRecordIds = hierarchicalData
                    .filter(x => x.parentId === undefined)
                    .map(x => x.id);
                await element.setSelectedRecordIds(allTopLevelRecordIds);

                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.partiallySelected
                );
            });

            it('clicking table selection checkbox selects/deselects all rows', async () => {
                pageObject.clickTableSelectionCheckbox();
                await waitForUpdatesAsync();
                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.selected
                );

                pageObject.clickTableSelectionCheckbox();
                await waitForUpdatesAsync();
                expect(pageObject.getTableSelectionState()).toBe(
                    TableRowSelectionState.notSelected
                );
            });
        });

        describe('with grouping', () => {
            beforeEach(async () => {
                /**
                 * With grouping, the expected table will be structured as follows:
                 *
                 * purple group row
                 *   0
                 *     0.0
                 *       0.0.0
                 *       0.0.1
                 *     0.1
                 *     0.2
                 *       0.2.0
                 *   3
                 * green group row
                 *   1
                 *   2
                 *     2.0
                 */
                column1.groupIndex = 0;
                element.selectionMode = TableRowSelectionMode.multiple;
                await waitForUpdatesAsync();
            });

            it('selecting group selects all children', async () => {
                pageObject.clickGroupRowSelectionCheckbox(0);
                await selectionChangeListener;

                const currentSelection = await element.getSelectedRecordIds();
                expect(currentSelection).toEqual(
                    jasmine.arrayWithExactContents([
                        '0',
                        '0.0',
                        '0.0.0',
                        '0.0.1',
                        '0.1',
                        '0.2',
                        '0.2.0',
                        '3'
                    ])
                );
            });

            it('selecting all children of a group marks the group as selected', async () => {
                await element.setSelectedRecordIds([
                    '0',
                    '0.0',
                    '0.0.0',
                    '0.0.1',
                    '0.1',
                    '0.2',
                    '0.2.0',
                    '3'
                ]);
                await waitForUpdatesAsync();
                expect(pageObject.getGroupRowSelectionState(0)).toBe(
                    TableRowSelectionState.selected
                );
            });

            it('selecting single child of group marks the group as having indeterminate selection', async () => {
                await element.setSelectedRecordIds(['0.0.1']);
                await waitForUpdatesAsync();
                expect(pageObject.getGroupRowSelectionState(0)).toBe(
                    TableRowSelectionState.partiallySelected
                );
            });

            it('deselecting single child of group after selecting all marks the group as having indeterminate selection', async () => {
                await element.setSelectedRecordIds([
                    '0',
                    '0.0',
                    '0.0.0',
                    '0.0.1',
                    '0.1',
                    '0.2',
                    '0.2.0',
                    '3'
                ]);
                await waitForUpdatesAsync();
                pageObject.clickRowSelectionCheckbox(3);
                await selectionChangeListener;

                expect(pageObject.getGroupRowSelectionState(0)).toBe(
                    TableRowSelectionState.partiallySelected
                );
            });
        });
    });
});
