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
    private readonly unitScale: UnitScale;
    private readonly minimumFractionDigits: number;
    private readonly maximumFractionDigits: number;

    private readonly scaledUnitFormatters = new Map<number, ScaledUnitFormat>();

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
        type SignDisplay = Intl.NumberFormatOptions['signDisplay'];
        const intlNumberFormatOptions = {
            maximumFractionDigits,
            minimumFractionDigits,
            // Hack to avoid a ts error about signDisplay not accepting the value 'negative'.
            // The value has been supported by browsers since 8/23, but TypeScript still hasn't
            // added it to the type definitions. See https://github.com/microsoft/TypeScript/issues/56269
            signDisplay: 'negative' as SignDisplay
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
        this.unitScale = unitScale;
        this.minimumFractionDigits = minimumFractionDigits;
        this.maximumFractionDigits = maximumFractionDigits;
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
        const scaledUnitFormatter = this.scaledUnitFormatters.get(
            scaledUnit.scaleFactor
        )!;
        return scaledUnitFormatter.format(scaledValue);
    }
}
