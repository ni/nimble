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

export const SimpleNumberFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit'
} as const;
export type SimpleNumberFormat =
    (typeof SimpleNumberFormat)[keyof typeof SimpleNumberFormat];

export const MonthFormat = {
    default: undefined,
    numeric: 'numeric',
    twoDigit: '2-digit',
    long: 'long',
    short: 'short',
    narrow: 'narrow'
} as const;
export type MonthFormat = (typeof MonthFormat)[keyof typeof MonthFormat];

export const TimeZoneFormat = {
    default: undefined,
    short: 'short',
    long: 'long',
    shortOffset: 'shortOffset',
    longOffset: 'longOffset',
    shortGeneric: 'shortGeneric',
    longGeneric: 'longGeneric'
} as const;
export type TimeZoneFormat =
    (typeof TimeZoneFormat)[keyof typeof TimeZoneFormat];

export const FormatMatcherAlgorithm = {
    default: undefined,
    bestFit: 'best fit',
    basic: 'basic'
} as const;
export type FormatMatcherAlgorithm =
    (typeof FormatMatcherAlgorithm)[keyof typeof FormatMatcherAlgorithm];

export const DayPeriodFormat = {
    default: undefined,
    narrow: 'narrow',
    short: 'short',
    long: 'long'
} as const;
export type DayPeriodFormat =
    (typeof DayPeriodFormat)[keyof typeof DayPeriodFormat];

export const DateStyle = {
    default: undefined,
    full: 'full',
    long: 'long',
    medium: 'medium',
    short: 'short'
} as const;
export type DateStyle = (typeof DateStyle)[keyof typeof DateStyle];

export const TimeStyle = {
    default: undefined,
    full: 'full',
    long: 'long',
    medium: 'medium',
    short: 'short'
} as const;
export type TimeStyle = (typeof TimeStyle)[keyof typeof TimeStyle];

export const HourCycle = {
    default: undefined,
    h11: 'h11',
    h12: 'h12',
    h23: 'h23',
    h24: 'h24'
} as const;
export type HourCycle = (typeof HourCycle)[keyof typeof HourCycle];
