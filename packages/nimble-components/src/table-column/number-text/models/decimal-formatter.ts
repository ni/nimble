import { NumberFormatter } from './number-formatter';
import type {
    UnitScaleFormatter,
    UnitScaleFormatterContructor
} from './unit-scale-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly formatter: UnitScaleFormatter;
    private readonly tenPowDecimalDigits: number;

    public constructor(
        locale: string,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        UnitScaleFormatterContructor: UnitScaleFormatterContructor,
        minimumFractionDigits: number,
        maximumFractionDigits: number
    ) {
        super();
        this.formatter = new UnitScaleFormatterContructor(locale, {
            maximumFractionDigits,
            minimumFractionDigits,
            useGrouping: true
        });
        this.tenPowDecimalDigits = 10 ** maximumFractionDigits;
    }

    protected format(number: number): string {
        const convertedNumber = this.formatter.getValueForBestUnit(number);
        // The NumberFormat option of `signDisplay: "negative"` is not supported in all browsers nimble supports.
        // Because that option cannot be used to avoid rendering "-0", coerce the value -0 to 0 prior to formatting.
        const valueToFormat = this.willRoundToZero(convertedNumber)
            ? 0
            : number;
        return this.formatter.formatValue(valueToFormat);
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to decimal-digits so that Math.round can be used to emulate rounding to
        // decimal-digits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
