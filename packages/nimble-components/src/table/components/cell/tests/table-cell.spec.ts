/* eslint-disable max-classes-per-file */
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
import { TableColumn } from '../../../../table-column/base';
import type { ColumnInternalsOptions } from '../../../../table-column/base/models/column-internals';
import { TableGroupHeaderView } from '../../../../table-column/base/group-header-view';

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

const columnGroupHeaderName = uniqueElementName();

@customElement({
    name: columnGroupHeaderName,
    template: html<TestTableColumnGroupHeader>`<div></div>`
})
class TestTableColumnGroupHeader extends TableGroupHeaderView {}

const columnName = uniqueElementName();

@customElement({
    name: columnName,
    template: html<TestTableColumn>`<div></div>`
})
class TestTableColumn extends TableColumn {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellViewTag: columnCellViewName,
            cellRecordFieldNames: [''],
            groupHeaderViewTag: columnGroupHeaderName,
            delegatedEvents: []
        };
    }
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
