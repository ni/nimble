import { html } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type {
    TableColumnConfigurationChangeEventDetail,
    TableRecord
} from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import { createEventListener } from '../../utilities/tests/component';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    moreStringData: string;
    moreStringData2: string;
    moreStringData3: string;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        moreStringData: 'foo',
        moreStringData2: 'foo',
        moreStringData3: 'foo'
    },
    {
        stringData: 'hello world',
        moreStringData: 'foo',
        moreStringData2: 'foo',
        moreStringData3: 'foo'
    },
    {
        stringData: 'another string',
        moreStringData: 'foo',
        moreStringData2: 'foo',
        moreStringData3: 'foo'
    }
] as const;

const largeTableData = Array.from(Array(500), (_, i) => {
    return {
        stringData: `string ${i}`,
        moreStringData: 'foo',
        moreStringData2: `foo ${i}`,
        moreStringData3: `foo ${i + 1}`
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

// prettier-ignore
async function setupInteractiveTests(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text id="first-column" field-name="stringData" min-pixel-width="50">
            </nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="moreStringData" min-pixel-width="50">
            </nimble-table-column-text>
            <nimble-table-column-text id="third-column" field-name="moreStringData2" min-pixel-width="50">
            </nimble-table-column-text>
            <nimble-table-column-text id="fourth-column" field-name="moreStringData3" min-pixel-width="50">
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
                rowWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: undefined,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 200,
                column2ExpectedRenderedWidth: 200
            },
            {
                name: 'one column has larger fractionalWidth',
                rowWidth: 600,
                column1FractionalWidth: 2,
                column1PixelWidth: undefined,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 400,
                column2ExpectedRenderedWidth: 200
            },
            {
                name: 'first column set to use pixelWidth',
                rowWidth: 600,
                column1FractionalWidth: 1,
                column1PixelWidth: 200,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 200,
                column2ExpectedRenderedWidth: 400
            },
            {
                name: 'second column set to use pixelWidth',
                rowWidth: 600,
                column1FractionalWidth: 1,
                column1PixelWidth: undefined,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: 200,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 400,
                column2ExpectedRenderedWidth: 200
            },
            {
                name: 'both columns use pixelWidth',
                rowWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 300,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: 300,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 300,
                column2ExpectedRenderedWidth: 300
            },
            {
                name: 'first column has smaller pixelWidth than minPixelWidth, results in column with size of minPixelWidth',
                rowWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 50,
                column1MinPixelWidth: 75,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 75,
                column2ExpectedRenderedWidth: 325
            },
            {
                name: 'combined minPixelWidth of first column and pixelWidth of second column being greater than table width, results in row size greater than table width',
                rowWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: undefined,
                column1MinPixelWidth: 100,
                column2FractionalWidth: 1,
                column2PixelWidth: 350,
                column2MinPixelWidth: undefined,
                column1ExpectedRenderedWidth: 100,
                column2ExpectedRenderedWidth: 350
            },
            {
                name: 'combined pixelWidth of first column and minPixelWidth of second column being greater than table width, results in row size greater than table width',
                rowWidth: 400,
                column1FractionalWidth: 1,
                column1PixelWidth: 350,
                column1MinPixelWidth: undefined,
                column2FractionalWidth: 1,
                column2PixelWidth: undefined,
                column2MinPixelWidth: 100,
                column1ExpectedRenderedWidth: 350,
                column2ExpectedRenderedWidth: 100
            }
        ] as const;
        parameterizeSpec(columnSizeTests, (spec, name, value) => {
            spec(name, async () => {
                await connect();
                await pageObject.sizeTableToGivenRowWidth(
                    value.rowWidth,
                    element
                );
                await element.setData(simpleTableData);
                await connect();
                await waitForUpdatesAsync();

                column1.columnInternals.fractionalWidth = value.column1FractionalWidth;
                column1.columnInternals.pixelWidth = value.column1PixelWidth;
                if (typeof value.column1MinPixelWidth === 'number') {
                    column1.columnInternals.minPixelWidth = value.column1MinPixelWidth;
                }

                column2.columnInternals.fractionalWidth = value.column2FractionalWidth;
                column2.columnInternals.pixelWidth = value.column2PixelWidth;
                if (typeof value.column2MinPixelWidth === 'number') {
                    column2.columnInternals.minPixelWidth = value.column2MinPixelWidth;
                }

                await waitForUpdatesAsync();
                const column1RenderedWidth = pageObject.getCellRenderedWidth(
                    0,
                    0
                );
                const column2RenderedWidth = pageObject.getCellRenderedWidth(
                    0,
                    1
                );
                const header1RenderedWidth = pageObject.getHeaderRenderedWidth(0);
                const header2RenderedWidth = pageObject.getHeaderRenderedWidth(1);
                expect(column1RenderedWidth).toBe(
                    value.column1ExpectedRenderedWidth
                );
                expect(column2RenderedWidth).toBe(
                    value.column2ExpectedRenderedWidth
                );
                expect(header1RenderedWidth).toBe(
                    value.column1ExpectedRenderedWidth
                );
                expect(header2RenderedWidth).toBe(
                    value.column2ExpectedRenderedWidth
                );
            });
        });

        it('resizing table with fractionalWidth columns changes column rendered widths', async () => {
            await connect();
            await pageObject.sizeTableToGivenRowWidth(400, element);
            await element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            await pageObject.sizeTableToGivenRowWidth(300, element);
            await waitForUpdatesAsync();

            const column1RenderedWidth = pageObject.getCellRenderedWidth(0, 0);
            const column2RenderedWidth = pageObject.getCellRenderedWidth(0, 1);
            expect(column1RenderedWidth).toBe(150);
            expect(column2RenderedWidth).toBe(150);
        });

        it('hidden column results in other column filling whole space', async () => {
            await connect();
            await pageObject.sizeTableToGivenRowWidth(400, element);
            await element.setData(simpleTableData);
            await connect();
            await waitForUpdatesAsync();

            column1.columnHidden = true;
            await waitForUpdatesAsync();

            const column1RenderedWidth = pageObject.getCellRenderedWidth(0, 0);
            expect(column1RenderedWidth).toBe(400);
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
        ] as const;
        parameterizeSpec(tests, (spec, name, value) => {
            spec(name, async () => {
                await connect();
                await pageObject.sizeTableToGivenRowWidth(300, element);
                await element.setData(largeTableData);
                await connect();
                await waitForUpdatesAsync();

                column1.columnInternals.fractionalWidth = value.column1FractionalWidth;
                if (value.column1MinPixelWidth !== null) {
                    column1.columnInternals.minPixelWidth = value.column1MinPixelWidth;
                }

                column2.columnInternals.fractionalWidth = value.column2FractionalWidth;
                if (value.column2MinPixelWidth !== null) {
                    column2.columnInternals.minPixelWidth = value.column2MinPixelWidth;
                }

                await waitForUpdatesAsync();
                const firstRowColumn1RenderedWidth = pageObject.getCellRenderedWidth(0, 0);
                const firstRowColumn2RenderedWidth = pageObject.getCellRenderedWidth(0, 1);
                await pageObject.scrollToLastRowAsync();
                const lastRowIndex = pageObject.getRenderedRowCount() - 1;
                const lastRowColumn1RenderedWidth = pageObject.getCellRenderedWidth(lastRowIndex, 0);
                const lastRowColumn2RenderedWidth = pageObject.getCellRenderedWidth(lastRowIndex, 1);

                expect(firstRowColumn1RenderedWidth).toBe(
                    lastRowColumn1RenderedWidth
                );
                expect(firstRowColumn2RenderedWidth).toBe(
                    lastRowColumn2RenderedWidth
                );
            });
        });
    });
});

