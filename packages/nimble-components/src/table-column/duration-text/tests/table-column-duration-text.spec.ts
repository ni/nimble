import { html, ref } from '@microsoft/fast-element';
import { tableTag, type Table } from '../../../table';
import { TableColumnDurationText, tableColumnDurationTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { lang, themeProviderTag } from '../../../theme-provider';
import { TableColumnDurationTextPageObject } from '../testing/table-column-duration-text.pageobject';
import { parameterizeSpec } from '@ni/jasmine-parameterized';

interface SimpleTableRecord extends TableRecord {
    field?: number | null;
    anotherField?: number | null;
}

class ElementReferences {
    public table!: Table;
    public column1!: TableColumnDurationText;
}

fdescribe('TableColumnDurationText', () => {
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

    describe('placeholder', () => {
        const testCases = [
            {
                name: 'value is not specified',
                data: [{}],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'value is undefined',
                data: [{ field: undefined }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'value is null',
                data: [{ field: null }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'value is Number.NaN',
                data: [{ field: Number.NaN }],
                cellValue: '',
                groupValue: '',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is valid and non-zero',
                data: [{ field: 20000 }],
                cellValue: '20 sec',
                groupValue: '20 sec',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is incorrect type',
                data: [{ field: 'not a number' as unknown as number }],
                cellValue: '',
                groupValue: '',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is specified and falsey',
                data: [{ field: 0 }],
                cellValue: '0 sec',
                groupValue: '0 sec',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is Inf',
                data: [{ field: Number.POSITIVE_INFINITY }],
                cellValue: '',
                groupValue: '',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is negative',
                data: [{ field: -5 }],
                cellValue: '',
                groupValue: '',
                usesColumnPlaceholder: false
            }
        ];

        parameterizeSpec(testCases, (spec, name, value) => {
            spec(`cell and group row render expected value when ${name} and placeholder is configured`, async () => {
                const placeholder = 'Custom placeholder';
                elementReferences.column1.placeholder = placeholder;
                await table.setData(value.data);
                await connect();
                await waitForUpdatesAsync();

                const expectedCellText = value.usesColumnPlaceholder ? placeholder : value.cellValue;
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(expectedCellText);
                expect(pageObject.getRenderedGroupHeaderContent(0)).toBe(value.groupValue);
            });
        });

        parameterizeSpec(testCases, (spec, name, value) => {
            spec(`cell and group row render expected value when ${name} and placeholder is not configured`, async () => {
                await table.setData(value.data);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellContent(0, 0)).toBe(value.cellValue);
                expect(pageObject.getRenderedGroupHeaderContent(0)).toBe(value.groupValue);
            });
        });

        it('setting placeholder to undefined updates cells from displaying placeholder to displaying blank', async () => {
            const placeholder = 'My placeholder';
            elementReferences.column1.placeholder = placeholder;
            await table.setData([{}]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(placeholder);

            elementReferences.column1.placeholder = undefined;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
        });

        it('setting placeholder to defined string updates cells from displaying placeholder to displaying blank', async () => {
            await table.setData([{}]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('');

            const placeholder = 'placeholder';
            elementReferences.column1.placeholder = placeholder;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(placeholder);
        });

        it('updating placeholder from one string to another updates cell', async () => {
            const placeholder1 = 'My first placeholder';
            elementReferences.column1.placeholder = placeholder1;
            await table.setData([{}]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(placeholder1);

            const placeholder2 = 'My second placeholder';
            elementReferences.column1.placeholder = placeholder2;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(placeholder2);
        });
    });
});
