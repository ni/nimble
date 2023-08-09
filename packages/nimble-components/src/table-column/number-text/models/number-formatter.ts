/**
 * The base class for number formatters used by the number-text column.
 */
export abstract class NumberFormatter {
    public abstract format(number: number): string;
}
