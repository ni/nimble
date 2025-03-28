import { html, ref } from '@ni/fast-element';
import { TableRow, tableRowTag } from '..';
import {
    tableColumnTextTag,
    TableColumnText,
    type TableColumnTextCellRecord
} from '../../../../table-column/text';

import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import type {
    TableRecord,
    TableRowExpansionToggleEventDetail,
    TableRowSelectionToggleEventDetail
} from '../../../types';
import { TableRowPageObject } from './table-row.pageobject';
import { waitForEvent } from '../../../../utilities/testing/component';
import { tableTag, type Table } from '../../..';
import {
    TableColumnDateText,
    type TableColumnDateTextCellRecord,
    tableColumnDateTextTag
} from '../../../../table-column/date-text';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    numberData: number;
}

type TableRowExpansionToggleEventHandler = (
    evt: CustomEvent<TableRowExpansionToggleEventDetail>
) => void;

type TableRowSelectionToggleEventHandler = (
    evt: CustomEvent<TableRowSelectionToggleEventDetail>
) => void;

describe('TableRow', () => {
    describe('standalone', () => {
        // prettier-ignore
        async function setup(): Promise<Fixture<TableRow<SimpleTableRecord>>> {
            return await fixture<TableRow<SimpleTableRecord>>(
                html`<${tableRowTag}>
                    </${tableRowTag}>`
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
            expect(document.createElement(tableRowTag)).toBeInstanceOf(
                TableRow
            );
        });

        it('includes row operations gridcell when rowOperationGridCellHidden is false', async () => {
            element.rowOperationGridCellHidden = false;
            await connect();

            expect(
                element.shadowRoot!.querySelectorAll('[role="gridcell"]').length
            ).toBe(1);
        });

        it('does not include row operations gridcell when rowOperationGridCellHidden is true', async () => {
            element.rowOperationGridCellHidden = true;
            await connect();

            expect(
                element.shadowRoot!.querySelectorAll('[role="gridcell"]').length
            ).toBe(0);
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

        it('has aria-expanded attribute set to "true" when it is expanded', async () => {
            element.expanded = true;
            await connect();

            expect(element.getAttribute('aria-expanded')).toBe('true');
        });

        it('has aria-expanded attribute set to "false" when it is not expanded', async () => {
            element.expanded = false;
            await connect();

            expect(element.getAttribute('aria-expanded')).toBe('false');
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

            const spy = jasmine.createSpy<TableRowSelectionToggleEventHandler>();
            const listener = waitForEvent(element, 'row-selection-toggle', spy);
            element.selectionCheckbox!.click();
            await listener;

            expect(spy).toHaveBeenCalledTimes(1);
            const expectedDetails: TableRowSelectionToggleEventDetail = {
                newState: true,
                oldState: false
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(expectedDetails);
        });

        it('unchecking selection checkbox fires "row-selection-toggle" event', async () => {
            element.selectable = true;
            element.hideSelection = false;
            element.selected = true;
            await connect();

            const spy = jasmine.createSpy<TableRowSelectionToggleEventHandler>();
            const listener = waitForEvent(element, 'row-selection-toggle', spy);
            element.selectionCheckbox!.click();
            await listener;

            expect(spy).toHaveBeenCalledTimes(1);
            const expectedDetails: TableRowSelectionToggleEventDetail = {
                newState: false,
                oldState: true
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(expectedDetails);
        });

        it('programmatically changing selection state does not fire "row-selection-toggle" event', async () => {
            element.selectable = true;
            element.hideSelection = false;
            element.selected = true;
            await connect();

            const spy = jasmine.createSpy();
            element.addEventListener('row-selection-toggle', spy);
            element.selected = false;
            await waitForUpdatesAsync();

            expect(spy).not.toHaveBeenCalled();
            element.removeEventListener('row-selection-toggle', spy);
        });

        it('shows expand-collapse button when isParentRow is true', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            await waitForUpdatesAsync();

            expect(pageObject.getExpandCollapseButton()).toBeDefined();
        });

        it('hides expand-collapse button when isParentRow is false', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            await waitForUpdatesAsync();

            element.isParentRow = false;
            await waitForUpdatesAsync();
            expect(pageObject.getExpandCollapseButton()).toBeNull();
        });

        it('clicking collapsed row fires "row-expand-toggle" event with expanded details', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            element.recordId = 'foo';
            await waitForUpdatesAsync();
            const expandCollapseButton = pageObject.getExpandCollapseButton();

            const spy = jasmine.createSpy<TableRowExpansionToggleEventHandler>();
            const listener = waitForEvent(element, 'row-expand-toggle', spy);
            expandCollapseButton!.click();
            await listener;

            expect(spy).toHaveBeenCalledTimes(1);
            const expandDetails: TableRowExpansionToggleEventDetail = {
                newState: true,
                oldState: false,
                recordId: 'foo'
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(expandDetails);
        });

        it('clicking expanded row fires "row-expand-toggle" event with collapsed details', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            element.recordId = 'foo';
            await waitForUpdatesAsync();
            const expandCollapseButton = pageObject.getExpandCollapseButton();

            const spy = jasmine.createSpy<TableRowExpansionToggleEventHandler>();
            const listener = waitForEvent(element, 'row-expand-toggle', spy);
            element.expanded = true;
            expandCollapseButton!.click();
            await listener;
            expect(spy).toHaveBeenCalledTimes(1);
            const collapseDetails: TableRowExpansionToggleEventDetail = {
                newState: false,
                oldState: true,
                recordId: 'foo'
            };
            const event = spy.calls.first().args[0];
            expect(event.detail).toEqual(collapseDetails);
        });

        it('shows spinner instead of expand-collapse button when loading and isParentRow are true', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            element.loading = true;
            await waitForUpdatesAsync();

            expect(pageObject.getLoadingSpinner()).toBeTruthy();
            expect(pageObject.getExpandCollapseButton()).toBeFalsy();
        });

        it('hides spinner and shows expand-collapse button when isParentRow is true and loading is false', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            element.loading = false;
            await waitForUpdatesAsync();

            expect(pageObject.getLoadingSpinner()).toBeFalsy();
            expect(pageObject.getExpandCollapseButton()).toBeTruthy();
        });

        it('loading spinner has expected aria-label', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            element.loading = true;
            await waitForUpdatesAsync();

            const spinner = pageObject.getLoadingSpinner();
            expect(spinner?.ariaLabel).toBe('Loading');
        });

        it('loading spinner has expected title', async () => {
            const pageObject = new TableRowPageObject(element);
            await connect();
            element.isParentRow = true;
            element.loading = true;
            await waitForUpdatesAsync();

            const spinner = pageObject.getLoadingSpinner();
            expect(spinner?.title).toBe('Loading');
        });
    });

    describe('in table', () => {
        class ColumnReferences {
            public firstColumn!: TableColumnText;
            public secondColumn!: TableColumnDateText;
        }

        // prettier-ignore
        async function setupTable(source: ColumnReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
            return await fixture<Table<SimpleTableRecord>>(
                html`<${tableTag}>
                        <${tableColumnTextTag} ${ref('firstColumn')} field-name="stringData" column-id='foo'>Column 1</${tableColumnTextTag}>
                        <${tableColumnDateTextTag} ${ref('secondColumn')} field-name="numberData" column-id='bar'>Column 2</${tableColumnDateTextTag}>
                    </${tableTag}>`,
                { source }
            );
        }

        let element: Table<SimpleTableRecord>;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: TableRowPageObject;
        let row: TableRow;
        let columnReferences: ColumnReferences;

        beforeEach(async () => {
            columnReferences = new ColumnReferences();
            ({ element, connect, disconnect } = await setupTable(columnReferences));
            await connect();
            await element.setData([
                {
                    stringData: 'string 1',
                    numberData: 0
                }
            ]);
            await waitForUpdatesAsync();
            row = element.shadowRoot!.querySelector(tableRowTag)!;
            pageObject = new TableRowPageObject(row);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('column cell view template is applied to generated cells', () => {
            const renderedCell = pageObject.getRenderedCell(0);

            expect(renderedCell!.cellViewTemplate).toEqual(
                columnReferences.firstColumn.columnInternals.cellViewTemplate
            );
        });

        it('rendered cell gets cellState from column', () => {
            const cellStates = row.cellStates;

            const firstCell = pageObject.getRenderedCell(0)!;
            const firstCellState = cellStates[0];
            expect(firstCellState).toEqual(firstCell.cellState);
            const firstCellRecord = firstCellState!
                .cellRecord as TableColumnTextCellRecord;
            expect(firstCellRecord.value).toBe('string 1');

            const secondCell = pageObject.getRenderedCell(1)!;
            const secondCellState = cellStates[1];
            expect(secondCellState).toEqual(secondCell.cellState);
            const secondCellRecord = secondCellState!
                .cellRecord as TableColumnDateTextCellRecord;
            expect(secondCellRecord.value).toBe(0);
        });

        it('updates cell.columnId when column changes', async () => {
            expect(pageObject.getRenderedCell(0)!.columnId).toEqual('foo');
            element.removeChild(columnReferences.firstColumn);
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCell(0)!.columnId).toBe('bar');
        });

        it('updates cell.columnId when id of column changes', async () => {
            expect(pageObject.getRenderedCell(0)!.columnId).toEqual('foo');
            columnReferences.firstColumn.columnId = 'baz';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCell(0)!.columnId).toBe('baz');
        });

        it('reordering columns reorders cells', async () => {
            // Swap the two columns
            element.insertBefore(
                columnReferences.secondColumn,
                columnReferences.firstColumn
            );
            await waitForUpdatesAsync();

            const cell0 = pageObject.getRenderedCell(0)!;
            expect(cell0.cellViewTemplate).toEqual(
                columnReferences.secondColumn.columnInternals.cellViewTemplate
            );
            expect(cell0.cellState?.columnConfig).toEqual(
                columnReferences.secondColumn.columnInternals.columnConfig
            );

            const cell1 = pageObject.getRenderedCell(1)!;
            expect(cell1.cellViewTemplate).toEqual(
                columnReferences.firstColumn.columnInternals.cellViewTemplate
            );
            expect(cell1.cellState?.columnConfig).toEqual(
                columnReferences.firstColumn.columnInternals.columnConfig
            );
        });

        it('updating column reuses cell', async () => {
            const originalCell = pageObject.getRenderedCell(0);

            columnReferences.firstColumn.fieldName = 'updated-field-name';
            await waitForUpdatesAsync();

            const updatedCell = pageObject.getRenderedCell(0);
            expect(originalCell).toBe(updatedCell);
        });

        it('reordering columns creates new cells', async () => {
            const originalCell = pageObject.getRenderedCell(0);

            // Swap the two columns
            element.insertBefore(
                columnReferences.secondColumn,
                columnReferences.firstColumn
            );
            await waitForUpdatesAsync();

            const updatedCell = pageObject.getRenderedCell(0);
            expect(originalCell).not.toBe(updatedCell);
        });

        it('getFocusableElements() includes array of cells', async () => {
            await connect();

            const focusableElements = row.getFocusableElements();
            const actualCells = pageObject.getRenderedCells();
            expect(focusableElements.cells).toEqual([
                { cell: actualCells[0]!, actionMenuButton: undefined },
                { cell: actualCells[1]!, actionMenuButton: undefined }
            ]);
        });

        it('getFocusableElements() includes the selection checkbox when row is selectable', async () => {
            row.selectable = true;
            await connect();

            const focusableElements = row.getFocusableElements();
            expect(focusableElements.selectionCheckbox).toBe(
                row.selectionCheckbox
            );
        });

        it('if row is set to selectable then subsequently not selectable, getFocusableElements() does not include a selection checkbox', async () => {
            row.selectable = true;
            await connect();
            await waitForUpdatesAsync();
            row.selectable = false;
            await waitForUpdatesAsync();

            const focusableElements = row.getFocusableElements();
            expect(focusableElements.selectionCheckbox).toBeUndefined();
        });
    });
});
