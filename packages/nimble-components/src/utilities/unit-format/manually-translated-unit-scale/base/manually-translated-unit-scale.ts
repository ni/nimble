import { ManuallyTranslatedScaledUnitFormat } from './manually-translated-scaled-unit-format';
import { ScaledUnit } from '../../unit-scale/base/scaled-unit';
import type { UnitPrefix } from './unit-prefix';
import type { UnitTranslation } from './unit-translation';
import { UnitScale } from '../../unit-scale/base/unit-scale';

/**
 * A unit scale that is not supported by Intl.NumberFormat and has manually provided translation strings
 */
export abstract class ManuallyTranslatedUnitScale extends UnitScale {
    public constructor(
        unitTranslations: ReadonlyMap<string, UnitTranslation>,
        supportedPrefixes: readonly UnitPrefix[]
    ) {
        super(
            ManuallyTranslatedUnitScale.createSupportedScaledUnits(
                unitTranslations,
                supportedPrefixes
            )
        );
    }

    private static createSupportedScaledUnits(
        unitTranslations: ReadonlyMap<string, UnitTranslation>,
        supportedPrefixes: readonly UnitPrefix[]
    ): readonly ScaledUnit[] {
        if (!unitTranslations.get('en')) {
            throw new Error('English translations must exist');
        }
        const supportedUnits = supportedPrefixes.map(
            prefix => new ScaledUnit(
                prefix.factor,
                scaledUnitFormatFactoryOptions => new ManuallyTranslatedScaledUnitFormat(
                    scaledUnitFormatFactoryOptions,
                    unitTranslations,
                    prefix
                )
            )
        );

        return supportedUnits;
    }
}
