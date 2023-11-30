import { IntlNumberFormatScaledUnit } from '../../base/models/intl-number-format-scaled-unit';
import type { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';
import { UnitScale } from '../../../table-column/number-text/models/unit-scale';

/**
 * Byte units (1000-based)
 */
export class ByteUnitScale extends UnitScale {
    public static readonly instance = new ByteUnitScale();

    private static readonly supportedScaledUnits: ScaledUnit[] = [
        {
            scaleFactor: 1,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new IntlNumberFormatScaledUnit(locale, numberFormatOptions, {
                    style: 'unit',
                    unit: 'byte',
                    unitDisplay: 'long'
                });
            }
        },
        {
            scaleFactor: 1000,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new IntlNumberFormatScaledUnit(locale, numberFormatOptions, {
                    style: 'unit',
                    unit: 'kilobyte',
                    unitDisplay: 'short'
                });
            }
        },
        {
            scaleFactor: 10 ** 6,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new IntlNumberFormatScaledUnit(locale, numberFormatOptions, {
                    style: 'unit',
                    unit: 'megabyte',
                    unitDisplay: 'short'
                });
            }
        },
        {
            scaleFactor: 10 ** 9,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new IntlNumberFormatScaledUnit(locale, numberFormatOptions, {
                    style: 'unit',
                    unit: 'gigabyte',
                    unitDisplay: 'short'
                });
            }
        },
        {
            scaleFactor: 10 ** 12,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new IntlNumberFormatScaledUnit(locale, numberFormatOptions, {
                    style: 'unit',
                    unit: 'terabyte',
                    unitDisplay: 'short'
                });
            }
        },
        {
            scaleFactor: 10 ** 15,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new IntlNumberFormatScaledUnit(locale, numberFormatOptions, {
                    style: 'unit',
                    unit: 'petabyte',
                    unitDisplay: 'short'
                });
            }
        }
    ];

    private constructor() {
        super();
    }

    protected override getSupportedScaledUnits(): ScaledUnit[] {
        return ByteUnitScale.supportedScaledUnits;
    }
}
