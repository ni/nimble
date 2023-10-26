import { EmptyScaledUnit } from './empty-scaled-unit';
import type { ScaledUnit } from './scaled-unit';
import { UnitScaleFormatter } from './unit-scale-formatter';

/**
 * Degenerate UnitScaleFormatter for formatting without units
 */
export class EmptyUnitScaleFormatter extends UnitScaleFormatter {
    protected override getSupportedScaledUnits(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        return [
            new EmptyScaledUnit(new Intl.NumberFormat(locale, formatterOptions))
        ];
    }
}
