import { html } from '@microsoft/fast-element';
import { Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableRecord } from '../types';
import { TablePageObject } from './table.pageobject';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    numericData: number;
    booleanData: boolean;
    dateData: Date;
}

const simpleTableDataKeys = [
    'stringData',
    'numericData',
    'booleanData',
    'dateData'
] as const;

const simpleTableData = [
    {
        stringData: 'string 1',
        numericData: 8,
        booleanData: true,
        dateData: new Date(2008, 12, 11)
    },
    {
        stringData: 'hello world',
        numericData: 0,
        booleanData: true,
        dateData: new Date(2022, 5, 30)
    },
    {
        stringData: 'string 1',
        numericData: -9,
        booleanData: false,
        dateData: new Date(2000, 1, 1)
    }
] as const;

const largeTableData = Array.from(Array(500), (_, i) => {
    return {
        stringData: `string ${i}`,
        numericData: i,
        booleanData: false,
        dateData: new Date(2000, 1, 1)
    };
});

async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="height: 400px"></nimble-table>`
    );
}

describe('Table', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    function verifyRenderedData(expectedData: SimpleTableRecord[]): void {
        const expectedRowCount = expectedData.length;
        expect(pageObject.getRenderedRowCount()).toEqual(expectedRowCount);
        for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
            for (
                let columnIndex = 0;
                columnIndex < simpleTableDataKeys.length;
                columnIndex++
            ) {
                const dataKey = simpleTableDataKeys[columnIndex]!;
                const expectedCellData = expectedData[rowIndex]![dataKey]!;
                expect(
                    pageObject.getRenderedCellContent(rowIndex, columnIndex)
                ).toEqual(expectedCellData.toString());
            }
        }
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-table')).toBeInstanceOf(Table);
    });

    it('should render column headers', async () => {
        await connect();

        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedHeaderCount()).toEqual(
            simpleTableDataKeys.length
        );
        for (
            let columnIndex = 0;
            columnIndex < simpleTableDataKeys.length;
            columnIndex++
        ) {
            expect(pageObject.getRenderedHeaderContent(columnIndex)).toEqual(
                simpleTableDataKeys[columnIndex]!
            );
        }
    });

    it('can set data before the element is connected', async () => {
        const data = [...simpleTableData];
        element.data = data;
        await connect();
        await waitForUpdatesAsync();

        verifyRenderedData(data);
    });

    it('can set data after the element is connected', async () => {
        await connect();

        const data = [...simpleTableData];
        element.data = data;
        await waitForUpdatesAsync();

        verifyRenderedData(data);
    });

    it('updating data can add a new row to the table', async () => {
        await connect();

        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        const updatedData: SimpleTableRecord[] = [
            ...simpleTableData,
            {
                stringData: 'a new string',
                numericData: -9,
                booleanData: false,
                dateData: new Date()
            }
        ];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('updating data can remove rows from the table', async () => {
        await connect();

        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        const updatedData: SimpleTableRecord[] = [
            simpleTableData[0],
            simpleTableData[2]
        ];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('updating data can reorder rows from the table', async () => {
        await connect();

        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        const updatedData: SimpleTableRecord[] = [
            simpleTableData[1],
            simpleTableData[2],
            simpleTableData[0]
        ];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    describe('uses virtualization', () => {
        it('to render fewer rows (based on viewport size)', async () => {
            await connect();

            const data = [...largeTableData];
            element.data = data;
            await waitForUpdatesAsync();

            const actualRowCount = pageObject.getRenderedRowCount();
            const approximateRowHeight = 32;
            const expectedRowCountUpperBound = (element.offsetHeight / approximateRowHeight) * 3;
            expect(actualRowCount).toBeLessThan(data.length);
            expect(actualRowCount).toBeLessThan(expectedRowCountUpperBound);
            const dataSubset = data.slice(0, actualRowCount);
            verifyRenderedData(dataSubset);
        });

        it('and allows viewing the last rows in the data after scrolling to the bottom', async () => {
            await connect();

            const data = [...largeTableData];
            element.data = data;
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
            element.data = data;
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
});
