import { html, css } from '@microsoft/fast-element';
import { TableCell } from '..';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import type {
    TableCellRecord,
    TableCellState
} from '../../../../table-column/base/types';
import { TableCellPageObject } from './table-cell.pageobject';

interface SimpleTableCellRecord extends TableCellRecord {
    stringData: string;
}

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
        pageObject = new TableCellPageObject<SimpleTableCellRecord>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // prettier-ignore
        expect(document.createElement('nimble-table-cell')).toBeInstanceOf(TableCell);
    });

    it('renders cellTemplate content', async () => {
        await connect();

        const cellTemplate = html` <span>Foo</span> `;

        element.cellTemplate = cellTemplate;
        await waitForUpdatesAsync();

        const renderedContent = pageObject.getRenderedCellContent();
        expect(renderedContent?.textContent).toBe('Foo');
    });

    it('changing cellState updates rendered content', async () => {
        await connect();

        const cellTemplate = html<TableCellState<SimpleTableCellRecord>>`
            <span>${x => x.cellRecord.stringData}</span>
        `;
        element.cellState = {
            cellRecord: { stringData: 'foo' },
            columnConfig: {}
        };
        element.cellTemplate = cellTemplate;
        await waitForUpdatesAsync();

        element.cellState = {
            cellRecord: { stringData: 'bar' },
            columnConfig: {}
        };
        const renderedContent = pageObject.getRenderedCellContent();
        expect(renderedContent?.textContent).toBe('bar');
    });

    it('cellStyles is applied to content', async () => {
        await connect();

        const cellTemplate = html<TableCellState<SimpleTableCellRecord>>`
            <span>${x => x.cellRecord.stringData}</span>
        `;

        const cellStyles = css`
            span {
                display: flex;
            }
        `;
        element.cellState = {
            cellRecord: { stringData: 'foo' },
            columnConfig: {}
        };
        element.cellTemplate = cellTemplate;
        element.cellStyles = cellStyles;
        await waitForUpdatesAsync();

        const renderedContent = pageObject.getRenderedCellContent();
        expect(window.getComputedStyle(renderedContent!).display).toBe('flex');
    });

    it('updating cellStyles removed previous style', async () => {
        await connect();

        const cellTemplate = html<TableCellState<SimpleTableCellRecord>>`
            <span>${x => x.cellRecord.stringData}</span>
        `;

        let cellStyles = css`
            span {
                display: flex;
            }
        `;
        element.cellState = {
            cellRecord: { stringData: 'foo' },
            columnConfig: {}
        };
        element.cellTemplate = cellTemplate;
        element.cellStyles = cellStyles;
        await waitForUpdatesAsync();

        cellStyles = css`
            span {
                visibility: hidden;
            }
        `;
        element.cellStyles = cellStyles;
        await waitForUpdatesAsync();
        const renderedContent = pageObject.getRenderedCellContent();
        const style = window.getComputedStyle(renderedContent!);
        expect(style.display).not.toBe('flex');
        expect(style.visibility).toBe('hidden');
    });
});
