import { html } from '@microsoft/fast-element';
import { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { controlHeight } from '../../theme-provider/design-tokens';
import { createEventListener } from '../../utilities/tests/component';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { TableColumnSortDirection, TableRecord, TableRowSelectionMode } from '../types';
import { TablePageObject } from './table.pageobject';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    numericData: number;
    moreStringData: string;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        numericData: 8,
        moreStringData: 'foo'
    },
    {
        stringData: 'hello world',
        numericData: 0,
        moreStringData: 'foo'
    },
    {
        stringData: 'another string',
        numericData: -9,
        moreStringData: 'foo'
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table></nimble-table>`
    );
}

describe('Table row selection', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        element.setData(simpleTableData);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('defaults to selection mode of "none"', () => {
        expect(element.selectionMode).toBe(TableRowSelectionMode.none);
    });

    // is valid when selection mode is none and id field name is set
    // is valid when selection mode is none and id field name is not set
    // is valid when selection mode is single and id field name is set
    // is invalid when selection mode is single and id field name is not set
    // resets selection when id field name changes
    // resets selection when selection mode changes
    // basic get/setSelectedRecordIds
    // setSelectedRecordIds doesn't update selection when selection mode is none
    // setSelectedRecordIds only sets first selection when selection mode is single
    // setSelectedRecordIds filters out records on in data
    // updating data updates selection
    // clicking selects a row
    // clicking changes selection of a row
    // interactive selection fires event
    // programmatic selection doesn't fire event -- updating data or calling setSelection
    // selection isn't changed when id field name is invalid
    // action menu is always visible when row is selected, even when not hovered
    // setting id field name clears selection
    // changing selection mode clears selection
    // selection state is correct on tableData? maybe that the attribute is set on the row
});
