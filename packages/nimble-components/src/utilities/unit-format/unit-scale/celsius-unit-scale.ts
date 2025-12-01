import { ScaledUnit } from '../scaled-unit/scaled-unit';
import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import { UnitScale } from './unit-scale';

const celsiusUnitScaleOptions = [[1, 'celsius', 'short']] as const;

/**
 * Degrees Celsius units
 */
class CelsiusUnitScale extends UnitScale {
    public constructor() {
        super(
            celsiusUnitScaleOptions.map(
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

export const celsiusUnitScale = new CelsiusUnitScale();
