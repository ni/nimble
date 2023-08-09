/**
 * The formatter for a number-text column whose format is configured to be 'integer'.
 */
export class IntegerFormatter {
    private static readonly formatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
        useGrouping: true
    });

    public format(number: number): string {
        return IntegerFormatter.formatter.format(number);
    }
}
