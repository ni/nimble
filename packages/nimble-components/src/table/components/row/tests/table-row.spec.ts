import { html } from '@microsoft/fast-element';
import { TableRow } from '..';
import {
    TableColumnText,
    TableColumnTextCellRecord
} from '../../../../table-column/text';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { fixture, Fixture } from '../../../../utilities/tests/fixture';
import type { TableRecord } from '../../../types';
import { TableRowPageObject } from './table-row.pageobject';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    moreStringData: string;
}

// prettier-ignore
async function setup(): Promise<Fixture<TableRow<SimpleTableRecord>>> {
    return fixture<TableRow<SimpleTableRecord>>(
        html`<nimble-table-row>
            </nimble-table>`
    );
}

describe('TableRow', () => {
    let element: TableRow<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TableRowPageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TableRowPageObject<SimpleTableRecord>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // prettier-ignore
        expect(document.createElement('nimble-table-row')).toBeInstanceOf(TableRow);
    });

    it('column state is applied to generated cells', async () => {
        await connect();

        const textColumn1 = new TableColumnText();
        element.columns = [textColumn1];
        await waitForUpdatesAsync();

        const renderedCell = pageObject.getRenderedCell(0);

        expect(renderedCell!.cellTemplate).toEqual(textColumn1.cellTemplate);
        expect(renderedCell!.cellStyles).toEqual(textColumn1.cellStyles);
    });

    it('rendered cell gets cellState from column', async () => {
        await connect();

        const textColumn1 = new TableColumnText();
        textColumn1.fieldName = 'stringData';
        const textColumn2 = new TableColumnText();
        textColumn2.fieldName = 'moreStringData';
        element.columns = [textColumn1, textColumn2];
        element.dataRecord = {
            stringData: 'string 1',
            moreStringData: 'foo'
        };
        await waitForUpdatesAsync();

        const firstCell = pageObject.getRenderedCell(0);
        const firstCellState = element.getCellState(textColumn1);
        expect(firstCellState).toEqual(firstCell!.cellState!);
        const firstCellRecord = firstCellState.cellRecord as TableColumnTextCellRecord;
        expect(firstCellRecord.value).toBe('string 1');
        const secondCell = pageObject.getRenderedCell(1);
        const secondCellState = element.getCellState(textColumn2);
        expect(secondCellState).toEqual(secondCell!.cellState!);
        const secondCellRecord = secondCellState.cellRecord as TableColumnTextCellRecord;
        expect(secondCellRecord.value).toBe('foo');
    });
});
