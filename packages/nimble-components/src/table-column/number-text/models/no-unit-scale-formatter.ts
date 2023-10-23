import { IntlNumberFormatUnit } from './intl-number-format-unit';
import type { ScaledUnit } from './scaled-unit';
import { UnitScaleFormatter } from './unit-scale-formatter';

/**
 * Degenerate UnitScaleFormatter for formatting without units
 */
export class NoUnitScaleFormatter extends UnitScaleFormatter {
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
                new Intl.NumberFormat(lang, formatterOptions)
            )
        ];
    }
}
