import { html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '../../../table';
import { TableColumnText } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/tests/table.pageobject';

interface SimpleTableRecord extends TableRecord {
    field?: string | null;
    noPlaceholder?: string | null;
    anotherField?: string | null;
}

const tableColumnText = DesignSystem.tagFor(TableColumnText);

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
                <${tableColumnText} field-name="field" placeholder="no value">
                    Column 1
                </${tableColumnText}>
                <${tableColumnText} field-name="noPlaceholder">
                    Column 2
                </${tableColumnText}>
            </nimble-table>`
    );
}

describe('TableColumnText', () => {
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

    const noValueData = [
        { description: 'field not present', data: [{ unused: 'foo' }] },
        { description: 'value is null', data: [{ field: null }] },
        { description: 'value is undefined', data: [{ field: undefined }] }
    ];
    for (const testData of noValueData) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays placeholder string when ${testData.description}`, async () => {
            element.data = testData.data;
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value'); // test for when value is null
        });
    }

    it('changing fieldName updates display', async () => {
        element.data = [{ field: 'foo', anotherField: 'bar' }];
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('bar');
    });

    it('changing placeholder updates display', async () => {
        element.data = [{ field: null }];
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.placeholder = 'different value';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('different value');
    });

    it('changing data from value to null displays placeholder', async () => {
        element.data = [{ field: 'foo' }];
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        element.data = updatedData;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');
    });

    it('changing data from null to value displays value', async () => {
        element.data = [{ field: null }];
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');

        element.data = [{ field: 'foo' }];
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = undefined;
        element.data = [{ field: 'foo' }];
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
    });

    const fieldValues = [
        { value: 'foo' },
        { value: '<button></button>' },
        { value: 'null' },
        { value: 'undefined' },
        { value: 'null' },
        { value: '-2147483648/-1' },
        { value: '田' },
        { value: 'Ω' },
        { value: '( ͡° ͜ʖ ͡°)' },
        { value: '😍' },
        { value: 'Iñtërnâtiônàlizætiøn☃💩' },
        { value: '１' }
    ];
    for (const fieldValue of fieldValues) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`data ${fieldValue.value} renders as ${fieldValue.value}`, async () => {
            await connect();

            element.data = [{ field: fieldValue.value }];
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                fieldValue.value
            );
        });
    }
});
