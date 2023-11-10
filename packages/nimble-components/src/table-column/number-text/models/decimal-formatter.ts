import type { FormattedNumber } from './formatted-number';
import { NumberFormatter } from './number-formatter';
import type {
    UnitScaleFormatter,
    UnitScaleFormatterConstructor
} from './unit-scale-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly formatter: UnitScaleFormatter;

    public constructor(
        locale: string,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        UnitScaleFormatterConstructor: UnitScaleFormatterConstructor,
        minimumFractionDigits: number,
        maximumFractionDigits: number
    ) {
        super();
        this.formatter = new UnitScaleFormatterConstructor(locale, {
            maximumFractionDigits,
            minimumFractionDigits,
            useGrouping: true
        });
    }

    protected format(number: number): FormattedNumber {
        return this.formatter.formatValue(number);
    }
}
