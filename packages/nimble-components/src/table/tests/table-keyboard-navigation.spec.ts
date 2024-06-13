/* eslint-disable no-await-in-loop */
import { html } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyEscape,
    keyFunction2,
    keyHome,
    keyPageDown,
    keyPageUp,
    keySpace,
    keyTab
} from '@microsoft/fast-web-utilities';
import type { Table } from '..';
import type { TableColumnText } from '../../table-column/text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    TableColumnSortDirection,
    TableRecord,
    TableRowSelectionMode
} from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import { createEventListener } from '../../utilities/tests/component';
import { TableRow } from '../components/row';
import { TableCell } from '../components/cell';
import { TableCellView } from '../../table-column/base/cell-view';
import type { TableColumn } from '../../table-column/base';
import { TableGroupRow } from '../components/group-row';
import type { TableColumnAnchor } from '../../table-column/anchor';

interface SimpleTableRecord extends TableRecord {
    id: string;
    stringData1?: string | null;
    stringData2?: string | null;
    stringData3?: string | null;
    parentId?: string;
}

interface SimpleAnchorTableRecord extends TableRecord {
    id: string;
    href1?: string | null;
    href2?: string | null;
    href3?: string | null;
    parentId?: string;
}

// prettier-ignore
async function setupWithTextColumns(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table id-field-name="id">
        <nimble-table-column-text id="first-column" field-name="stringData1" column-id="column-1"></nimble-table-column-text>
        <nimble-table-column-text id="second-column" field-name="stringData2" column-id="column-2"></nimble-table-column-text>
        <nimble-table-column-text id="third-column" field-name="stringData3" column-id="column-3"></nimble-table-column-text>
    </nimble-table>`
    );
}

// prettier-ignore
async function setupWithAnchorColumns(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table id-field-name="id">
        <nimble-table-column-anchor id="first-column" href-field-name="href1" label-field-name="href1" column-id="column-1"></nimble-table-column-anchor>
        <nimble-table-column-anchor id="second-column" href-field-name="href2" label-field-name="href2" column-id="column-2"></nimble-table-column-anchor>
        <nimble-table-column-anchor id="third-column" href-field-name="href3" label-field-name="href3" column-id="column-3"></nimble-table-column-anchor>
    </nimble-table>`
    );
}

function currentFocusedElement(): HTMLElement | null {
    let activeElement = document.activeElement;
    while (activeElement?.shadowRoot?.activeElement) {
        activeElement = activeElement.shadowRoot.activeElement;
        // In some cases, the active element may be a sub-part of a control (example: MenuButton -> ToggleButton -> a div with tabindex=0). Stop at the outer control boundary, so that
        // we can more simply check element equality.
        // (For rows/cells/cell views, we do need to recurse into them, to get to the appropriate focused controls though)
        if (
            activeElement instanceof FoundationElement
            && !(activeElement instanceof TableRow)
            && !(activeElement instanceof TableCell)
            && !(activeElement instanceof TableCellView)
        ) {
            break;
        }
    }

    return activeElement as HTMLElement;
}

