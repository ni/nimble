import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '..';
import { tableColumnTextTag, type TableColumnText } from '../../table-column/text';
import {
    tableColumnNumberTextTag,
    type TableColumnNumberText
} from '../../table-column/number-text';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture } from '../../utilities/tests/fixture';
import { TablePageObject } from '../testing/table.pageobject';
import {
    type TableRecord,
    TableColumnSortDirection,
    TableRowSelectionMode,
    TableRowSelectionState
} from '../types';

interface Record extends TableRecord {
    id: string;
    group?: string;
    subgroup?: string;
    value?: number | null;
    parentId?: string;
}

describe('Table upgrade regressions', () => {
    let element: Table<Record>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<Record>;
    let groupColumn: TableColumnText;
    let subgroupColumn: TableColumnText;
    let valueColumn: TableColumnNumberText;

    function renderedIds(): string[] {
        return Array.from({ length: pageObject.getRenderedRowCount() }, (_, i) => pageObject.getRecordId(i)!);
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await fixture<Table<Record>>(html`
            <${tableTag} id-field-name="id" style="height: 800px">
                <${tableColumnTextTag} field-name="group" column-id="group"></${tableColumnTextTag}>
                <${tableColumnTextTag} field-name="subgroup" column-id="subgroup"></${tableColumnTextTag}>
                <${tableColumnNumberTextTag} field-name="value" column-id="value"></${tableColumnNumberTextTag}>
            </${tableTag}>
        `));
        pageObject = new TablePageObject(element);
        groupColumn = element.querySelector<TableColumnText>('[column-id="group"]')!;
        subgroupColumn = element.querySelector<TableColumnText>('[column-id="subgroup"]')!;
        valueColumn = element.querySelector<TableColumnNumberText>('[column-id="value"]')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    parameterizeSpec([
        { name: 'ascending', direction: TableColumnSortDirection.ascending },
        { name: 'descending', direction: TableColumnSortDirection.descending }
    ], (spec, name, { direction }) => {
        spec(`sorts numeric edge cases ${name} through the row model`, async () => {
            const ordered: Record[] = [
                { id: 'undefined' },
                { id: 'null', value: null },
                { id: 'nan', value: Number.NaN },
                { id: 'negative-infinity', value: Number.NEGATIVE_INFINITY },
                { id: 'negative', value: -1 },
                { id: 'negative-zero', value: -0 },
                { id: 'zero', value: 0 },
                { id: 'positive', value: 1 },
                { id: 'infinity', value: Number.POSITIVE_INFINITY }
            ];
            valueColumn.sortIndex = 0;
            valueColumn.sortDirection = direction;
            await element.setData([...ordered].reverse());
            await connect();
            await waitForUpdatesAsync();

            const expected = ordered.map(row => row.id);
            expect(renderedIds()).toEqual(direction === TableColumnSortDirection.ascending ? expected : expected.reverse());
        });
    });

    it('preserves equal-value input order and applies multi-sort tie breaking', async () => {
        valueColumn.sortIndex = 0;
        valueColumn.sortDirection = TableColumnSortDirection.ascending;
        await element.setData([
            { id: 'b', value: 1, subgroup: 'b' },
            { id: 'a-first', value: 1, subgroup: 'a' },
            { id: 'a-second', value: 1, subgroup: 'a' }
        ]);
        await connect();
        await waitForUpdatesAsync();
        expect(renderedIds()).toEqual(['b', 'a-first', 'a-second']);

        subgroupColumn.sortIndex = 1;
        subgroupColumn.sortDirection = TableColumnSortDirection.ascending;
        await waitForUpdatesAsync();
        expect(renderedIds()).toEqual(['a-first', 'a-second', 'b']);
    });

    it('sorts group rows by implicit numeric sums while sorting children individually', async () => {
        groupColumn.groupIndex = 0;
        valueColumn.sortIndex = 0;
        valueColumn.sortDirection = TableColumnSortDirection.ascending;
        await element.setData([
            { id: 'a-2', group: 'a', value: 2 },
            { id: 'a-3', group: 'a', value: 3 },
            { id: 'b-1', group: 'b', value: 1 },
            { id: 'b-10', group: 'b', value: 10 }
        ]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getAllRenderedGroupHeaderTextContent()).toEqual(['a', 'b']);
        expect(renderedIds()).toEqual(['a-2', 'a-3', 'b-1', 'b-10']);

        valueColumn.sortDirection = TableColumnSortDirection.descending;
        await waitForUpdatesAsync();
        expect(pageObject.getAllRenderedGroupHeaderTextContent()).toEqual(['b', 'a']);
        expect(renderedIds()).toEqual(['b-10', 'b-1', 'a-3', 'a-2']);
    });

    it('sorts outer groups using the first value of a later grouped column', async () => {
        groupColumn.groupIndex = 0;
        subgroupColumn.groupIndex = 1;
        subgroupColumn.sortIndex = 0;
        subgroupColumn.sortDirection = TableColumnSortDirection.ascending;
        await element.setData([
            { id: 'a-z', group: 'a', subgroup: 'z' },
            { id: 'b-y', group: 'b', subgroup: 'y' }
        ]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getAllRenderedGroupHeaderTextContent()).toEqual(['b', 'y', 'a', 'z']);
        expect(renderedIds()).toEqual(['b-y', 'a-z']);
    });

    it('preserves expansion and selection when replacing sorted grouped hierarchical data', async () => {
        element.parentIdFieldName = 'parentId';
        element.selectionMode = TableRowSelectionMode.multiple;
        groupColumn.groupIndex = 0;
        groupColumn.sortIndex = 0;
        groupColumn.sortDirection = TableColumnSortDirection.ascending;
        const data: Record[] = [
            { id: 'b', group: 'b' },
            { id: 'b-child', group: 'b', parentId: 'b' },
            { id: 'a', group: 'a' },
            { id: 'a-child', group: 'a', parentId: 'a' }
        ];
        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        await element.setSelectedRecordIds(['a-child', 'b-child']);
        pageObject.toggleGroupRowExpandedState(0);
        await waitForUpdatesAsync();

        const selectionChangeSpy = jasmine.createSpy();
        element.addEventListener('selection-change', selectionChangeSpy);
        await element.setData([
            ...data.filter(row => row.id !== 'b-child'),
            { id: 'b-new', group: 'b', parentId: 'b' }
        ]);
        await waitForUpdatesAsync();
        expect(pageObject.getAllGroupRowsExpandedState()).toEqual([false, true]);
        expect(renderedIds()).toEqual(['b', 'b-new']);
        expect(await element.getSelectedRecordIds()).toEqual(['a-child']);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.partiallySelected);
        expect(selectionChangeSpy).not.toHaveBeenCalled();

        pageObject.toggleGroupRowExpandedState(0);
        await waitForUpdatesAsync();
        expect(renderedIds()).toEqual(['a', 'a-child', 'b', 'b-new']);
        expect(pageObject.getRowSelectionState(1)).toBe(TableRowSelectionState.selected);
    });

    it('updates header and group selection after deselecting fully selected groups', async () => {
        groupColumn.groupIndex = 0;
        subgroupColumn.groupIndex = 1;
        element.selectionMode = TableRowSelectionMode.multiple;
        await element.setData([
            { id: 'a-1', group: 'a', subgroup: 'one' },
            { id: 'a-2', group: 'a', subgroup: 'two' },
            { id: 'b-1', group: 'b', subgroup: 'one' }
        ]);
        await connect();
        await waitForUpdatesAsync();
        const selectionChangeSpy = jasmine.createSpy();
        element.addEventListener('selection-change', selectionChangeSpy);
        await element.setSelectedRecordIds(['a-1', 'a-2', 'b-1']);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.selected);

        pageObject.clickGroupRowSelectionCheckbox(0);
        await waitForUpdatesAsync();
        expect(await element.getSelectedRecordIds()).toEqual(['b-1']);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.partiallySelected);
        expect(pageObject.getGroupRowSelectionState(0)).toBe(TableRowSelectionState.notSelected);
        expect(pageObject.getGroupRowSelectionState(1)).toBe(TableRowSelectionState.notSelected);

        pageObject.clickGroupRowSelectionCheckbox(3);
        await waitForUpdatesAsync();
        expect(await element.getSelectedRecordIds()).toEqual([]);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.notSelected);
        expect(selectionChangeSpy).toHaveBeenCalledTimes(2);
    });

    it('updates cached selection state as an additive range grows and shrinks', async () => {
        element.selectionMode = TableRowSelectionMode.multiple;
        await element.setData([
            { id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }
        ]);
        await connect();
        await waitForUpdatesAsync();
        const selectionChangeSpy = jasmine.createSpy();
        element.addEventListener('selection-change', selectionChangeSpy);

        await pageObject.clickRow(0);
        await pageObject.clickRow(3, { shiftKey: true, ctrlKey: true });
        expect(await element.getSelectedRecordIds()).toEqual(['0', '1', '2', '3']);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.selected);

        await pageObject.clickRow(1, { shiftKey: true, ctrlKey: true });
        expect(await element.getSelectedRecordIds()).toEqual(['0', '1']);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.partiallySelected);
        expect(pageObject.getRowSelectionState(2)).toBe(TableRowSelectionState.notSelected);

        await pageObject.clickRow(3, { shiftKey: true, ctrlKey: true });
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.selected);
        await element.setSelectedRecordIds([]);
        expect(pageObject.getTableSelectionState()).toBe(TableRowSelectionState.notSelected);
        expect(selectionChangeSpy).toHaveBeenCalledTimes(4);
    });

    it('repeatedly collapses all and re-expands one branch without opening siblings', async () => {
        element.parentIdFieldName = 'parentId';
        await element.setData([
            { id: 'a' }, { id: 'a-child', parentId: 'a' },
            { id: 'b' }, { id: 'b-child', parentId: 'b' }
        ]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.clickCollapseAllButton();
        await waitForUpdatesAsync();
        pageObject.clickCollapseAllButton();
        await waitForUpdatesAsync();
        expect(renderedIds()).toEqual(['a', 'b']);

        pageObject.clickDataRowExpandCollapseButton(0);
        await waitForUpdatesAsync();
        expect(renderedIds()).toEqual(['a', 'a-child', 'b']);
        pageObject.clickCollapseAllButton();
        await waitForUpdatesAsync();
        expect(renderedIds()).toEqual(['a', 'b']);
    });
});
