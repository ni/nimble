import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'roundToInteger'.
 */
export class RoundToIntegerFormatter extends NumberFormatter {
    private static readonly formatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
        useGrouping: true,
        // @ts-expect-error - The version of TypeScript currently being used does not include 'negative' as a valid signDisplay value
        signDisplay: 'negative'
    });

    public format(number: number): string {
        return RoundToIntegerFormatter.formatter.format(number);
    }
}
