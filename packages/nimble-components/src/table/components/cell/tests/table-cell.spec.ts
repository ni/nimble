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
import { createEventListener } from '../../../../utilities/tests/component';

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

    it('fires cell-view-focus-in/cell-focus-in/cell-blur events when cell contents are focused/blurred', async () => {
        await connect();
        await waitForUpdatesAsync();

        const cellViewFocusInListener = createEventListener(
            element,
            'cell-view-focus-in'
        );
        const cellFocusInListener = createEventListener(
            element,
            'cell-focus-in'
        );
        const cellBlurListener = createEventListener(element, 'cell-blur');
        const renderedCellView = pageObject.getRenderedCellView();
        const span = renderedCellView.shadowRoot
            ?.firstElementChild as HTMLSpanElement;
        span.tabIndex = 0;
        span.focus();
        await cellViewFocusInListener.promise;
        await cellFocusInListener.promise;

        expect(cellViewFocusInListener.spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
        expect(cellFocusInListener.spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
        expect(cellBlurListener.spy).not.toHaveBeenCalled();

        span.blur();
        await cellBlurListener.promise;

        expect(cellBlurListener.spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
    });

    it('fires the cell-view-focus-in event when cell contents are focused, after the cell is already focused', async () => {
        await connect();
        await waitForUpdatesAsync();

        const cellViewFocusInListener = createEventListener(
            element,
            'cell-view-focus-in'
        );
        const renderedCellView = pageObject.getRenderedCellView();
        element.tabIndex = 0;
        element.focus();
        await waitForUpdatesAsync();

        expect(cellViewFocusInListener.spy).not.toHaveBeenCalled();

        const span = renderedCellView.shadowRoot
            ?.firstElementChild as HTMLSpanElement;
        span.tabIndex = 0;
        span.focus();
        await cellViewFocusInListener.promise;

        expect(cellViewFocusInListener.spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
    });
});
