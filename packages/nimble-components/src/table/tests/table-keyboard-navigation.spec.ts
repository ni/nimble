/* eslint-disable no-await-in-loop */
import { customElement, html, observable, ref } from '@microsoft/fast-element';
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
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import type { Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import {
    type Fixture,
    fixture,
    uniqueElementName
} from '../../utilities/tests/fixture';
import {
    TableColumnSortDirection,
    TableRecord,
    TableRowSelectionMode
} from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import {
    createEventListener,
    sendKeyDownEvent
} from '../../utilities/tests/component';
import { TableRow } from '../components/row';
import { TableCell } from '../components/cell';
import { TableCellView } from '../../table-column/base/cell-view';
import { TableColumn } from '../../table-column/base';
import { TableGroupRow } from '../components/group-row';
import { menuItemTag } from '../../menu-item';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag
} from '../../table-column/base/tests/table-column.fixtures';
import { mixinGroupableColumnAPI } from '../../table-column/mixins/groupable-column';
import type { ColumnInternalsOptions } from '../../table-column/base/models/column-internals';
import { ColumnValidator } from '../../table-column/base/models/column-validator';
import { mixinSortableColumnAPI } from '../../table-column/mixins/sortable-column';

interface SimpleTableRecord extends TableRecord {
    id: string;
    value?: string | null;
    parentId?: string;
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

    async function sendKeyPressToTable(
        key: string,
        init?: KeyboardEventInit
    ): Promise<KeyboardEvent> {
        return sendKeyDownEvent(element, key, init);
    }

    async function sendKeyPressesToTable(...keys: string[]): Promise<void> {
        for (const key of keys) {
            await sendKeyPressToTable(key);
        }
    }

    function getContainingElement<TElement>(
        start: Element | undefined | null,
        isElementMatch: (element: Element) => boolean
    ): TElement | undefined {
        let possibleMatch = start;
        while (possibleMatch && possibleMatch !== element) {
            if (isElementMatch(possibleMatch)) {
                return possibleMatch as TElement;
            }
            possibleMatch = possibleMatch.parentElement
                ?? (possibleMatch.parentNode as ShadowRoot)?.host;
        }

        return undefined;
    }

    async function clickAndSendFocusEvents(
        newFocus: HTMLElement
    ): Promise<void> {
        const oldFocus = currentFocusedElement();
        const oldRow = oldFocus instanceof TableRow
            ? oldFocus
            : getContainingElement<TableRow>(
                oldFocus,
                el => el instanceof TableRow
            );
        const oldCell = oldFocus instanceof TableCell
            ? oldFocus
            : getContainingElement<TableCell>(
                oldFocus,
                el => el instanceof TableCell
            );
        const oldCellContent = oldFocus !== oldRow && oldFocus !== oldCell ? oldFocus : undefined;
        const newRow = newFocus instanceof TableRow
            ? newFocus
            : getContainingElement<TableRow>(
                newFocus,
                el => el instanceof TableRow
            );
        const newCell = newFocus instanceof TableCell
            ? newFocus
            : getContainingElement<TableCell>(
                newFocus,
                el => el instanceof TableCell
            );
        const newCellContent = newFocus !== newRow && newFocus !== newCell ? newFocus : undefined;

        newFocus.click();
        oldCellContent?.dispatchEvent(new FocusEvent('blur'));
        oldCell?.dispatchEvent(new FocusEvent('blur'));
        oldRow?.dispatchEvent(new FocusEvent('blur'));
        newRow?.dispatchEvent(new FocusEvent('focusin'));
        newCell?.dispatchEvent(new FocusEvent('focusin'));
        newCellContent?.dispatchEvent(new FocusEvent('focusin'));
        newFocus.focus();
        await waitForUpdatesAsync();
    }

