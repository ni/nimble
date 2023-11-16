import { IntlNumberFormatScaledUnit } from '../../base/models/intl-number-format-scaled-unit';
import type { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';
import { UnitScale } from '../../../table-column/number-text/models/unit-scale';

/**
 * Byte units (1000-based)
 */
export class ByteUnitScale extends UnitScale {
    public static readonly instance = new ByteUnitScale();

    private static readonly supportedScaledUnits = [
        new IntlNumberFormatScaledUnit(1, {
            style: 'unit',
            unit: 'byte',
            unitDisplay: 'long'
        }),
        new IntlNumberFormatScaledUnit(1000, {
            style: 'unit',
            unit: 'kilobyte',
            unitDisplay: 'short'
        }),
        new IntlNumberFormatScaledUnit(10 ** 6, {
            style: 'unit',
            unit: 'megabyte',
            unitDisplay: 'short'
        }),
        new IntlNumberFormatScaledUnit(10 ** 9, {
            style: 'unit',
            unit: 'gigabyte',
            unitDisplay: 'short'
        }),
        new IntlNumberFormatScaledUnit(10 ** 12, {
            style: 'unit',
            unit: 'terabyte',
            unitDisplay: 'short'
        }),
        new IntlNumberFormatScaledUnit(10 ** 15, {
            style: 'unit',
            unit: 'petabyte',
            unitDisplay: 'short'
        })
    ];

    private constructor() {
        super();
    }

    protected override getSupportedScaledUnits(): ScaledUnit[] {
        return ByteUnitScale.supportedScaledUnits;
    }
}