describe('Table keyboard navigation', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    async function addActionMenu(column: TableColumn): Promise<void> {
        column.actionMenuSlot = `${column.id}-action-menu-slot`;
        column.actionMenuLabel = 'Actions';

        const menu = document.createElement('nimble-menu');
        menu.slot = column.actionMenuSlot;

        const menuItem1 = document.createElement('nimble-menu-item');
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);

        element.appendChild(menu);

        await waitForUpdatesAsync();
    }

    async function verifyLastTabKeyEventBehavior(
        keyEvent: KeyboardEvent
    ): Promise<void> {
        // Note: Dispatching key events with dispatchEvent is not sufficient to trigger the browser's built-in Tab behavior.
        // From these tests, we can only check defaultPrevented (and assume that defaultPrevented=false means that the browser will
        // focus the expected element outside the table).
        expect(keyEvent.defaultPrevented).toBe(false);
        // Currently KeyboardNavigationManager will set tabindex=-1 on the focused element, but not blur it, relying on the browser's
        // built in behavior for that (for correct behavior in Safari).
        const focusedElement = currentFocusedElement()!;
        expect(focusedElement).not.toBeNull();
        expect(focusedElement.tabIndex).toBe(-1);
        // Manually blur so we can ensure that the table doesn't re-take focus
        focusedElement.blur();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.activeElement).toBeNull();
    }

    async function sendKeyPress(
        target: HTMLElement,
        key: string,
        init?: KeyboardEventInit
    ): Promise<KeyboardEvent> {
        const event = new KeyboardEvent('keydown', {
            key,
            cancelable: true,
            bubbles: true,
            ...init
        });
        target.dispatchEvent(event);
        await waitForUpdatesAsync();
        return event;
    }

    async function sendKeyPressToTable(
        key: string,
        init?: KeyboardEventInit
    ): Promise<KeyboardEvent> {
        return sendKeyPress(element, key, init);
    }

    async function sendKeyPressesToTable(...keys: string[]): Promise<void> {
        for (const key of keys) {
            await sendKeyPressToTable(key);
        }
    }

    describe('with text columns', () => {
        let column1: TableColumnText;
        let column2: TableColumnText;
        let column3: TableColumnText;
        const largeDataRowCount = 1000;

        async function setupBasicTable(): Promise<void> {
            const data: readonly SimpleTableRecord[] = [
                {
                    id: '1',
                    stringData1: 'a1',
                    stringData2: 'b1',
                    stringData3: 'c1'
                },
                {
                    id: '2',
                    stringData1: 'a2',
                    stringData2: 'b2',
                    stringData3: 'c2'
                },
                {
                    id: '3',
                    stringData1: 'a3',
                    stringData2: 'b3',
                    stringData3: 'c3'
                },
                {
                    id: '4',
                    stringData1: 'a4',
                    stringData2: 'b4',
                    stringData3: 'c4'
                }
            ] as const;

            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
        }

        async function setupTableWithGrouping(): Promise<void> {
            const data: readonly SimpleTableRecord[] = [
                {
                    id: '1',
                    stringData1: 'a1',
                    stringData2: 'b1',
                    stringData3: 'c1'
                },
                {
                    id: '2',
                    stringData1: 'a2',
                    stringData2: 'b1',
                    stringData3: 'c2'
                },
                {
                    id: '3',
                    stringData1: 'a3',
                    stringData2: 'b3',
                    stringData3: 'c3'
                },
                {
                    id: '4',
                    stringData1: 'a4',
                    stringData2: 'b3',
                    stringData3: 'c4'
                }
            ] as const;

            await element.setData(data);
            column2.groupIndex = 0;
            await connect();
            await waitForUpdatesAsync();
        }

        async function setupLargeDataTable(): Promise<void> {
            const data: SimpleTableRecord[] = [];
            for (let i = 0; i < largeDataRowCount; i++) {
                data.push({
                    id: i.toString(),
                    stringData1: `a${i}`,
                    stringData2: `b${i}`,
                    stringData3: `c${i}`
                });
            }

            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithTextColumns());
            pageObject = new TablePageObject<SimpleTableRecord>(element);
            column1 = element.querySelector<TableColumnText>('#first-column')!;
            column2 = element.querySelector<TableColumnText>('#second-column')!;
            column3 = element.querySelector<TableColumnText>('#third-column')!;
        });

        afterEach(async () => {
            await disconnect();
        });

        describe('for a simple table (no hierarchy/grouping/selection) with focus', () => {
            beforeEach(async () => {
                await setupBasicTable();
                element.focus();
                await waitForUpdatesAsync();
            });

            it('on initial table focus, the 1st column header is focused if sortable', () => {
                const firstHeader = pageObject.getHeaderElement(0);
                expect(currentFocusedElement()).toBe(firstHeader);
            });

            it('consecutive Enter key presses will sort the focused column (ascending, descending, no sort)', async () => {
                const firstHeader = pageObject.getHeaderElement(0);
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.none
                );

                const focusedColumn = currentFocusedElement()!;
                await sendKeyPress(focusedColumn, keyEnter);
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );

                await sendKeyPress(focusedColumn, keyEnter);
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.descending
                );

                await sendKeyPress(focusedColumn, keyEnter);
                await waitForUpdatesAsync();
                expect(
                    firstHeader.sortDirection
                        === TableColumnSortDirection.none
                        || firstHeader.sortDirection === null
                ).toBe(true);
            });

            it('Shift-Enter key presses will sort the focused column (ascending, descending, no sort) and maintain other sorted columns', async () => {
                const firstHeader = pageObject.getHeaderElement(0);
                const secondHeader = pageObject.getHeaderElement(1);
                await sendKeyPress(currentFocusedElement()!, keyEnter);
                await sendKeyPressToTable(keyArrowRight);

                const focusedColumn = currentFocusedElement()!;
                await sendKeyPress(focusedColumn, keyEnter, { shiftKey: true });
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );
                expect(secondHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );

                await sendKeyPress(focusedColumn, keyEnter, { shiftKey: true });
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );
                expect(secondHeader.sortDirection).toBe(
                    TableColumnSortDirection.descending
                );

                await sendKeyPress(focusedColumn, keyEnter, { shiftKey: true });
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );
                expect(
                    secondHeader.sortDirection
                        === TableColumnSortDirection.none
                        || secondHeader.sortDirection === null
                ).toBe(true);
            });

            it('consecutive RightArrow presses focus each header to the right, stopping at the last header', async () => {
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(0)
                );
                await sendKeyPressToTable(keyArrowRight);
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(1)
                );
                await sendKeyPressToTable(keyArrowRight);
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(2)
                );
                await sendKeyPressToTable(keyArrowRight);
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(2)
                );
            });

            it('from the last header being focused, consecutive LeftArrow presses focus each header to the left, stopping at the 1st header', async () => {
                await sendKeyPressesToTable(
                    keyArrowRight,
                    keyArrowRight,
                    keyArrowRight
                );

                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(2)
                );
                await sendKeyPressToTable(keyArrowLeft);
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(1)
                );
                await sendKeyPressToTable(keyArrowLeft);
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(0)
                );
                await sendKeyPressToTable(keyArrowLeft);
                expect(currentFocusedElement()).toBe(
                    pageObject.getHeaderElement(0)
                );
            });

            it('after a DownArrow key press (from 1st column header), cell[0, 0] is focused', async () => {
                await sendKeyPressToTable(keyArrowDown);

                const firstCell = pageObject.getCell(0, 0);
                expect(currentFocusedElement()).toBe(firstCell);
            });

            describe('starting with cell[0, 0] focused,', () => {
                beforeEach(async () => {
                    await sendKeyPressToTable(keyArrowDown);
                });

                it('pressing LeftArrow will focus the entire row', async () => {
                    await sendKeyPressToTable(keyArrowLeft);
                    expect(currentFocusedElement()).toBe(pageObject.getRow(0));
                });

                it('consecutive RightArrow presses focus each cell to the right in the same row, stopping at the last cell', async () => {
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 0)
                    );
                    await sendKeyPressToTable(keyArrowRight);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 1)
                    );
                    await sendKeyPressToTable(keyArrowRight);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 2)
                    );
                    await sendKeyPressToTable(keyArrowRight);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 2)
                    );
                });

                it('from the last cell being focused, consecutive LeftArrow presses focus each cell to the left in the same row', async () => {
                    await sendKeyPressesToTable(
                        keyArrowRight,
                        keyArrowRight,
                        keyArrowRight
                    );

                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 2)
                    );
                    await sendKeyPressToTable(keyArrowLeft);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 1)
                    );
                    await sendKeyPressToTable(keyArrowLeft);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 0)
                    );
                });

                it('End will focus the last cell in the same row, and Home will focus the 1st cell in the same row', async () => {
                    await sendKeyPressToTable(keyEnd);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 2)
                    );

                    await sendKeyPressToTable(keyHome);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 0)
                    );
                });

                it('with no tabbable elements in the row, pressing Tab will move focus past the table', async () => {
                    const keyEvent = await sendKeyPressToTable(keyTab);

                    await verifyLastTabKeyEventBehavior(keyEvent);
                });

                it('with no tabbable elements in the row, pressing Shift-Tab will move focus past the table', async () => {
                    const keyEvent = await sendKeyPressToTable(keyTab);

                    await verifyLastTabKeyEventBehavior(keyEvent);
                });
            });

            it('DownArrow key press will focus the cell in the same column in the next row', async () => {
                await sendKeyPressesToTable(keyArrowDown, keyArrowRight); // cell 0, 1

                await sendKeyPressToTable(keyArrowDown);
                expect(currentFocusedElement()).toBe(pageObject.getCell(1, 1));
            });

            it('UpArrow key press will focus the cell in the same column in the previous row', async () => {
                await sendKeyPressesToTable(
                    keyArrowDown,
                    keyArrowDown,
                    keyArrowRight
                ); // cell 1, 1

                await sendKeyPressToTable(keyArrowUp);
                expect(currentFocusedElement()).toBe(pageObject.getCell(0, 1));
            });

            it('when a row is focused, all action menus in that row are visible (and otherwise hidden) #SkipFirefox #SkipWebkit', async () => {
                await addActionMenu(column2);
                await addActionMenu(column3);
                await sendKeyPressToTable(keyArrowDown);
                await sendKeyPressToTable(keyArrowLeft); // focus row

                expect(pageObject.isCellActionMenuVisible(0, 1)).toBe(true);
                expect(pageObject.isCellActionMenuVisible(0, 2)).toBe(true);

                await sendKeyPressToTable(keyArrowRight); // focus cell 0, 0
                expect(pageObject.isCellActionMenuVisible(0, 1)).toBe(false);
                expect(pageObject.isCellActionMenuVisible(0, 2)).toBe(false);
            });

            it('when a cell is focused, its action menu is visible #SkipFirefox #SkipWebkit', async () => {
                await addActionMenu(column1);

                await sendKeyPressToTable(keyArrowDown);

                expect(pageObject.isCellActionMenuVisible(0, 0)).toBe(true);
            });

            it('when a cell with an action menu is focused, pressing Ctrl-Enter will open the action menu', async () => {
                await addActionMenu(column1);
                await sendKeyPressToTable(keyArrowDown);

                const toggleListener = createEventListener(
                    element,
                    'action-menu-toggle'
                );
                await sendKeyPressToTable(keyEnter, { ctrlKey: true });
                await toggleListener.promise;

                expect(pageObject.getCell(0, 0).menuOpen).toBe(true);
            });

            it('when a cell with an action menu is focused, pressing Enter will focus the action menu (if the cell contains no other interactive elements)', async () => {
                await addActionMenu(column1);
                await sendKeyPressToTable(keyArrowDown);

                await sendKeyPressToTable(keyEnter);

                expect(currentFocusedElement()).toBe(
                    pageObject.getCellActionMenu(0, 0)
                );
            });

            const refocusCellKeys = [keyEscape, keyFunction2];
            refocusCellKeys.forEach(key => {
                it(`when a cell's action menu is focused, pressing ${key} will focus the cell`, async () => {
                    await addActionMenu(column1);
                    await sendKeyPressToTable(keyArrowDown);
                    await sendKeyPressToTable(keyTab);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCellActionMenu(0, 0)
                    );

                    await sendKeyPressToTable(key);

                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 0)
                    );
                });
            });

            describe('table focus state is reset back to default on certain table configuration changes:', () => {
                beforeEach(async () => {
                    await sendKeyPressesToTable(keyArrowDown, keyArrowRight); // focus cell 0, 1
                });

                it('adding an action menu to a column', async () => {
                    await addActionMenu(column1);

                    expect(currentFocusedElement()).toBe(
                        pageObject.getHeaderElement(0)
                    );
                });

                it('hiding a column', async () => {
                    column1.columnHidden = true;
                    await waitForUpdatesAsync();

                    expect(currentFocusedElement()).toBe(
                        pageObject.getHeaderElement(0)
                    );
                });

                it('changing selection mode', async () => {
                    element.selectionMode = TableRowSelectionMode.single;
                    await waitForUpdatesAsync();

                    expect(currentFocusedElement()).toBe(
                        pageObject.getHeaderElement(0)
                    );
                });
            });
        });

        describe('for a large dataset (virtualized) table with cell[0, 0] focused,', () => {
            beforeEach(async () => {
                await setupLargeDataTable();
                element.focus();
                await waitForUpdatesAsync();
                await sendKeyPressToTable(keyArrowDown);
            });

            function getFirstRowVisibleIndex(): number {
                const visibleIndex = 0;
                const firstRenderedRow = pageObject.getRow(visibleIndex);
                if (firstRenderedRow.dataRecord!.id !== '0') {
                    throw new Error(
                        'Expected 1st visible row to be the 1st row in the dataset'
                    );
                }
                return visibleIndex;
            }

            function getLastRowVisibleIndex(): number {
                const renderedRowCount = pageObject.getRenderedRowCount();
                const visibleIndex = renderedRowCount - 1;
                const lastRenderedRow = pageObject.getRow(visibleIndex);
                if (
                    lastRenderedRow.dataRecord!.id
                    !== (largeDataRowCount - 1).toString()
                ) {
                    throw new Error(
                        'Expected last visible row to be the last row in the dataset'
                    );
                }
                return visibleIndex;
            }

            it('with a row focused, End focuses the last row, and Home focuses the 1st row', async () => {
                await sendKeyPressToTable(keyArrowLeft);

                await sendKeyPressToTable(keyEnd);
                await waitForUpdatesAsync();
                const lastRow = pageObject.getRow(getLastRowVisibleIndex());
                expect(currentFocusedElement()).toBe(lastRow);

                await sendKeyPressToTable(keyHome);
                await waitForUpdatesAsync();
                const firstRow = pageObject.getRow(getFirstRowVisibleIndex());
                expect(currentFocusedElement()).toBe(firstRow);
            });

            it('with a cell focused, Ctrl-End focuses the cell (same column) in the last row, and Ctrl-Home focuses the cell (same column) in the 1st row', async () => {
                await sendKeyPressToTable(keyEnd, { ctrlKey: true });
                await waitForUpdatesAsync();
                const cellInLastRow = pageObject.getCell(
                    getLastRowVisibleIndex(),
                    0
                );
                expect(currentFocusedElement()).toBe(cellInLastRow);

                await sendKeyPressToTable(keyHome, { ctrlKey: true });
                await waitForUpdatesAsync();
                const cellInFirstRow = pageObject.getCell(
                    getFirstRowVisibleIndex(),
                    0
                );
                expect(currentFocusedElement()).toBe(cellInFirstRow);
            });

            it('with a row focused, PgDown will focus a row one page (table viewport height of rows) down', async () => {
                await sendKeyPressToTable(keyArrowLeft);

                await sendKeyPressToTable(keyPageDown);
                await waitForUpdatesAsync();
                const focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableRow);
                const newRowIndex = (focusedElement as TableRow).rowStateIndex!;

                expect(newRowIndex).toBeCloseTo(
                    element.virtualizer.pageSize,
                    0
                );
            });

            it('with a row focused, PgUp will focus a row one page (table viewport height of rows) up', async () => {
                await sendKeyPressesToTable(
                    keyArrowLeft,
                    keyPageDown,
                    keyPageDown
                );
                let focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableRow);
                const oldRowIndex = (focusedElement as TableRow).rowStateIndex!;

                await sendKeyPressToTable(keyPageUp);
                await waitForUpdatesAsync();
                focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableRow);
                const newRowIndex = (focusedElement as TableRow).rowStateIndex!;

                expect(newRowIndex).toBeCloseTo(
                    oldRowIndex - element.virtualizer.pageSize,
                    0
                );
            });

            it('with a row focused, if the table is scrolled away from that row, then back to it, it is focused again', async () => {
                await sendKeyPressesToTable(
                    keyArrowLeft,
                    keyArrowDown,
                    keyArrowDown,
                    keyArrowDown
                );
                let focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableRow);
                const originalFocusedRowId = (focusedElement as TableRow)
                    .recordId;

                await pageObject.scrollToLastRowAsync();
                await pageObject.scrollToFirstRowAsync();

                focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableRow);
                expect((focusedElement as TableRow).recordId).toBe(
                    originalFocusedRowId
                );
            });

            it('with a cell focused, if the table is scrolled away from that cell, then back to it, it is focused again', async () => {
                await sendKeyPressesToTable(
                    keyArrowDown,
                    keyArrowDown,
                    keyArrowDown
                );
                let focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableCell);
                const originalFocusedCellId = (focusedElement as TableCell)
                    .recordId;

                await pageObject.scrollToLastRowAsync();
                await pageObject.scrollToFirstRowAsync();

                focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableCell);
                expect((focusedElement as TableCell).recordId).toBe(
                    originalFocusedCellId
                );
            });
        });

        it('for a simple table with no columns sortable, on initial table focus, the 1st row is focused', async () => {
            await setupBasicTable();
            column1.sortingDisabled = true;
            column2.sortingDisabled = true;
            column3.sortingDisabled = true;
            await waitForUpdatesAsync();
            element.focus();
            await waitForUpdatesAsync();

            const firstRow = pageObject.getRow(0);
            expect(currentFocusedElement()).toBe(firstRow);
        });

        describe('for a single-selection table with focus', () => {
            beforeEach(async () => {
                await setupBasicTable();
                element.selectionMode = TableRowSelectionMode.single;
                await waitForUpdatesAsync();
                element.focus();
                await waitForUpdatesAsync();
            });

            it('when a row is focused, pressing Space will select the row', async () => {
                await sendKeyPressesToTable(keyArrowDown, keyArrowLeft);

                const row = pageObject.getRow(0);
                await sendKeyPressToTable(keySpace);
                await waitForUpdatesAsync();

                expect(row.selected).toBe(true);
            });
        });

        describe('for a multiple-selection table with focus, when a row is focused,', () => {
            beforeEach(async () => {
                await setupBasicTable();
                element.selectionMode = TableRowSelectionMode.multiple;
                await waitForUpdatesAsync();
                element.focus();
                await waitForUpdatesAsync();
                await sendKeyPressToTable(keyArrowDown);
            });

            it('pressing Space will select the row', async () => {
                const row = pageObject.getRow(0);
                await sendKeyPressToTable(keySpace);

                expect(row.selected).toBe(true);
            });

            it('pressing RightArrow will focus the row selection checkbox', async () => {
                await sendKeyPressToTable(keyArrowRight);

                expect(currentFocusedElement()).toBe(
                    pageObject.getRow(0).selectionCheckbox!
                );
            });

            it('pressing Home when a cell is focused will focus the row selection checkbox', async () => {
                await sendKeyPressesToTable(keyArrowRight, keyArrowRight);

                await sendKeyPressToTable(keyHome);

                expect(currentFocusedElement()).toBe(
                    pageObject.getRow(0).selectionCheckbox!
                );
            });

            it('pressing End when the row selection checkbox is focused will focus the last cell', async () => {
                await sendKeyPressesToTable(keyArrowRight);

                await sendKeyPressToTable(keyEnd);

                expect(currentFocusedElement()).toBe(pageObject.getCell(0, 2));
            });
        });

        describe('for a table with a grouped column, when a group row is focused,', () => {
            beforeEach(async () => {
                await setupTableWithGrouping();
                element.focus();
                await waitForUpdatesAsync();
                await sendKeyPressToTable(keyArrowDown);
                if (!(currentFocusedElement() instanceof TableGroupRow)) {
                    throw new Error('Expected group row to be focused');
                }
            });

            const collapseGroupKeys = [keySpace, keyEnter, keyArrowLeft];
            collapseGroupKeys.forEach(key => {
                it(`for an expanded group row, pressing ${key} will collapse the group`, async () => {
                    await sendKeyPressToTable(key);

                    const focusedElement = currentFocusedElement();
                    expect(focusedElement).toBeInstanceOf(TableGroupRow);
                    expect((focusedElement as TableGroupRow).expanded).toBe(
                        false
                    );
                });
            });
            const expandGroupKeys = [keySpace, keyEnter, keyArrowRight];
            expandGroupKeys.forEach(key => {
                it(`for a collapsed group row, pressing ${key} will expand the group`, async () => {
                    pageObject.toggleGroupRowExpandedState(0);
                    await waitForUpdatesAsync();
                    let focusedElement = currentFocusedElement();
                    if (
                        !(focusedElement instanceof TableGroupRow)
                        || focusedElement.expanded
                    ) {
                        throw new Error(
                            'Expected focused group row to be collapsed'
                        );
                    }

                    await sendKeyPressToTable(key);

                    focusedElement = currentFocusedElement();
                    expect(focusedElement).toBeInstanceOf(TableGroupRow);
                    expect((focusedElement as TableGroupRow).expanded).toBe(
                        true
                    );
                });
            });

            it('with no tabbable elements in the group row, pressing Tab will move focus past the table', async () => {
                const keyEvent = await sendKeyPressToTable(keyTab);

                await verifyLastTabKeyEventBehavior(keyEvent);
            });

            it('with no tabbable elements in the group row, pressing Shift-Tab will move focus past the table', async () => {
                const keyEvent = await sendKeyPressToTable(keyTab, {
                    shiftKey: true
                });

                await verifyLastTabKeyEventBehavior(keyEvent);
            });
        });
    });

    describe('with anchor columns, and cell[0, 1] focused,', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithAnchorColumns());
            pageObject = new TablePageObject<SimpleAnchorTableRecord>(element);

            const data: readonly SimpleAnchorTableRecord[] = [
                {
                    id: '1',
                    href1: 'http://www.ni.com/a1',
                    href2: 'http://www.ni.com/b1',
                    href3: 'http://www.ni.com/c1'
                },
                {
                    id: '2',
                    href1: 'http://www.ni.com/a2',
                    href2: 'http://www.ni.com/b2',
                    href3: 'http://www.ni.com/c2'
                },
                {
                    id: '3',
                    href1: 'http://www.ni.com/a3',
                    href2: 'http://www.ni.com/b3',
                    href3: 'http://www.ni.com/c3'
                },
                {
                    id: '4',
                    href1: 'http://www.ni.com/a4',
                    href2: 'http://www.ni.com/b4',
                    href3: 'http://www.ni.com/c4'
                }
            ] as const;

            await element.setData(data);
            const column2 = element.querySelector<TableColumnAnchor>('#second-column')!;
            await addActionMenu(column2);
            await connect();
            await waitForUpdatesAsync();
            element.focus();
            await waitForUpdatesAsync();
            await sendKeyPressesToTable(keyArrowDown, keyArrowRight);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('each Tab press will focus each of the remaining tabbable elements in the row (to the right), then will move focus past the table', async () => {
            const expectedFocusedElements = [
                pageObject.getRenderedCellAnchor(0, 1),
                pageObject.getCellActionMenu(0, 1)!,
                pageObject.getRenderedCellAnchor(0, 2)
            ];
            for (const expectedElement of expectedFocusedElements) {
                const tabEvent = await sendKeyPressToTable(keyTab);
                expect(currentFocusedElement()).toBe(expectedElement);
                expect(tabEvent.defaultPrevented).toBe(true);
            }
            const lastTabEvent = await sendKeyPressToTable(keyTab);
            await verifyLastTabKeyEventBehavior(lastTabEvent);
        });

        it('each Shift-Tab press will focus each of the remaining tabbable elements in the row (to the left), then will move focus past the table', async () => {
            const expectedFocusedElements = [
                pageObject.getCellActionMenu(0, 1)!,
                pageObject.getRenderedCellAnchor(0, 1),
                pageObject.getRenderedCellAnchor(0, 0)
            ];
            for (const expectedElement of expectedFocusedElements) {
                const tabEvent = await sendKeyPressToTable(keyTab, {
                    shiftKey: true
                });
                expect(currentFocusedElement()).toBe(expectedElement);
                expect(tabEvent.defaultPrevented).toBe(true);
            }
            const lastTabEvent = await sendKeyPressToTable(keyTab, {
                shiftKey: true
            });
            await verifyLastTabKeyEventBehavior(lastTabEvent);
        });

        const focusContentKeys = [keyEnter, keyFunction2];
        focusContentKeys.forEach(key => {
            it(`pressing ${key} will focus the anchor in the current cell`, async () => {
                await sendKeyPressToTable(key);

                const anchorInCell = pageObject.getRenderedCellAnchor(0, 1);
                expect(currentFocusedElement()).toBe(anchorInCell);
            });
        });

        const refocusCellKeys = [keyEscape, keyFunction2];
        refocusCellKeys.forEach(key => {
            it(`when the anchor (focusable content) in the cell is focused, pressing ${key} will focus the cell`, async () => {
                await sendKeyPressToTable(keyEnter);

                await sendKeyPressToTable(key);

                expect(currentFocusedElement()).toBe(pageObject.getCell(0, 1));
            });
        });
    });
});
