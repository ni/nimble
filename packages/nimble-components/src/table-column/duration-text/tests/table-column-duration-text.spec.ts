import { html, ref } from '@microsoft/fast-element';
import { tableTag, type Table } from '../../../table';
import { TableColumnDurationText, tableColumnDurationTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { lang, themeProviderTag } from '../../../theme-provider';
import { parameterizeNamedList } from '../../../utilities/tests/parameterized';
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

    describe('displays blank when', () => {
        const badValueData = [
            { name: 'field not present', data: [{ unused: 'foo' }] },
            { name: 'value is null', data: [{ field: null }] },
            { name: 'value is undefined', data: [{ field: undefined }] },
            {
                name: 'value is Inf',
                data: [{ field: Number.POSITIVE_INFINITY }]
            },
            {
                name: 'value is -Inf',
                data: [{ field: Number.NEGATIVE_INFINITY }]
            },
            { name: 'value is NaN', data: [{ field: Number.NaN }] },
            {
                name: 'value is negative',
                data: [{ field: -1 }]
            },
            {
                name: 'value is not a number',
                data: [{ field: 'foo' as unknown as number }]
            }
        ];

        parameterizeNamedList(badValueData, (spec, name, value) => {
            spec(name, async () => {
                await table.setData(value.data);
                await waitForUpdatesAsync();

                expect(
                    tablePageObject.getRenderedCellTextContent(0, 0)
                ).toEqual('');
            });
        });
    });

    describe('displays expected duration', () => {
        const goodValueData = [
            {
                name: '0d 1h 1m 1s',
                data: [{ field: 3661000 }],
                expected: '1 hr, 1 min, 1 sec'
            },
            {
                name: '1d 0h 1m 1s',
                data: [{ field: 86461000 }],
                expected: '1 day, 1 min, 1 sec'
            },
            {
                name: '1d 1h 0m 1s',
                data: [{ field: 90001000 }],
                expected: '1 day, 1 hr, 1 sec'
            },
            {
                name: '1d 1h 1m 0s',
                data: [{ field: 90060000 }],
                expected: '1 day, 1 hr, 1 min'
            },
            {
                name: '1d 1h 1m 0.0005s',
                data: [{ field: 90060000.5 }],
                expected: '1 day, 1 hr, 1 min, 0.001 sec'
            },
            {
                name: '1d 1h 1m 0.00049s',
                data: [{ field: 90060000.49 }],
                expected: '1 day, 1 hr, 1 min'
            },
            { name: '0s', data: [{ field: 0 }], expected: '0 sec' },
            { name: '-0s', data: [{ field: -0 }], expected: '0 sec' },
            { name: '1.5s', data: [{ field: 1500 }], expected: '1.5 sec' },
            { name: '1.555s', data: [{ field: 1555 }], expected: '1.555 sec' },
            {
                name: '1.5556s',
                data: [{ field: 1555.6 }],
                expected: '1.556 sec'
            },
            {
                name: '1.5554s',
                data: [{ field: 1555.4 }],
                expected: '1.555 sec'
            },
            {
                name: '59999.9999999999997s',
                data: [{ field: 59999.9999999999997 }],
                expected: '1 min'
            },
            {
                name: '101 days',
                data: [{ field: 8726500000 }],
                expected: '8.727E6 sec'
            },
            { name: '1ms', data: [{ field: 1 }], expected: '0.001 sec' },
            { name: '0.99ms', data: [{ field: 0.99 }], expected: '9.9E-4 sec' },
            {
                name: 'MIN_VALUE',
                data: [{ field: Number.MIN_VALUE }],
                expected: '0 sec'
            },
            {
                name: 'MIN_VALUE * 1000',
                data: [{ field: Number.MIN_VALUE * 1000 }],
                expected: '5E-324 sec'
            },
            {
                name: 'MAX_VALUE',
                data: [{ field: Number.MAX_VALUE }],
                expected: '1.798E305 sec'
            }
        ];

        parameterizeNamedList(goodValueData, (spec, name, value) => {
            spec(name, async () => {
                await table.setData(value.data);
                await waitForUpdatesAsync();

                expect(
                    tablePageObject.getRenderedCellTextContent(0, 0)
                ).toEqual(value.expected);
            });
        });
    });

    it('changing fieldName updates display', async () => {
        await table.setData([
            {
                field: 2,
                anotherField: 1
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
        await table.setData([{ field: 2 }]);
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

        await table.setData([{ field: 2 }]);
        await waitForUpdatesAsync();

        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual(
            '2 sec'
        );
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        column.fieldName = undefined;
        await table.setData([{ field: 2 }]);
        await waitForUpdatesAsync();

        expect(tablePageObject.getRenderedCellTextContent(0, 0)).toEqual('');
    });

    it('sets title when cell text is ellipsized', async () => {
        table.style.width = '100px';
        await table.setData([{ field: 8607022 }]);
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(tablePageObject.getCellTitle(0, 0)).toEqual(
            '99 days, 14 hr, 50 min, 22 sec'
        );
    });

    it('does not set title when cell text is fully visible', async () => {
        await table.setData([{ field: 8607022 }]);
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(tablePageObject.getCellTitle(0, 0)).toEqual('');
    });

    it('removes title on mouseout of cell', async () => {
        table.style.width = '200px';
        await table.setData([{ field: 8607022 }]);
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        tablePageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(tablePageObject.getCellTitle(0, 0)).toEqual('');
    });

    it('sets group header text to rendered date value', async () => {
        await table.setData([{ field: 8607022 }]);
        await waitForUpdatesAsync();
        expect(tablePageObject.getRenderedGroupHeaderTextContent(0)).toBe(
            '99 days, 14 hr, 50 min, 22 sec'
        );
    });

    it('updates displayed date when lang token changes', async () => {
        await table.setData([{ field: 8607022 }]);
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
