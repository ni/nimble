import type { TableColumnNumberTextColumnConfig } from '..';
import type { TableNumberFieldValue } from '../../../table/types';

export function formatNumber(
    number: TableNumberFieldValue,
    columnConfig: TableColumnNumberTextColumnConfig
): string {
    if (typeof number === 'number') {
        try {
            if (columnConfig.useDefaultFormatting) {
                return formatNumberDefault(
                    number,
                    columnConfig.formatter!,
                    columnConfig.defaultScientificFormatter!
                );
            }
            return columnConfig.formatter!.format(number);
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
}

function formatNumberDefault(
    number: number,
    formatter: Intl.NumberFormat,
    scientificFormatter: Intl.NumberFormat
): string {
    const absoluteValue = Math.abs(number);
    if (absoluteValue > 0 && (absoluteValue < 1e-6 || absoluteValue >= 1e16)) {
        // Intl.NumberFormat formats numbers like '1.23E4' and '1.23E-4' for scientific. We want the output to be closer
        // to Number.toString(), i.e. lowercase 'e' and including the exponent + sign ('1.23e+4' and '1.23e-4').
        const exponentSeparator = number > 1 ? 'e+' : 'e';
        return scientificFormatter
            .formatToParts(number)
            .map(s => (s.type === 'exponentSeparator' ? exponentSeparator : s.value))
            .join('');
    }
    return formatter.format(number);
}
