import { html } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableRecord } from '../types';
import { TablePageObject } from './table.pageobject';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    moreStringData: string;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        moreStringData: 'foo'
    },
    {
        stringData: 'hello world',
        moreStringData: 'foo'
    },
    {
        stringData: 'another string',
        moreStringData: 'foo'
    }
] as const;

const largeTableData = Array.from(Array(500), (_, i) => {
    return {
        stringData: `string ${i}`,
        moreStringData: 'foo'
    };
});

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text id="first-column" field-name="stringData">                
            </nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="moreStringData">
            </nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table Column Sizing', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumn;
    let column2: TableColumn;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        column1 = element.querySelector<TableColumn>('#first-column')!;
        column2 = element.querySelector<TableColumn>('#second-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    describe('table column size changes result in correct rendered widths', () => {
        const columnSizeTests = [
            {
                name: 'both columns have same fractionalWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: undefined,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 200,
                column2ExpectedRenderedWidth: 200,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'one column has larger fractionalWidth',
                tableWidth: 300,
                column1FractionalWidth: 2,
                column1PixelWidth: undefined,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 200,
                column2ExpectedRenderedWidth: 100,
                rowExpectedRenderedWidth: 300
            },
            {
                name: 'first column set to use pixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 100,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 100,
                column2ExpectedRenderedWidth: 300,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'second column set to use pixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: undefined,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: 100,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 300,
                column2ExpectedRenderedWidth: 100,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'both columns use pixelWidth',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 100,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: 100,
                column2MinPixelWidth: undefined,
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
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 75,
                column2ExpectedRenderedWidth: 325,
                rowExpectedRenderedWidth: 400
            },
            {
                name: 'combined minPixelWidth of first column and pixelWidth of second column being greater than table width, results in row size greater than table width',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: undefined,
                column1MinPixelWidth: 100,
                column2FractionalWidth: 1,
                column2PixelWidth: 350,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 100,
                column2ExpectedRenderedWidth: 350,
                rowExpectedRenderedWidth: 450
            },
            {
                name: 'combined pixelWidth of first column and minPixelWidth of second column being greater than table width, results in row size greater than table width',
                tableWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 350,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: 100,
                column1ExpectedRenderedWidth: 350,
                column2ExpectedRenderedWidth: 100,
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
                    if (
                        typeof columnSizeTest.column1MinPixelWidth === 'number'
                    ) {
                        column1.internalMinPixelWidth = columnSizeTest.column1MinPixelWidth;
                    }

                    column2.internalFractionalWidth = columnSizeTest.column2FractionalWidth;
                    column2.internalPixelWidth = columnSizeTest.column2PixelWidth;
                    if (
                        typeof columnSizeTest.column2MinPixelWidth === 'number'
                    ) {
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

        it('resizing table with fractionalWidth columns changes column rendered widths', async () => {
            await connect();
            element.style.width = '400px';
            element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            element.style.width = '300px';
            await waitForUpdatesAsync();

            const column1RenderedWidth = pageObject.getCellRenderedWidth(0);
            const column2RenderedWidth = pageObject.getCellRenderedWidth(1);
            expect(column1RenderedWidth).toBe(150);
            expect(column2RenderedWidth).toBe(150);
        });
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