    describe('with non-interactive columns', () => {
        const nonInteractiveColumnName = uniqueElementName();
        // prettier-ignore
        @customElement({
            name: nonInteractiveColumnName
        })
        class TestNonInteractiveTableColumn extends mixinSortableColumnAPI(mixinGroupableColumnAPI(TableColumn)) {
            protected override getColumnInternalsOptions(): ColumnInternalsOptions {
                return {
                    cellRecordFieldNames: ['value'],
                    cellViewTag: tableColumnEmptyCellViewTag,
                    groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
                    delegatedEvents: [],
                    validator: new ColumnValidator<[]>([])
                };
            }
        }

        // prettier-ignore
        async function setupNonInteractiveTable(): Promise<Fixture<Table<SimpleTableRecord>>> {
            return fixture<Table<SimpleTableRecord>>(
                html`<nimble-table id-field-name="id">
                <${nonInteractiveColumnName} id="first-column" column-id="column-1"></${nonInteractiveColumnName}>
                <${nonInteractiveColumnName} id="second-column" column-id="column-2"></${nonInteractiveColumnName}>
                <${nonInteractiveColumnName} id="third-column" column-id="column-3"></${nonInteractiveColumnName}>
            </nimble-table>`
            );
        }

        let column1: TestNonInteractiveTableColumn;
        let column2: TestNonInteractiveTableColumn;
        let column3: TestNonInteractiveTableColumn;
        const largeDataRowCount = 1000;

        async function setupBasicTable(): Promise<void> {
            const data: readonly SimpleTableRecord[] = [
                {
                    id: '1',
                    value: 'a1'
                },
                {
                    id: '2',
                    value: 'a2'
                },
                {
                    id: '3',
                    value: 'a3'
                },
                {
                    id: '4',
                    value: 'a4'
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
                    value: 'a1'
                },
                {
                    id: '2',
                    value: 'a2'
                },
                {
                    id: '3',
                    value: 'a3'
                },
                {
                    id: '4',
                    value: 'a4'
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
                    value: `a${i}`
                });
            }

            await element.setData(data);
            await connect();
            await waitForUpdatesAsync();
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupNonInteractiveTable());
            pageObject = new TablePageObject<SimpleTableRecord>(element);
            column1 = element.querySelector<TestNonInteractiveTableColumn>(
                '#first-column'
            )!;
            column2 = element.querySelector<TestNonInteractiveTableColumn>(
                '#second-column'
            )!;
            column3 = element.querySelector<TestNonInteractiveTableColumn>(
                '#third-column'
            )!;
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
                await sendKeyDownEvent(focusedColumn, keyEnter);
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );

