import { ScaledUnit } from '../scaled-unit/scaled-unit.js';
import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format.js';
import { UnitScale } from './unit-scale.js';

const fahrenheitUnitScaleOptions = [[1, 'fahrenheit', 'short']] as const;

/**
 * Degrees Fahrenheit units
 */
class FahrenheitUnitScale extends UnitScale {
    public constructor() {
        super(
            fahrenheitUnitScaleOptions.map(
                ([scaleFactor, unit, unitDisplay]) => new ScaledUnit(
                    scaleFactor,
                    IntlNumberFormatScaledUnitFormat.createFactory({
                        style: 'unit',
                        unit,
                        unitDisplay
                    })
                )
            )
        );
    }
}

export const fahrenheitUnitScale = new FahrenheitUnitScale();
