import { NumberFormatter } from './number-formatter';
import type { UnitFormatter } from './unit-formatter';
import type { UnitScale } from './unit-scale/unit-scale';

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

    // Format options to use by default. It renders the number with a maximum of 6 signficant digits.
    private readonly defaultFormatterOptions: Intl.NumberFormatOptions = {
        maximumSignificantDigits: DefaultFormatter.maximumDigits,
        useGrouping: true
    };

    private readonly defaultUnitFormatters = new Map<number, UnitFormatter>();

    // Format options to use for numbers that have leading zeros. It limits the number of rendered
    // digits using 'maximumFractionDigits', which will result in less than 6 significant digits
    // in order to render no more than 6 total digits.
    private readonly leadingZeroFormatterOptions: Intl.NumberFormatOptions = {
        maximumFractionDigits: DefaultFormatter.maximumDigits - 1,
        useGrouping: true
    };

    private readonly leadingZeroUnitFormatters = new Map<
    number,
    UnitFormatter
    >();

    // Format options for numbers that should be displayed in exponential notation. This should be used
    // for numbers with magintudes over 'exponentialUpperBound' or under 'exponentialLowerBound'.
    private readonly exponentialFormatterOptions: Intl.NumberFormatOptions = {
        maximumSignificantDigits: DefaultFormatter.maximumDigits,
        notation: 'scientific'
    };

    private readonly exponentialUnitFormatter: UnitFormatter;

    public constructor(locale: string, private readonly unitScale: UnitScale) {
        super();
        for (const unit of unitScale.supportedScaledUnits) {
            this.defaultUnitFormatters.set(
                unit.scaleFactor,
                unit.unitFormatterFactory(locale, this.defaultFormatterOptions)
            );
            this.leadingZeroUnitFormatters.set(
                unit.scaleFactor,
                unit.unitFormatterFactory(
                    locale,
                    this.leadingZeroFormatterOptions
                )
            );
        }
        this.exponentialUnitFormatter = unitScale.baseScaledUnit.unitFormatterFactory(
            locale,
            this.exponentialFormatterOptions
        );
    }

    protected format(number: number): string {
        const valueToFormat = number === 0 ? 0 : number;

        const { scaledValue, scaledUnit: unit } = this.unitScale.scaleNumber(valueToFormat);

        const formatter = this.getFormatterForNumber(scaledValue);
        let unitFormatter: UnitFormatter;
        switch (formatter) {
            case 'default':
                unitFormatter = this.defaultUnitFormatters.get(
                    unit.scaleFactor
                )!;
                return unitFormatter.format(scaledValue);
            case 'leadingZero':
                unitFormatter = this.leadingZeroUnitFormatters.get(
                    unit.scaleFactor
                )!;
                return unitFormatter.format(scaledValue);
            case 'exponential':
                unitFormatter = this.exponentialUnitFormatter;
                return unitFormatter.format(valueToFormat);
            default:
                throw new Error('what happened?');
        }
    }

    private getFormatterForNumber(
        number: number
    ): 'default' | 'leadingZero' | 'exponential' {
        if (number === 0) {
            return 'default';
        }

        const absoluteValue = Math.abs(number);
        if (
            absoluteValue >= DefaultFormatter.exponentialUpperBound
            || absoluteValue < DefaultFormatter.exponentialLowerBound
        ) {
            return 'exponential';
        }
        // Ideally, we could set 'roundingPriority: "lessPrecision"' with a formatter that has both 'maximumSignificantDigits' and
        // 'maximumFractionDigits' configured instead of having two different formatters that we conditionally choose between. However,
        // 'roundingPrioirty' is not supported yet in all browsers nimble supports.
        if (absoluteValue < 1) {
            return 'leadingZero';
        }
        return 'default';
    }
}
