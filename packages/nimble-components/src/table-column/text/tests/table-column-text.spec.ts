import { html } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnText, tableColumnTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { parameterizeNamedList } from '../../../utilities/tests/parameterized';

interface SimpleTableRecord extends TableRecord {
    field?: string | null;
    anotherField?: string | null;
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnTextTag} field-name="field" group-index="0">
                    Column 1
                </${tableColumnTextTag}>
                <${tableColumnTextTag} field-name="anotherField">
                    Squeeze Column 1
                </${tableColumnTextTag}>
            </nimble-table>`
    );
}

describe('TableColumnText', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(tableColumnTextTag).toBe('nimble-table-column-text');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-text')
        ).toBeInstanceOf(TableColumnText);
    });

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;

        expect(firstColumn.checkValidity()).toBeTrue();
    });

    const noValueData = [
        { name: 'field not present', data: [{ unused: 'foo' }] },
        { name: 'value is null', data: [{ field: null }] },
        { name: 'value is undefined', data: [{ field: undefined }] },
        {
            name: 'value is not a string',
            data: [{ field: 10 as unknown as string }]
        }
    ];
    parameterizeNamedList(noValueData, (spec, name, value) => {
        spec(`displays empty string when ${name}`, async () => {
            await element.setData(value.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });
    });

    it('changing fieldName updates display', async () => {
        await element.setData([{ field: 'foo', anotherField: 'bar' }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bar');
    });

    it('changing data from value to null displays blank', async () => {
        await element.setData([{ field: 'foo' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        await element.setData(updatedData);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
    });

    it('changing data from null to value displays value', async () => {
        await element.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

        await element.setData([{ field: 'foo' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = undefined;
        await element.setData([{ field: 'foo' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
    });

    it('sets title when cell text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
    });

    it('does not set title when cell text is fully visible', async () => {
        const cellContents = 'short value';
        await element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    it('removes title on mouseout of cell', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    it('sets title when group header text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await element.setData([{ field: cellContents }]);
        element.style.width = '200px';
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe(cellContents);
    });

    it('does not set title when group header text is fully visible', async () => {
        const cellContents = 'foo';
        await element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    it('removes title on mouseout of group header', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        await element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    describe('various string values render as expected', () => {
        parameterizeNamedList(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                await connect();

                await element.setData([{ field: name }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(name);
            });
        });
    });

    describe('various string values render in group header as expected', () => {
        parameterizeNamedList(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                await connect();

                await element.setData([{ field: name }]);
                await waitForUpdatesAsync();

                expect(
                    pageObject.getRenderedGroupHeaderTextContent(0)
                ).toContain(name);
            });
        });
    });
});
