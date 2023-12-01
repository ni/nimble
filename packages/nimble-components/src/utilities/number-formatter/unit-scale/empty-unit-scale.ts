import type { ScaledUnit } from './models/scaled-unit';
import { UnitScale } from './unit-scale';

/**
 * Degenerate UnitScale for formatting without units
 */
export class EmptyUnitScale extends UnitScale {
    public static readonly instance = new EmptyUnitScale();

    private static readonly supportedScaledUnits: ScaledUnit[] = [
        {
            scaleFactor: 1,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new Intl.NumberFormat(locale, numberFormatOptions);
            }
        }
    ];

    private constructor() {
        super();
    }

    protected override getSupportedScaledUnits(): ScaledUnit[] {
        return EmptyUnitScale.supportedScaledUnits;
    }
}
