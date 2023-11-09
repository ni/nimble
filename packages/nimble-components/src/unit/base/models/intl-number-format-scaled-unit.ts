import type { FormattedNumber } from '../../../table-column/number-text/models/formatted-number';
import { IntlNumberFormatFormattedNumber } from '../../../table-column/number-text/models/intl-number-format-formatted-number';
import { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';

/**
 * A scaled unit that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnit extends ScaledUnit {
    public constructor(
        scaleFactor: number,
        private readonly formatter: Intl.NumberFormat
    ) {
        super(scaleFactor);
    }

    public format(value: number): FormattedNumber {
        return new IntlNumberFormatFormattedNumber(this.formatter, value);
    }
}
