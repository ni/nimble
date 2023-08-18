import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly formatter: Intl.NumberFormat;
    // private static readonly formatter = new Intl.NumberFormat(undefined, {
    //     maximumFractionDigits: 0,
    //     useGrouping: true
    // });

    public constructor(decimalsToDisplay: number) {
        super();
        this.formatter = new Intl.NumberFormat(undefined, {
            maximumFractionDigits: decimalsToDisplay,
            minimumFractionDigits: decimalsToDisplay,
            useGrouping: true
        });
    }

    protected format(number: number): string {
        // The NumberFormat option of `signDisplay: "negative"` is not supported in all browsers nimble supports.
        // Because that option cannot be used to avoid rendering "-0", coerce the values that will round to -0 to 0
        // prior to formatting.
        const valueToFormat = Math.round(number) === 0 ? 0 : number;
        return this.formatter.format(valueToFormat);
    }
}
