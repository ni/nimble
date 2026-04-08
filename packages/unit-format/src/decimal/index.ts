import { UnitFormat, type UnitFormatOptions } from '../index.js';
import type { ScaledUnitFormat } from '../scaled-unit-format/index.js';
import type { UnitScale } from '../unit-scale/index.js';
import { unitScalePassthrough } from '../unit-scale/passthrough/index.js';

interface UnitFormatDecimalOptions extends UnitFormatOptions {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}
type UnitFormatDecimalResolvedOptions = Required<UnitFormatDecimalOptions>;

/**
 * Format for decimal numbers with units.
 */
export class UnitFormatDecimal extends UnitFormat<UnitFormatDecimalOptions> {
    private readonly unitScale: UnitScale;
    private readonly minimumFractionDigits: number;
    private readonly maximumFractionDigits: number;

    private readonly scaledUnitFormatters = new Map<number, ScaledUnitFormat>();

    public constructor(
        locale: string,
        {
            minimumFractionDigits = 0,
            maximumFractionDigits = Math.max(3, minimumFractionDigits),
            unitScale = unitScalePassthrough
        }: UnitFormatDecimalOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            unitScale: unitScalePassthrough
        }
    ) {
        super();
        // Workaround to avoid a ts error about signDisplay not accepting the value 'negative'.
        // It has been supported by browsers since 8/23, but TypeScript still hasn't
        // added it to the type definitions. See https://github.com/microsoft/TypeScript/issues/56269
        const signDisplay = 'negative' as Intl.NumberFormatOptions['signDisplay'];
        const intlNumberFormatOptions = {
            maximumFractionDigits,
            minimumFractionDigits,
            signDisplay
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

    public override resolvedOptions(): UnitFormatDecimalResolvedOptions {
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
