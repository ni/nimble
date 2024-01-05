import { ScaledUnit } from './base/scaled-unit';
import { UnitScale } from './base/unit-scale';

/**
 * Degenerate UnitScale for formatting without units
 */
class EmptyUnitScale extends UnitScale {
    public constructor() {
        super([
            new ScaledUnit(1, (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => new Intl.NumberFormat(locale, numberFormatOptions))
        ]);
    }
}

export const emptyUnitScale = new EmptyUnitScale();
