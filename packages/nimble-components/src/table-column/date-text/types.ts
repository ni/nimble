/**
 * Formatting scheme for the date-text table column
 */
export const DateTextFormat = {
    default: undefined,
    custom: 'custom'
} as const;
export type DateTextFormat =
    (typeof DateTextFormat)[keyof typeof DateTextFormat];

export const LocaleMatcherAlgorithm = {
    default: undefined,
    bestFit: 'best fit',
    lookup: 'lookup'
} as const;
export type LocaleMatcherAlgorithm =
    (typeof LocaleMatcherAlgorithm)[keyof typeof LocaleMatcherAlgorithm];

export const WeekdayFormat = {
    default: undefined,
    long: 'long',
    short: 'short',
    narrow: 'narrow'
} as const;
export type WeekdayFormat = (typeof WeekdayFormat)[keyof typeof WeekdayFormat];

export const EraFormat = {
    default: undefined,
    long: 'long',
    short: 'short',
    narrow: 'narrow'
} as const;
export type EraFormat = (typeof EraFormat)[keyof typeof EraFormat];

export const YearFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type YearFormat = (typeof YearFormat)[keyof typeof YearFormat];

export const MonthFormat = {
    default: undefined,
    long: 'long',
    short: 'short',
    narrow: 'narrow',
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type MonthFormat = (typeof MonthFormat)[keyof typeof MonthFormat];

export const DayFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type DayFormat = (typeof DayFormat)[keyof typeof DayFormat];

export const HourFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type HourFormat = (typeof HourFormat)[keyof typeof HourFormat];

export const MinuteFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type MinuteFormat = (typeof MinuteFormat)[keyof typeof MinuteFormat];

export const SecondFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type SecondFormat = (typeof SecondFormat)[keyof typeof SecondFormat];

export const TimeZoneNameFormat = {
    default: undefined,
    long: 'long',
    short: 'short',
    longOffset: 'longOffset',
    shortOffset: 'shortOffset',
    longGeneric: 'longGeneric',
    shortGeneric: 'shortGeneric'
} as const;
export type TimeZoneNameFormat =
    (typeof TimeZoneNameFormat)[keyof typeof TimeZoneNameFormat];

export const FormatMatcherAlgorithm = {
    default: undefined,
    bestFit: 'best fit',
    basic: 'basic'
} as const;
export type FormatMatcherAlgorithm =
    (typeof FormatMatcherAlgorithm)[keyof typeof FormatMatcherAlgorithm];

export const DayPeriodFormat = {
    default: undefined,
    long: 'long',
    short: 'short',
    narrow: 'narrow'
} as const;
export type DayPeriodFormat =
    (typeof DayPeriodFormat)[keyof typeof DayPeriodFormat];

export const DateStyle = {
    default: undefined,
    long: 'long',
    short: 'short',
    full: 'full',
    medium: 'medium'
} as const;
export type DateStyle = (typeof DateStyle)[keyof typeof DateStyle];

export const TimeStyle = {
    default: undefined,
    long: 'long',
    short: 'short',
    full: 'full',
    medium: 'medium'
} as const;
export type TimeStyle = (typeof TimeStyle)[keyof typeof TimeStyle];

export const HourCycleFormat = {
    default: undefined,
    h11: 'h11',
    h12: 'h12',
    h23: 'h23',
    h24: 'h24'
} as const;
export type HourCycleFormat =
    (typeof HourCycleFormat)[keyof typeof HourCycleFormat];
