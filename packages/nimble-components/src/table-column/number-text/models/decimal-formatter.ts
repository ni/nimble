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
        const formatted = this.formatter.formatValue(number);
        // The NumberFormat option of `signDisplay: "negative"` is not supported in all browsers nimble supports.
        // Because that option cannot be used to avoid rendering "-0", coerce the value -0 to 0 prior to formatting.
        return formatted.number === 0 && 1 / formatted.number === -Infinity
            ? this.formatter.formatValue(0)
            : formatted;
    }
}
