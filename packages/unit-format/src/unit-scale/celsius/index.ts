import { ScaledUnit } from '../../scaled-unit/index.js';
import { ScaledUnitFormatIntlNumberFormat } from '../../scaled-unit-format/intl-number-format/index.js';
import { UnitScale } from '../index.js';

const unitScaleCelsiusConfig = [[1, 'celsius', 'short']] as const;

/**
 * Degrees Celsius units
 */
class UnitScaleCelsius extends UnitScale {
    public constructor() {
        super(
            unitScaleCelsiusConfig.map(
                ([scaleFactor, unit, unitDisplay]) => new ScaledUnit(
                    scaleFactor,
                    ScaledUnitFormatIntlNumberFormat.createFactory({
                        style: 'unit',
                        unit,
                        unitDisplay
                    })
                )
            )
        );
    }
}

export const unitScaleCelsius = new UnitScaleCelsius();
