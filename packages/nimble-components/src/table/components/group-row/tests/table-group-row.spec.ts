import { html } from '@microsoft/fast-element';
import { TableGroupRow } from '..';
import {
    TableColumnText,
    TableColumnTextColumnConfig
} from '../../../../table-column/text';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { fixture, Fixture } from '../../../../utilities/tests/fixture';
import { TableGroupRowPageObject } from './table-group-row.pageobject';

// prettier-ignore
async function setup(): Promise<Fixture<TableGroupRow>> {
    return fixture<TableGroupRow>(
        html`<nimble-table-group-row>
            </nimble-table-group-row>`
    );
}

describe('TableGroupRow', () => {
    let element: TableGroupRow;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TableGroupRowPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TableGroupRowPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // prettier-ignore
        expect(document.createElement('nimble-table-group-row')).toBeInstanceOf(TableGroupRow);
    });

    it('column state is applied to group header', async () => {
        await connect();

        const textColumn1 = new TableColumnText();
        textColumn1.columnConfig = {
            placeholder: 'no value'
        } as TableColumnTextColumnConfig;
        element.groupColumn = textColumn1;
        element.groupRowValue = 'test';
        await waitForUpdatesAsync();

        const renderedGroupHeader = pageObject.getRenderedGroupHeader();

        expect(renderedGroupHeader).not.toBeNull();
        expect(renderedGroupHeader?.groupHeaderValue).toBe('test');
        expect(
            (renderedGroupHeader?.columnConfig as TableColumnTextColumnConfig)
                .placeholder
        ).toBe('no value');
    });
});
