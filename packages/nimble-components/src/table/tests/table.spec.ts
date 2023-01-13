import { html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Table } from '..';
import { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableRecord } from '../types';
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

const tableColumnText = DesignSystem.tagFor(TableColumnText);

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
                <${tableColumnText} field-name="stringData">stringData</${tableColumnText}>
            </nimble-table>`
    );
}

describe('Table', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    // The assumption being made here is that the values in the data are equal to their
    // rendered representation (no formatting).
    function retrieveVisibleData(
        tableData: SimpleTableRecord[]
    ): TableRecord[] {
        const visibleData: TableRecord[] = [];
        for (const rowData of tableData) {
            const record: TableRecord = {};
            for (const column of element.columns) {
                const dataKey = column.getRecordFieldNames()[0]!;
                const expectedCellData = rowData[dataKey]!;
                record[dataKey] = expectedCellData;
            }
            visibleData.push(record);
        }
        return visibleData;
    }

    function verifyRenderedData(): void {
        const visibleData = retrieveVisibleData(element.data);
        const expectedRowCount = visibleData.length;
        expect(pageObject.getRenderedRowCount()).toEqual(expectedRowCount);
        for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
            for (
                let columnIndex = 0;
                columnIndex < element.columns.length;
                columnIndex++
            ) {
                const dataKey = element.columns[columnIndex]!.getRecordFieldNames()[0]!;
                const expectedCellData = visibleData[rowIndex]![dataKey]!;
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
            element.columns.length
        );
        for (
            let columnIndex = 0;
            columnIndex < element.columns.length;
            columnIndex++
        ) {
            expect(pageObject.getRenderedHeaderContent(columnIndex)).toEqual(
                element.columns[columnIndex]!.textContent!
            );
        }
    });

    it('can set data before the element is connected', async () => {
        const data = [...simpleTableData];
        element.data = data;
        await connect();
        await waitForUpdatesAsync();

        verifyRenderedData();
    });

    it('can set data after the element is connected', async () => {
        await connect();
        await waitForUpdatesAsync();

        const data = [...simpleTableData];
        element.data = data;
        await waitForUpdatesAsync();

        verifyRenderedData();
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
                moreStringData: 'foo'
            }
        ];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData();
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

        verifyRenderedData();
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

        verifyRenderedData();
    });

    it('adding column to end renders data for column at end of row', async () => {
        await connect();
        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        const dateColumn = new TableColumnText();
        dateColumn.fieldName = 'moreStringData';

        element.appendChild(dateColumn);
        await waitForUpdatesAsync();
        expect(element.columns[element.columns.length - 1]).toBe(dateColumn);

        verifyRenderedData();
    });

    it('adding column to front renders data for column at front of row', async () => {
        await connect();
        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        const dateColumn = new TableColumnText();
        dateColumn.fieldName = 'moreStringData';

        element.insertBefore(dateColumn, element.columns[0]!);
        await waitForUpdatesAsync();
        expect(element.columns[0]).toBe(dateColumn);

        verifyRenderedData();
    });

    describe('ID validation', () => {
        it('setting valid field for ID is valid and renders rows', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'stringData';
            await connect();
            await waitForUpdatesAsync();

            verifyRenderedData();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.duplicateRowId).toBeFalse();
            expect(element.validity.invalidRowId).toBeFalse();
            expect(element.validity.missingRowId).toBeFalse();
        });

        it('setting invalid field for ID  is invalid and renders no rows', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'numericData';
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateRowId).toBeFalse();
            expect(element.validity.invalidRowId).toBeTrue();
            expect(element.validity.missingRowId).toBeFalse();
        });

        it('setting ID field name to undefined makes an invalid table valid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            element.idFieldName = undefined;
            await waitForUpdatesAsync();

            verifyRenderedData();
            expect(element.checkValidity()).toBeTrue();
        });

        it('setting a valid ID field name makes an invalid table valid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'missingFieldName';
            await connect();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            element.idFieldName = 'stringData';
            await waitForUpdatesAsync();

            verifyRenderedData();
            expect(element.checkValidity()).toBeTrue();
        });

        it('setting invalid ID field name on valid table makes it invalid', async () => {
            const data = [...simpleTableData];
            element.data = data;
            element.idFieldName = 'stringData';
            await connect();
            await waitForUpdatesAsync();

            verifyRenderedData();
            expect(element.checkValidity()).toBeTrue();

            element.idFieldName = 'missingFieldName';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
        });
    });
});
