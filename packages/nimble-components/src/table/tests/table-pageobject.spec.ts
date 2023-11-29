import { html } from '@microsoft/fast-element';
import type { TableColumn } from '@ni/nimble-foundation/dist/esm/table-column/base';
import type { Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { TablePageObject } from '../testing/table.pageobject';
import type { TableRecord } from '../types';

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

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
            <nimble-table-column-text id="first-column" field-name="stringData">Col1</nimble-table-column-text>
            <nimble-table-column-text id="second-column" field-name="moreStringData">Col2</nimble-table-column-text>
        </nimble-table>`
    );
}

describe('Table page object', () => {
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

    describe('getRenderedCellViewById', () => {
        it('gets right cell views by ID', async () => {
            await element.setData(simpleTableData);
            column1.columnId = 'my-column-id1';
            column2.columnId = 'my-column-id2';
            await connect();
            await waitForUpdatesAsync();

            const row1Id = pageObject.getRecordId(0)!;
            const row2Id = pageObject.getRecordId(1)!;

            expect(
                pageObject.getRenderedCellViewById(row1Id, 'my-column-id1')
            ).toBe(pageObject.getRenderedCellView(0, 0));
            expect(
                pageObject.getRenderedCellViewById(row1Id, 'my-column-id2')
            ).toBe(pageObject.getRenderedCellView(0, 1));
            expect(
                pageObject.getRenderedCellViewById(row2Id, 'my-column-id1')
            ).toBe(pageObject.getRenderedCellView(1, 0));
            expect(
                pageObject.getRenderedCellViewById(row2Id, 'my-column-id2')
            ).toBe(pageObject.getRenderedCellView(1, 1));
        });
    });
});
