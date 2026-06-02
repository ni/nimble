import { html, ref } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '@ni/nimble-components/dist/esm/table';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag, type MenuItem } from '@ni/nimble-components/dist/esm/menu-item';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { TablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { singleIconColumnWidth } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { TsTableColumnBreakpoint, tsTableColumnBreakpointTag } from '..';
import { TsTableColumnBreakpointPageObject } from './ts-table-column-breakpoint.pageobject';
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
    public firstMenuItem!: MenuItem;
    public secondMenuItem!: MenuItem;
    public lastMenuItem!: MenuItem;
}

describe('TsTableColumnBreakpoint', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let breakpointPageObject: TsTableColumnBreakpointPageObject<SimpleTableRecord>;

    async function setup(
        source: ElementReferences
    ): Promise<Fixture<Table<SimpleTableRecord>>> {
        return await fixture<Table<SimpleTableRecord>>(
            html`<${tableTag} ${ref('table')} id-field-name="id" style="width: 700px">
                    <${tsTableColumnBreakpointTag}
                        ${ref('column')}
                        field-name="breakpointState"
                        menu-slot="breakpoint-menu"
                    >
                    </${tsTableColumnBreakpointTag}>

                    <${menuTag} slot="breakpoint-menu">
                        <${menuItemTag} ${ref('firstMenuItem')}>Toggle</${menuItemTag}>
                        <${menuItemTag} ${ref('secondMenuItem')}>Disable</${menuItemTag}>
                        <${menuItemTag} ${ref('lastMenuItem')}>Edit</${menuItemTag}>
                    </${menuTag}>
                </${tableTag}>`,
            { source }
        );
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
        breakpointPageObject = new TsTableColumnBreakpointPageObject(tablePageObject);
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
        const stateRenderTests = [
            {
                name: 'renders off state when field value is "off"',
                fieldValue: BreakpointState.off,
                expectedState: BreakpointState.off
            },
            {
                name: 'renders enabled state when field value is "enabled"',
                fieldValue: BreakpointState.enabled,
                expectedState: BreakpointState.enabled
            },
            {
                name: 'renders disabled state when field value is "disabled"',
                fieldValue: BreakpointState.disabled,
                expectedState: BreakpointState.disabled
            },
            {
                name: 'renders hit state when field value is "hit"',
                fieldValue: BreakpointState.hit,
                expectedState: BreakpointState.hit
            },
            {
                name: 'renders off state when field value is null',
                fieldValue: null,
                expectedState: BreakpointState.off
            },
            {
                name: 'renders off state when field value is undefined',
                fieldValue: undefined,
                expectedState: BreakpointState.off
            },
            {
                name: 'renders off state when field value is invalid',
                fieldValue: 'invalid-state',
                expectedState: BreakpointState.off
            }
        ] as const;

        parameterizeSpec(stateRenderTests, (spec, name, value) => {
            spec(name, async () => {
                await table.setData([
                    { id: '1', breakpointState: value.fieldValue }
                ]);
                await waitForUpdatesAsync();

                expect(breakpointPageObject.getCurrentState(0, 0)).toBe(
                    value.expectedState
                );
            });
        });
    });

    describe('click-to-toggle', () => {
        const clickToggleTests = [
            {
                name: 'emits toggle event from off to enabled on click',
                initialState: BreakpointState.off,
                expectedNewState: BreakpointState.enabled
            },
            {
                name: 'emits toggle event from enabled to off on click',
                initialState: BreakpointState.enabled,
                expectedNewState: BreakpointState.off
            },
            {
                name: 'emits toggle event from hit to off on click',
                initialState: BreakpointState.hit,
                expectedNewState: BreakpointState.off
            }
        ] as const;

        parameterizeSpec(clickToggleTests, (spec, name, value) => {
            spec(name, async () => {
                await table.setData([
                    { id: '1', breakpointState: value.initialState }
                ]);
                await waitForUpdatesAsync();

                const toggleSpy = jasmine.createSpy('toggle');
                elementReferences.column.addEventListener(
                    'breakpoint-column-toggle',
                    toggleSpy
                );

                breakpointPageObject.clickBreakpointButton(0, 0);
                await waitForUpdatesAsync();

                expect(toggleSpy).toHaveBeenCalledTimes(1);
                const eventDetail = (
                    toggleSpy.calls.first().args[0] as CustomEvent<BreakpointToggleEventDetail>
                ).detail;
                expect(eventDetail.oldState).toBe(value.initialState);
                expect(eventDetail.newState).toBe(value.expectedNewState);
                expect(eventDetail.recordId).toBe('1');
            });
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

            breakpointPageObject.clickBreakpointButton(1, 0);
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
        beforeEach(async () => {
            table.selectionMode = 'multiple';
            await waitForUpdatesAsync();

            await table.setData([{ id: '1', breakpointState: BreakpointState.off }]);
            await waitForUpdatesAsync();

            breakpointPageObject.focusBreakpointButton(0, 0);
        });

        it('when clicking a breakpoint button', async () => {
            breakpointPageObject.clickBreakpointButton(0, 0);
            await waitForUpdatesAsync();

            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });

        it('when toggling a breakpoint button by pressing Enter', async () => {
            breakpointPageObject.pressBreakpointButtonKey(0, 0, { key: 'Enter' });
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

            expect(breakpointPageObject.getTooltipText(0, 0)).toBe('Add breakpoint');
        });

        it('shows "Remove breakpoint" when state is enabled', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.enabled }
            ]);
            await waitForUpdatesAsync();

            expect(breakpointPageObject.getTooltipText(0, 0)).toBe('Remove breakpoint');
        });
    });

    describe('tabbable children', () => {
        it('cell view has one tabbable child (the button)', async () => {
            await table.setData([
                { id: '1', breakpointState: BreakpointState.off }
            ]);
            await waitForUpdatesAsync();

            expect(breakpointPageObject.getTabbableChildrenCount(0, 0)).toBe(1);
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

            breakpointPageObject.rightClickBreakpointButton(0, 0);
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

            breakpointPageObject.rightClickBreakpointButton(0, 0);
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

            breakpointPageObject.pressBreakpointButtonKey(0, 0, {
                key: 'F10',
                shiftKey: true
            });
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

            breakpointPageObject.pressBreakpointButtonKey(0, 0, {
                key: 'Menu'
            });
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

            breakpointPageObject.rightClickBreakpointButton(0, 0);
            await waitForUpdatesAsync();

            breakpointPageObject.rightClickBreakpointButton(0, 0);
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

            breakpointPageObject.pressBreakpointButtonKey(0, 0, {
                key: 'F9'
            });
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

            breakpointPageObject.pressBreakpointButtonKey(0, 0, {
                key: 'b',
                ctrlKey: true
            });
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

            expect(breakpointPageObject.getCurrentState(0, 0)).toBe(
                BreakpointState.enabled
            );

            elementReferences.column.fieldName = undefined;
            await waitForUpdatesAsync();

            expect(breakpointPageObject.getCurrentState(0, 0)).toBe(BreakpointState.off);
        });
    });
});
