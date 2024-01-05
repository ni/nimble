import { ScaledUnit } from './base/scaled-unit';
import { UnitScale } from './base/unit-scale';

/**
 * Unit scale that is used to passthrough a number without applying scaling or units
 */
class PassthroughUnitScale extends UnitScale {
    public constructor() {
        super([
            new ScaledUnit(
                1,
                (
                    locale: string,
                    numberFormatOptions: Intl.NumberFormatOptions | undefined
                ) => new Intl.NumberFormat(locale, numberFormatOptions)
            )
        ]);
    }
}

export const passthroughUnitScale = new PassthroughUnitScale();
