import { NumberFormatter } from './number-formatter';

/**
 * The formatter for a number-text column whose format is configured to be 'default'.
 */
export class DefaultFormatter extends NumberFormatter {
    // The maximum number of digits that should be rendered for any given value.
    private static readonly maximumDigits = 6;

    // Use exponential notation for numbers that will be rendered with 3 leading 0s or more.
    // Because a maximum of 6 digits are rendered, showing more than 3 leading 0s is not ideal
    // because then at least half of the displayed digits will be leading 0s.
    private static readonly exponentialLowerBound = 0.000995;

    // Use exponential formatting for numbers whose magnitude cannot otherwise be displayed
    // with 6 digits or less.
    private static readonly exponentialUpperBound = 999999.5;

    // Formatter to use by default. It renders the number with a maximum of 6 signficant digits.
    private readonly defaultFormatter: Intl.NumberFormat;

    // Formatter to use for numbers that have leading zeros. It limits the number of rendered
    // digits using 'maximumFractionDigits', which will result in less than 6 significant digits
    // in order to render no more than 6 total digits.
    private readonly leadingZeroFormatter: Intl.NumberFormat;

    // Formatter for numbers that should be displayed in exponential notation. This should be used
    // for numbers with magintudes over 'exponentialUpperBound' or under 'exponentialLowerBound'.
    private readonly exponentialFormatter: Intl.NumberFormat;

    public constructor(locale: string) {
        super();
        this.defaultFormatter = new Intl.NumberFormat(
            locale,
            {
                maximumSignificantDigits: DefaultFormatter.maximumDigits,
                useGrouping: true
            }
        );
        this.leadingZeroFormatter = new Intl.NumberFormat(
            locale,
            {
                maximumFractionDigits: DefaultFormatter.maximumDigits - 1,
                useGrouping: true
            }
        );
        this.exponentialFormatter = new Intl.NumberFormat(
            locale,
            {
                maximumSignificantDigits: DefaultFormatter.maximumDigits,
                notation: 'scientific'
            }
        );
    }

    protected format(number: number): string {
        // The NumberFormat option of `signDisplay: "negative"` is not supported in all browsers nimble supports.
        // Because that option cannot be used to avoid rendering "-0", coerce the value -0 to 0 prior to formatting.
        const valueToFormat = number === 0 ? 0 : number;
        const formatter = this.getFormatterForNumber(valueToFormat);
        return formatter.format(valueToFormat);
    }

    private getFormatterForNumber(number: number): Intl.NumberFormat {
        if (number === 0) {
            return this.defaultFormatter;
        }

        const absoluteValue = Math.abs(number);
        if (
            absoluteValue >= DefaultFormatter.exponentialUpperBound
            || absoluteValue < DefaultFormatter.exponentialLowerBound
        ) {
            return this.exponentialFormatter;
        }
        // Ideally, we could set 'roundingPriority: "lessPrecision"' with a formatter that has both 'maximumSignificantDigits' and
        // 'maximumFractionDigits' configured instead of having two different formatters that we conditionally choose between. However,
        // 'roundingPrioirty' is not supported yet in all browsers nimble supports.
        if (absoluteValue < 1) {
            return this.leadingZeroFormatter;
        }
        return this.defaultFormatter;
    }
}
