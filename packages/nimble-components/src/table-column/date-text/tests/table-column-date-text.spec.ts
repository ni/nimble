import { html } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnDateText, tableColumnDateTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { TableColumnDateTextPageObject } from '../testing/table-column-date-text.pageobject';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { lang, themeProviderTag } from '../../../theme-provider';

interface SimpleTableRecord extends TableRecord {
    field?: number | null;
    anotherField?: number | null;
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    const themeProvider = document.createElement(themeProviderTag);
    themeProvider.lang = 'en-US';
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnDateTextTag} field-name="field" group-index="0">
                    Column 1
                </${tableColumnDateTextTag}>
                <${tableColumnDateTextTag} field-name="anotherField">
                    Squeeze Column 1
                </${tableColumnDateTextTag}>
            </nimble-table>`,
        {
            parent: themeProvider
        }
    );
}

// prettier-ignore
async function setupWithConfig(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnDateTextTag} field-name="field" group-index="0"
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
                <${tableColumnDateTextTag} field-name="anotherField">
                    Squeeze Column 1
                </${tableColumnDateTextTag}>
            </nimble-table>`
    );
}

describe('TableColumnDateText', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let pageObject: TableColumnDateTextPageObject<SimpleTableRecord>;
    let column: TableColumnDateText;

    describe('no static config', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            tablePageObject = new TablePageObject<SimpleTableRecord>(element);
            pageObject = new TableColumnDateTextPageObject(tablePageObject);
            await connect();
            await waitForUpdatesAsync();
            column = element.columns[0] as TableColumnDateText;
        });

        afterEach(async () => {
            await disconnect();
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
                    name: 'value is MAX_VALUE',
                    data: [{ field: Number.MAX_VALUE }]
                },
                {
                    name: 'value is too large for Date',
                    data: [{ field: 8640000000000000 + 1 }]
                },
                {
                    name: 'value is too small for Date',
                    data: [{ field: -8640000000000000 - 1 }]
                },
                {
                    name: 'value is not a number',
                    data: [{ field: 'foo' as unknown as number }]
                }
            ];

            for (const entry of badValueData) {
                const focused: string[] = [];
                const disabled: string[] = [];
                const specType = getSpecTypeByNamedList(
                    entry,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(entry.name, async () => {
                    await element.setData(entry.data);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
                });
            }
        });

        it('changing fieldName updates display', async () => {
            await element.setData([
                {
                    field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf(),
                    anotherField: new Date('Jan 20, 2018, 4:05:45 AM').valueOf()
                }
            ]);
            await waitForUpdatesAsync();

            column.fieldName = 'anotherField';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                'Jan 20, 2018, 4:05:45 AM'
            );
        });

        it('changing data from value to null displays blank', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                'Dec 10, 2012, 10:35:05 PM'
            );

            const updatedValue = { field: null };
            const updatedData = [updatedValue];
            await element.setData(updatedData);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
        });

        it('changing data from null to value displays value', async () => {
            await element.setData([{ field: null }]);
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');

            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual(
                'Dec 10, 2012, 10:35:05 PM'
            );
        });

        it('when no fieldName provided, nothing is displayed', async () => {
            column.fieldName = undefined;
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toEqual('');
        });

        it('sets title when cell text is ellipsized', async () => {
            element.style.width = '200px';
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            tablePageObject.dispatchEventToCell(
                0,
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toEqual(
                'Dec 10, 2012, 10:35:05 PM'
            );
        });

        it('does not set title when cell text is fully visible', async () => {
            await element.setData([
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
            element.style.width = '200px';
            await element.setData([
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
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedGroupHeaderContent(0)).toBe(
                'Dec 10, 2012, 10:35:05 PM'
            );
        });

        it('updates displayed date when format changes', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('12/10/2012');
        });

        it('updates displayed date when lang token changes', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                'Dec 10, 2012, 10:35:05 PM'
            );
            lang.setValueFor(element, 'fr');
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                '10 déc. 2012, 22:35:05'
            );
        });

        it('honors customDateStyle property', async () => {
            await element.setData([
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
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customTimeStyle = 'medium';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10:35:05 PM');
        });

        it('honors customWeekday property', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customWeekday = 'long';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('Monday');
        });

        it('honors customDay property', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customDay = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10');
        });

        it('honors customMonth property', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customMonth = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('12');
        });

        it('honors customYear property', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('2012');
        });

        it('honors customEra property', async () => {
            await element.setData([
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
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customHour = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('10 PM');
        });

        it('honors customMinute property', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customMinute = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('35');
        });

        it('honors customSecond property', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customSecond = 'numeric';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('5');
        });

        it('honors customHour12 property', async () => {
            await element.setData([
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

        it('honors customHourCycle property', async () => {
            await element.setData([
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
            await element.setData([
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
            await element.setData([
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
            await element.setData([
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
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            column.customNumberingSystem = 'fullwide';
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('２０１２');
        });

        it('has no invalid flags on column when using default formatting', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            expect(column.validity.invalidCustomOptionsCombination).toBeFalse();
            expect(column.validity.invalidLangCode).toBeFalse();
        });

        it('sets invalidCustomOptionsCombination flag on column when custom options are incompatible', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            await waitForUpdatesAsync();
            column.format = 'custom';
            column.customYear = 'numeric';
            column.customDateStyle = 'full';
            await waitForUpdatesAsync();
            expect(column.validity.invalidCustomOptionsCombination).toBeTrue();
            expect(column.validity.invalidLangCode).toBeFalse();
        });

        it('clears invalidCustomOptionsCombination flag on column after fixing custom option incompatibility', async () => {
            await element.setData([
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

        it('sets invalidLangCode flag on column when lang code is malformed', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            lang.setValueFor(element, '');
            await waitForUpdatesAsync();
            expect(column.validity.invalidLangCode).toBeTrue();
            expect(column.validity.invalidCustomOptionsCombination).toBeFalse();
        });

        it('clears invalidLangCode flag on column after fixing lang code', async () => {
            await element.setData([
                { field: new Date('Dec 10, 2012, 10:35:05 PM').valueOf() }
            ]);
            lang.setValueFor(element, '');
            await waitForUpdatesAsync();
            lang.setValueFor(element, 'en');
            expect(column.validity.invalidLangCode).toBeFalse();
        });
    });

    describe('with static config', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithConfig());
            tablePageObject = new TablePageObject<SimpleTableRecord>(element);
            pageObject = new TableColumnDateTextPageObject(tablePageObject);
            await connect();
            await waitForUpdatesAsync();
            column = element.columns[0] as TableColumnDateText;
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
