import { html, ref } from '@ni/fast-element';
import { tableTag, type Table } from '@ni/nimble-components/dist/esm/table';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { TablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { singleIconColumnWidth } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { TsTableColumnBreakpoint, tsTableColumnBreakpointTag } from '..';
import { TsTableColumnBreakpointCellView } from '../cell-view';
import {
    BreakpointState,
    type BreakpointToggleEventDetail,
    type BreakpointContextMenuEventDetail
} from '../types';

interface SimpleTableRecord extends TableRecord {
    id?: string;
    parentId?: string;
    breakpointState?: string | null;
}

class ElementReferences {
    public table!: Table;
    public column!: TsTableColumnBreakpoint;
}

describe('TsTableColumnBreakpoint', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let tablePageObject: TablePageObject<SimpleTableRecord>;

    async function setup(
        source: ElementReferences
    ): Promise<Fixture<Table<SimpleTableRecord>>> {
        return await fixture<Table<SimpleTableRecord>>(
            html`<${tableTag} ${ref('table')} id-field-name="id" style="width: 700px">
                    <${tsTableColumnBreakpointTag} ${ref('column')} field-name="breakpointState">
                    </${tsTableColumnBreakpointTag}>
                </${tableTag}>`,
            { source }
        );
    }

    function getBreakpointButton(
        cellView: TsTableColumnBreakpointCellView
    ): HTMLButtonElement {
        const button = cellView.shadowRoot!.querySelector<HTMLButtonElement>(
            '.breakpoint-button'
        );
        if (!button) {
            throw new Error('Expected breakpoint button');
        }
        return button;
    }

    function getContextMenuEventDetail(
        contextMenuSpy: jasmine.Spy
    ): BreakpointContextMenuEventDetail {
        return (
            contextMenuSpy.calls.first().args[0] as CustomEvent<BreakpointContextMenuEventDetail>
        ).detail;
    }

    beforeEach(async () => {
        elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        tablePageObject = new TablePageObject<SimpleTableRecord>(table);
        await connect();
        await waitForUpdatesAsync();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(tsTableColumnBreakpointTag)
        ).toBeInstanceOf(TsTableColumnBreakpoint);
    });

    it('reports column configuration valid', () => {
        expect(elementReferences.column.checkValidity()).toBeTrue();
    });

    it('uses fixed icon width and disables resizing', () => {
        expect(elementReferences.column.columnInternals.resizingDisabled).toBeTrue();
        expect(elementReferences.column.columnInternals.pixelWidth).toBe(singleIconColumnWidth);
        expect(elementReferences.column.columnInternals.minPixelWidth).toBe(singleIconColumnWidth);
    });

    describe('rendering breakpoint states', () => {
        it('renders off state when field value is "off"', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.off);
        });

        it('renders enabled state when field value is "enabled"', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.enabled);
        });

        it('renders disabled state when field value is "disabled"', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.disabled }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.disabled);
        });

        it('renders hit state when field value is "hit"', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.hit }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.hit);
        });

        it('renders off state when field value is null', async () => {
            await table.setData([{ id: '1', breakpointState: null }]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.off);
        });

        it('renders off state when field value is undefined', async () => {
            await table.setData([{ id: '1', breakpointState: undefined }]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.off);
        });

        it('renders off state when field value is invalid', async () => {
            await table.setData([
                { id: '1', breakpointState: 'invalid-state' }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.off);
        });
    });

    describe('click-to-toggle', () => {
        it('emits toggle event from off to enabled on click', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const toggleSpy = jasmine.createSpy('toggle');
            elementReferences.column.addEventListener(
                'breakpoint-column-toggle',
                toggleSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);
            button.click();
            await waitForUpdatesAsync();

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            const eventDetail = (
                toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
            ).detail;
            expect(eventDetail.oldState).toBe(BreakpointState.off);
            expect(eventDetail.newState).toBe(BreakpointState.enabled);
            expect(eventDetail.recordId).toBe('1');
        });

        it('emits toggle event from enabled to off on click', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const toggleSpy = jasmine.createSpy('toggle');
            elementReferences.column.addEventListener(
                'breakpoint-column-toggle',
                toggleSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);
            button.click();
            await waitForUpdatesAsync();

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            const eventDetail = (
                toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
            ).detail;
            expect(eventDetail.oldState).toBe(BreakpointState.enabled);
            expect(eventDetail.newState).toBe(BreakpointState.off);
            expect(eventDetail.recordId).toBe('1');
        });

        it('emits toggle event from hit to off on click', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.hit }
            ]);
            await waitForUpdatesAsync();

            const toggleSpy = jasmine.createSpy('toggle');
            elementReferences.column.addEventListener(
                'breakpoint-column-toggle',
                toggleSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);
            button.click();
            await waitForUpdatesAsync();

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            const eventDetail = (
                toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
            ).detail;
            expect(eventDetail.oldState).toBe(BreakpointState.hit);
            expect(eventDetail.newState).toBe(BreakpointState.off);
        });

        it('emits toggle event for child rows in hierarchical data', async () => {
            table.parentIdFieldName = 'parentId';
            await table.setData([
                { id: 'parent', breakpointState: BreakpointState.off },
                { id: 'child', parentId: 'parent', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const toggleSpy = jasmine.createSpy('toggle');
            elementReferences.column.addEventListener(
                'breakpoint-column-toggle',
                toggleSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                1,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);
            button.click();
            await waitForUpdatesAsync();

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            const eventDetail = (
                toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
            ).detail;
            expect(eventDetail.recordId).toBe('child');
            expect(eventDetail.oldState).toBe(BreakpointState.off);
            expect(eventDetail.newState).toBe(BreakpointState.enabled);
        });
    });

    describe('table selection does not change', () => {
        let button: HTMLButtonElement;

        beforeEach(async () => {
            table.selectionMode = 'multiple';
            await waitForUpdatesAsync();

            await table.setData([{ id: '1', breakpointState: BreakpointState.off }]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            button = getBreakpointButton(cellView);
            button.focus();
        });

        it('when clicking a breakpoint button', async () => {
            button.click();
            await waitForUpdatesAsync();

            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });

        it('when toggling a breakpoint button by pressing Enter', async () => {
            button.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true
                })
            );
            await waitForUpdatesAsync();

            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });
    });

    describe('tooltip text', () => {
        it('shows "Add breakpoint" when state is off', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.tooltipText).toBe('Add breakpoint');
        });

        it('shows "Remove breakpoint" when state is enabled', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.tooltipText).toBe('Remove breakpoint');
        });
    });

    describe('tabbable children', () => {
        it('cell view has one tabbable child (the button)', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.tabbableChildren.length).toBe(1);
        });
    });

    describe('context menu', () => {
        it('emits breakpoint-column-context-menu on right-click when state is off', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const contextMenuSpy = jasmine.createSpy('contextmenu');
            elementReferences.column.addEventListener(
                'breakpoint-column-context-menu',
                contextMenuSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);
            button.dispatchEvent(
                new MouseEvent('contextmenu', { bubbles: true })
            );
            await waitForUpdatesAsync();

            expect(contextMenuSpy).toHaveBeenCalledTimes(1);
            const eventDetail = getContextMenuEventDetail(contextMenuSpy);
            expect(eventDetail.recordId).toBe('1');
            expect(eventDetail.currentState).toBe(BreakpointState.off);
        });

        it('emits breakpoint-column-context-menu on right-click when state is enabled', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const contextMenuSpy = jasmine.createSpy('contextmenu');
            elementReferences.column.addEventListener(
                'breakpoint-column-context-menu',
                contextMenuSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);
            button.dispatchEvent(
                new MouseEvent('contextmenu', { bubbles: true })
            );
            await waitForUpdatesAsync();

            expect(contextMenuSpy).toHaveBeenCalledTimes(1);
            const eventDetail = getContextMenuEventDetail(contextMenuSpy);
            expect(eventDetail.recordId).toBe('1');
            expect(eventDetail.currentState).toBe(BreakpointState.enabled);
        });

        it('emits breakpoint-column-context-menu on Shift+F10', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const contextMenuSpy = jasmine.createSpy('contextmenu');
            elementReferences.column.addEventListener(
                'breakpoint-column-context-menu',
                contextMenuSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);

            button.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'F10',
                    shiftKey: true,
                    bubbles: true
                })
            );
            await waitForUpdatesAsync();

            expect(contextMenuSpy).toHaveBeenCalledTimes(1);
            const eventDetail = getContextMenuEventDetail(contextMenuSpy);
            expect(eventDetail.recordId).toBe('1');
            expect(eventDetail.currentState).toBe(BreakpointState.enabled);
        });

        it('emits breakpoint-column-context-menu on Menu key', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const contextMenuSpy = jasmine.createSpy('contextmenu');
            elementReferences.column.addEventListener(
                'breakpoint-column-context-menu',
                contextMenuSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);

            button.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Menu',
                    bubbles: true
                })
            );
            await waitForUpdatesAsync();

            expect(contextMenuSpy).toHaveBeenCalledTimes(1);
            const eventDetail = getContextMenuEventDetail(contextMenuSpy);
            expect(eventDetail.recordId).toBe('1');
            expect(eventDetail.currentState).toBe(BreakpointState.enabled);
        });

        it('emits breakpoint-column-context-menu when right-clicking while menu is already open', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const contextMenuSpy = jasmine.createSpy('contextmenu');
            elementReferences.column.addEventListener(
                'breakpoint-column-context-menu',
                contextMenuSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);

            button.dispatchEvent(
                new MouseEvent('contextmenu', { bubbles: true })
            );
            await waitForUpdatesAsync();

            button.dispatchEvent(
                new MouseEvent('contextmenu', { bubbles: true })
            );
            await waitForUpdatesAsync();

            expect(contextMenuSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('keyboard shortcuts', () => {
        it('toggles breakpoint on F9 when focused in breakpoint cell', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            const toggleSpy = jasmine.createSpy('toggle');
            elementReferences.column.addEventListener(
                'breakpoint-column-toggle',
                toggleSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);

            button.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'F9',
                    bubbles: true
                })
            );
            await waitForUpdatesAsync();

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            const eventDetail = (
                toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
            ).detail;
            expect(eventDetail.oldState).toBe(BreakpointState.off);
            expect(eventDetail.newState).toBe(BreakpointState.enabled);
        });

        it('toggles breakpoint on Ctrl+B when focused in breakpoint cell', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            const toggleSpy = jasmine.createSpy('toggle');
            elementReferences.column.addEventListener(
                'breakpoint-column-toggle',
                toggleSpy
            );

            const cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            const button = getBreakpointButton(cellView);

            button.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'b',
                    ctrlKey: true,
                    bubbles: true
                })
            );
            await waitForUpdatesAsync();

            expect(toggleSpy).toHaveBeenCalledTimes(1);
            const eventDetail = (
                toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
            ).detail;
            expect(eventDetail.oldState).toBe(BreakpointState.enabled);
            expect(eventDetail.newState).toBe(BreakpointState.off);
        });
    });

    describe('field-name attribute', () => {
        it('updating fieldName updates cell rendering', async () => {
            await table.setData([
                {
                    id: '1',
                    breakpointState: BreakpointState.enabled
                }
            ]);
            await waitForUpdatesAsync();

            let cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.enabled);

            elementReferences.column.fieldName = undefined;
            await waitForUpdatesAsync();

            cellView = tablePageObject.getRenderedCellView(
                0,
                0
            ) as TsTableColumnBreakpointCellView;
            expect(cellView.currentState).toBe(BreakpointState.off);
        });
    });
});
