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
import { waitForEvent } from '../../../../utilities/testing/component';

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
    return await fixture<TableCell<SimpleTableCellRecord>>(
        html`<nimble-table-cell>
            </nimble-table-cell>`
    );
}

fdescribe('TableCell', () => {
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

        const cellViewFocusInSpy = jasmine.createSpy();
        const cellViewFocusInPromise = waitForEvent(
            element,
            'cell-view-focus-in',
            cellViewFocusInSpy
        );
        const cellFocusInSpy = jasmine.createSpy();
        const cellFocusInPromise = waitForEvent(
            element,
            'cell-focus-in',
            cellFocusInSpy
        );
        const cellBlurSpy = jasmine.createSpy();
        const cellBlurPromise = waitForEvent(element, 'cell-blur', cellBlurSpy);
        const renderedCellView = pageObject.getRenderedCellView();
        const span = renderedCellView.shadowRoot
            ?.firstElementChild as HTMLSpanElement;
        span.tabIndex = 0;
        span.focus();
        await cellViewFocusInPromise;
        await cellFocusInPromise;

        expect(cellViewFocusInSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
        expect(cellFocusInSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
        expect(cellBlurSpy).not.toHaveBeenCalled();

        span.blur();
        await cellBlurPromise;

        expect(cellBlurSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
    });

    it('fires the cell-view-focus-in event when cell contents are focused, after the cell is already focused', async () => {
        await connect();
        await waitForUpdatesAsync();

        const spy = jasmine.createSpy();
        const cellViewFocusInPromise = waitForEvent(
            element,
            'cell-view-focus-in',
            spy
        );
        const renderedCellView = pageObject.getRenderedCellView();
        element.tabIndex = 0;
        element.focus();
        await waitForUpdatesAsync();

        expect(spy).not.toHaveBeenCalled();

        const span = renderedCellView.shadowRoot
            ?.firstElementChild as HTMLSpanElement;
        span.tabIndex = 0;
        span.focus();
        await cellViewFocusInPromise;

        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ detail: element })
        );
    });
});
