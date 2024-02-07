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
    } else if (typeof date === 'string') {
        return date;
    } else {
        return '';
    }
}
