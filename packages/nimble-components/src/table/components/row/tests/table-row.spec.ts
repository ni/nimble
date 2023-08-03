import { html } from '@microsoft/fast-element';
import { TableRow } from '..';
import type {
    TableColumnText,
    TableColumnTextCellRecord
} from '../../../../table-column/text';

import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { fixture, Fixture } from '../../../../utilities/tests/fixture';
import type {
    TableRecord,
    TableRowSelectionToggleEventDetail
} from '../../../types';
import { TableRowPageObject } from './table-row.pageobject';
import { createEventListener } from '../../../../utilities/tests/component';
import type { Table } from '../../..';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    moreStringData: string;
}

describe('TableRow', () => {
    describe('standalone', () => {
        // prettier-ignore
        async function setup(): Promise<Fixture<TableRow<SimpleTableRecord>>> {
            return fixture<TableRow<SimpleTableRecord>>(
                html`<nimble-table-row>
                    </nimble-table-row>`
            );
        }

        let element: TableRow<SimpleTableRecord>;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            // prettier-ignore
            expect(document.createElement('nimble-table-row')).toBeInstanceOf(TableRow);
        });

        it('does not have aria-selected attribute when it is not selectable', async () => {
            element.selectable = false;
            element.selected = false;
            await connect();

            expect(element.hasAttribute('aria-selected')).toBeFalse();
        });

        it('has aria-selected attribute set to "true" when it is selected', async () => {
            element.selectable = true;
            element.selected = true;
            await connect();

            expect(element.getAttribute('aria-selected')).toBe('true');
        });

        it('has aria-selected attribute set to "false" when it is not selected', async () => {
            element.selectable = true;
            element.selected = false;
            await connect();

            expect(element.getAttribute('aria-selected')).toBe('false');
        });

        it('updates aria-selected attribute when selection state changes', async () => {
            element.selectable = true;
            element.selected = false;
            await connect();

            element.selected = true;
            await waitForUpdatesAsync();

            expect(element.getAttribute('aria-selected')).toBe('true');
        });

        it('shows selection checkbox when row is selectable and selection is not hidden', async () => {
            await connect();
            element.selectable = true;
            element.hideSelection = false;
            await waitForUpdatesAsync();

            expect(element.selectionCheckbox).toBeDefined();
        });

        it('hides selection checkbox when row is selectable and selection is hidden', async () => {
            await connect();
            element.selectable = true;
            element.hideSelection = true;
            await waitForUpdatesAsync();

            expect(element.selectionCheckbox).not.toBeDefined();
        });

        it('hides selection checkbox when row is not selectable', async () => {
            await connect();
            element.selectable = false;
            element.hideSelection = false;
            await waitForUpdatesAsync();

            expect(element.selectionCheckbox).not.toBeDefined();
        });

        it('selection checkbox is checked when row is selected', async () => {
            await connect();
            element.selectable = true;
            element.hideSelection = false;
            element.selected = true;
            await waitForUpdatesAsync();

            expect(element.selectionCheckbox!.checked).toBeTrue();
        });

        it('selection checkbox is not checked when row is not selected', async () => {
            await connect();
            element.selectable = true;
            element.hideSelection = false;
            element.selected = false;
            await waitForUpdatesAsync();

            expect(element.selectionCheckbox!.checked).toBeFalse();
        });

        it('selection state can be set before connect()', async () => {
            element.selectable = true;
            element.hideSelection = false;
            element.selected = true;
            await connect();

            expect(element.selectionCheckbox!.checked).toBeTrue();
        });

        it('checking selection checkbox fires "row-selection-toggle" event', async () => {
            element.selectable = true;
            element.hideSelection = false;
            element.selected = false;
            await connect();

            const listener = createEventListener(
                element,
                'row-selection-toggle'
            );
            element.selectionCheckbox!.click();
            await listener.promise;

            expect(listener.spy).toHaveBeenCalledTimes(1);
            const expectedDetails: TableRowSelectionToggleEventDetail = {
                newState: true,
                oldState: false
            };
            const event = listener.spy.calls.first().args[0] as CustomEvent;
            expect(event.detail).toEqual(expectedDetails);
        });

        it('unchecking selection checkbox fires "row-selection-toggle" event', async () => {
            element.selectable = true;
            element.hideSelection = false;
            element.selected = true;
            await connect();

            const listener = createEventListener(
                element,
                'row-selection-toggle'
            );
            element.selectionCheckbox!.click();
            await listener.promise;

            expect(listener.spy).toHaveBeenCalledTimes(1);
            const expectedDetails: TableRowSelectionToggleEventDetail = {
                newState: false,
                oldState: true
            };
            const event = listener.spy.calls.first().args[0] as CustomEvent;
            expect(event.detail).toEqual(expectedDetails);
        });

        it('programmatically changing selection state does not fire "row-selection-toggle" event', async () => {
            element.selectable = true;
            element.hideSelection = false;
            element.selected = true;
            await connect();

            const listener = createEventListener(
                element,
                'row-selection-toggle'
            );
            element.selected = false;
            await waitForUpdatesAsync();

            expect(listener.spy).not.toHaveBeenCalled();
        });
    });

    describe('in table', () => {
        // prettier-ignore
        async function setupTable(): Promise<Fixture<Table<SimpleTableRecord>>> {
            return fixture<Table<SimpleTableRecord>>(
                html`<nimble-table>
                        <nimble-table-column-text id="first-column" field-name="stringData" column-id='foo'>Column 1</nimble-table-column-text>
                        <nimble-table-column-text id="second-column" field-name="moreStringData" column-id='bar'>Column 2</nimble-table-column-text>
                    </nimble-table>`
            );
        }

        let element: Table<SimpleTableRecord>;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: TableRowPageObject;
        let row: TableRow;
        let column1: TableColumnText;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupTable());
            await connect();
            await element.setData([
                {
                    stringData: 'string 1',
                    moreStringData: 'string 2'
                }
            ]);
            await waitForUpdatesAsync();
            row = element.shadowRoot!.querySelector('nimble-table-row')!;
            pageObject = new TableRowPageObject(row);
            column1 = element.querySelector<TableColumnText>('#first-column')!;
        });

        afterEach(async () => {
            await disconnect();
        });

        it('column cell view template is applied to generated cells', () => {
            const renderedCell = pageObject.getRenderedCell(0);

            expect(renderedCell!.cellViewTemplate).toEqual(
                column1.columnInternals.cellViewTemplate
            );
        });

        it('rendered cell gets cellState from column', () => {
            const columnStates = row.columnStates;

            const firstCell = pageObject.getRenderedCell(0)!;
            const firstCellState = columnStates[0]?.cellState;
            expect(firstCellState).toEqual(firstCell.cellState);
            const firstCellRecord = firstCellState!
                .cellRecord as TableColumnTextCellRecord;
            expect(firstCellRecord.value).toBe('string 1');

            const secondCell = pageObject.getRenderedCell(1)!;
            const secondCellState = columnStates[1]?.cellState;
            expect(secondCellState).toEqual(secondCell.cellState);
            const secondCellRecord = secondCellState!
                .cellRecord as TableColumnTextCellRecord;
            expect(secondCellRecord.value).toBe('string 2');
        });

        it('updates cell.columnId when column changes', async () => {
            const cell = pageObject.getRenderedCell(0)!;
            expect(cell.columnId).toEqual('foo');
            element.removeChild(column1);
            await waitForUpdatesAsync();
            expect(cell.columnId).toBe('bar');
        });

        it('updates cell.columnId when id of column changes', async () => {
            const cell = pageObject.getRenderedCell(0)!;
            expect(cell.columnId).toEqual('foo');
            column1.columnId = 'baz';
            await waitForUpdatesAsync();
            expect(cell.columnId).toBe('baz');
        });
    });
});
