import { EmptyScaledUnitFormatter } from './empty-scaled-unit-formatter';
import type { ScaledUnit } from './scaled-unit';
import { UnitScale } from './unit-scale';

/**
 * Degenerate UnitScaleFormatter for formatting without units
 */
export class EmptyUnitScale extends UnitScale {
    private static readonly supportedScaledUnits: ScaledUnit[] = [
        {
            scaleFactor: 1,
            unitFormatterFactory: (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => {
                return new EmptyScaledUnitFormatter(locale, numberFormatOptions);
            }
        }
    ];

    protected override getSupportedScaledUnits(): ScaledUnit[] {
        return EmptyUnitScale.supportedScaledUnits;
    }
}