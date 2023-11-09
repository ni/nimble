import { FormattedNumber } from './formatted-number';

/**
 * Representation of a number formatted by an Intl.NumberFormatter
 */
export class IntlNumberFormatFormattedNumber extends FormattedNumber {
    public constructor(formattedParts: Intl.NumberFormatPart[]) {
        super(
            IntlNumberFormatFormattedNumber.parseFromParts(formattedParts),
            formattedParts.map(x => x.value).join('')
        );
    }

    private static parseFromParts(parts: Intl.NumberFormatPart[]): number {
        return parseFloat(
            parts
                .map(part => {
                    switch (part.type) {
                        case 'plusSign':
                        case 'minusSign':
                        case 'integer':
                        case 'fraction':
                        case 'exponentInteger':
                        case 'exponentMinusSign':
                        case 'exponentSeparator':
                        case 'nan':
                            return part.value;
                        case 'decimal':
                            return '.';
                        case 'infinity':
                            return 'Infinity';
                        case 'literal':
                        case 'group':
                        case 'percentSign':
                        case 'unit':
                        case 'compact':
                        case 'currency':
                        default:
                            return '';
                    }
                })
                .join('')
        );
    }
}
