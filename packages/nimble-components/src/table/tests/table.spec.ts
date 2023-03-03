import { html } from '@microsoft/fast-element';
import { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { controlHeight } from '../../theme-provider/design-tokens';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableRecord } from '../types';
import { TablePageObject } from './table.pageobject';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

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

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text id="first-column" field-name="stringData">stringData</nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="moreStringData">
                <nimble-icon-check></nimble-icon-check>
            </nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumn;
    let column2: TableColumn;

    // The assumption being made here is that the values in the data are equal to their
    // rendered representation (no formatting).
    function retrieveExpectedData(
        tableData: readonly SimpleTableRecord[]
    ): TableRecord[] {
        const expectedData: TableRecord[] = [];
        for (const rowData of tableData) {
            const record: TableRecord = {};
            for (const column of element.columns) {
                if (column.columnHidden) {
                    continue;
                }

                const dataKey = column.dataRecordFieldNames[0]!;
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
        const visibleColumns = element.columns.filter(x => !x.columnHidden);

        for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
            for (
                let columnIndex = 0;
                columnIndex < visibleColumns.length;
                columnIndex++
            ) {
                const dataKey = visibleColumns[columnIndex]!.dataRecordFieldNames[0]!;
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
        column1 = element.querySelector<TableColumn>('#first-column')!;
        column2 = element.querySelector<TableColumn>('#second-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-table')).toBeInstanceOf(Table);
    });

    it('column header content should be the columns', async () => {
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
            expect(pageObject.getHeaderContent(columnIndex))
                .withContext(`for column${columnIndex}`)
                .toEqual(element.columns[columnIndex]);
        }
    });

    it('changing column content updates header rendered content', async () => {
        await connect();

        element.setData(simpleTableData);
        await waitForUpdatesAsync();

        let headerContent = pageObject.getHeaderContent(0)!.firstChild;
        expect(headerContent?.textContent).toEqual('stringData');

        element.columns[0]!.textContent = 'foo';
        await waitForUpdatesAsync();

        headerContent = pageObject.getHeaderContent(0)!.firstChild;
        expect(headerContent?.textContent).toEqual('foo');
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
                otherData: 'an even newer string',
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
            otherData: 'yet another record',
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
            otherData: 'blah de blah blah',
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

    it('transitioning the table state from valid to invalid and back to valid rerenders the table correctly', async () => {
        element.setData(simpleTableData);
        await connect();
        await waitForUpdatesAsync();

        element.idFieldName = 'missingFieldName';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedRowCount()).toBe(0);
        expect(element.checkValidity()).toBeFalse();

        element.idFieldName = undefined;
        await waitForUpdatesAsync();

        verifyRenderedData(simpleTableData);
        expect(element.checkValidity()).toBeTrue();
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

    describe('column IDs', () => {
        it('duplicate column IDs marks the table as invalid and rows are not rendered', async () => {
            element.setData(simpleTableData);
            column1.columnId = 'my-column-id';
            column2.columnId = 'my-column-id';
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateColumnId).toBeTrue();
            expect(element.validity.missingColumnId).toBeFalse();
        });

        it('missing column IDs marks the table as invalid and rows are not rendered', async () => {
            element.setData(simpleTableData);
            column1.columnId = 'my-column-id';
            column2.columnId = undefined;
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateColumnId).toBeFalse();
            expect(element.validity.missingColumnId).toBeTrue();
        });

        it('table validity updates if column IDs become valid', async () => {
            element.setData(simpleTableData);
            column1.columnId = 'my-column-id';
            column2.columnId = undefined;
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedRowCount()).toBe(0);
            expect(element.checkValidity()).toBeFalse();

            column2.setAttribute('column-id', 'my-other-column-id');
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();
        });

        it('table validity updates if column IDs become invalid', async () => {
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            verifyRenderedData(simpleTableData);
            expect(element.checkValidity()).toBeTrue();

            column1.setAttribute('column-id', 'my-column-id');
            column2.setAttribute('column-id', 'my-column-id');
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

    describe('hidden columns', () => {
        it('does not render hidden columns', async () => {
            column1.columnHidden = true;
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            const visibleColumnCount = element.columns.filter(
                x => !x.columnHidden
            ).length;
            expect(pageObject.getRenderedHeaderCount()).toEqual(
                visibleColumnCount
            );
            expect(pageObject.getRenderedCellCountForRow(0)).toEqual(
                visibleColumnCount
            );
            verifyRenderedData(simpleTableData);
        });

        it('changing a column from hidden to not hidden makes it visible', async () => {
            column1.columnHidden = true;
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            column1.columnHidden = false;
            await waitForUpdatesAsync();

            const visibleColumnCount = element.columns.filter(
                x => !x.columnHidden
            ).length;
            expect(pageObject.getRenderedHeaderCount()).toEqual(
                visibleColumnCount
            );
            expect(pageObject.getRenderedCellCountForRow(0)).toEqual(
                visibleColumnCount
            );
            verifyRenderedData(simpleTableData);
        });

        it('changing a column from not hidden to hidden makes it hidden', async () => {
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            column1.columnHidden = true;
            await waitForUpdatesAsync();

            const visibleColumnCount = element.columns.filter(
                x => !x.columnHidden
            ).length;
            expect(pageObject.getRenderedHeaderCount()).toEqual(
                visibleColumnCount
            );
            expect(pageObject.getRenderedCellCountForRow(0)).toEqual(
                visibleColumnCount
            );
            verifyRenderedData(simpleTableData);
        });
    });

    describe('table column sizing', () => {
        const columnSizeTests = [
            {
                name: 'both columns have same fractionalWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: null,
                column1MinPixelWidth: null,
                column2FractionalWidth: 1,
                column2PixelWidth: null,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 200,
                column2ExpectedRenderedWidth: 200,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'one column has larger fractionalWidth',
                tableWidth: 300,
                column1FractionalWidth: 2,
                column1PixelWidth: null,
                column1MinPixelWidth: null,
                column2FractionalWidth: 1,
                column2PixelWidth: null,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 200,
                column2ExpectedRenderedWidth: 100,
                rowExpectedRenderedWidth: 300
            },
            {
                name: 'first column set to use pixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 100,
                column1MinPixelWidth: null,
                column2FractionalWidth: 1,
                column2PixelWidth: null,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 100,
                column2ExpectedRenderedWidth: 300,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'second column set to use pixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: null,
                column1MinPixelWidth: null,
                column2FractionalWidth: 1,
                column2PixelWidth: 100,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 300,
                column2ExpectedRenderedWidth: 100,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'both columns use pixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 100,
                column1MinPixelWidth: null,
                column2FractionalWidth: 1,
                column2PixelWidth: 100,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 100,
                column2ExpectedRenderedWidth: 100,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'first column has smaller pixelWidth than minPixelWidth, results in column with size of minPixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 50,
                column1MinPixelWidth: 75,
                column2FractionalWidth: 1,
                column2PixelWidth: null,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 75,
                column2ExpectedRenderedWidth: 325,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'combined minPixelWidth of first column and pixelWidth of second column being greater than table width, results in row size greater than table width',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: null,
                column1MinPixelWidth: 100,
                column2FractionalWidth: 1,
                column2PixelWidth: 350,
                column2MinPixelWidth: null,
                column1ExpectedRenderedWidth: 100,
                column2ExpectedRenderedWidth: 350,
                rowExpectedRenderedWidth: 450
            }
        ];
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const columnSizeTest of columnSizeTests) {
            const specType = getSpecTypeByNamedList(
                columnSizeTest,
                focused,
                disabled
            );
            specType(
                `${columnSizeTest.name}`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();
                    element.style.width = `${columnSizeTest.tableWidth.toString()}px`;
                    element.setData(simpleTableData);
                    await connect();
                    await waitForUpdatesAsync();

                    column1.internalFractionalWidth = columnSizeTest.column1FractionalWidth;
                    column1.internalPixelWidth = columnSizeTest.column1PixelWidth;
                    if (columnSizeTest.column1MinPixelWidth !== null) {
                        column1.internalMinPixelWidth = columnSizeTest.column1MinPixelWidth;
                    }

                    column2.internalFractionalWidth = columnSizeTest.column2FractionalWidth;
                    column2.internalPixelWidth = columnSizeTest.column2PixelWidth;
                    if (columnSizeTest.column2MinPixelWidth !== null) {
                        column2.internalMinPixelWidth = columnSizeTest.column2MinPixelWidth;
                    }

                    await waitForUpdatesAsync();
                    const column1RenderedWidth = pageObject.getCellRenderedWidth(0);
                    const column2RenderedWidth = pageObject.getCellRenderedWidth(1);
                    const header1RenderedWidth = pageObject.getHeaderRenderedWidth(0);
                    const header2RenderedWidth = pageObject.getHeaderRenderedWidth(1);
                    const rowWidth = pageObject.getRowWidth();
                    const tableWidth = element.getBoundingClientRect().width;
                    expect(column1RenderedWidth).toBe(
                        columnSizeTest.column1ExpectedRenderedWidth
                    );
                    expect(column2RenderedWidth).toBe(
                        columnSizeTest.column2ExpectedRenderedWidth
                    );
                    expect(header1RenderedWidth).toBe(
                        columnSizeTest.column1ExpectedRenderedWidth
                    );
                    expect(header2RenderedWidth).toBe(
                        columnSizeTest.column2ExpectedRenderedWidth
                    );
                    expect(rowWidth).toBe(
                        columnSizeTest.rowExpectedRenderedWidth
                    );
                    expect(tableWidth).toBe(columnSizeTest.tableWidth);
                }
            );
        }
    });

    describe('columns/cells are sized correctly after scrolling vertically', () => {
        const tests = [
            {
                name: 'when columns have min pixel widths',
                column1FractionalWidth: 1,
                column1PixelWidth: null,
                column1MinPixelWidth: 250,
                column2FractionalWidth: 1,
                column2PixelWidth: null,
                column2MinPixelWidth: 150
            },
            {
                name: 'when columns have fractional widths',
                column1FractionalWidth: 2,
                column1PixelWidth: null,
                column1MinPixelWidth: null,
                column2FractionalWidth: 1,
                column2PixelWidth: null,
                column2MinPixelWidth: null
            }
        ];
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const rowScrollTest of tests) {
            const specType = getSpecTypeByNamedList(
                rowScrollTest,
                focused,
                disabled
            );
            specType(
                `${rowScrollTest.name}`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();
                    element.style.width = '300px';
                    element.setData(largeTableData);
                    await connect();
                    await waitForUpdatesAsync();

                    column1.internalFractionalWidth = rowScrollTest.column1FractionalWidth;
                    if (rowScrollTest.column1MinPixelWidth !== null) {
                        column1.internalMinPixelWidth = rowScrollTest.column1MinPixelWidth;
                    }

                    column2.internalFractionalWidth = rowScrollTest.column2FractionalWidth;
                    if (rowScrollTest.column2MinPixelWidth !== null) {
                        column2.internalMinPixelWidth = rowScrollTest.column2MinPixelWidth;
                    }

                    await waitForUpdatesAsync();
                    const firstRowColumn1RenderedWidth = pageObject.getCellRenderedWidth(0, 0);
                    const firstRowColumn2RenderedWidth = pageObject.getCellRenderedWidth(1, 0);
                    await pageObject.scrollToLastRowAsync();
                    const lastRowIndex = pageObject.getRenderedRowCount() - 1;
                    const lastRowColumn1RenderedWidth = pageObject.getCellRenderedWidth(0, lastRowIndex);
                    const lastRowColumn2RenderedWidth = pageObject.getCellRenderedWidth(1, lastRowIndex);

                    expect(firstRowColumn1RenderedWidth).toBe(
                        lastRowColumn1RenderedWidth
                    );
                    expect(firstRowColumn2RenderedWidth).toBe(
                        lastRowColumn2RenderedWidth
                    );
                }
            );
        }
    });
});
