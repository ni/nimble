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
    numericData: string;
    booleanData: string;
    moreStringData: string;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        numericData: '8',
        booleanData: 'true',
        moreStringData: 'foo'
    },
    {
        stringData: 'hello world',
        numericData: '0',
        booleanData: 'true',
        moreStringData: 'foo'
    },
    {
        stringData: 'string 1',
        numericData: '-9',
        booleanData: 'false',
        moreStringData: 'foo'
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
                <${DesignSystem.tagFor(TableColumnText)} field-name="stringData">stringData</${DesignSystem.tagFor(TableColumnText)}>
                <${DesignSystem.tagFor(TableColumnText)} field-name="numericData">numericData</${DesignSystem.tagFor(TableColumnText)}>
                <${DesignSystem.tagFor(TableColumnText)} field-name="booleanData">booleanData</${DesignSystem.tagFor(TableColumnText)}>
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
                numericData: '-9',
                booleanData: 'false',
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
        expect(element.columns[3]).toBe(dateColumn);

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
});
