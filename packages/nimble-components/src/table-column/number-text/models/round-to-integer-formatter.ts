import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'roundToInteger'.
 */
export class RoundToIntegerFormatter extends NumberFormatter {
    private readonly formatter: Intl.NumberFormat;

    public constructor(locale: string) {
        super();
        this.formatter = new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0,
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
