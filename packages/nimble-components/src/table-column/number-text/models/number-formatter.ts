import { FormattedNumber } from './formatted-number';

/**
 * The base class for number formatters used by the number-text column.
 */
export abstract class NumberFormatter {
    /**
     * Tries to format the passed value using the `format()` function implemented by a concrete implementation of the class.
     * Returns an empty string if the value is not a number or if `format()` throws an error.
     */
    public formatValue(value: number | undefined | null): FormattedNumber {
        if (typeof value !== 'number') {
            return FormattedNumber.empty;
        }

        try {
            return this.format(value);
        } catch {
            return FormattedNumber.empty;
        }
    }

    protected abstract format(number: number): FormattedNumber;
}
