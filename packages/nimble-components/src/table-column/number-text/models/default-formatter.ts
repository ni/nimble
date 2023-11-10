import type { FormattedNumber } from './formatted-number';
import { NumberFormatter } from './number-formatter';
import type {
    UnitScaleFormatter,
    UnitScaleFormatterConstructor
} from './unit-scale-formatter';

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
    private readonly defaultFormatter: UnitScaleFormatter;

    // Formatter to use for numbers that have leading zeros. It limits the number of rendered
    // digits using 'maximumFractionDigits', which will result in less than 6 significant digits
    // in order to render no more than 6 total digits.
    private readonly leadingZeroFormatter: UnitScaleFormatter;

    // Formatter for numbers that should be displayed in exponential notation. This should be used
    // for numbers with magintudes over 'exponentialUpperBound' or under 'exponentialLowerBound'.
    private readonly exponentialFormatter: UnitScaleFormatter;

    public constructor(
        locale: string,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        UnitScaleFormatterConstructor: UnitScaleFormatterConstructor
    ) {
        super();
        this.defaultFormatter = new UnitScaleFormatterConstructor(locale, {
            maximumSignificantDigits: DefaultFormatter.maximumDigits,
            useGrouping: true
        });
        this.leadingZeroFormatter = new UnitScaleFormatterConstructor(locale, {
            maximumFractionDigits: DefaultFormatter.maximumDigits - 1,
            useGrouping: true
        });
        this.exponentialFormatter = new UnitScaleFormatterConstructor(locale, {
            maximumSignificantDigits: DefaultFormatter.maximumDigits,
            notation: 'scientific'
        });
        this.exponentialFormatter.alwaysUseBaseScaledUnit = true;
    }

    protected format(number: number): FormattedNumber {
        const defaultFormatted = this.defaultFormatter.formatValue(number);
        if (defaultFormatted.number === 0) {
            return defaultFormatted;
        }

        const absoluteValue = Math.abs(defaultFormatted.number);
        if (
            absoluteValue >= DefaultFormatter.exponentialUpperBound
            || absoluteValue < DefaultFormatter.exponentialLowerBound
        ) {
            return this.exponentialFormatter.formatValue(number);
        }
        // Ideally, we could set 'roundingPriority: "lessPrecision"' with a formatter that has both 'maximumSignificantDigits' and
        // 'maximumFractionDigits' configured instead of having two different formatters that we conditionally choose between. However,
        // 'roundingPrioirty' is not supported yet in all browsers nimble supports.
        if (absoluteValue < 1) {
            return this.leadingZeroFormatter.formatValue(number);
        }
        return defaultFormatted;
    }
}
