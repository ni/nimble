import { IntlNumberFormatScaledUnit } from '../../base/models/intl-number-format-scaled-unit';
import type { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';
import { UnitScaleFormatter } from '../../../table-column/number-text/models/unit-scale-formatter';

/**
 * Formatter for numbers with byte units (1000-based)
 */
export class ByteUnitScaleFormatter extends UnitScaleFormatter {
    protected override getSupportedScaledUnits(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        return [
            new IntlNumberFormatScaledUnit(
                1,
                new Intl.NumberFormat(locale, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'byte',
                    unitDisplay: 'long'
                })
            ),
            new IntlNumberFormatScaledUnit(
                1000,
                new Intl.NumberFormat(locale, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'kilobyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatScaledUnit(
                10 ** 6,
                new Intl.NumberFormat(locale, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'megabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatScaledUnit(
                10 ** 9,
                new Intl.NumberFormat(locale, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'gigabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatScaledUnit(
                10 ** 12,
                new Intl.NumberFormat(locale, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'terabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatScaledUnit(
                10 ** 15,
                new Intl.NumberFormat(locale, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'petabyte',
                    unitDisplay: 'short'
                })
            )
        ];
    }
}
