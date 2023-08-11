import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'default'.
 */
export class DefaultFormatter extends NumberFormatter {
    private static readonly maximumDigits = 6;
    // Use exponential notation for numbers that will be displayed with
    // 3 leading 0s or more because otherwise at least half of the displayed
    // digits will be leading 0s.
    private static readonly exponentialLowerBound = 0.000995;
    // Use exponential formatting for numbers whose magnitude cannot
    // otherwise be displayed with less than 6 digits or less.
    private static readonly exponentialUpperBound = 999999.5;

    private static readonly defaultFormatter = new Intl.NumberFormat(
        undefined,
        {
            maximumSignificantDigits: DefaultFormatter.maximumDigits,
            maximumFractionDigits: DefaultFormatter.maximumDigits - 1,
            // Use 'lessPrecision' rounding priority to help ensure that no more than 6 digits are rendered
            // in the formatted value, even if 'maximumSignificantDigits' or 'maximumFractionDigits' alone
            // would result in more than 6 rendered digits.
            roundingPriority: 'lessPrecision',
            useGrouping: true,
            // @ts-expect-error - The version of TypeScript currently being used does not include 'negative' as a valid signDisplay value
            signDisplay: 'negative'
        }
    );

    private static readonly exponentialFormatter = new Intl.NumberFormat(
        undefined,
        {
            maximumSignificantDigits: DefaultFormatter.maximumDigits,
            notation: 'scientific'
        }
    );

    public format(number: number): string {
        return this.shouldUseExponentialFormatter(number)
            ? DefaultFormatter.exponentialFormatter.format(number)
            : DefaultFormatter.defaultFormatter.format(number);
    }

    private shouldUseExponentialFormatter(number: number): boolean {
        if (number === 0) {
            return false;
        }

        const absoluteValue = Math.abs(number);
        return absoluteValue < DefaultFormatter.exponentialLowerBound || absoluteValue >= DefaultFormatter.exponentialUpperBound;
    }
}
