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
    'dateData',
    ''
] as const;

const simpleTableData = [
    {
        stringData: 'string 1',
        numericData: 8,
        booleanData: true,
        dateData: new Date(2008, 12, 11),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '': 'empty'
    },
    {
        stringData: 'hello world',
        numericData: 0,
        booleanData: true,
        dateData: new Date(2022, 5, 30),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '': 'foo'
    },
    {
        stringData: 'another string',
        numericData: -9,
        booleanData: false,
        dateData: new Date(2000, 1, 1),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '': 'bar'
    }
] as const;

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
                dateData: new Date(),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '': ''
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

    describe('ID validation', () => {
        it('setting valid field for ID is valid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'stringData';
            await connect();

            verifyRenderedData(data);
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateRowId).toBeFalse();
            expect(element.validity.invalidRowId).toBeFalse();
            expect(element.validity.missingRowId).toBeFalse();
        });

        it('ID field name can be an empty string', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = '';
            await connect();

            verifyRenderedData(data);
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateRowId).toBeFalse();
            expect(element.validity.invalidRowId).toBeFalse();
            expect(element.validity.missingRowId).toBeFalse();
        });

        it('setting data with duplicate IDs is invalid', async () => {
            const data = [...simpleTableData, simpleTableData[0]];
            element.data = data;
            element.idFieldName = 'stringData';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateRowId).toBeTrue();
            expect(element.validity.invalidRowId).toBeFalse();
            expect(element.validity.missingRowId).toBeFalse();
        });

        it('setting data with invalid ID value is invalid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'numericData';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateRowId).toBeFalse();
            expect(element.validity.invalidRowId).toBeTrue();
            expect(element.validity.missingRowId).toBeFalse();
        });

        it('setting data with missing IDs is invalid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateRowId).toBeFalse();
            expect(element.validity.invalidRowId).toBeFalse();
            expect(element.validity.missingRowId).toBeTrue();
        });

        it('setting ID field name to undefined should make an invalid table valid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            element.idFieldName = undefined;
            await waitForUpdatesAsync();

            verifyRenderedData(data);
            expect(element.checkValidity()).toBeTrue();
        });

        it('setting a valid ID field name should make an invalid table valid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            verifyRenderedData(data);
            expect(element.checkValidity()).toBeTrue();
        });

        it('setting invalid ID field name on valid table should make it invalid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'stringData';
            await connect();

            verifyRenderedData(data);
            expect(element.checkValidity()).toBeTrue();

            element.idFieldName = 'missingFieldName';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
        });
    });
});
