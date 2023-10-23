import { IntlNumberFormatUnit } from './intl-number-format-unit';
import type { ScaledUnit } from './scaled-unit';
import { UnitScaleFormatter } from './unit-scale-formatter';

/**
 * Formatter for numbers with byte units
 */
export class ByteScaleFormatter extends UnitScaleFormatter {
    public constructor(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ) {
        super(lang, formatterOptions);
    }

    protected override getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        return [
            new IntlNumberFormatUnit(
                1,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'byte',
                    unitDisplay: 'long'
                })
            ),
            new IntlNumberFormatUnit(
                1000,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'kilobyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 6,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'megabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 9,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'gigabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 12,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'terabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 15,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'petabyte',
                    unitDisplay: 'short'
                })
            )
        ];
    }
}
