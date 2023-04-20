import { html, customElement } from '@microsoft/fast-element';
import { TableCell } from '..';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import {
    fixture,
    uniqueElementName,
    type Fixture
} from '../../../../utilities/tests/fixture';
import type { TableCellRecord } from '../../../../table-column/base/types';
import { TableCellPageObject } from './table-cell.pageobject';
import { TableCellView } from '../../../../table-column/base/cell-view';
import { createCellViewTemplate } from '../../../../table-column/base/cell-view/template';

interface SimpleTableCellRecord extends TableCellRecord {
    stringData: string;
}

const columnCellViewName = uniqueElementName();

@customElement({
    name: columnCellViewName,
    template: html<TestTableColumnCellView>`<span
        >${x => x.cellRecord?.stringData}</span
    >`
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestTableColumnCellView extends TableCellView<SimpleTableCellRecord> {}

// prettier-ignore
async function setup(): Promise<Fixture<TableCell<SimpleTableCellRecord>>> {
    return fixture<TableCell<SimpleTableCellRecord>>(
        html`<nimble-table-cell>
            </nimble-table-cell>`
    );
}

describe('TableCell', () => {
    let element: TableCell<SimpleTableCellRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TableCellPageObject<SimpleTableCellRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        element.cellViewTemplate = createCellViewTemplate(columnCellViewName);
        pageObject = new TableCellPageObject<SimpleTableCellRecord>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // prettier-ignore
        expect(document.createElement('nimble-table-cell')).toBeInstanceOf(TableCell);
    });

    it('renders correct cell view type', async () => {
        await connect();
        await waitForUpdatesAsync();

        const renderedCellView = pageObject.getRenderedCellView();
        expect(renderedCellView).toBeInstanceOf(TestTableColumnCellView);
    });

    it('changing cellState updates rendered content', async () => {
        await connect();

        element.cellState = {
            cellRecord: { stringData: 'foo' },
            columnConfig: {}
        };
        await waitForUpdatesAsync();

        element.cellState = {
            cellRecord: { stringData: 'bar' },
            columnConfig: {}
        };
        await waitForUpdatesAsync();
        const renderedContent = pageObject.getRenderedCellContent();
        expect(renderedContent).toBe('bar');
    });
});