                await sendKeyDownEvent(focusedColumn, keyEnter);
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.descending
                );

                await sendKeyDownEvent(focusedColumn, keyEnter);
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
                await sendKeyDownEvent(currentFocusedElement()!, keyEnter);
                await sendKeyPressToTable(keyArrowRight);

                const focusedColumn = currentFocusedElement()!;
                await sendKeyDownEvent(focusedColumn, keyEnter, {
                    shiftKey: true
                });
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );
                expect(secondHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );

                await sendKeyDownEvent(focusedColumn, keyEnter, {
                    shiftKey: true
                });
                expect(firstHeader.sortDirection).toBe(
                    TableColumnSortDirection.ascending
                );
                expect(secondHeader.sortDirection).toBe(
                    TableColumnSortDirection.descending
                );

                await sendKeyDownEvent(focusedColumn, keyEnter, {
                    shiftKey: true
                });
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

                it('consecutive DownArrow presses focus each cell to the bottom in subsequent rows', async () => {
                    await sendKeyPressToTable(keyArrowDown);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(1, 0)
                    );
                    await sendKeyPressToTable(keyArrowDown);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(2, 0)
                    );
                    await sendKeyPressToTable(keyArrowDown);
                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(3, 0)
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

                it('clicking a cell in a new row, then a cell in the original row, will focus the clicked (original) row', async () => {
                    await clickAndSendFocusEvents(pageObject.getCell(1, 0));
                    await clickAndSendFocusEvents(pageObject.getCell(0, 0));

                    expect(currentFocusedElement()).toBe(pageObject.getRow(0));
                });

                it('when the table data changes (same or greater row count), the focused cell is maintained (row at the same index)', async () => {
                    await sendKeyPressesToTable(keyArrowDown, keyArrowDown); // cell 2, 0

                    const newData: SimpleTableRecord[] = [
                        { id: 'A' },
                        { id: 'B' },
                        { id: 'C' },
                        { id: 'D' },
                        { id: 'E' }
                    ];
                    await element.setData(newData);
                    await waitForUpdatesAsync();

                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(2, 0)
                    );
                });

                it('when the table data changes (fewer rows than previously focused row index), the focused cell resets to be for the 1st row', async () => {
                    await sendKeyPressesToTable(keyArrowDown, keyArrowDown); // cell 2, 0

                    const newData: SimpleTableRecord[] = [
                        { id: 'A' },
                        { id: 'B' }
                    ];
                    await element.setData(newData);
                    await waitForUpdatesAsync();

                    expect(currentFocusedElement()).toBe(
                        pageObject.getCell(0, 0)
                    );
                });

                it('when the table data changes to zero rows, the focus resets to the header', async () => {
                    await sendKeyPressesToTable(keyArrowDown, keyArrowDown); // cell 2, 0

                    const newData: SimpleTableRecord[] = [];
                    await element.setData(newData);
                    await waitForUpdatesAsync();

                    expect(currentFocusedElement()).toBe(
                        pageObject.getHeaderElement(0)
                    );
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

            it('a row is tabindex 0 when focused, and tabindex -1 when clicked away from', async () => {
                await sendKeyPressesToTable(keyArrowDown, keyArrowLeft); // focus row
                const firstRow = pageObject.getRow(0);

                expect(firstRow.tabIndex).toBe(0);

                await clickAndSendFocusEvents(pageObject.getCell(1, 0));

                expect(firstRow.tabIndex).toBe(-1);
            });

            it('when a row is focused, pressing Space has no effect when selectionMode is none (row not selected)', async () => {
                await sendKeyPressesToTable(keyArrowDown, keyArrowLeft);

                await sendKeyPressToTable(keySpace);

                expect(currentFocusedElement()).toBe(pageObject.getRow(0));
                expect(pageObject.getRow(0).selected).toBe(false);
            });

            // This test relies on :focus-visible styling for the action menus to show, and programmatic focus / key events don't seem to
            // trigger that for Firefox/WebKit.
            it('when a row is focused, all action menus in that row are visible (and otherwise hidden) #SkipFirefox #SkipWebkit', async () => {
                await addActionMenu(column2);
                await addActionMenu(column3);
                await sendKeyPressesToTable(keyArrowDown, keyArrowLeft); // focus row

                expect(pageObject.isCellActionMenuVisible(0, 1)).toBe(true);
                expect(pageObject.isCellActionMenuVisible(0, 2)).toBe(true);

                await sendKeyPressToTable(keyArrowRight); // focus cell 0, 0
                expect(pageObject.isCellActionMenuVisible(0, 1)).toBe(false);
                expect(pageObject.isCellActionMenuVisible(0, 2)).toBe(false);
            });

            // This test relies on :focus-visible styling for the action menus to show, and programmatic focus / key events don't seem to
            // trigger that for Firefox/WebKit.
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

            describe("when a cell's action menu is focused, pressing the given key will focus the cell:", () => {
                const tests = [
                    { name: 'Escape', key: keyEscape },
                    { name: 'F2', key: keyFunction2 }
                ];
                parameterizeSpec(tests, (spec, name, value) => {
                    spec(name, async () => {
                        await addActionMenu(column1);
                        await sendKeyPressToTable(keyArrowDown);
                        await sendKeyPressToTable(keyTab);
                        expect(currentFocusedElement()).toBe(
                            pageObject.getCellActionMenu(0, 0)
                        );

                        await sendKeyPressToTable(value.key);

                        expect(currentFocusedElement()).toBe(
                            pageObject.getCell(0, 0)
                        );
                    });
                });
            });

            describe("when a cell's action menu is focused,", () => {
                beforeEach(async () => {
                    await addActionMenu(column1);
                    await sendKeyPressToTable(keyArrowDown);
                    await sendKeyPressToTable(keyTab);
                });

                const tests = [
                    { name: 'UpArrow', key: keyArrowUp },
                    { name: 'DownArrow', key: keyArrowDown }
                ];
                parameterizeSpec(tests, (spec, name, value) => {
                    spec(
                        `pressing ${name} will open the action menu, Esc will close the menu, and another Esc press will focus the (same) cell`,
                        async () => {
                            const actionMenuButton = pageObject.getCellActionMenu(0, 0)!;
                            const toggleListener = createEventListener(
                                element,
                                'action-menu-toggle'
                            );
                            await sendKeyDownEvent(
                                actionMenuButton.toggleButton!,
                                value.key
                            );
                            await toggleListener.promise;

                            const firstCell = pageObject.getCell(0, 0);
                            expect(firstCell.menuOpen).toBe(true);

                            const actionMenuItem = element.querySelector(menuItemTag)!;

                            await sendKeyDownEvent(actionMenuItem, keyEscape);

                            expect(firstCell.menuOpen).toBe(false);

                            await sendKeyPressToTable(keyEscape);

                            expect(currentFocusedElement()).toBe(firstCell);
                        }
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
                const newRowIndex = (focusedElement as TableRow)
                    .resolvedRowIndex!;

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
                const oldRowIndex = (focusedElement as TableRow)
                    .resolvedRowIndex!;

                await sendKeyPressToTable(keyPageUp);
                await waitForUpdatesAsync();
                focusedElement = currentFocusedElement();
                expect(focusedElement).toBeInstanceOf(TableRow);
                const newRowIndex = (focusedElement as TableRow)
                    .resolvedRowIndex!;

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

            it('if a cell is focused, then the table loses focus, it does not steal focus back on scroll', async () => {
                await sendKeyPressesToTable(
                    keyArrowDown,
                    keyArrowDown,
                    keyArrowDown
                );

                currentFocusedElement()!.blur();
                await pageObject.scrollToLastRowAsync();
                await pageObject.scrollToFirstRowAsync();

                expect(currentFocusedElement()).toBe(document.body);
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

            it('when a row is focused, pressing Space will select the row, and pressing it again will deselect the row', async () => {
                await sendKeyPressesToTable(keyArrowDown, keyArrowLeft);

                const row = pageObject.getRow(0);
                await sendKeyPressToTable(keySpace);

                expect(row.selected).toBe(true);

                await sendKeyPressToTable(keySpace);

                expect(row.selected).toBe(false);
            });

            it('when a cell is focused, pressing Shift-Space will select the row, and pressing it again will deselect the row', async () => {
                await sendKeyPressesToTable(keyArrowDown);

                const row = pageObject.getRow(0);
                await sendKeyPressToTable(keySpace, { shiftKey: true });

                expect(row.selected).toBe(true);

                await sendKeyPressToTable(keySpace, { shiftKey: true });

                expect(row.selected).toBe(false);
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

            it('pressing DownArrow multiple times when the row selection checkbox is focused will focus the row selection checkbox on subsequent rows', async () => {
                await sendKeyPressToTable(keyArrowRight);

                await sendKeyPressToTable(keyArrowDown);
                expect(currentFocusedElement()).toBe(
                    pageObject.getRow(1).selectionCheckbox!
                );

                await sendKeyPressToTable(keyArrowDown);
                expect(currentFocusedElement()).toBe(
                    pageObject.getRow(2).selectionCheckbox!
                );

                await sendKeyPressToTable(keyArrowDown);
                expect(currentFocusedElement()).toBe(
                    pageObject.getRow(3).selectionCheckbox!
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

            describe('for an expanded group row, pressing the given key will collapse the group:', () => {
                const tests = [
                    { name: 'Space', key: keySpace },
                    { name: 'Enter', key: keyEnter },
                    { name: 'LeftArrow', key: keyArrowLeft }
                ];
                parameterizeSpec(tests, (spec, name, value) => {
                    spec(name, async () => {
                        await sendKeyPressToTable(value.key);

                        const focusedElement = currentFocusedElement();
                        expect(focusedElement).toBeInstanceOf(TableGroupRow);
                        expect((focusedElement as TableGroupRow).expanded).toBe(
                            false
                        );
                    });
                });
            });

            describe('for a collapsed group row, pressing the given key will expand the group:', () => {
                const tests = [
                    { name: 'Space', key: keySpace },
                    { name: 'Enter', key: keyEnter },
                    { name: 'RightArrow', key: keyArrowRight }
                ];
                parameterizeSpec(tests, (spec, name, value) => {
                    spec(name, async () => {
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

                        await sendKeyPressToTable(value.key);

                        focusedElement = currentFocusedElement();
                        expect(focusedElement).toBeInstanceOf(TableGroupRow);
                        expect((focusedElement as TableGroupRow).expanded).toBe(
                            true
                        );
                    });
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

        describe('for a table with hierarchy', () => {
            beforeEach(async () => {
                const data = [
                    {
                        stringData1: 'A0',
                        stringData2: 'B0',
                        stringData3: 'C0',
                        id: '0',
                        parentId: undefined
                    },
                    {
                        stringData1: 'A1',
                        stringData2: 'B1',
                        stringData3: 'C1',
                        id: '1',
                        parentId: '0'
                    }
                ];
                element.idFieldName = 'id';
                element.parentIdFieldName = 'parentId';
                await element.setData(data);
                await connect();
                await waitForUpdatesAsync();
                element.focus();
                await waitForUpdatesAsync();
            });

            it('when a collapsed row is focused, pressing RightArrow will expand the row', async () => {
                pageObject.clickDataRowExpandCollapseButton(0);
                await sendKeyPressToTable(keyArrowDown);

                await sendKeyPressToTable(keyArrowRight);

                const row = pageObject.getRow(0);
                expect(row.expanded).toBe(true);
            });

            it('when an expanded row is focused, pressing LeftArrow will collapse the row', async () => {
                await sendKeyPressToTable(keyArrowDown);

                await sendKeyPressToTable(keyArrowLeft);

                const row = pageObject.getRow(0);
                expect(row.expanded).toBe(false);
            });

            it('when an expanded row is focused, pressing RightArrow will move to the 1st cell of the row (and the row stays expanded)', async () => {
                await sendKeyPressToTable(keyArrowDown);

                await sendKeyPressToTable(keyArrowRight);

                expect(currentFocusedElement()).toBe(pageObject.getCell(0, 0));
                expect(pageObject.getRow(0).expanded).toBe(true);
            });
        });
    });

    describe('with interactive columns', () => {
        const interactiveCellViewName = uniqueElementName();
        const interactiveColumnName = uniqueElementName();

        // prettier-ignore
        @customElement({
            name: interactiveCellViewName,
            template: html<TestInteractiveCellView>`<span tabindex="-1" ${ref('spanElement')}>Test</span>`
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestInteractiveCellView extends TableCellView {
            @observable
            public spanElement!: HTMLSpanElement;

            public override get tabbableChildren(): HTMLElement[] {
                return [this.spanElement];
            }
        }
        // prettier-ignore
        @customElement({
            name: interactiveColumnName
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestInteractiveTableColumn extends TableColumn {
            protected override getColumnInternalsOptions(): ColumnInternalsOptions {
                return {
                    cellViewTag: interactiveCellViewName,
                    cellRecordFieldNames: ['value'],
                    groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
                    delegatedEvents: [],
                    validator: new ColumnValidator<[]>([])
                };
            }
        }

        // prettier-ignore
        async function setupInteractiveTable(): Promise<Fixture<Table<SimpleTableRecord>>> {
            return fixture<Table<SimpleTableRecord>>(
                html`<nimble-table id-field-name="id">
                <${interactiveColumnName} id="first-column" column-id="column-1"></${interactiveColumnName}>
                <${interactiveColumnName} id="second-column" column-id="column-2"></${interactiveColumnName}>
                <${interactiveColumnName} id="third-column" column-id="column-3"></${interactiveColumnName}>
            </nimble-table>`
            );
        }

        function getRenderedCellContent(
            rowIndex: number,
            columnIndex: number
        ): HTMLElement {
            return (
                pageObject.getRenderedCellView(
                    rowIndex,
                    columnIndex
                ) as TestInteractiveCellView
            ).spanElement;
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupInteractiveTable());
            pageObject = new TablePageObject(element);

            const tableData = [
                {
                    id: '1',
                    value: 'a1'
                },
                {
                    id: '2',
                    value: 'a2'
                },
                {
                    id: '3',
                    value: 'a3'
                },
                {
                    id: '4',
                    value: 'a4'
                }
            ] as SimpleTableRecord[];
            await element.setData(tableData);
            const column2 = element.querySelector<TableColumn>('#second-column')!;
            await addActionMenu(column2);
            await connect();
            await waitForUpdatesAsync();
            element.focus();
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('with the first row focused, clicking interactive cell content in another row will focus that content, and an Esc key press will refocus the cell', async () => {
            await sendKeyPressesToTable(keyArrowDown, keyArrowLeft); // focus row

            const row2CellContent = getRenderedCellContent(1, 0);
            await clickAndSendFocusEvents(row2CellContent);

            expect(currentFocusedElement()).toBe(row2CellContent);

            await sendKeyPressToTable(keyEscape);

            expect(currentFocusedElement()).toBe(pageObject.getCell(1, 0));
        });

        describe('and cell[0, 1] focused,', () => {
            beforeEach(async () => {
                await sendKeyPressesToTable(keyArrowDown, keyArrowRight);
            });

            it('each Tab press will focus each of the remaining tabbable elements in the row (to the right), then will move focus past the table', async () => {
                const expectedFocusedElements = [
                    getRenderedCellContent(0, 1),
                    pageObject.getCellActionMenu(0, 1)!,
                    getRenderedCellContent(0, 2)
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
                    getRenderedCellContent(0, 1),
                    getRenderedCellContent(0, 0)
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

            describe('pressing the given key will focus the interactive cell content in the current cell:', () => {
                const keyTests = [
                    { name: 'Enter', key: keyEnter },
                    { name: 'F2', key: keyFunction2 }
                ];
                parameterizeSpec(
                    keyTests,
                    (keyTestSpec, keyTestName, keyTestValue) => {
                        keyTestSpec(keyTestName, async () => {
                            await sendKeyPressToTable(keyTestValue.key);

                            const cellContent = getRenderedCellContent(0, 1);
                            expect(currentFocusedElement()).toBe(cellContent);
                        });
                    }
                );
            });

            describe('when the interactive content in the cell is focused, pressing the given key will focus the cell:', () => {
                const keyTests = [
                    { name: 'Escape', key: keyEscape },
                    { name: 'F2', key: keyFunction2 }
                ];
                parameterizeSpec(
                    keyTests,
                    (keyTestSpec, keyTestName, keyTestValue) => {
                        keyTestSpec(keyTestName, async () => {
                            await sendKeyPressToTable(keyEnter);

                            await sendKeyPressToTable(keyTestValue.key);

                            expect(currentFocusedElement()).toBe(
                                pageObject.getCell(0, 1)
                            );
                        });
                    }
                );
            });
        });
    });
});
