import { html } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnDateText, tableColumnDateTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { TableColumnDateTextPageObject } from '../testing/table-column-date-text.pageobject';

interface SimpleTableRecord extends TableRecord {
    field?: number | null;
    anotherField?: number | null;
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnDateTextTag} field-name="field" group-index="0">
                    Column 1
                </${tableColumnDateTextTag}>
                <${tableColumnDateTextTag} field-name="anotherField">
                    Squeeze Column 1
                </${tableColumnDateTextTag}>
            </nimble-table>`
    );
}

describe('TableColumnDateText', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let pageObject: TableColumnDateTextPageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        tablePageObject = new TablePageObject<SimpleTableRecord>(element);
        pageObject = new TableColumnDateTextPageObject(tablePageObject);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnDateText;

        expect(firstColumn.checkValidity()).toBeTrue();
    });

    const badValueData = [
        { description: 'field not present', data: [{ unused: 'foo' }] },
        { description: 'value is null', data: [{ field: null }] },
        { description: 'value is undefined', data: [{ field: undefined }] },
        {
            description: 'value is Inf',
            data: [{ field: Number.POSITIVE_INFINITY }]
        },
        {
            description: 'value is -Inf',
            data: [{ field: Number.NEGATIVE_INFINITY }]
        },
        { description: 'value is NaN', data: [{ field: Number.NaN }] },
        {
            description: 'value is MAX_VALUE',
            data: [{ field: Number.MAX_VALUE }]
        },
        {
            description: 'value is too large for Date',
            data: [{ field: 8640000000000000 + 1 }]
        },
        {
            description: 'value is too small for Date',
            data: [{ field: -8640000000000000 - 1 }]
        }
    ];
    for (const testData of badValueData) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays blank when ${testData.description}`, async () => {
            await element.setData(testData.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
        });
    }

    it('changing fieldName updates display', async () => {
        await element.setData([
            {
                field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf(),
                anotherField: new Date('Jan 20, 2018, 4:05:45 AM').valueOf()
            }
        ]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnDateText;
        firstColumn.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
            'Jan 20, 2018, 4:05:45 AM'
        );
    });

    it('changing data from value to null displays blank', async () => {
        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
            'Dec 10, 2012, 10:35:05 PM'
        );

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        await element.setData(updatedData);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
    });

    it('changing data from null to value displays value', async () => {
        await element.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');

        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
            'Dec 10, 2012, 10:35:05 PM'
        );
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnDateText;
        firstColumn.fieldName = undefined;
        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
    });

    it('sets title when cell text is ellipsized', async () => {
        element.style.width = '200px';
        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await connect();
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toEqual(
            'Dec 10, 2012, 10:35:05 PM'
        );
    });

    it('does not set title when cell text is fully visible', async () => {
        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await connect();
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toEqual('');
    });

    it('removes title on mouseout of cell', async () => {
        element.style.width = '200px';
        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await connect();
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toEqual('');
    });

    it('sets group header text as expected', async () => {
        await element.setData([
            { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
        ]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe(
            'Dec 10, 2012, 10:35:05 PM'
        );
    });
});
