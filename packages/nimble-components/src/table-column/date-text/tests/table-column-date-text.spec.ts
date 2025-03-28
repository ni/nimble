import { html, ref } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '../../../table';
import { TableColumnDateText, tableColumnDateTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { TableColumnDateTextPageObject } from '../testing/table-column-date-text.pageobject';
import { lang, themeProviderTag } from '../../../theme-provider';
import { DateTextFormat } from '../types';

interface SimpleTableRecord extends TableRecord {
    field?: number | null;
    anotherField?: number | null;
}

class ElementReferences {
    public table!: Table;
    public column1!: TableColumnDateText;
}

describe('TableColumnDateText', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let pageObject: TableColumnDateTextPageObject<SimpleTableRecord>;
    let column: TableColumnDateText;

    // prettier-ignore
    async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
        return await fixture<Table<SimpleTableRecord>>(
            html`<${themeProviderTag} lang="en-US">
                    <${tableTag} ${ref('table')} style="width: 700px">
                        <${tableColumnDateTextTag} ${ref('column1')} field-name="field" group-index="0">
                            Column 1
                        </${tableColumnDateTextTag}>
                        <${tableColumnDateTextTag} field-name="anotherField">
                            Squeeze Column 1
                        </${tableColumnDateTextTag}>
                    </${tableTag}>
                </${themeProviderTag}>`,
            { source }
        );
    }

    describe('no static config', () => {
        beforeEach(async () => {
            elementReferences = new ElementReferences();
            ({ connect, disconnect } = await setup(elementReferences));
            table = elementReferences.table;
            tablePageObject = new TablePageObject<SimpleTableRecord>(table);
            pageObject = new TableColumnDateTextPageObject(tablePageObject);
            await connect();
            await waitForUpdatesAsync();
            column = elementReferences.column1;
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(
                document.createElement(tableColumnDateTextTag)
            ).toBeInstanceOf(TableColumnDateText);
        });

        it('reports column configuration valid', () => {
            expect(column.checkValidity()).toBeTrue();
        });

        it('changing fieldName updates display', async () => {
            const fieldValue = new Date('Dec 10, 2012, 10:35:05 PM').valueOf();
            const anotherFieldValue = new Date(
                'Jan 20, 2018, 4:05:45 AM'
            ).valueOf();
            await table.setData([
                {
                    field: fieldValue,
                    anotherField: anotherFieldValue
                }
            ]);
            await waitForUpdatesAsync();

            column.fieldName = 'anotherField';
            await waitForUpdatesAsync();

            const expectedFormattedValue = pageObject.getDefaultFormattedCellText(
                anotherFieldValue,
                'en-US'
            );
            expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                expectedFormattedValue
            );
        });

        it('changing data from value to null displays blank', async () => {
            const fieldValue = new Date('Dec 10, 2012, 10:35:05 PM').valueOf();
            await table.setData([{ field: fieldValue }]);
            await waitForUpdatesAsync();
            const expectedFormattedValue = pageObject.getDefaultFormattedCellText(fieldValue, 'en-US');
            expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                expectedFormattedValue
            );

            const updatedValue = { field: null };
            const updatedData = [updatedValue];
            await table.setData(updatedData);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
        });

        it('changing data from null to value displays value', async () => {
            await table.setData([{ field: null }]);
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');

            const fieldValue = new Date('Dec 10, 2012, 10:35:05 PM').valueOf();
            await table.setData([{ field: fieldValue }]);
            await waitForUpdatesAsync();

            const expectedFormattedValue = pageObject.getDefaultFormattedCellText(fieldValue, 'en-US');
            expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                expectedFormattedValue
            );
        });

        it('when no fieldName provided, nothing is displayed', async () => {
            column.fieldName = undefined;
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
        });

        it('sets title when cell text is ellipsized', async () => {
            table.style.width = '200px';
            const fieldValue = new Date('Dec 10, 2012, 10:35:05 PM').valueOf();
            await table.setData([{ field: fieldValue }]);
            await waitForUpdatesAsync();
            tablePageObject.dispatchEventToCell(
                0,
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            const expectedFormattedValue = pageObject.getDefaultFormattedCellText(fieldValue, 'en-US');
            expect(pageObject.getCellTitle(0, 0)).toEqual(
                expectedFormattedValue
            );
        });

        it('does not set title when cell text is fully visible', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            tablePageObject.dispatchEventToCell(
                0,
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toEqual('');
        });

        it('removes title on mouseout of cell', async () => {
            table.style.width = '200px';
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            tablePageObject.dispatchEventToCell(
                0,
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            tablePageObject.dispatchEventToCell(
                0,
                0,
                new MouseEvent('mouseout')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toEqual('');
        });

        it('sets group header text to rendered date value', async () => {
            const fieldValue = new Date('Dec 10, 2012, 10:35:05 PM').valueOf();
            await table.setData([{ field: fieldValue }]);
            await waitForUpdatesAsync();
            const expectedFormattedValue = pageObject.getDefaultFormattedCellText(fieldValue, 'en-US');
            expect(pageObject.getRenderedGroupHeaderContent(0)).toBe(
                expectedFormattedValue
            );
        });

        it('updates displayed date when format changes', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('12/10/2012');
        });

        it('updates displayed date when lang token changes', async () => {
            const fieldValue = new Date('Dec 10, 2012, 10:35:05 PM').valueOf();
            await table.setData([{ field: fieldValue }]);
            await waitForUpdatesAsync();
            const expectedEnglishFormattedValue = pageObject.getDefaultFormattedCellText(fieldValue, 'en-US');
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                expectedEnglishFormattedValue
            );
            lang.setValueFor(table, 'fr');
            await waitForUpdatesAsync();
            const expectedFrenchFormattedValue = pageObject.getDefaultFormattedCellText(fieldValue, 'fr');
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                expectedFrenchFormattedValue
            );
        });

        it('honors customDateStyle property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customDateStyle = 'long';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                'December 10, 2012'
            );
        });

        it('honors customTimeStyle property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customTimeStyle = 'medium';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10:35:05 PM');
        });

        it('honors customWeekday property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customWeekday = 'long';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('Monday');
        });

        it('honors customDay property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customDay = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10');
        });

        it('honors customMonth property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customMonth = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('12');
        });

        it('honors customYear property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('2012');
        });

        it('honors customEra property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customEra = 'short';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                '12/10/2012 AD'
            );
        });

        it('honors customHour property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customHour = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10 PM');
        });

        it('honors customMinute property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customMinute = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('35');
        });

        it('honors customSecond property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customSecond = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('5');
        });

        it('honors customHour12 property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customHour = 'numeric'; // must specify hour
            column.customHourCycle = 'h24'; // must force 24hr clock to override with hour12
            column.customHour12 = true;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10 PM');
        });

        it('honors setting customHour12 property to undefined', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customHour = 'numeric'; // must specify hour
            column.customHourCycle = 'h24'; // must force 24hr clock to ensure not overridden by hour12
            column.customHour12 = true; // first set it to true so that we're actually changing the value (affects view)
            column.customHour12 = undefined;
            expect(column.customHour12).toBeUndefined();
            await waitForUpdatesAsync();
            expect(column.outerHTML).toMatch(
                /<nimble-table-column-date-text((?!custom-hour12).)*>/
            );
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('22');
        });

        it('honors customHourCycle property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customHour = 'numeric'; // must specify hour
            column.customHourCycle = 'h24';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('22');
        });

        it('honors customTimeZone and customTimeZoneName properties', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM UTC').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customTimeZone = 'UTC';
            column.customTimeZoneName = 'short';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                '12/10/2012, UTC'
            );
        });

        it('honors customDayPeriod property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customHour = 'numeric'; // must specify hour
            column.customDayPeriod = 'narrow';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10 at night');
        });

        it('honors customCalendar property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customDay = 'numeric';
            column.customMonth = 'short';
            column.customYear = 'numeric';
            column.customCalendar = 'hebrew';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                '26 Kislev 5773'
            );
        });

        it('honors customNumberingSystem property', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            column.customNumberingSystem = 'fullwide';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('２０１２');
        });

        it('has no invalid flag on column when using default formatting', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            expect(column.validity.invalidCustomOptionsCombination).toBeFalse();
        });

        it('sets invalidCustomOptionsCombination flag on column when custom options are incompatible', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            column.customDateStyle = 'full';
            await waitForUpdatesAsync();
            expect(column.validity.invalidCustomOptionsCombination).toBeTrue();
        });

        it('clears invalidCustomOptionsCombination flag on column after fixing custom option incompatibility', async () => {
            await table.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            column.customDateStyle = 'full';
            await waitForUpdatesAsync();
            column.customDateStyle = undefined;
            await waitForUpdatesAsync();
            expect(column.validity.invalidCustomOptionsCombination).toBeFalse();
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
                    data: [{ field: 1708984169258 }],
                    cellValue: '2/26/2024',
                    groupValue: '2/26/2024',
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
                    cellValue: '1/1/1970',
                    groupValue: '1/1/1970',
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
                    name: 'value is -Inf',
                    data: [{ field: Number.NEGATIVE_INFINITY }],
                    cellValue: '',
                    groupValue: '',
                    usesColumnPlaceholder: false
                },
                {
                    name: 'value is MAX_VALUE',
                    data: [{ field: Number.MAX_VALUE }],
                    cellValue: '',
                    groupValue: '',
                    usesColumnPlaceholder: false
                },
                {
                    name: 'value is too large for Date',
                    data: [{ field: 8640000000000000 + 1 }],
                    cellValue: '',
                    groupValue: '',
                    usesColumnPlaceholder: false
                },
                {
                    name: 'value is too small for Date',
                    data: [{ field: -8640000000000000 - 1 }],
                    cellValue: '',
                    groupValue: '',
                    usesColumnPlaceholder: false
                }
            ] as const;

            async function initializeColumnAndTable(
                data: readonly SimpleTableRecord[],
                placeholder?: string
            ): Promise<void> {
                // Set a custom time zone so that the behavior of the test does not
                // depend on the configuration of the computer running the tests.
                column.format = DateTextFormat.custom;
                column.customTimeZone = 'UTC';
                column.placeholder = placeholder;
                await table.setData(data);
                await connect();
                await waitForUpdatesAsync();
            }

            parameterizeSpec(testCases, (spec, name, value) => {
                spec(
                    `cell and group row render expected value when ${name} and placeholder is configured`,
                    async () => {
                        const placeholder = 'Custom placeholder';
                        await initializeColumnAndTable(value.data, placeholder);

                        const expectedCellText = value.usesColumnPlaceholder
                            ? placeholder
                            : value.cellValue;
                        expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                            expectedCellText
                        );
                        expect(
                            pageObject.getRenderedGroupHeaderContent(0)
                        ).toBe(value.groupValue);
                    }
                );
            });

            parameterizeSpec(testCases, (spec, name, value) => {
                spec(
                    `cell and group row render expected value when ${name} and placeholder is not configured`,
                    async () => {
                        await initializeColumnAndTable(value.data);

                        expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                            value.cellValue
                        );
                        expect(
                            pageObject.getRenderedGroupHeaderContent(0)
                        ).toBe(value.groupValue);
                    }
                );
            });

            it('setting placeholder to undefined updates cells from displaying placeholder to displaying blank', async () => {
                const placeholder = 'My placeholder';
                await initializeColumnAndTable([{}], placeholder);
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    placeholder
                );

                column.placeholder = undefined;
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
            });

            it('setting placeholder to defined string updates cells from displaying blank to displaying placeholder', async () => {
                await initializeColumnAndTable([{}]);
                expect(pageObject.getRenderedCellContent(0, 0)).toBe('');

                const placeholder = 'placeholder';
                column.placeholder = placeholder;
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    placeholder
                );
            });

            it('updating placeholder from one string to another updates cell', async () => {
                const placeholder1 = 'My first placeholder';
                await initializeColumnAndTable([{}], placeholder1);
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    placeholder1
                );

                const placeholder2 = 'My second placeholder';
                column.placeholder = placeholder2;
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    placeholder2
                );
            });

            it('can configure empty placeholder', async () => {
                const placeholder = '';
                await initializeColumnAndTable([{}], placeholder);
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    placeholder
                );
            });
        });
    });

    describe('with static config', () => {
        // prettier-ignore
        async function setupWithConfig(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
            return await fixture<Table<SimpleTableRecord>>(
                html`<${tableTag} ${ref('table')} style="width: 700px">
                        <${tableColumnDateTextTag} ${ref('column1')} field-name="field" group-index="0"
                            format="custom"
                            custom-locale-matcher="lookup"
                            custom-weekday="short"
                            custom-era="short"
                            custom-year="2-digit"
                            custom-month="short"
                            custom-day="2-digit"
                            custom-hour="2-digit"
                            custom-minute="2-digit"
                            custom-second="2-digit"
                            custom-time-zone-name="longOffset"
                            custom-format-matcher="basic"
                            custom-hour12="false"
                            custom-time-zone="America/Chicago"
                            custom-calendar="hebrew"
                            custom-day-period="short"
                            custom-numbering-system="fullwide"
                            custom-date-style="long"
                            custom-time-style="long"
                            custom-hour-cycle="h23"
                        >
                            Column 1
                        </${tableColumnDateTextTag}>
                    </${tableTag}>`,
                { source }
            );
        }

        beforeEach(async () => {
            elementReferences = new ElementReferences();
            ({ connect, disconnect } = await setupWithConfig(elementReferences));
            table = elementReferences.table;
            tablePageObject = new TablePageObject<SimpleTableRecord>(table);
            pageObject = new TableColumnDateTextPageObject(tablePageObject);
            await connect();
            await waitForUpdatesAsync();
            column = elementReferences.column1;
        });

        afterEach(async () => {
            await disconnect();
        });

        it('honors format attribute', () => {
            expect(column.format).toBe('custom');
        });

        it('honors custom-date-style attribute', () => {
            expect(column.customDateStyle).toBe('long');
        });

        it('honors custom-time-style attribute', () => {
            expect(column.customTimeStyle).toBe('long');
        });

        it('honors custom-weekday attribute', () => {
            expect(column.customWeekday).toBe('short');
        });

        it('honors custom-day attribute', () => {
            expect(column.customDay).toBe('2-digit');
        });

        it('honors custom-month attribute', () => {
            expect(column.customMonth).toBe('short');
        });

        it('honors custom-year attribute', () => {
            expect(column.customYear).toBe('2-digit');
        });

        it('honors custom-era attribute', () => {
            expect(column.customEra).toBe('short');
        });

        it('honors custom-hour attribute', () => {
            expect(column.customHour).toBe('2-digit');
        });

        it('honors custom-minute attribute', () => {
            expect(column.customMinute).toBe('2-digit');
        });

        it('honors custom-second attribute', () => {
            expect(column.customSecond).toBe('2-digit');
        });

        it('honors custom-hour12 attribute', () => {
            expect(column.customHour12).toBeFalse();
        });

        it('honors custom-hour-cycle attribute', () => {
            expect(column.customHourCycle).toBe('h23');
        });

        it('honors custom-time-zone property', () => {
            expect(column.customTimeZone).toBe('America/Chicago');
        });

        it('honors custom-time-zone-name property', () => {
            expect(column.customTimeZoneName).toBe('longOffset');
        });

        it('honors custom-day-period attribute', () => {
            expect(column.customDayPeriod).toBe('short');
        });

        it('honors custom-calendar attribute', () => {
            expect(column.customCalendar).toBe('hebrew');
        });

        it('honors custom-numbering-system attribute', () => {
            expect(column.customNumberingSystem).toBe('fullwide');
        });

        it('honors custom-format-matcher attribute', () => {
            expect(column.customFormatMatcher).toBe('basic');
        });

        it('honors custom-locale-matcher attribute', () => {
            expect(column.customLocaleMatcher).toBe('lookup');
        });
    });
});
