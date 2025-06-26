import { ScaledUnit } from '../scaled-unit/scaled-unit';
import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import { UnitScale } from './unit-scale';

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