describe('Table Interactive Column Sizing', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setupInteractiveTests());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await connect();
        await element.setData(simpleTableData);
        await waitForUpdatesAsync();
        await pageObject.sizeTableToGivenRowWidth(400, element);
    });

    afterEach(async () => {
        await disconnect();
    });

    describe('No hidden columns ', () => {
        const columnSizeTests = [
            {
                name: 'sizing right only affects adjacent right column with delta less than min width',
                dragDeltas: [1],
                columnDragIndex: 0,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [101, 99, 100, 100]
            },
            {
                name: 'sizing right past the minimum size of adjacent right column cascades to next column',
                dragDeltas: [51],
                columnDragIndex: 0,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [151, 50, 99, 100]
            },
            {
                name: 'sizing right past the minimum size of all columns to right shrinks all columns to minimum size, but allows left column to keep growing',
                dragDeltas: [151],
                columnDragIndex: 0,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [251, 50, 50, 50]
            },
            {
                name: 'sizing left only affects adjacent left column with delta less than min width',
                dragDeltas: [-1],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [100, 100, 99, 101]
            },
            {
                name: 'sizing left past the minimum size of adjacent left column cascades to next column',
                dragDeltas: [-51],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [100, 99, 50, 151]
            },
            {
                name: 'sizing left past the minimum size of all columns to left shrinks all columns to minimum size, and stops growing right most column',
                dragDeltas: [-151],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [50, 50, 50, 250]
            },
            {
                name: `sizing left past the minimum size of all columns to left shrinks all columns to minimum size, and stops growing right most column,
                       and then moving cursor slightly to right causes no column width changes`,
                dragDeltas: [-152, 1],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [50, 50, 50, 250]
            },
            {
                name: 'sizing right causing cascade and then sizing left in same interaction reverts cascade effect',
                dragDeltas: [100, -50],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [100, 100, 150, 50]
            },
            {
                name: 'sizing left causing cascade and then sizing right in same interaction reverts cascade effect',
                dragDeltas: [-50, 25],
                columnDragIndex: 0,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 50],
                expectedColumnWidths: [75, 125, 100, 100]
            },
            {
                name: 'sizing a column with the same fractional width as other columns, but larger minimum size, does not result in different pixel widths for columns not resized',
                dragDeltas: [-10],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 50, 175],
                expectedColumnWidths: [75, 75, 65, 185]
            },
            {
                name: 'sizing a column with the same fractional width as other columns, but larger minimum size, with a fixed width column that is not interactively sized, does not result in different pixel widths for columns not resized',
                dragDeltas: [-30],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [85, undefined, undefined, undefined],
                minPixelWidths: [50, 50, 45, 175],
                expectedColumnWidths: [85, 65, 45, 205]
            },
            {
                name: 'sizing a column with the same fractional width as other columns, but larger minimum size, along with a fixed width column, does not result in different pixel widths for columns not resized',
                dragDeltas: [-25],
                columnDragIndex: 2,
                fractionalWidths: [1, 1, 1, 1],
                pixelWidths: [undefined, undefined, 75, undefined],
                minPixelWidths: [50, 50, 50, 175],
                expectedColumnWidths: [75, 75, 50, 200]
            }
        ] as const;
        parameterizeSpec(columnSizeTests, (spec, name, value) => {
            spec(name, async () => {
                element.columns.forEach((column, i) => {
                    column.columnInternals.fractionalWidth = value.fractionalWidths[i]!;
                    column.columnInternals.pixelWidth = value.pixelWidths[i]!;
                    column.columnInternals.minPixelWidth = value.minPixelWidths[i]!;
                });
                await waitForUpdatesAsync();
                pageObject.dragSizeColumnByRightDivider(
                    value.columnDragIndex,
                    value.dragDeltas
                );
                await waitForUpdatesAsync();
                value.expectedColumnWidths.forEach((width, i) => expect(pageObject.getCellRenderedWidth(0, i)).toBe(width));
            });
        });

        it('when table width is smaller than total column min width, dragging column still expands column', async () => {
            await pageObject.sizeTableToGivenRowWidth(100, element);
            await waitForUpdatesAsync();
            pageObject.dragSizeColumnByRightDivider(2, [50]);
            await waitForUpdatesAsync();
            const cellWidth = pageObject.getCellRenderedWidth(0, 2);
            expect(cellWidth).toBe(100);
        });

        it('sizing column beyond table width creates horizontal scrollbar', async () => {
            pageObject.dragSizeColumnByRightDivider(2, [100]);
            await waitForUpdatesAsync();
            expect(pageObject.isHorizontalScrollbarVisible()).toBeTrue();
        });

        it('sizing table with a horizontal scrollbar does not change column widths until sized beyond current column pixel widths', async () => {
            // create horizontal scrollbar with total column width of 450
            pageObject.dragSizeColumnByRightDivider(2, [100]);
            // size table below threshhold of total column widths
            await pageObject.sizeTableToGivenRowWidth(425, element);
            expect(pageObject.getTotalCellRenderedWidth()).toBe(450);
            // size table 50 pixels beyond total column widths
            await pageObject.sizeTableToGivenRowWidth(500, element);
            expect(pageObject.getTotalCellRenderedWidth()).toBe(500);
            expect(pageObject.isHorizontalScrollbarVisible()).toBeFalse();
        });

        it('after table gets horizontal scrollbar, growing right-most column to left does not remove scroll area', async () => {
            // create horizontal scrollbar with total column width of 450
            pageObject.dragSizeColumnByRightDivider(2, [100]);
            await waitForUpdatesAsync();
            pageObject.dragSizeColumnByRightDivider(2, [-100]);
            await waitForUpdatesAsync();
            expect(pageObject.getTotalCellRenderedWidth()).toBe(450);
        });

        it('sizing column results in updated currentFractionalWidths for columns', () => {
            pageObject.dragSizeColumnByRightDivider(0, [150]);
            const updatedFractionalWidths = element.columns.map(
                column => column.columnInternals.currentFractionalWidth
            );
            expect(updatedFractionalWidths).toEqual([2.5, 0.5, 0.5, 0.5]);
        });

        it('sizing column left of hidden column to the right cascade to columns to right of hidden column', async () => {
            element.columns[1]!.columnHidden = true;
            await waitForUpdatesAsync();
            const secondVisibleCellWidth = pageObject.getCellRenderedWidth(
                0,
                1
            );
            pageObject.dragSizeColumnByRightDivider(0, [5]);
            await waitForUpdatesAsync();
            expect(pageObject.getCellRenderedWidth(0, 1)).toBe(
                secondVisibleCellWidth - 5
            );
        });

        it('sizing column right of hidden column to the left cascade to columns to left of hidden column', async () => {
            element.columns[2]!.columnHidden = true;
            await waitForUpdatesAsync();
            const secondVisibleCellWidth = pageObject.getCellRenderedWidth(
                0,
                1
            );
            pageObject.dragSizeColumnByRightDivider(1, [-5]);
            await waitForUpdatesAsync();
            expect(pageObject.getCellRenderedWidth(0, 1)).toBe(
                secondVisibleCellWidth - 5
            );
        });

        it('hiding column after creating horizontal scroll space does not change scroll area', async () => {
            // create horizontal scrollbar with total column width of 450
            pageObject.dragSizeColumnByRightDivider(2, [100]);
            await waitForUpdatesAsync();
            element.columns[1]!.columnHidden = true;
            await waitForUpdatesAsync();
            expect(pageObject.getTotalCellRenderedWidth()).toBe(450);
            expect(pageObject.getRenderedCellCountForRow(0)).toBe(3);
        });
    });

    describe('hidden column drag right divider tests ', () => {
        const hiddenColumDragRightDividerTests = [
            {
                name: 'first column hidden, drag first right divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 0,
                dragDeltas: [50],
                expectedColumnWidths: [150, 50, 100]
            },
            {
                name: 'first column hidden, drag second right divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 1,
                dragDeltas: [50],
                expectedColumnWidths: [100, 150, 50]
            },
            {
                name: 'second column hidden, drag first right divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 0,
                dragDeltas: [50],
                expectedColumnWidths: [150, 50, 100]
            },
            {
                name: 'second column hidden, drag second right divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 1,
                dragDeltas: [50],
                expectedColumnWidths: [100, 150, 50]
            },
            {
                name: 'first column hidden, drag first right divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 0,
                dragDeltas: [-50],
                expectedColumnWidths: [50, 150, 100]
            },
            {
                name: 'first column hidden, drag second right divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 1,
                dragDeltas: [-50],
                expectedColumnWidths: [100, 50, 150]
            },
            {
                name: 'second column hidden, drag first right divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 0,
                dragDeltas: [-50],
                expectedColumnWidths: [50, 150, 100]
            },
            {
                name: 'second column hidden, drag second right divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 1,
                dragDeltas: [-50],
                expectedColumnWidths: [100, 50, 150]
            }
        ] as const;
        parameterizeSpec(
            hiddenColumDragRightDividerTests,
            (spec, name, value) => {
                spec(name, async () => {
                    await pageObject.sizeTableToGivenRowWidth(
                        value.tableWidth,
                        element
                    );
                    value.hiddenColumns.forEach(columnIndex => {
                        element.columns[columnIndex]!.columnHidden = true;
                    });
                    await waitForUpdatesAsync();
                    pageObject.dragSizeColumnByRightDivider(
                        value.dragColumnIndex,
                        value.dragDeltas
                    );
                    await waitForUpdatesAsync();
                    value.expectedColumnWidths.forEach((width, i) => expect(pageObject.getCellRenderedWidth(0, i)).toBe(
                        width
                    ));
                });
            }
        );
    });

    describe('hidden column drag left divider tests ', () => {
        const hiddenColumDragRightDividerTests = [
            {
                name: 'first column hidden, drag first left divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 1,
                dragDeltas: [50],
                expectedColumnWidths: [150, 50, 100]
            },
            {
                name: 'first column hidden, drag second left divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 2,
                dragDeltas: [50],
                expectedColumnWidths: [100, 150, 50]
            },
            {
                name: 'second column hidden, drag first left divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 1,
                dragDeltas: [50],
                expectedColumnWidths: [150, 50, 100]
            },
            {
                name: 'second column hidden, drag second left divider to right results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 2,
                dragDeltas: [50],
                expectedColumnWidths: [100, 150, 50]
            },
            {
                name: 'first column hidden, drag first left divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 1,
                dragDeltas: [-50],
                expectedColumnWidths: [50, 150, 100]
            },
            {
                name: 'first column hidden, drag second left divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [0],
                dragColumnIndex: 2,
                dragDeltas: [-50],
                expectedColumnWidths: [100, 50, 150]
            },
            {
                name: 'second column hidden, drag first left divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 1,
                dragDeltas: [-50],
                expectedColumnWidths: [50, 150, 100]
            },
            {
                name: 'second column hidden, drag second left divider to left results in correct columns widths',
                tableWidth: 300,
                hiddenColumns: [1],
                dragColumnIndex: 2,
                dragDeltas: [-50],
                expectedColumnWidths: [100, 50, 150]
            }
        ] as const;
        parameterizeSpec(
            hiddenColumDragRightDividerTests,
            (spec, name, value) => {
                spec(name, async () => {
                    await pageObject.sizeTableToGivenRowWidth(
                        value.tableWidth,
                        element
                    );
                    value.hiddenColumns.forEach(columnIndex => {
                        element.columns[columnIndex]!.columnHidden = true;
                    });
                    await waitForUpdatesAsync();
                    pageObject.dragSizeColumnByLeftDivider(
                        value.dragColumnIndex,
                        value.dragDeltas
                    );
                    await waitForUpdatesAsync();
                    value.expectedColumnWidths.forEach((width, i) => expect(pageObject.getCellRenderedWidth(0, i)).toBe(
                        width
                    ));
                });
            }
        );
    });

    describe('active divider tests', () => {
        const dividerActiveTests = [
            {
                name: 'click on first column right divider only results in one active divider',
                dividerClickIndex: 0,
                leftDividerClick: false,
                expectedActiveIndexes: [0]
            },
            {
                name: 'click on second column left divider results in two active dividers',
                dividerClickIndex: 1,
                expectedActiveIndexes: [1, 2]
            },
            {
                name: 'click on second column right divider results in two active dividers',
                dividerClickIndex: 2,
                expectedActiveIndexes: [1, 2]
            },
            {
                name: 'click on third column left divider results in two active dividers',
                dividerClickIndex: 3,
                expectedActiveIndexes: [3, 4]
            },
            {
                name: 'click on third column right divider results in two active dividers',
                dividerClickIndex: 4,
                expectedActiveIndexes: [3, 4]
            },
            {
                name: 'click on last column left divider only results in one active divider',
                dividerClickIndex: 5,
                expectedActiveIndexes: [5]
            }
        ] as const;
        parameterizeSpec(dividerActiveTests, (spec, name, value) => {
            spec(name, async () => {
                const dividers = Array.from(
                    element.shadowRoot!.querySelectorAll('.column-divider')
                );
                const divider = dividers[value.dividerClickIndex]!;
                const dividerRect = divider.getBoundingClientRect();
                const mouseDownEvent = new MouseEvent('mousedown', {
                    clientX: (dividerRect.x + dividerRect.width) / 2,
                    clientY: (dividerRect.y + dividerRect.height) / 2
                });
                const mouseUpEvent = new MouseEvent('mouseup');
                divider.dispatchEvent(mouseDownEvent);
                await waitForUpdatesAsync();
                const activeDividers = [];
                for (let i = 0; i < dividers.length; i++) {
                    if (dividers[i]!.classList.contains('active')) {
                        activeDividers.push(i);
                    }
                }
                document.dispatchEvent(mouseUpEvent); // clean up registered event handlers
                expect(activeDividers).toEqual(value.expectedActiveIndexes);
            });
        });

        it('first column only has right divider', () => {
            const rightDivider = pageObject.getColumnRightDivider(0);
            const leftDivider = pageObject.getColumnLeftDivider(0);

            expect(rightDivider).not.toBeNull();
            expect(leftDivider).toBeNull();
        });

        it('last column only has left divider', () => {
            const rightDivider = pageObject.getColumnRightDivider(3);
            const leftDivider = pageObject.getColumnLeftDivider(3);

            expect(rightDivider).toBeNull();
            expect(leftDivider).not.toBeNull();
        });

        it('after releasing divider, it is no longer marked as active', async () => {
            const divider = pageObject.getColumnRightDivider(0)!;
            const dividerRect = divider.getBoundingClientRect();
            const mouseDownEvent = new MouseEvent('mousedown', {
                clientX: (dividerRect.x + dividerRect.width) / 2,
                clientY: (dividerRect.y + dividerRect.height) / 2
            });
            divider.dispatchEvent(mouseDownEvent);
            await waitForUpdatesAsync();
            expect(divider.classList.contains('active')).toBeTruthy();

            const mouseUpEvent = new MouseEvent('mouseup');
            document.dispatchEvent(mouseUpEvent);
            await waitForUpdatesAsync();
            expect(divider.classList.contains('active')).toBeFalsy();
        });
    });

    it('resizing columns emits single "column-configuration-change" event with expected state', async () => {
        const listener = createEventListener(
            element,
            'column-configuration-change'
        );
        pageObject.dragSizeColumnByRightDivider(2, [1, 1, 1, 1]);
        await waitForUpdatesAsync();

        expect(listener.spy).toHaveBeenCalledTimes(1);
        const expectedFractionalWidths = [1, 1, 1.04, 0.96];
        const expectedPixelWidths = [
            undefined,
            undefined,
            undefined,
            undefined
        ];
        const eventDetails = (listener.spy.calls.first().args[0] as CustomEvent)
            .detail as TableColumnConfigurationChangeEventDetail;
        const actualFractionalWidths = eventDetails.columns.map(
            column => column.fractionalWidth
        );
        const actualPixelWidths = eventDetails.columns.map(
            column => column.pixelWidth
        );
        expect(actualFractionalWidths).toEqual(expectedFractionalWidths);
        expect(actualPixelWidths).toEqual(expectedPixelWidths);
    });

    it('sizing to left when columns are all on sub-pixel boundary and just above minimum size, does not cause total column width to change', async () => {
        await pageObject.sizeTableToGivenRowWidth(202, element); // columns now on half-pixel boundary
        const expectedColumnSizes = [50.5, 50.5, 50.5, 50.5];
        expectedColumnSizes.forEach((width, i) => expect(pageObject.getCellRenderedWidth(0, i)).toBe(width));
        pageObject.dragSizeColumnByLeftDivider(3, [-1]);
        await waitForUpdatesAsync();
        const totalColumnPixelWidth = pageObject.getTotalCellRenderedWidth();
        expect(totalColumnPixelWidth).toBe(202);
    });
});
