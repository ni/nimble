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

const simpleTableData = [
    {
        field: 'string 1',
        noPlaceholder: 'string 2',
        anotherField: 'foo'
    },
    {
        field: '<button></button>',
        noPlaceholder: 'string 2',
        anotherField: 'foo'
    },
    {
        field: '',
        noPlaceholder: 'string 2',
        anotherField: 'foo'
    },
    {
        field: null,
        noPlaceholder: null,
        anotherField: 'foo'
    },
    {
        field: undefined,
        noPlaceholder: undefined,
        anotherField: 'foo'
    }
] as const;

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

    it('displays placeholder string when no value present', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(3, 0)).toBe('no value'); // test for when value is null
        expect(pageObject.getRenderedCellContent(3, 1)).toBe(''); // test for when value is null
        expect(pageObject.getRenderedCellContent(4, 0)).toBe('no value'); // test for when value is undefined
        expect(pageObject.getRenderedCellContent(4, 1)).toBe(''); // test for when value is undefined
    });

    it('displays data value and not placeholder when value present', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('string 1');
        expect(pageObject.getRenderedCellContent(1, 0)).toBe(
            '<button></button>'
        );
        expect(pageObject.getRenderedCellContent(2, 0)).toBe('');
    });

    it('changing fieldName updates display', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');
    });

    it('changing placeholder updates display', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.placeholder = 'different value';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(3, 0)).toBe('different value');
    });

    it('changing data from value to null displays placeholder', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('string 1');

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        element.data = updatedData;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');
    });

    it('changing data from null to value displays value', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(3, 0)).toBe('no value');

        const updatedData: SimpleTableRecord[] = [
            simpleTableData[0],
            simpleTableData[1],
            simpleTableData[2],
            { field: 'new value' }
        ];
        element.data = updatedData;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(3, 0)).toBe('new value');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = undefined;
        element.data = [...simpleTableData];
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
    });

    const fieldValues = [
        { dataValue: 'foo', renderedValue: 'foo' },
        { dataValue: '<button></button>', renderedValue: '<button></button>' },
        { dataValue: null, renderedValue: 'no value' },
        { dataValue: 'null', renderedValue: 'null' },
        { dataValue: undefined, renderedValue: 'no value' },
        { dataValue: 'undefined', renderedValue: 'undefined' }
    ];
    for (const fieldValue of fieldValues) {
        let testDataTitleValue: string;
        if (fieldValue.dataValue) {
            testDataTitleValue = `"${fieldValue.dataValue}"`;
        } else if (fieldValue.dataValue === null) {
            testDataTitleValue = 'null';
        } else {
            testDataTitleValue = 'undefined';
        }
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`data ${testDataTitleValue} renders as ${fieldValue.renderedValue}`, async () => {
            await connect();

            const updatedValue = { field: fieldValue.dataValue };
            const updatedData = [updatedValue];
            element.data = updatedData;
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                fieldValue.renderedValue
            );
        });
    }
});
