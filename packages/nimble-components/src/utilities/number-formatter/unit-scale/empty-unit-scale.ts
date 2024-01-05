import type { ScaledUnit } from './models/scaled-unit';
import { UnitScale } from './unit-scale';

/**
 * Degenerate UnitScale for formatting without units
 */
class EmptyUnitScale extends UnitScale {
    private static readonly supportedScaledUnits: readonly ScaledUnit[] = [
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

    public constructor() {
        super(EmptyUnitScale.supportedScaledUnits);
    }
}

export const emptyUnitScale = new EmptyUnitScale();
