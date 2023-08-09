/**
 * The base class for all number formatters used by the number-text column.
 */
export abstract class NumberFormatter {
    public abstract format(number: number): string;
}
