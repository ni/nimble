import { html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '../../table';
import { TableColumnText } from '../table-column-text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableRecord } from '../../table/types';
import { TablePageObject } from '../../table/tests/table.pageobject';

interface SimpleTableRecord extends TableRecord {
    stringData: string | null;
    numericData: number | null;
    booleanData: boolean | null;
    dateData: Date | null;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        numericData: 8,
        booleanData: true,
        dateData: new Date(2008, 12, 11)
    },
    {
        stringData: '<button></button>',
        numericData: 0,
        booleanData: true,
        dateData: new Date(2022, 5, 30)
    },
    {
        stringData: null,
        numericData: null,
        booleanData: null,
        dateData: null
    }
] as const;

async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
                <${DesignSystem.tagFor(TableColumnText)} field-name="stringData" placeholder="no value">stringData</${DesignSystem.tagFor(TableColumnText)}>
                <${DesignSystem.tagFor(TableColumnText)} field-name="numericData">numericData</${DesignSystem.tagFor(TableColumnText)}>
                <${DesignSystem.tagFor(TableColumnText)} field-name="booleanData">booleanData</${DesignSystem.tagFor(TableColumnText)}>
                <${DesignSystem.tagFor(TableColumnText)} field-name="dateData">dateData</${DesignSystem.tagFor(TableColumnText)}>
                <button>Ignore Me</button>
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

        expect(pageObject.getRenderedCellContent(2, 0)).toBe('no value');
        expect(pageObject.getRenderedCellContent(2, 1)).toBe('');
    });

    it('displays data value and not placeholder when value present', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('string 1');
    });

    it('displays value formatted as HTML as its string value', async () => {
        element.data = [...simpleTableData];
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(1, 0)).toBe('<button></button>');
    });
});