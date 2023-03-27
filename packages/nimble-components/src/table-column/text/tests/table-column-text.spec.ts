import { html } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnText, tableColumnTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/tests/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';

interface SimpleTableRecord extends TableRecord {
    field?: string | null;
    noPlaceholder?: string | null;
    anotherField?: string | null;
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table>
                <${tableColumnTextTag} field-name="field" placeholder="no value" group-index="0">
                    Column 1
                </${tableColumnTextTag}>
                <${tableColumnTextTag} field-name="noPlaceholder">
                    Column 2
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

    const noValueData = [
        { description: 'field not present', data: [{ unused: 'foo' }] },
        { description: 'value is null', data: [{ field: null }] },
        { description: 'value is undefined', data: [{ field: undefined }] }
    ];
    for (const testData of noValueData) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays placeholder string when ${testData.description}`, async () => {
            element.setData(testData.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value'); // test for when value is null
        });
    }

    it('changing fieldName updates display', async () => {
        element.setData([{ field: 'foo', anotherField: 'bar' }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = 'anotherField';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('bar');
    });

    it('changing placeholder updates display', async () => {
        element.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.placeholder = 'different value';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('different value');
    });

    it('changing data from value to null displays placeholder', async () => {
        element.setData([{ field: 'foo' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');

        const updatedValue = { field: null };
        const updatedData = [updatedValue];
        element.setData(updatedData);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');
    });

    it('changing data from null to value displays value', async () => {
        element.setData([{ field: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');

        element.setData([{ field: 'foo' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnText;
        firstColumn.fieldName = undefined;
        element.setData([{ field: 'foo' }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
    });

    it('sets title when cell text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
    });

    it('does not set title when cell text is fully visible', async () => {
        const cellContents = 'short value';
        element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    it('removes title on mouseout', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        element.setData([{ field: cellContents }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    describe('various string values render as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `data "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();

                    element.setData([{ field: value.name }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                        value.name
                    );
                }
            );
        }
    });

    describe('placeholder assigned various strings render as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `placeholder "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();
                    element.setData([{ field: null }]);
                    await waitForUpdatesAsync();

                    const firstColumn = element.columns[0] as TableColumnText;
                    firstColumn.placeholder = value.name;
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                        value.name
                    );
                }
            );
        }
    });

    describe('various string values render in group header as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `data "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();

                    element.setData([{ field: value.name }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedGroupHeaderContent(0)).toContain(
                        value.name
                    );
                }
            );
        }
    });

    fdescribe('placeholder assigned various strings render in group header as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `placeholder "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();
                    element.setData([{ field: null }]);
                    await waitForUpdatesAsync();

                    const firstColumn = element.columns[0] as TableColumnText;
                    firstColumn.placeholder = value.name;
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedGroupHeaderContent(0)).toContain(
                        value.name
                    );
                }
            );
        }
    });
});
