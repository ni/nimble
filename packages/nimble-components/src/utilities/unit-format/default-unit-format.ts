import { UnitFormat, UnitFormatOptions } from './unit-format';
import type { ScaledUnitFormat } from './scaled-unit-format/scaled-unit-format';
import type { UnitScale } from './unit-scale/unit-scale';
import { passthroughUnitScale } from './unit-scale/passthrough-unit-scale';

type SignDisplay = Intl.NumberFormatOptions['signDisplay'];

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
    // Format options to use by default. It renders the number with a maximum of 6 signficant digits (including zero before decimal point).
    private readonly defaultIntlNumberFormatOptions: Intl.NumberFormatOptions = {
        maximumSignificantDigits: DefaultUnitFormat.maximumDigits,
        maximumFractionDigits: DefaultUnitFormat.maximumDigits - 1,
        // Workaround to avoid ts errors about signDisplay not accepting the value 'negative'.
        // It has been supported by browsers since 8/23, but TypeScript still hasn't
        // added it to the type definitions. See https://github.com/microsoft/TypeScript/issues/56269
        signDisplay: 'negative' as SignDisplay
    };

    private readonly defaultScaledUnitFormatters = new Map<
    number,
    ScaledUnitFormat
    >();

    // Format options for numbers that should be displayed in exponential notation. This should be used
    // for numbers with magintudes over 'exponentialUpperBound' or under 'exponentialLowerBound'.
    private readonly exponentialIntlNumberFormatOptions: Intl.NumberFormatOptions = {
        maximumSignificantDigits: DefaultUnitFormat.maximumDigits,
        notation: 'scientific',
        // See comment above defaultIntlNumberFormatOptions.signDisplay
        signDisplay: 'negative' as SignDisplay
    };

    private readonly exponentialScaledUnitFormatter: ScaledUnitFormat;

    public constructor(
        locale: string,
        { unitScale = passthroughUnitScale }: UnitFormatOptions = {
            unitScale: passthroughUnitScale
        }
    ) {
        super();
        for (const unit of unitScale.supportedScaledUnits) {
            this.defaultScaledUnitFormatters.set(
                unit.scaleFactor,
                unit.scaledUnitFormatFactory({
                    locale,
                    // Workaround to avoid ts error about roundingPriority not being a known option.
                    // It has been supported by browsers since 8/23, but TypeScript still hasn't
                    // added it to the type definitions. See https://github.com/microsoft/TypeScript/issues/56269
                    intlNumberFormatOptions: {
                        ...this.defaultIntlNumberFormatOptions,
                        roundingPriority: 'lessPrecision'
                    } as Intl.NumberFormatOptions
                })
            );
        }
        this.exponentialScaledUnitFormatter = unitScale.baseScaledUnit.scaledUnitFormatFactory({
            locale,
            // Same as above comment
            intlNumberFormatOptions: this.exponentialIntlNumberFormatOptions
        });
        this.unitScale = unitScale;
    }

    public override resolvedOptions(): Required<UnitFormatOptions> {
        return {
            unitScale: this.unitScale
        };
    }

    protected tryFormat(number: number): string {
        const { scaledValue, scaledUnit } = this.unitScale.scaleNumber(number);

        const absoluteValue = Math.abs(scaledValue);
        const useExponential = absoluteValue !== 0
            && (absoluteValue >= DefaultUnitFormat.exponentialUpperBound
                || absoluteValue < DefaultUnitFormat.exponentialLowerBound);
        return useExponential
            ? this.exponentialScaledUnitFormatter.format(number)
            : this.defaultScaledUnitFormatters
                .get(scaledUnit.scaleFactor)!
                .format(scaledValue);
    }
}
