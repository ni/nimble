import { html } from '@microsoft/fast-element';
import { ITableData, Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { TablePageObject } from './table.pageobject';

interface IFakeTableData extends ITableData {
    stringData: string;
    numericData: number;
    booleanData: boolean;
    dateData: Date;
}
const fakeTableDataKeys = ['stringData', 'numericData', 'booleanData', 'dateData'];

async function setup(): Promise<Fixture<Table<IFakeTableData>>> {
    return fixture<Table<IFakeTableData>>(html`<nimble-table></nimble-table>`);
}

function makeFakeData(count: number): IFakeTableData[] {
    const data: IFakeTableData[] = [];
    for (let i = 0; i < count; i++) {
        data.push({
            stringData: `string #${i}`,
            numericData: i * 2,
            booleanData: (i % 2) === 0,
            // Generate arbitrary dates that are 10 seconds apart
            dateData: new Date(1670000000000 + i * 10000)
        });
    }
    return data;
}

describe('Table', () => {
    let element: Table<IFakeTableData>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<IFakeTableData>;

    function verifyRenderedData(expectedData: IFakeTableData[]): void {
        const expectedRowCount = expectedData.length;
        expect(pageObject.getRenderedRowCount()).toEqual(expectedRowCount);
        for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
            for (let columnIndex = 0; columnIndex < fakeTableDataKeys.length; columnIndex++) {
                const dataKey = fakeTableDataKeys[columnIndex]!;
                const expectedCellData = expectedData[rowIndex]![dataKey]!;
                expect(pageObject.getCellContent(rowIndex, columnIndex)).toEqual(expectedCellData.toString());
            }
        }
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<IFakeTableData>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-table')).toBeInstanceOf(Table);
    });

    it('can set data before the element is connected', async () => {
        const fakeData = makeFakeData(5);
        element.data = fakeData;

        await connect();

        verifyRenderedData(fakeData);
    });

    it('can set data after the element is connected', async () => {
        await connect();

        const fakeData = makeFakeData(5);
        element.data = fakeData;
        await waitForUpdatesAsync();

        verifyRenderedData(fakeData);
    });

    it('updating data can add a new row to the table', async () => {
        await connect();

        const fakeData = makeFakeData(5);
        element.data = fakeData;
        await waitForUpdatesAsync();

        const updatedData: IFakeTableData[] = [...fakeData, {
            stringData: 'a new string',
            numericData: -9,
            booleanData: false,
            dateData: new Date()
        }];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('updating data can remove an rows from the table', async () => {
        await connect();

        const fakeData = makeFakeData(5);
        element.data = fakeData;
        await waitForUpdatesAsync();

        const updatedData: IFakeTableData[] = [fakeData[0]!, fakeData[1]!, fakeData[4]!];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });

    it('updating data can reorder rows from the table', async () => {
        await connect();

        const fakeData = makeFakeData(5);
        element.data = fakeData;
        await waitForUpdatesAsync();

        const updatedData: IFakeTableData[] = [fakeData[4]!, fakeData[1]!, fakeData[3]!, fakeData[2]!, fakeData[0]!];
        element.data = updatedData;
        await waitForUpdatesAsync();

        verifyRenderedData(updatedData);
    });
});
