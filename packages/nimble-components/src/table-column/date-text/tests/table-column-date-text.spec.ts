import { html } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnDateText, tableColumnDateTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';

interface SimpleTableRecord extends TableRecord {
    field?: number | null;
    noPlaceholder?: string | null;
    anotherField?: number | null;
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnDateTextTag} field-name="field" placeholder="no value" group-index="0">
                    Column 1
                </${tableColumnDateTextTag}>
                <${tableColumnDateTextTag} field-name="noPlaceholder">
                    Column 2
                </${tableColumnDateTextTag}>
            </nimble-table>`
    );
}

describe('TableColumnDateText', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
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

    const noValueData = [
        { description: 'field not present', data: [{ unused: 'foo' }] },
        { description: 'value is null', data: [{ field: null }] },
        { description: 'value is undefined', data: [{ field: undefined }] }
    ];
    for (const testData of noValueData) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays placeholder string when ${testData.description}`, async () => {
            await element.setData(testData.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('no value');
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

    it('changing placeholder updates display', async () => {
        await element.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnDateText;
        firstColumn.placeholder = 'different value';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
            'different value'
        );
    });

    it('changing data from value to null displays placeholder', async () => {
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

        expect(pageObject.getRenderedCellContent(0, 0)).toEqual('no value');
    });

    it('changing data from null to value displays value', async () => {
        await element.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toEqual('no value');

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
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
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
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
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
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toEqual('');
    });

    describe('placeholder assigned various strings render as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `placeholder "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();
                    await element.setData([{ field: null }]);
                    await waitForUpdatesAsync();

                    const firstColumn = element
                        .columns[0] as TableColumnDateText;
                    firstColumn.placeholder = value.name;
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                        value.name
                    );
                }
            );
        }
    });

    describe('placeholder assigned various strings render in group header as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `placeholder "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();
                    await element.setData([{ field: null }]);
                    await waitForUpdatesAsync();

                    const firstColumn = element
                        .columns[0] as TableColumnDateText;
                    firstColumn.placeholder = value.name;
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getRenderedGroupHeaderContent(0)
                    ).toContain(value.name);
                }
            );
        }
    });
});
