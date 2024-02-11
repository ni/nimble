import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import { ScaledUnit } from '../scaled-unit/scaled-unit';
import { UnitScale } from './unit-scale';

/**
 * Unit scale that is used to passthrough a number without applying scaling or units
 */
class PassthroughUnitScale extends UnitScale {
    public constructor() {
        super([
            new ScaledUnit(
                10 ** 0,
                IntlNumberFormatScaledUnitFormat.createFactory({})
            )
        ]);
    }
}

export const passthroughUnitScale = new PassthroughUnitScale();
