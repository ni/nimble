import { IntlNumberFormatScaledUnitFormat } from './base/intl-number-format-scaled-unit-format';
import { ScaledUnit } from './base/scaled-unit';
import { UnitScale } from './base/unit-scale';

/**
 * Unit scale that is used to passthrough a number without applying scaling or units
 */
class PassthroughUnitScale extends UnitScale {
    public constructor() {
        super([
            new ScaledUnit(
                10 ** 0,
                (
                    locale: string,
                    intlNumberFormatOptions?: Intl.NumberFormatOptions
                ) => new IntlNumberFormatScaledUnitFormat(
                    locale,
                    intlNumberFormatOptions
                )
            )
        ]);
    }
}

export const passthroughUnitScale = new PassthroughUnitScale();
