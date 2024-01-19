import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import { ScaledUnit } from '../scaled-unit/scaled-unit';
import { UnitScale } from './unit-scale';

const byteUnitScaleOptions = [
    [1000 ** 0, 'byte', 'long'],
    [1000 ** 1, 'kilobyte', 'short'],
    [1000 ** 2, 'megabyte', 'short'],
    [1000 ** 3, 'gigabyte', 'short'],
    [1000 ** 4, 'terabyte', 'short'],
    [1000 ** 5, 'petabyte', 'short']
] as const;

/**
 * Byte units (1000-based)
 */
class ByteUnitScale extends UnitScale {
    public constructor() {
        super(
            byteUnitScaleOptions.map(
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

export const byteUnitScale = new ByteUnitScale();
