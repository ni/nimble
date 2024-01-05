/**
 * The base class for number formatters used by the number-text column.
 */
export abstract class NumberFormatter {
    /**
     * Formats a number value to a string.
     * For nullish values or values that result in an exception being thrown, empty string is returned
     */
    public format(value: number | undefined | null): string {
        if (typeof value !== 'number') {
            return '';
        }

        try {
            return this.tryFormat(value);
        } catch {
            return '';
        }
    }

    protected abstract tryFormat(number: number): string;
}
