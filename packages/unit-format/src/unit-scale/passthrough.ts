import { ScaledUnitFormatIntlNumberFormat } from '../scaled-unit-format/intl-number-format.js';
import { ScaledUnit } from '../scaled-unit/scaled-unit.js';
import { UnitScale } from './unit-scale.js';

/**
 * Unit scale that is used to passthrough a number without applying scaling or units
 */
class UnitScalePassthrough extends UnitScale {
    public constructor() {
        super([
            new ScaledUnit(
                10 ** 0,
                ScaledUnitFormatIntlNumberFormat.createFactory({})
            )
        ]);
    }
}

export const unitScalePassthrough = new UnitScalePassthrough();
