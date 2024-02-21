import { html, ref } from '@microsoft/fast-element';
import { tableTag, type Table } from '../../../table';
import { TableColumnDurationText, tableColumnDurationTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { lang, themeProviderTag } from '../../../theme-provider';
import { TableColumnDurationTextPageObject } from '../testing/table-column-duration-text.pageobject';

interface SimpleTableRecord extends TableRecord {
    field?: number | null;
    anotherField?: number | null;
}

class ElementReferences {
    public table!: Table;
    public column1!: TableColumnDurationText;
}

describe('TableColumnDurationText', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let pageObject: TableColumnDurationTextPageObject<SimpleTableRecord>;
    let column: TableColumnDurationText;

    // prettier-ignore
    async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
        return fixture<Table<SimpleTableRecord>>(
            html`<${themeProviderTag} lang="en-US">
                    <${tableTag} ${ref('table')} style="width: 700px">
                        <${tableColumnDurationTextTag} ${ref('column1')} field-name="field" group-index="0">
                            Duration Column 1
                        </${tableColumnDurationTextTag}>
                        <${tableColumnDurationTextTag} field-name="anotherField">
                            Duration Column 2
                        </${tableColumnDurationTextTag}>
                    </${tableTag}>
                </${themeProviderTag}>`,
            { source }
        );
    }

    beforeEach(async () => {
        elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        tablePageObject = new TablePageObject<SimpleTableRecord>(table);
        pageObject = new TableColumnDurationTextPageObject(tablePageObject);
        await connect();
        await waitForUpdatesAsync();
        column = elementReferences.column1;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(tableColumnDurationTextTag).toBe(
            'nimble-table-column-duration-text'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-duration-text')
        ).toBeInstanceOf(TableColumnDurationText);
    });

    it('reports column configuration valid', () => {
        expect(column.checkValidity()).toBeTrue();
    });

    it('changing fieldName updates display', async () => {
        await table.setData([
            {
                field: 2000,
                anotherField: 1000
            }
        ]);
        await waitForUpdatesAsync();

        column.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual(
            '1 sec'
        );
    });

    it('changing data from value to null displays blank', async () => {
        await table.setData([{ field: 2000 }]);
        await waitForUpdatesAsync();
        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual(
            '2 sec'
        );

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        await table.setData(updatedData);
        await waitForUpdatesAsync();

        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual('');
    });

    it('changing data from null to value displays value', async () => {
        await table.setData([{ field: null }]);
        await waitForUpdatesAsync();
        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual('');

        await table.setData([{ field: 2000 }]);
        await waitForUpdatesAsync();

        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual(
            '2 sec'
        );
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        column.fieldName = undefined;
        await table.setData([{ field: 2000 }]);
        await waitForUpdatesAsync();

        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual('');
    });

    it('sets title when cell text is ellipsized', async () => {
        table.style.width = '100px';
        await table.setData([{ field: 8607022000 }]);
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(tablePageObject.getCellTitle(0, 0)).toEqual(
            '99 days, 14 hr, 50 min, 22 sec'
        );
    });

    it('does not set title when cell text is fully visible', async () => {
        await table.setData([{ field: 8607022000 }]);
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(tablePageObject.getCellTitle(0, 0)).toEqual('');
    });

    it('removes title on mouseout of cell', async () => {
        table.style.width = '100px';
        await table.setData([{ field: 8607022000 }]);
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(tablePageObject.getCellTitle(0, 0)).toEqual('');
    });

    it('sets group header text to rendered date value', async () => {
        await table.setData([{ field: 8607022000 }]);
        await waitForUpdatesAsync();
        expect(tablePageObject.getRenderedGroupHeaderTextContent(0)).toBe(
            '99 days, 14 hr, 50 min, 22 sec'
        );
    });

    it('updates displayed date when lang token changes', async () => {
        await table.setData([{ field: 8607022000 }]);
        await waitForUpdatesAsync();
        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toBe(
            '99 days, 14 hr, 50 min, 22 sec'
        );
        lang.setValueFor(table, 'fr');
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe(
            '99 j, 14 h, 50 min, 22 s'
        );
    });
});
