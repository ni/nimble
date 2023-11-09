import type { FormattedNumber } from './formatted-number';
import { IntlNumberFormatFormattedNumber } from './intl-number-format-formatted-number';
import { ScaledUnit } from './scaled-unit';

/**
 * A degenerate scaled unit that is used only by EmptyScaledUnitFormatter
 */
export class EmptyScaledUnit extends ScaledUnit {
    public constructor(private readonly formatter: Intl.NumberFormat) {
        super(1);
    }

    public format(value: number): FormattedNumber {
        return new IntlNumberFormatFormattedNumber(this.formatter, value);
    }
}
