/**
 * The formatter for a number-text column whose format is configured to be 'default'.
 */
export class DefaultFormatter {
    private static readonly significantDigits = 6;

    private static readonly exponentialLowerBound = 10 ** -DefaultFormatter.significantDigits;

    private static readonly exponentialUpperBound = 10 ** DefaultFormatter.significantDigits;

    private static readonly defaultFormatter = new Intl.NumberFormat(
        undefined,
        {
            maximumSignificantDigits: DefaultFormatter.significantDigits,
            useGrouping: true
        }
    );

    private static readonly exponentialFormatter = new Intl.NumberFormat(
        undefined,
        {
            maximumSignificantDigits: DefaultFormatter.significantDigits,
            notation: 'scientific'
        }
    );

    public format(number: number): string {
        return this.shouldUseExponentialFormatter(number)
            ? DefaultFormatter.exponentialFormatter.format(number)
            : DefaultFormatter.defaultFormatter.format(number);
    }

    private shouldUseExponentialFormatter(number: number): boolean {
        const absoluteValue = Math.abs(number);
        return (
            absoluteValue > 0
            && (absoluteValue < DefaultFormatter.exponentialLowerBound
                || absoluteValue >= DefaultFormatter.exponentialUpperBound)
        );
    }
}
