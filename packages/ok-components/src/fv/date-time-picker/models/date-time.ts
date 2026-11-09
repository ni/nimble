import {
    maskitoParseTime,
    maskitoStringifyTime,
    maskitoWithDateDefaults,
    maskitoWithTimeDefaults,
    type MaskitoTimeMode
} from '@maskito/kit';
import type { FvDateTimePickerType } from '../types';

/** Calendar arithmetic uses UTC as a timezone-free container, not as an instant. */
export function calendarDate(year: number, month: number, day: number): Date {
    const date = new Date(0);
    date.setUTCFullYear(year, month, day);
    return date;
}

export function today(): Date {
    const date = new Date();
    return calendarDate(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dateKey(date: Date): string {
    return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function parseValue(value: string, type: FvDateTimePickerType): Date | null {
    const pattern = type === 'date'
        ? /^\d{4}-\d{2}-\d{2}$/
        : /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/;
    if (!pattern.test(value)) {
        return null;
    }
    const date = new Date(type === 'date' ? `${value}T00:00:00Z` : `${value}Z`);
    return !Number.isNaN(date.getTime()) && date.getUTCFullYear() >= 1 && dateKey(date) === value.slice(0, 10)
        ? date : null;
}

export function formatValue(date: Date, type: FvDateTimePickerType): string {
    return type === 'date' ? dateKey(date) : date.toISOString().slice(0, -1).replace(/\.?0+$/, '').replace(/:00$/, '');
}

export function parseIsoPaste(text: string, type: FvDateTimePickerType): Date | null {
    const match = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/.exec(text.trim());
    if (!match) {
        return null;
    }
    const [, dateText, timeText, offset] = match;
    const date = parseValue(`${dateText}T${timeText ?? '00:00'}`, 'datetime-local');
    if (!date) {
        return null;
    }
    if (offset) {
        const instant = new Date(`${dateText}T${timeText}${offset}`);
        date.setUTCFullYear(instant.getFullYear(), instant.getMonth(), instant.getDate());
        date.setUTCHours(instant.getHours(), instant.getMinutes(), instant.getSeconds(), instant.getMilliseconds());
    }
    return date.getUTCFullYear() >= 1 && date.getUTCFullYear() <= 9999
        ? parseValue(formatValue(date, type), type) : null;
}

export function dateFormat(locale: string): ReturnType<typeof maskitoWithDateDefaults> {
    return maskitoWithDateDefaults({ locale });
}

export function timeFormat(locale: string, mode: MaskitoTimeMode): ReturnType<typeof maskitoWithTimeDefaults> {
    return maskitoWithTimeDefaults({ locale, mode, step: 0 });
}

export function formatTime(date: Date, locale: string, mode: MaskitoTimeMode): string {
    const milliseconds = date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000
        + date.getUTCSeconds() * 1000 + date.getUTCMilliseconds();
    return maskitoStringifyTime(milliseconds, timeFormat(locale, mode));
}

export function formatDisplay(date: Date, type: FvDateTimePickerType, locale: string, mode: MaskitoTimeMode): string {
    const { mode: dateMode, separator } = dateFormat(locale);
    const segments: { [key: string]: string } = {
        yyyy: String(date.getUTCFullYear()).padStart(4, '0'),
        mm: String(date.getUTCMonth() + 1).padStart(2, '0'),
        dd: String(date.getUTCDate()).padStart(2, '0')
    };
    const dateText = dateMode.split('/').map(segment => segments[segment]).join(separator);
    return type === 'date' ? dateText : `${dateText} ${formatTime(date, locale, mode)}`;
}

const normalize = (text: string): string => text.replace(/\s/g, ' ').toLocaleLowerCase();

export function parseDisplay(text: string, type: FvDateTimePickerType, locale: string, mode: MaskitoTimeMode, complete = false): string {
    if (complete && type === 'datetime-local') {
        const { dayPeriod } = timeFormat(locale, mode);
        const candidates = [
            text,
            ...(dayPeriod[0] ? [`${text.trimEnd()} ${dayPeriod[0]}`] : []),
            `${text.trimEnd()} ${formatTime(calendarDate(1970, 0, 1), locale, mode)}`
        ];
        for (const candidate of candidates) {
            const value = parseDisplay(candidate, type, locale, mode);
            if (value) {
                return value;
            }
        }
        return '';
    }
    const { mode: dateMode, separator } = dateFormat(locale);
    const length = dateMode.split('/').join(separator).length;
    const segments = text.slice(0, length).split(separator);
    const keys = dateMode.split('/');
    const year = segments[keys.indexOf('yyyy')];
    const month = segments[keys.indexOf('mm')];
    const day = segments[keys.indexOf('dd')];
    const value = `${year}-${month}-${day}`;
    const date = parseValue(value, 'date');
    if (!date) {
        return '';
    }
    if (type !== 'date') {
        const time = text.slice(length + 1);
        const milliseconds = maskitoParseTime(time, timeFormat(locale, mode));
        if (!Number.isFinite(milliseconds)) {
            return '';
        }
        date.setUTCMilliseconds(milliseconds);
    }
    return normalize(formatDisplay(date, type, locale, mode)) === normalize(text) ? formatValue(date, type) : '';
}
