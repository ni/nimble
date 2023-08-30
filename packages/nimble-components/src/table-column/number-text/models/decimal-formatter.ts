import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly formatter: Intl.NumberFormat;

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
        // Because that option cannot be used to avoid rendering "-0", coerce the value -0 to 0 prior to formatting.
        const valueToFormat = number === 0 ? 0 : number;
        return this.formatter.format(valueToFormat);
    }
}
