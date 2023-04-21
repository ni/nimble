import { html } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { TableColumnSortDirection, TableRecord } from '../types';
import { TablePageObject } from './table.pageobject';

interface SimpleTableRecord extends TableRecord {
    id: string;
    stringData1?: string | null;
    stringData2?: string | null;
    stringData3?: string | null;
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table id-field-name="id">
            <nimble-table-column-text id="first-column" field-name="stringData1"></nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="stringData2"></nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table grouping', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumnText;
    let column2: TableColumnText;

    function getRenderedRecordIds(): string[] {
        const ids: string[] = [];
        const numberOfRows = pageObject.getRenderedRowCount();
        for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
            ids.push(pageObject.getRecordId(rowIndex) ?? '');
        }

        return ids;
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        column1 = element.querySelector<TableColumnText>('#first-column')!;
        column2 = element.querySelector<TableColumnText>('#second-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can set group state before connect', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'foo' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupRowCount()).toEqual(3);
    });

    it('can set group state after connect', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'foo' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        column1.groupIndex = 0;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupRowCount()).toEqual(3);
    });

    it('changing column field updates rows', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo', stringData2: 'elephant' },
            { id: '2', stringData1: 'abc', stringData2: 'cat' },
            { id: '3', stringData1: 'foo', stringData2: 'dog' },
            { id: '4', stringData1: 'hello', stringData2: 'cat' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '3', '2', '4']);

        column1.fieldName = 'stringData2';
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '4', '3']);
    });

    it('removing grouping restores rows to default order based on data', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'foo' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '3', '2', '4']);

        column1.groupIndex = null;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '3', '4']);
    });

    it('updating data maintains expanded state', async () => {
        const originalData: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'foo' },
            { id: '4', stringData1: 'hello' }
        ] as const;
        const newData: readonly SimpleTableRecord[] = [
            { id: '5', stringData1: 'dog' },
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'foo' },
            { id: '4', stringData1: 'ant' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 0;
        await element.setData(originalData);
        await connect();
        await waitForUpdatesAsync();

        pageObject.toggleGroupRowExpandedState(0); // collapse first group
        await waitForUpdatesAsync();

        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([
            false,
            true,
            true
        ]);
        expect(pageObject.getRenderedRowCount()).toBe(2);

        await element.setData(newData); // inserts row at beginning
        await waitForUpdatesAsync();

        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([
            true,
            false,
            true,
            true
        ]);
        expect(pageObject.getRenderedRowCount()).toBe(3);
    });

    it('updating grouping state expands all groups', async () => {
        const originalData: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo', stringData2: 'a' },
            { id: '2', stringData1: 'abc', stringData2: 'a' },
            { id: '3', stringData1: 'foo', stringData2: 'a' },
            { id: '4', stringData1: 'abc', stringData2: 'a' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 0;
        await element.setData(originalData);
        await connect();
        await waitForUpdatesAsync();

        pageObject.toggleGroupRowExpandedState(0); // collapse first group
        await waitForUpdatesAsync();

        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([
            false,
            true
        ]);

        column2.groupIndex = 1;
        await waitForUpdatesAsync();

        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([
            true,
            true,
            true,
            true
        ]);
        expect(pageObject.getRenderedRowCount()).toBe(4);
    });

    it('collapsing group then updating grouped state followed by setting data has all groups expanded', async () => {
        const originalData: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo', stringData2: 'a' },
            { id: '2', stringData1: 'abc', stringData2: 'a' },
            { id: '3', stringData1: 'foo', stringData2: 'a' },
            { id: '4', stringData1: 'abc', stringData2: 'a' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 0;
        await element.setData(originalData);
        await connect();
        await waitForUpdatesAsync();

        pageObject.toggleGroupRowExpandedState(0); // collapse first group
        await waitForUpdatesAsync();

        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([
            false,
            true
        ]);

        column2.groupIndex = 1;
        await waitForUpdatesAsync();

        const newData: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo', stringData2: 'bar' }
        ];
        await element.setData(newData);
        await waitForUpdatesAsync();

        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([true, true]);
    });

    it('can group by multiple columns', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello', stringData2: 'world' },
            { id: '2', stringData1: 'good bye', stringData2: 'moon' },
            { id: '3', stringData1: 'hello', stringData2: 'moon' },
            { id: '4', stringData1: 'good bye', stringData2: 'world' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 1;
        column2.fieldName = 'stringData2';
        column2.groupIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupRowCount()).toBe(6);
        expect(getRenderedRecordIds()).toEqual(['1', '4', '2', '3']);
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('world');
        expect(pageObject.getRenderedGroupHeaderContent(1)).toBe('hello');
    });

    it('can update group index', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello', stringData2: 'world' },
            { id: '2', stringData1: 'good bye', stringData2: 'moon' },
            { id: '3', stringData1: 'hello', stringData2: 'moon' },
            { id: '4', stringData1: 'good bye', stringData2: 'world' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 1;
        column2.fieldName = 'stringData2';
        column2.groupIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '4', '2', '3']);

        column2.groupIndex = 2;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '3', '2', '4']);
    });

    it('column with group-index and grouping-disabled set does not get grouped', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello' },
            { id: '2', stringData1: 'good bye' },
            { id: '3', stringData1: 'hello' },
            { id: '4', stringData1: 'good bye' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 1;
        column1.groupingDisabled = true;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupRowCount()).toEqual(0);
        expect(pageObject.getRenderedRowCount()).toEqual(4);
    });

    it('updating grouped column to set grouping-disabled removes grouping', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello' },
            { id: '2', stringData1: 'good bye' },
            { id: '3', stringData1: 'hello' },
            { id: '4', stringData1: 'good bye' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 1;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedGroupRowCount()).toEqual(2);
        expect(pageObject.getRenderedRowCount()).toEqual(4);

        column1.groupingDisabled = true;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupRowCount()).toEqual(0);
        expect(pageObject.getRenderedRowCount()).toEqual(4);
    });

    it('collapse all button has label from attribute', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello' },
            { id: '2', stringData1: 'good bye' },
            { id: '3', stringData1: 'hello' },
            { id: '4', stringData1: 'good bye' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.groupIndex = 1;
        element.collapseAllButtonLabel = 'foo';
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getCollapseAllButtonLabel()).toBe('foo');
    });

    describe('group index validation', () => {
        it('multiple columns with the same group index does not render rows', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            column2.fieldName = 'stringData2';
            column2.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateGroupIndex).toBeTrue();
            expect(pageObject.getRenderedRowCount()).toBe(0);
        });

        it('transitioning out of having duplicate group indices updates table', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            column2.fieldName = 'stringData2';
            column2.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateGroupIndex).toBeTrue();
            expect(pageObject.getRenderedRowCount()).toBe(0);

            column2.groupIndex = 1;
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateGroupIndex).toBeFalse();
            expect(pageObject.getRenderedRowCount()).toBe(4);
        });

        it('transitioning into having duplicate group indices updates table', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            column2.fieldName = 'stringData2';
            column2.groupIndex = 1;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateGroupIndex).toBeFalse();
            expect(pageObject.getRenderedRowCount()).toBe(4);

            column2.groupIndex = 0;
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateGroupIndex).toBeTrue();
            expect(pageObject.getRenderedRowCount()).toBe(0);
        });
    });

    describe('changing slotted columns', () => {
        async function removeExistingColumnsAndAddNewColumn(
            fieldName: string,
            groupIndex?: number
        ): Promise<TableColumnText> {
            element.removeChild(column1);
            element.removeChild(column2);

            const newColumn = document.createElement(
                'nimble-table-column-text'
            );
            newColumn.fieldName = fieldName;
            if (typeof groupIndex === 'number') {
                newColumn.groupIndex = groupIndex;
            }
            element.appendChild(newColumn);

            await waitForUpdatesAsync();
            return newColumn;
        }

        async function addNewColumn(
            fieldName: string,
            groupIndex?: number
        ): Promise<TableColumnText> {
            const newColumn = document.createElement(
                'nimble-table-column-text'
            );
            newColumn.fieldName = fieldName;
            if (typeof groupIndex === 'number') {
                newColumn.groupIndex = groupIndex;
            }
            element.appendChild(newColumn);

            await waitForUpdatesAsync();
            return newColumn;
        }

        it('removes grouping if no new columns are grouped', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedGroupRowCount()).toEqual(4);

            await removeExistingColumnsAndAddNewColumn('stringData1');
            expect(pageObject.getRenderedGroupRowCount()).toEqual(0);
        });

        it('applies new grouping if new columns are grouped', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedGroupRowCount()).toEqual(0);

            await removeExistingColumnsAndAddNewColumn('stringData1', 0);
            expect(pageObject.getRenderedGroupRowCount()).toEqual(4);
            expect(pageObject.getRenderedRowCount()).toEqual(4);
        });

        it('group state responds to changes on new columns', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo', stringData3: 'bar' },
                { id: '2', stringData1: 'abc', stringData3: 'bar' },
                { id: '3', stringData1: 'zzz', stringData3: 'bar' },
                { id: '4', stringData1: 'hello', stringData3: 'bar' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 1;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedGroupHeaderContent(0)).toEqual('foo');

            const newColumn = await addNewColumn('stringData3');
            newColumn.groupIndex = 0;
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedGroupHeaderContent(0)).toEqual('bar');
        });

        it('hidden column can still be grouped by', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.hidden = true;
            column1.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getAllRenderedGroupHeaderContent()).toEqual([
                'foo',
                'abc',
                'zzz',
                'hello'
            ]);
        });
    });

    describe('grouping with sorting:', () => {
        it('sort ascending on grouped column sorts group rows in ascending order', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello', stringData2: 'world' },
                { id: '2', stringData1: 'good bye', stringData2: 'moon' },
                { id: '3', stringData1: 'hello', stringData2: 'moon' },
                { id: '4', stringData1: 'good bye', stringData2: 'world' },
                { id: '5', stringData1: 'adios', stringData2: 'saturn' },
                { id: '6', stringData1: 'sayonara', stringData2: 'jupiter' }
            ] as const;

            column1.fieldName = 'stringData1';
            column2.groupIndex = 0;
            column2.sortIndex = 0;
            column2.sortDirection = TableColumnSortDirection.ascending;
            column2.fieldName = 'stringData2';
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getAllRenderedGroupHeaderContent()).toEqual([
                'jupiter',
                'moon',
                'saturn',
                'world'
            ]);
        });

        it('sort descending on grouped column sorts group rows in descending order', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello', stringData2: 'world' },
                { id: '2', stringData1: 'good bye', stringData2: 'moon' },
                { id: '3', stringData1: 'hello', stringData2: 'moon' },
                { id: '4', stringData1: 'good bye', stringData2: 'world' },
                { id: '5', stringData1: 'adios', stringData2: 'saturn' },
                { id: '6', stringData1: 'sayonara', stringData2: 'jupiter' }
            ] as const;

            column1.fieldName = 'stringData1';
            column2.groupIndex = 0;
            column2.sortIndex = 0;
            column2.sortDirection = TableColumnSortDirection.descending;
            column2.fieldName = 'stringData2';
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getAllRenderedGroupHeaderContent()).toEqual([
                'world',
                'saturn',
                'moon',
                'jupiter'
            ]);
        });

        it('sort descending on first grouped column and sort ascending on second grouped column sorts group rows as expected', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello', stringData2: 'world' },
                { id: '2', stringData1: 'good bye', stringData2: 'moon' },
                { id: '3', stringData1: 'hello', stringData2: 'moon' },
                { id: '4', stringData1: 'good bye', stringData2: 'world' },
                { id: '5', stringData1: 'adios', stringData2: 'saturn' },
                { id: '6', stringData1: 'sayonara', stringData2: 'jupiter' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 1;
            column1.sortIndex = 1;
            column1.sortDirection = TableColumnSortDirection.ascending;
            column2.fieldName = 'stringData2';
            column2.groupIndex = 0;
            column2.sortIndex = 0;
            column2.sortDirection = TableColumnSortDirection.descending;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getAllRenderedGroupHeaderContent()).toEqual([
                'world',
                'good bye',
                'hello',
                'saturn',
                'adios',
                'moon',
                'good bye',
                'hello',
                'jupiter',
                'sayonara'
            ]);
        });

        it('sort on one column while grouping another sorts rows as expected within group', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello', stringData2: 'world' },
                { id: '2', stringData1: 'good bye', stringData2: 'moon' },
                { id: '3', stringData1: 'hello', stringData2: 'moon' },
                { id: '4', stringData1: 'good bye', stringData2: 'world' },
                { id: '5', stringData1: 'adios', stringData2: 'moon' },
                { id: '6', stringData1: 'sayonara', stringData2: 'world' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortIndex = 0;
            column1.sortDirection = TableColumnSortDirection.descending;
            column2.fieldName = 'stringData2';
            column2.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(getRenderedRecordIds()).toEqual([
                '6',
                '1',
                '4',
                '3',
                '2',
                '5'
            ]);
        });
    });

    describe('collapse all button:', () => {
        it('becomes visible when column becomes grouped', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello' },
                { id: '2', stringData1: 'good bye' },
                { id: '3', stringData1: 'hello' },
                { id: '4', stringData1: 'good bye' }
            ] as const;

            column1.fieldName = 'stringData1';
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.isCollapseAllButtonVisible()).toBeFalse();

            column1.groupIndex = 0;
            await waitForUpdatesAsync();
            expect(pageObject.isCollapseAllButtonVisible()).toBeTrue();
        });

        it('becomes hidden when grouping is removed', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello' },
                { id: '2', stringData1: 'good bye' },
                { id: '3', stringData1: 'hello' },
                { id: '4', stringData1: 'good bye' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.isCollapseAllButtonVisible()).toBeTrue();

            column1.groupIndex = null;
            await waitForUpdatesAsync();
            expect(pageObject.isCollapseAllButtonVisible()).toBeFalse();
        });

        it('becomes hidden when grouping is disabled', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello' },
                { id: '2', stringData1: 'good bye' },
                { id: '3', stringData1: 'hello' },
                { id: '4', stringData1: 'good bye' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.isCollapseAllButtonVisible()).toBeTrue();

            column1.groupingDisabled = true;
            await waitForUpdatesAsync();
            expect(pageObject.isCollapseAllButtonVisible()).toBeFalse();
        });

        it('when clicked, collapses all expanded rows', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello' },
                { id: '2', stringData1: 'good bye' },
                { id: '3', stringData1: 'hello' },
                { id: '4', stringData1: 'good bye' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(4);
            pageObject.clickCollapseAllButton();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(pageObject.getRenderedGroupRowCount()).toBe(2);
        });

        it('clicked when everything is already collapsed, does nothing', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello' },
                { id: '2', stringData1: 'good bye' },
                { id: '3', stringData1: 'hello' },
                { id: '4', stringData1: 'good bye' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
            pageObject.clickCollapseAllButton();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(pageObject.getRenderedGroupRowCount()).toBe(2);

            pageObject.clickCollapseAllButton();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(pageObject.getRenderedGroupRowCount()).toBe(2);
        });

        it('after collapse all of fully expanded multi-column grouping, expanding a group has a collapsed sub-group', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'hello' },
                { id: '2', stringData1: 'good bye' },
                { id: '3', stringData1: 'hello' },
                { id: '4', stringData1: 'good bye' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.groupIndex = 0;
            column2.fieldName = 'id';
            column2.groupIndex = 1;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
            pageObject.clickCollapseAllButton();
            await waitForUpdatesAsync();

            await pageObject.clickGroupRow(0);
            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(pageObject.getRenderedGroupRowCount()).toBe(4); // id 1 and 3 shown under 'hello' plus un-expanded 'good bye'
        });
    });
});
