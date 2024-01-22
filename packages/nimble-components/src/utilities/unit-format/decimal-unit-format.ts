import { UnitFormat, UnitFormatOptions } from './unit-format';
import type { ScaledUnitFormat } from './scaled-unit-format/scaled-unit-format';
import type { UnitScale } from './unit-scale/unit-scale';
import { passthroughUnitScale } from './unit-scale/passthrough-unit-scale';

interface DecimalUnitFormatOptions extends UnitFormatOptions {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    unitScale?: UnitScale;
}

/**
 * Format for decimal numbers with units.
 */
export class DecimalUnitFormat extends UnitFormat<DecimalUnitFormatOptions> {
    private static readonly defaultFractionDigits = 2;
    private readonly unitScale: UnitScale;
    private readonly minimumFractionDigits: number;
    private readonly maximumFractionDigits: number;

    private readonly scaledUnitFormatters = new Map<number, ScaledUnitFormat>();
    private readonly tenPowDecimalDigits: number;

    public constructor(
        locale: string,
        {
            minimumFractionDigits = 0,
            maximumFractionDigits = Math.max(3, minimumFractionDigits),
            unitScale = passthroughUnitScale
        }: DecimalUnitFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            unitScale: passthroughUnitScale
        }
    ) {
        super();
        const intlNumberFormatOptions = {
            maximumFractionDigits,
            minimumFractionDigits,
            useGrouping: true
        };
        for (const scaledUnit of unitScale.supportedScaledUnits) {
            this.scaledUnitFormatters.set(
                scaledUnit.scaleFactor,
                scaledUnit.scaledUnitFormatFactory({
                    locale,
                    intlNumberFormatOptions
                })
            );
        }
        this.tenPowDecimalDigits = 10 ** maximumFractionDigits;
        this.unitScale = unitScale;
        this.minimumFractionDigits = minimumFractionDigits;
        this.maximumFractionDigits = maximumFractionDigits;
    }

    public static normalizeAndDefaultFractionDigitOptions(
        fractionDigits?: number,
        minimumFractionDigits?: number,
        maximumFractionDigits?: number
    ): {
            minimumFractionDigits?: number,
            maximumFractionDigits?: number
        } {
        if (
            fractionDigits !== undefined
            && (maximumFractionDigits !== undefined
                || minimumFractionDigits !== undefined)
        ) {
            throw new Error(
                'fractionDigits is mutually exclusive with minimumFractionDigits and maximumFractionDigits. Do not mix.'
            );
        }
        const actualMinimumFractionDigits = maximumFractionDigits === undefined
            && minimumFractionDigits === undefined
            ? fractionDigits ?? DecimalUnitFormat.defaultFractionDigits
            : minimumFractionDigits ?? 0;
        const actualMaximumFractionDigits = maximumFractionDigits === undefined
            && minimumFractionDigits === undefined
            ? fractionDigits ?? DecimalUnitFormat.defaultFractionDigits
            : maximumFractionDigits;
        return {
            maximumFractionDigits: actualMaximumFractionDigits,
            minimumFractionDigits: actualMinimumFractionDigits
        };
    }

    public override resolvedOptions(): Required<DecimalUnitFormatOptions> {
        return {
            unitScale: this.unitScale,
            maximumFractionDigits: this.maximumFractionDigits,
            minimumFractionDigits: this.minimumFractionDigits
        };
    }

    protected tryFormat(number: number): string {
        const { scaledValue, scaledUnit } = this.unitScale.scaleNumber(number);

        const numberNormalized = this.willRoundToZero(scaledValue)
            ? 0
            : scaledValue;
        const scaledUnitFormatter = this.scaledUnitFormatters.get(
            scaledUnit.scaleFactor
        )!;
        return scaledUnitFormatter.format(numberNormalized);
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to maximumFractionDigits so that Math.round can be used to emulate rounding to
        // maximumFractionDigits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
