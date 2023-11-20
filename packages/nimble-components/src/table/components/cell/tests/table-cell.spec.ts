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
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { createEventListener } from '../../../../utilities/tests/component';
import type { TableRowExpandToggleEventDetail } from '../../../types';

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

    const expandCollapseVisiblityTests = [
        {
            name: 'expand-collapse button is hidden when isParentRow, isFirstCell, and isTopLevelRow are true',
            isParentRow: true,
            isFirstCell: true,
            isTopLevelRow: true,
            expectedVisibleState: false
        },
        {
            name: 'expand-collapse button is visible when isParentRow and isFirstCell are true and isTopLevelRow is false',
            isParentRow: true,
            isFirstCell: true,
            isTopLevelRow: false,
            expectedVisibleState: true
        },
        {
            name: 'expand-collapse button is hidden when isParentRow and isTopLevelRow are true, and isFirstCell is false',
            isParentRow: true,
            isFirstCell: false,
            isTopLevelRow: true,
            expectedVisibleState: false
        },
        {
            name: 'expand-collapse button is hidden when isFirstCell and isTopLevelRow are true, and isParentRow is false',
            isParentRow: false,
            isFirstCell: true,
            isTopLevelRow: true,
            expectedVisibleState: false
        },
        {
            name: 'expand-collapse button is hidden when isParentRow and isFirstCell are false, and isTopLevelRow are true',
            isParentRow: false,
            isFirstCell: false,
            isTopLevelRow: true,
            expectedVisibleState: false
        },
        {
            name: 'expand-collapse button is hidden when isParentRow, isFirstCell, and isTopLevelRow are false',
            isParentRow: false,
            isFirstCell: false,
            isTopLevelRow: false,
            expectedVisibleState: false
        },
        {
            name: 'expand-collapse button is hidden when isFirstCell and isTopLevelRow are false, and isParentRow is true',
            isParentRow: true,
            isFirstCell: false,
            isTopLevelRow: false,
            expectedVisibleState: false
        }
    ];
    parameterizeNamedList(expandCollapseVisiblityTests, (spec, name, value) => {
        spec(name, async () => {
            await connect();
            element.isParentRow = value.isParentRow;
            element.isTopLevelRow = value.isTopLevelRow;
            element.isFirstCell = value.isFirstCell;
            await waitForUpdatesAsync();

            const expandCollapseButtonVisible = pageObject.getExpandCollapseButton() !== null;
            expect(expandCollapseButtonVisible).toBe(
                value.expectedVisibleState
            );
        });
    });

    it('toggling expand-collapse button fires "row-expand-toggle" event', async () => {
        await connect();
        element.isTopLevelRow = false;
        element.isParentRow = true;
        element.isFirstCell = true;
        element.recordId = 'foo';
        await waitForUpdatesAsync();
        const expandCollapseButton = pageObject.getExpandCollapseButton();

        const listener = createEventListener(element, 'row-expand-toggle');
        expandCollapseButton!.click();
        await listener.promise;

        expect(listener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowExpandToggleEventDetail = {
            newState: true,
            oldState: false,
            recordId: 'foo'
        };
        const event = listener.spy.calls.first().args[0] as CustomEvent;
        expect(event.detail).toEqual(expectedDetails);
    });
});
