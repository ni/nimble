import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import { ScaledUnit } from '../scaled-unit/scaled-unit';
import { UnitScale } from './unit-scale';

const byteUnitScaleOptions = [
    [10 ** 0, 'byte', 'long'],
    [10 ** 3, 'kilobyte', 'short'],
    [10 ** 6, 'megabyte', 'short'],
    [10 ** 9, 'gigabyte', 'short'],
    [10 ** 12, 'terabyte', 'short'],
    [10 ** 15, 'petabyte', 'short']
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
