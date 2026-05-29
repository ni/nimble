import { ScaledUnitFormatIntlNumberFormat } from '../../scaled-unit-format/intl-number-format/index.js';
import { ScaledUnit } from '../../scaled-unit/index.js';
import { UnitScale } from '../index.js';

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
