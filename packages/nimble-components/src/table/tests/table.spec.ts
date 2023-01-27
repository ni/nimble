import { html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Table } from '..';
import { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { controlHeight } from '../../theme-provider/design-tokens';
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

const largeTableData = Array.from(Array(500), (_, i) => {
    return {
        stringData: `string ${i}`,
        numericData: i,
        moreStringData: 'foo'
    };
});

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
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-table')).toBeInstanceOf(Table);
    });

    it('should render column headers', async () => {
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
            expect(pageObject.getRenderedHeaderContent(columnIndex)).toEqual(
                element.columns[columnIndex]!.textContent!
            );
        }
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
});
