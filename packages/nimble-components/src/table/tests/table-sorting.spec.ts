import { html } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    TableColumnConfigurationChangeEventDetail,
    TableColumnSortDirection,
    TableRecord
} from '../types';
import { SortedColumn, TablePageObject } from '../testing/table.pageobject';
import { createEventListener } from '../../utilities/tests/component';

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
            <nimble-table-column-text id="first-column" field-name="stringData1" column-id="column-1"></nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="stringData2" column-id="column-2"></nimble-table-column-text>
            <nimble-table-column-text id="third-column" field-name="stringData3" column-id="column-3"></nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table sorting', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumnText;
    let column2: TableColumnText;
    let column3: TableColumnText;

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
        column3 = element.querySelector<TableColumnText>('#third-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can set sort state before connect', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getSortedColumns()).toEqual([
            {
                columnId: 'column-1',
                sortDirection: TableColumnSortDirection.ascending
            }
        ]);
        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);
    });

    it('can set sort state after connect', async () => {
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

        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await waitForUpdatesAsync();

        expect(pageObject.getSortedColumns()).toEqual([
            {
                columnId: 'column-1',
                sortDirection: TableColumnSortDirection.ascending
            }
        ]);
        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);
    });

    it('can sort ascending by a single column', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);
    });

    it('can sort descending by a single column', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.descending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);
    });

    it('sorts ascending with values of null and undefined', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: '' },
            { id: '2', stringData1: undefined },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: null },
            { id: '5', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '4', '1', '5', '3']);
    });

    it('sorts descending with values of null and undefined', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: '' },
            { id: '2', stringData1: undefined },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: null },
            { id: '5', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.descending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['3', '5', '1', '4', '2']);
    });

    it('can sort by a hidden column', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.descending;
        column1.sortIndex = 0;
        column1.columnHidden = true;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);
    });

    it('changing sort direction updates rows', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.descending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);

        column1.sortDirection = TableColumnSortDirection.ascending;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);
    });

    it('changing sort field updates rows', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo', stringData2: 'elephant' },
            { id: '2', stringData1: 'abc', stringData2: 'cat' },
            { id: '3', stringData1: 'zzz', stringData2: 'dog' },
            { id: '4', stringData1: 'hello', stringData2: 'ant' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);

        column1.fieldName = 'stringData2';
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['4', '2', '3', '1']);
    });

    it('performs case sensitive string sort', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'FOO' },
            { id: '3', stringData1: 'fOO' },
            { id: '4', stringData1: 'Foo' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '3', '4', '2']);
    });

    it('removing sorting restores rows to default order based on data', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);

        column1.sortDirection = TableColumnSortDirection.none;
        column1.sortIndex = null;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '3', '4']);
    });

    it('can perform string sort with undefined value', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: undefined },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '4', '3']);
    });

    it('can perform string sort with null value', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: null },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '4', '3']);
    });

    it('can sort with have field names containing "."', async () => {
        /* eslint-disable @typescript-eslint/naming-convention */
        interface ExtendedTableRecord extends SimpleTableRecord {
            'field.name.with.dots': string;
        }

        const data: readonly ExtendedTableRecord[] = [
            { id: '1', 'field.name.with.dots': 'abc' },
            { id: '2', 'field.name.with.dots': 'zzz' },
            { id: '3', 'field.name.with.dots': 'hello' }
        ] as const;

        column1.fieldName = 'field.name.with.dots';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '3', '2']);
        /* eslint-enable @typescript-eslint/naming-convention */
    });

    it('updating data maintains sort state and updates row order', async () => {
        const originalData: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;
        const newData: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'elephant' },
            { id: '2', stringData1: 'cat' },
            { id: '3', stringData1: 'dog' },
            { id: '4', stringData1: 'ant' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(originalData);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);

        await element.setData(newData);
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['4', '2', '3', '1']);
    });

    it('can sort by multiple columns', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello', stringData2: 'world' },
            { id: '2', stringData1: 'good bye', stringData2: 'moon' },
            { id: '3', stringData1: 'hello', stringData2: 'moon' },
            { id: '4', stringData1: 'good bye', stringData2: 'world' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 1;
        column2.fieldName = 'stringData2';
        column2.sortDirection = TableColumnSortDirection.descending;
        column2.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['4', '1', '2', '3']);
    });

    it('can update sort index', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'hello', stringData2: 'world' },
            { id: '2', stringData1: 'good bye', stringData2: 'moon' },
            { id: '3', stringData1: 'hello', stringData2: 'moon' },
            { id: '4', stringData1: 'good bye', stringData2: 'world' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 1;
        column2.fieldName = 'stringData2';
        column2.sortDirection = TableColumnSortDirection.descending;
        column2.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['4', '1', '2', '3']);

        column2.sortIndex = 2;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['4', '2', '1', '3']);
    });

    it('sets correct sort direction on header rows', async () => {
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        column3.sortDirection = TableColumnSortDirection.descending;
        column3.sortIndex = 1;
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getHeaderElement(0).sortDirection).toBe(
            TableColumnSortDirection.ascending
        );
        expect(pageObject.getHeaderElement(1).sortDirection).toBe(
            TableColumnSortDirection.none
        );
        expect(pageObject.getHeaderElement(2).sortDirection).toBe(
            TableColumnSortDirection.descending
        );
    });

    it('updates sort direction on header rows when sort direction changes', async () => {
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        column3.sortDirection = TableColumnSortDirection.descending;
        column3.sortIndex = 1;
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getHeaderElement(0).sortDirection).toBe(
            TableColumnSortDirection.ascending
        );
        expect(pageObject.getHeaderElement(1).sortDirection).toBe(
            TableColumnSortDirection.none
        );
        expect(pageObject.getHeaderElement(2).sortDirection).toBe(
            TableColumnSortDirection.descending
        );

        column1.sortDirection = TableColumnSortDirection.descending;
        column2.sortDirection = TableColumnSortDirection.ascending;
        column2.sortIndex = 2;
        await waitForUpdatesAsync();

        expect(pageObject.getHeaderElement(0).sortDirection).toBe(
            TableColumnSortDirection.descending
        );
        expect(pageObject.getHeaderElement(1).sortDirection).toBe(
            TableColumnSortDirection.ascending
        );
        expect(pageObject.getHeaderElement(2).sortDirection).toBe(
            TableColumnSortDirection.descending
        );
    });

    it('does not set sort on header when a sort index is not specified', async () => {
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        column2.sortDirection = TableColumnSortDirection.descending;
        column2.sortIndex = null;
        column3.sortDirection = TableColumnSortDirection.descending;
        column3.sortIndex = undefined;
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getHeaderElement(0).sortDirection).toBe(
            TableColumnSortDirection.ascending
        );
        expect(pageObject.getHeaderElement(1).sortDirection).toBe(
            TableColumnSortDirection.none
        );
        expect(pageObject.getHeaderElement(2).sortDirection).toBe(
            TableColumnSortDirection.none
        );
    });

    it('sets `first-column-sorted` on header with lowest sort index', async () => {
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 1;
        column3.sortDirection = TableColumnSortDirection.descending;
        column3.sortIndex = 0;
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getHeaderElement(0).firstSortedColumn).toBe(false);
        expect(pageObject.getHeaderElement(1).firstSortedColumn).toBe(false);
        expect(pageObject.getHeaderElement(2).firstSortedColumn).toBe(true);

        column1.sortIndex = -1;
        await waitForUpdatesAsync();

        expect(pageObject.getHeaderElement(0).firstSortedColumn).toBe(true);
        expect(pageObject.getHeaderElement(1).firstSortedColumn).toBe(false);
        expect(pageObject.getHeaderElement(2).firstSortedColumn).toBe(false);
    });

    it('can have multiple sorted columns sorted by the same data field', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.descending;
        column1.sortIndex = 0;
        column2.fieldName = 'stringData1';
        column2.sortDirection = TableColumnSortDirection.ascending;
        column2.sortIndex = 1;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);
    });

    it('disables sorting when sortingDisabled is true (set before connect), with currentSortIndex/currentSortDirection resolving to undefined/none', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        column1.sortingDisabled = true;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '3', '4']);
        expect(column1.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.none
        );
        expect(column1.columnInternals.currentSortIndex).toBeUndefined();
    });

    it('disables sorting when sortingDisabled is true (set after connect), with currentSortIndex/currentSortDirection resolving to undefined/none', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        column1.sortingDisabled = true;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['1', '2', '3', '4']);
        expect(column1.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.none
        );
        expect(column1.columnInternals.currentSortIndex).toBeUndefined();
    });

    it('allows programmatic sorting after sortingDisabled is set back to false', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;

        column1.fieldName = 'stringData1';
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        column1.sortingDisabled = true;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        column1.sortingDisabled = false;
        await waitForUpdatesAsync();

        expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);
        expect(column1.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.ascending
        );
        expect(column1.columnInternals.currentSortIndex).toEqual(0);
    });

    it('does not emit "column-configuration-change" when sorting changes programmatically', async () => {
        const data: readonly SimpleTableRecord[] = [
            { id: '1', stringData1: 'foo' },
            { id: '2', stringData1: 'abc' },
            { id: '3', stringData1: 'zzz' },
            { id: '4', stringData1: 'hello' }
        ] as const;
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();

        const listener = createEventListener(
            element,
            'column-configuration-change'
        );
        column1.sortDirection = TableColumnSortDirection.ascending;
        column1.sortIndex = 0;
        await waitForUpdatesAsync();

        expect(listener.spy).not.toHaveBeenCalled();
    });

    describe('sort index validation', () => {
        it('multiple columns with the same sort index and a sort direction is invalid and does not render rows', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            column2.fieldName = 'stringData2';
            column2.sortDirection = TableColumnSortDirection.ascending;
            column2.sortIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateSortIndex).toBeTrue();
            expect(pageObject.getRenderedRowCount()).toBe(0);
        });

        it('multiple columns with the same sort index without a sort direction is valid renders rows', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            column2.fieldName = 'stringData2';
            column2.sortDirection = TableColumnSortDirection.none;
            column2.sortIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateSortIndex).toBeFalse();
            expect(pageObject.getRenderedRowCount()).toBe(4);
        });

        it('transitioning out of having duplicate sort indices updates table', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            column2.fieldName = 'stringData2';
            column2.sortDirection = TableColumnSortDirection.ascending;
            column2.sortIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateSortIndex).toBeTrue();
            expect(pageObject.getRenderedRowCount()).toBe(0);

            column2.sortIndex = 1;
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateSortIndex).toBeFalse();
            expect(pageObject.getRenderedRowCount()).toBe(4);
        });

        it('transitioning into having duplicate sort indices updates table', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            column2.fieldName = 'stringData2';
            column2.sortDirection = TableColumnSortDirection.ascending;
            column2.sortIndex = 1;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateSortIndex).toBeFalse();
            expect(pageObject.getRenderedRowCount()).toBe(4);

            column2.sortIndex = 0;
            await waitForUpdatesAsync();

            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateSortIndex).toBeTrue();
            expect(pageObject.getRenderedRowCount()).toBe(0);
        });
    });

    describe('changing slotted columns', () => {
        async function removeExistingColumnsAndAddNewColumn(
            fieldName: string,
            sortDirection: TableColumnSortDirection
        ): Promise<TableColumnText> {
            element.removeChild(column1);
            element.removeChild(column2);
            element.removeChild(column3);

            const newColumn = document.createElement(
                'nimble-table-column-text'
            );
            newColumn.fieldName = fieldName;
            if (sortDirection !== TableColumnSortDirection.none) {
                newColumn.sortDirection = sortDirection;
                newColumn.sortIndex = 0;
            }
            element.appendChild(newColumn);

            await waitForUpdatesAsync();
            return newColumn;
        }

        it('removes sorting if no new columns are sorted', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);

            await removeExistingColumnsAndAddNewColumn(
                'stringData1',
                TableColumnSortDirection.none
            );
            expect(getRenderedRecordIds()).toEqual(['1', '2', '3', '4']);
        });

        it('applies new sorting if new columns are sorted', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);

            await removeExistingColumnsAndAddNewColumn(
                'stringData1',
                TableColumnSortDirection.ascending
            );
            expect(getRenderedRecordIds()).toEqual(['2', '1', '4', '3']);
        });

        it('sort state responds to changes on new columns', async () => {
            const data: readonly SimpleTableRecord[] = [
                { id: '1', stringData1: 'foo' },
                { id: '2', stringData1: 'abc' },
                { id: '3', stringData1: 'zzz' },
                { id: '4', stringData1: 'hello' }
            ] as const;

            column1.fieldName = 'stringData1';
            column1.sortDirection = TableColumnSortDirection.descending;
            column1.sortIndex = 0;
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);

            const newColumn = await removeExistingColumnsAndAddNewColumn(
                'stringData1',
                TableColumnSortDirection.ascending
            );
            newColumn.sortDirection = TableColumnSortDirection.descending;
            await waitForUpdatesAsync();

            expect(getRenderedRecordIds()).toEqual(['3', '4', '1', '2']);
        });
    });

    describe('interactive sorting', () => {
        const data: readonly SimpleTableRecord[] = [
            {
                id: '1',
                stringData1: 'a1',
                stringData2: 'b1',
                stringData3: 'c1'
            },
            {
                id: '2',
                stringData1: 'a2',
                stringData2: 'b2',
                stringData3: 'c2'
            },
            {
                id: '3',
                stringData1: 'a3',
                stringData2: 'b3',
                stringData3: 'c3'
            },
            { id: '4', stringData1: 'a4', stringData2: 'b4', stringData3: 'c4' }
        ] as const;

        it('does not affect sortIndex / sortDirection for the interactively sorted column', async () => {
            await element.setData(data);
            column1.sortIndex = 5;
            column1.sortDirection = TableColumnSortDirection.descending;
            await connect();
            await waitForUpdatesAsync();

            await pageObject.clickColumnHeader(0);

            expect(column1.sortDirection).toEqual(
                TableColumnSortDirection.descending
            );
            expect(column1.sortIndex).toEqual(5);
        });

        it('is disabled for columns with sortingDisabled set to true (with no modifications to currentSortDirection / currentSortIndex)', async () => {
            await element.setData(data);
            column1.sortingDisabled = true;
            await connect();
            await waitForUpdatesAsync();

            await pageObject.clickColumnHeader(0);

            expect(pageObject.getSortedColumns()).toEqual([]);
            expect(column1.columnInternals.currentSortDirection).toEqual(
                TableColumnSortDirection.none
            );
            expect(column1.columnInternals.currentSortIndex).toBeUndefined();
        });

        const directionLabel: (
            direction: TableColumnSortDirection
        ) => string = direction => `${direction ?? 'no'}-sort`;
        const directionCyclingTests: {
            initialDirection: TableColumnSortDirection,
            expectedDirectionAfterClick: TableColumnSortDirection
        }[] = [
            {
                initialDirection: TableColumnSortDirection.none,
                expectedDirectionAfterClick: TableColumnSortDirection.ascending
            },
            {
                initialDirection: TableColumnSortDirection.ascending,
                expectedDirectionAfterClick: TableColumnSortDirection.descending
            },
            {
                initialDirection: TableColumnSortDirection.descending,
                expectedDirectionAfterClick: TableColumnSortDirection.none
            }
        ];
        directionCyclingTests.forEach(test => {
            it(`${directionLabel(
                test.initialDirection
            )} columns become ${directionLabel(
                test.expectedDirectionAfterClick
            )} when clicked`, async () => {
                await element.setData(data);
                column1.sortDirection = test.initialDirection;
                column1.sortIndex = test.initialDirection === TableColumnSortDirection.none
                    ? undefined
                    : 0;
                await connect();
                await waitForUpdatesAsync();

                await pageObject.clickColumnHeader(0);

                const expectedSort: SortedColumn[] = test.expectedDirectionAfterClick
                    ? [
                        {
                            columnId: 'column-1',
                            sortDirection:
                                      test.expectedDirectionAfterClick
                        }
                    ]
                    : [];
                expect(pageObject.getSortedColumns()).toEqual(expectedSort);
            });

            it(`${directionLabel(
                test.initialDirection
            )} columns become ${directionLabel(
                test.expectedDirectionAfterClick
            )} when Shift-clicked, and other sorted columns stay sorted`, async () => {
                await element.setData(data);
                column1.sortDirection = test.initialDirection;
                column1.sortIndex = test.initialDirection === TableColumnSortDirection.none
                    ? undefined
                    : 1;
                column2.sortDirection = TableColumnSortDirection.ascending;
                column2.sortIndex = 0;
                await connect();
                await waitForUpdatesAsync();

                await pageObject.clickColumnHeader(0, true);

                const alreadySortedColumn: SortedColumn = {
                    columnId: 'column-2',
                    sortDirection: TableColumnSortDirection.ascending
                };
                const expectedSort: SortedColumn[] = test.expectedDirectionAfterClick
                    ? [
                        alreadySortedColumn,
                        {
                            columnId: 'column-1',
                            sortDirection:
                                      test.expectedDirectionAfterClick
                        }
                    ]
                    : [alreadySortedColumn];
                expect(column1.columnInternals.currentSortDirection).toEqual(
                    test.expectedDirectionAfterClick
                );
                expect(pageObject.getSortedColumns()).toEqual(expectedSort);
            });
        });

        it('sort indices are normalized (0 to n-1 for n sorted columns), and maintain their relative sort order, on interactive sort operations', async () => {
            await element.setData(data);
            column1.sortDirection = TableColumnSortDirection.ascending;
            column1.sortIndex = -3;
            column2.sortDirection = TableColumnSortDirection.ascending;
            column2.sortIndex = -5;
            column3.sortDirection = TableColumnSortDirection.ascending;
            column3.sortIndex = -1;
            await connect();
            await waitForUpdatesAsync();

            await pageObject.clickColumnHeader(1, true);

            expect(column1.columnInternals.currentSortDirection).toEqual(
                TableColumnSortDirection.ascending
            );
            expect(column1.columnInternals.currentSortIndex).toEqual(1);
            expect(column2.columnInternals.currentSortDirection).toEqual(
                TableColumnSortDirection.descending
            );
            expect(column2.columnInternals.currentSortIndex).toEqual(0);
            expect(column3.columnInternals.currentSortDirection).toEqual(
                TableColumnSortDirection.ascending
            );
            expect(column3.columnInternals.currentSortIndex).toEqual(2);
        });

        it('emits "column-configuration-change" when sorting is enabled on the column', async () => {
            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();

            const listener = createEventListener(
                element,
                'column-configuration-change'
            );
            await pageObject.clickColumnHeader(0);

            expect(listener.spy).toHaveBeenCalled();
            const args = listener.spy.calls.first()
                .args[0] as CustomEvent<TableColumnConfigurationChangeEventDetail>;
            expect(args.detail).toEqual({
                columns: [
                    {
                        columnId: 'column-1',
                        hidden: false,
                        sortIndex: 0,
                        sortDirection: TableColumnSortDirection.ascending,
                        groupIndex: undefined,
                        fractionalWidth: 1,
                        pixelWidth: undefined
                    },
                    {
                        columnId: 'column-2',
                        hidden: false,
                        sortIndex: undefined,
                        sortDirection: TableColumnSortDirection.none,
                        groupIndex: undefined,
                        fractionalWidth: 1,
                        pixelWidth: undefined
                    },
                    {
                        columnId: 'column-3',
                        hidden: false,
                        sortIndex: undefined,
                        sortDirection: TableColumnSortDirection.none,
                        groupIndex: undefined,
                        fractionalWidth: 1,
                        pixelWidth: undefined
                    }
                ]
            });
        });

        it('does not emit "column-configuration-change" when sorting is disabled on the column', async () => {
            await element.setData(data);
            column1.sortingDisabled = true;
            await connect();
            await waitForUpdatesAsync();

            const listener = createEventListener(
                element,
                'column-configuration-change'
            );
            await pageObject.clickColumnHeader(0);

            expect(listener.spy).not.toHaveBeenCalled();
        });
    });
});
