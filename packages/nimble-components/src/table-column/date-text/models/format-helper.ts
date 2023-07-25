import type { TableColumnDateTextColumnConfig } from '..';
import type { TableNumberFieldValue } from '../../../table/types';

export function formatNumericDate(
    formatter: Intl.DateTimeFormat,
    date: TableNumberFieldValue
): string {
    if (typeof date === 'number') {
        try {
            return formatter.format(date);
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
}

export function createFormatter(
    columnConfig?: TableColumnDateTextColumnConfig
): Intl.DateTimeFormat | undefined {
    let options: Intl.DateTimeFormatOptions;
    if (!columnConfig?.format) {
        options = {
            dateStyle: 'medium',
            timeStyle: 'medium'
        };
    } else {
        options = getCustomFormattingOptions(columnConfig);
    }
    try {
        return new Intl.DateTimeFormat(undefined, options);
    } catch (e) {
        return undefined;
    }
}

function getCustomFormattingOptions(
    columnConfig: TableColumnDateTextColumnConfig
): Intl.DateTimeFormatOptions {
    const options: Intl.DateTimeFormatOptions = {
        localeMatcher: columnConfig.customLocaleMatcher,
        weekday: columnConfig.customWeekday,
        era: columnConfig.customEra,
        year: columnConfig.customYear,
        month: columnConfig.customMonth,
        day: columnConfig.customDay,
        hour: columnConfig.customHour,
        minute: columnConfig.customMinute,
        second: columnConfig.customSecond,
        timeZoneName: columnConfig.customTimeZoneName,
        formatMatcher: columnConfig.customFormatMatcher,
        hour12: columnConfig.customHour12,
        timeZone: columnConfig.customTimeZone,
        calendar: columnConfig.customCalendar,
        dayPeriod: columnConfig.customDayPeriod,
        numberingSystem: columnConfig.customNumberingSystem,
        dateStyle: columnConfig.customDateStyle,
        timeStyle: columnConfig.customTimeStyle,
        hourCycle: columnConfig.customHourCycle
    };
    return options;
}
