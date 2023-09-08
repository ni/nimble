import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly formatter: Intl.NumberFormat;
    private readonly tenPowDecimalDigits: number;

    public constructor(decimalsToDisplay: number) {
        super();
        this.formatter = new Intl.NumberFormat(undefined, {
            maximumFractionDigits: decimalsToDisplay,
            minimumFractionDigits: decimalsToDisplay,
            useGrouping: true
        });
        this.tenPowDecimalDigits = 10 ** decimalsToDisplay;
    }

    protected format(number: number): string {
        // The NumberFormat option of `signDisplay: "negative"` is not supported in all browsers nimble supports.
        // Because that option cannot be used to avoid rendering "-0", coerce the value -0 to 0 prior to formatting.
        const valueToFormat = this.willRoundToZero(number) ? 0 : number;
        return this.formatter.format(valueToFormat);
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to decimal-digits so that Math.round can be used to emulate rounding to
        // decimal-digits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
