import { UnitFormat, UnitFormatOptions } from './unit-format';
import type { ScaledUnitFormat } from './scaled-unit-format/scaled-unit-format';
import type { UnitScale } from './unit-scale/unit-scale';
import { passthroughUnitScale } from './unit-scale/passthrough-unit-scale';

type NumberStyle = 'default' | 'leadingZero' | 'exponential';

// Allow consistent pattern for defining Options and ResolvedOptions
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DefaultUnitFormatOptions extends UnitFormatOptions {}
type ResolvedDefaultUnitFormatOptions = Required<DefaultUnitFormatOptions>;

/**
 * Format for numbers with units to show in a tabular form.
 * Large and tiny numbers are shown exponentially and the rest as decimal.
 */
export class DefaultUnitFormat extends UnitFormat {
    // The maximum number of digits that should be rendered for any given value.
    private static readonly maximumDigits = 6;

    // Use exponential notation for numbers that will be rendered with 3 leading 0s or more.
    // Because a maximum of 6 digits are rendered, showing more than 3 leading 0s is not ideal
    // because then at least half of the displayed digits will be leading 0s.
    private static readonly exponentialLowerBound = 0.000995;

    // Use exponential formatting for numbers whose magnitude cannot otherwise be displayed
    // with 6 digits or less.
    private static readonly exponentialUpperBound = 999999.5;

    private readonly unitScale: UnitScale;

    // Format options to use by default. It renders the number with a maximum of 6 signficant digits.
    private readonly defaultIntlNumberFormatOptions: Intl.NumberFormatOptions = {
        maximumSignificantDigits: DefaultUnitFormat.maximumDigits,
        useGrouping: true
    };

    private readonly defaultScaledUnitFormatters = new Map<
    number,
    ScaledUnitFormat
    >();

    // Format options to use for numbers that have leading zeros. It limits the number of rendered
    // digits using 'maximumFractionDigits', which will result in less than 6 significant digits
    // in order to render no more than 6 total digits.
    private readonly leadingZeroIntlNumberFormatOptions: Intl.NumberFormatOptions = {
        maximumFractionDigits: DefaultUnitFormat.maximumDigits - 1,
        useGrouping: true
    };

    private readonly leadingZeroScaledUnitFormatters = new Map<
    number,
    ScaledUnitFormat
    >();

    // Format options for numbers that should be displayed in exponential notation. This should be used
    // for numbers with magintudes over 'exponentialUpperBound' or under 'exponentialLowerBound'.
    private readonly exponentialIntlNumberFormatOptions: Intl.NumberFormatOptions = {
        maximumSignificantDigits: DefaultUnitFormat.maximumDigits,
        notation: 'scientific'
    };

    private readonly exponentialScaledUnitFormatter: ScaledUnitFormat;

    public constructor(
        locale: string,
        { unitScale = passthroughUnitScale }: DefaultUnitFormatOptions = {
            unitScale: passthroughUnitScale
        }
    ) {
        super();
        for (const unit of unitScale.supportedScaledUnits) {
            this.defaultScaledUnitFormatters.set(
                unit.scaleFactor,
                unit.scaledUnitFormatFactory({
                    locale,
                    intlNumberFormatOptions: this.defaultIntlNumberFormatOptions
                })
            );
            this.leadingZeroScaledUnitFormatters.set(
                unit.scaleFactor,
                unit.scaledUnitFormatFactory({
                    locale,
                    intlNumberFormatOptions:
                        this.leadingZeroIntlNumberFormatOptions
                })
            );
        }
        this.exponentialScaledUnitFormatter = unitScale.baseScaledUnit.scaledUnitFormatFactory({
            locale,
            intlNumberFormatOptions: this.exponentialIntlNumberFormatOptions
        });
        this.unitScale = unitScale;
    }

    public override resolvedOptions(): ResolvedDefaultUnitFormatOptions {
        return {
            unitScale: this.unitScale
        };
    }

    protected tryFormat(number: number): string {
        // Normalize +0 / -0 --> +0
        const numberNormalized = number === 0 ? 0 : number;

        const { scaledValue, scaledUnit } = this.unitScale.scaleNumber(numberNormalized);

        const numberStyle = this.resolveNumberStyle(scaledValue);
        switch (numberStyle) {
            case 'default': {
                const scaledUnitFormatter = this.defaultScaledUnitFormatters.get(
                    scaledUnit.scaleFactor
                )!;
                return scaledUnitFormatter.format(scaledValue);
            }
            case 'leadingZero': {
                const scaledUnitFormatter = this.leadingZeroScaledUnitFormatters.get(
                    scaledUnit.scaleFactor
                )!;
                return scaledUnitFormatter.format(scaledValue);
            }
            case 'exponential': {
                const scaledUnitFormatter = this.exponentialScaledUnitFormatter;
                return scaledUnitFormatter.format(numberNormalized);
            }
            default:
                throw new Error('Unexpected number format style');
        }
    }

    private resolveNumberStyle(number: number): NumberStyle {
        if (number === 0) {
            return 'default';
        }

        const absoluteValue = Math.abs(number);
        if (
            absoluteValue >= DefaultUnitFormat.exponentialUpperBound
            || absoluteValue < DefaultUnitFormat.exponentialLowerBound
        ) {
            return 'exponential';
        }
        // Ideally, we could set 'roundingPriority: "lessPrecision"' with a formatter that has both 'maximumSignificantDigits' and
        // 'maximumFractionDigits' configured instead of having two different formatters that we conditionally choose between. However,
        // 'roundingPrioirty' is not supported yet in all browsers.
        if (absoluteValue < 1) {
            return 'leadingZero';
        }
        return 'default';
    }
}
