/**
 * Formatting scheme for the date-text table column
 */
export const DateTextFormat = {
    default: undefined,
    custom: 'custom'
} as const;
export type DateTextFormat =
    (typeof DateTextFormat)[keyof typeof DateTextFormat];

export type LocaleMatcherAlgorithm =
    Intl.DateTimeFormatOptions['localeMatcher'];
export type WeekdayFormat = Intl.DateTimeFormatOptions['weekday'];
export type EraFormat = Intl.DateTimeFormatOptions['era'];
export type YearFormat = Intl.DateTimeFormatOptions['year'];
export type MonthFormat = Intl.DateTimeFormatOptions['month'];
export type DayFormat = Intl.DateTimeFormatOptions['day'];
export type HourFormat = Intl.DateTimeFormatOptions['hour'];
export type MinuteFormat = Intl.DateTimeFormatOptions['minute'];
export type SecondFormat = Intl.DateTimeFormatOptions['second'];
export type TimeZoneFormat = Intl.DateTimeFormatOptions['timeZoneName'];
export type FormatMatcherAlgorithm =
    Intl.DateTimeFormatOptions['formatMatcher'];
export type DayPeriodFormat = Intl.DateTimeFormatOptions['dayPeriod'];
export type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];
export type TimeStyle = Intl.DateTimeFormatOptions['timeStyle'];
export type HourCycle = Intl.DateTimeFormatOptions['hourCycle'];
