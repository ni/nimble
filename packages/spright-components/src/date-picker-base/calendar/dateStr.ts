/* eslint-disable import/no-extraneous-dependencies */
import { formatISO } from 'date-fns';

/// Date format: YYYY-MM-DD
export type DateStr = string;

export const formatDateStr = (date: Date): DateStr => formatISO(date, { representation: 'date' });

export const currentDateStr = (now = new Date()): DateStr => formatDateStr(now);

export const parseDateStr = (dateStr: DateStr): Date => {
    const [year, month, day] = dateStr.split('-');
    return new Date(parseInt(year!, 10), parseInt(month!, 10) - 1, parseInt(day!, 10));
};

export const addDays = (dateStr: DateStr, days: number): DateStr => {
    const date = parseDateStr(dateStr);
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + days);
    return formatDateStr(resultDate);
};

export const compareDateStr = (a: DateStr, b: DateStr): number => {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};

const hasThreeComponents = (
    components: string[]
): components is [string, string, string] => components.length === 3;

const allComponentsAreNumbers = (components: string[]): boolean => components.every(component => /^\d+$/.test(component));

const isValidDate = ([yearStr, monthStr, dayStr]: [string, string, string]): boolean => {
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);
    const date = new Date(year, month, day);
    return (
        date.getFullYear() === year
        && date.getMonth() === month
        && date.getDate() === day
    );
};

export const isValidDateStr = (string: string): boolean => {
    const components = string.split('-');

    return (
        hasThreeComponents(components)
        && allComponentsAreNumbers(components)
        && isValidDate(components)
    );
};
