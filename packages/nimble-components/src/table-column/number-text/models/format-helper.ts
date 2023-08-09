import type { TableColumnNumberTextColumnConfig } from '..';
import type { TableNumberFieldValue } from '../../../table/types';
import {
    defaultExponentialLowerBound,
    defaultExponentialUpperBound
} from '../types';

export function formatNumber(
    number: TableNumberFieldValue,
    columnConfig: TableColumnNumberTextColumnConfig
): string {
    if (typeof number === 'number') {
        try {
            return columnConfig.exponentialFormatter
                && shouldUseExponentialFormatter(number)
                ? columnConfig.exponentialFormatter.format(number)
                : columnConfig.formatter.format(number);
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
}

function shouldUseExponentialFormatter(number: number): boolean {
    const absoluteValue = Math.abs(number);
    return (
        absoluteValue > 0
        && (absoluteValue < defaultExponentialLowerBound
            || absoluteValue >= defaultExponentialUpperBound)
    );
}
