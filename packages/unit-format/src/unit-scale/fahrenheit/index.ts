import { ScaledUnit } from '../../scaled-unit/index.js';
import { ScaledUnitFormatIntlNumberFormat } from '../../scaled-unit-format/intl-number-format/index.js';
import { UnitScale } from '../index.js';

const unitScaleFahrenheitConfig = [[1, 'fahrenheit', 'short']] as const;

/**
 * Degrees Fahrenheit units
 */
class UnitScaleFahrenheit extends UnitScale {
    public constructor() {
        super(
            unitScaleFahrenheitConfig.map(
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

export const unitScaleFahrenheit = new UnitScaleFahrenheit();
