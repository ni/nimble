import type { TableColumnNumberTextColumnConfig } from '..';
import type { TableNumberFieldValue } from '../../../table/types';

export function formatNumber(
    number: TableNumberFieldValue,
    columnConfig: TableColumnNumberTextColumnConfig
): string {
    if (typeof number === 'number') {
        try {
            return columnConfig.scientificFormatter && shouldUseScientificFormatter(number)
                ? columnConfig.scientificFormatter.format(number)
                : columnConfig.formatter.format(number);
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
}

function shouldUseScientificFormatter(number: number): boolean {
    const absoluteValue = Math.abs(number);
    return absoluteValue > 0 && (absoluteValue < 1e-6 || absoluteValue >= 1e6);
}
