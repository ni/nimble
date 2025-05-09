import { html } from '@ni/fast-element';
import { tableTag, type Table } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import type { TableRecord } from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import { themeProviderTag, type ThemeProvider } from '../../theme-provider';
import {
    LabelProviderTable,
    labelProviderTableTag
} from '../../label-provider/table';
import {
    tableColumnTextTag,
    type TableColumnText
} from '../../table-column/text';
import { tableGroupRowTag } from '../components/group-row';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';

interface SimpleTableRecord extends TableRecord {
    stringData: string;
    moreStringData: string;
}

const simpleTableData = [
    {
        stringData: 'string 1',
        moreStringData: 'foo'
    },
    {
        stringData: 'hello world',
        moreStringData: 'foo'
    },
    {
        stringData: 'another string',
        moreStringData: 'foo'
    }
] as const;

// prettier-ignore
async function setup(): Promise<Fixture<ThemeProvider>> {
    return await fixture<ThemeProvider>(
        html`
        <${themeProviderTag}>
            <${labelProviderTableTag}></${labelProviderTableTag}>
            <${tableTag} style="width: 700px">
                <${tableColumnTextTag} id="first-column" field-name="stringData">stringData</${tableColumnTextTag}>
                <${tableColumnTextTag} id="second-column" field-name="moreStringData">moreStringData</${tableColumnTextTag}>
            </${tableTag}>
        <${themeProviderTag}>`
    );
}

describe('Table with LabelProviderTable', () => {
    let element: Table<SimpleTableRecord>;
    let labelProvider: LabelProviderTable;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TableColumnText;

    beforeEach(async () => {
        let themeProvider: ThemeProvider;
        ({ element: themeProvider, connect, disconnect } = await setup());
        element = themeProvider.querySelector<Table<SimpleTableRecord>>(tableTag)!;
        labelProvider = themeProvider.querySelector(labelProviderTableTag)!;

        pageObject = new TablePageObject<SimpleTableRecord>(element);
        column1 = element.querySelector<TableColumnText>('#first-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('uses correct labels when a column is grouped (groupCollapse/groupExpand/collapseAll/columnHeaderGroupedIndicator)', async () => {
        await element.setData(simpleTableData);
        await connect();

        labelProvider.collapseAll = 'Customized Collapse All';
        labelProvider.groupExpand = 'Customized Expand';
        labelProvider.groupCollapse = 'Customized Collapse';
        labelProvider.columnHeaderGrouped = 'Customized Grouped';
        column1.groupIndex = 0;
        await waitForUpdatesAsync();

        const actualGroupsCollapseAllLabel = element
            .shadowRoot!.querySelector('.collapse-all-button')!
            .textContent!.trim();
        expect(actualGroupsCollapseAllLabel).toBe('Customized Collapse All');
        const actualColumnHeaderGroupedIndicatorLabel = pageObject
            .getHeaderElement(0)
            .shadowRoot!.querySelector('.grouped-indicator')!
            .getAttribute('title');
        expect(actualColumnHeaderGroupedIndicatorLabel).toBe(
            'Customized Grouped'
        );
        const firstGroupRow: HTMLElement = element.shadowRoot!.querySelector(tableGroupRowTag)!;
        const actualGroupCollapseLabel = firstGroupRow
            .shadowRoot!.querySelector('.expand-collapse-button')!
            .getAttribute('title')
            ?.trim();
        expect(actualGroupCollapseLabel).toBe('Customized Collapse');

        firstGroupRow.click();
        await waitForUpdatesAsync();

        const actualGroupExpandLabel = firstGroupRow
            .shadowRoot!.querySelector('.expand-collapse-button')!
            .getAttribute('title')
            ?.trim();
        expect(actualGroupExpandLabel).toBe('Customized Expand');
    });

    it('uses correct labels when a column has an action menu (cellActionMenu)', async () => {
        const slot = 'my-action-menu';
        column1.actionMenuSlot = slot;
        const menu = document.createElement(menuTag);
        const menuItem1 = document.createElement(menuItemTag);
        menuItem1.textContent = 'menu item 1';
        menu.appendChild(menuItem1);
        menu.slot = slot;
        element.appendChild(menu);
        await element.setData(simpleTableData);
        await connect();

        labelProvider.cellActionMenu = 'Customized Cell Options';
        await waitForUpdatesAsync();

        const actualCellActionMenuLabel = pageObject
            .getCellActionMenu(0, 0)!
            .textContent!.trim();
        expect(actualCellActionMenuLabel).toBe('Customized Cell Options');
    });
});
