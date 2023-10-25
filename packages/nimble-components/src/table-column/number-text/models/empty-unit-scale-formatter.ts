import { IntlNumberFormatScaledUnit } from './intl-number-format-scaled-unit';
import type { ScaledUnit } from './scaled-unit';
import { UnitScaleFormatter } from './unit-scale-formatter';

/**
 * Degenerate UnitScaleFormatter for formatting without units
 */
export class EmptyUnitScaleFormatter extends UnitScaleFormatter {
    protected override getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        return [
            new IntlNumberFormatScaledUnit(
                1,
                new Intl.NumberFormat(lang, formatterOptions)
            )
        ];
    }
}
