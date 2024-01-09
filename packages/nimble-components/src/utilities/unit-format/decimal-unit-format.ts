import { UnitFormat } from './base/unit-format';
import type { ScaledUnitFormat } from './unit-scale/base/scaled-unit-format';
import type { UnitScale } from './unit-scale/base/unit-scale';
import { passthroughUnitScale } from './unit-scale/passthrough-unit-scale';

/**
 * Format for decimal numbers with units.
 */
export class DecimalUnitFormat extends UnitFormat {
    /** Resolved UnitScale */
    public readonly unitScale: UnitScale;

    /** Resolved minimumFractionDigits */
    public readonly minimumFractionDigits: number;

    /** Resolved maximumFractionDigits */
    public readonly maximumFractionDigits: number;

    private readonly scaledUnitFormatters = new Map<number, ScaledUnitFormat>();
    private readonly tenPowDecimalDigits: number;

    public constructor(
        locale: string,
        {
            minimumFractionDigits = 0,
            maximumFractionDigits = Math.max(3, minimumFractionDigits),
            unitScale = passthroughUnitScale
        }: {
            minimumFractionDigits?: number,
            maximumFractionDigits?: number,
            unitScale?: UnitScale
        } = {
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
