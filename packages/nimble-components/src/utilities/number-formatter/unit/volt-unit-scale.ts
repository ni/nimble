import { ManuallyTranslatedUnitScale } from './models/manually-translated-unit-scale';
import { UnitPrefix, metricPrefixes } from './models/unit-prefix';
import { UnitTranslation } from './models/unit-translation';

/**
 * Voltage units
 */
export class VoltUnitScale extends ManuallyTranslatedUnitScale {
    private static readonly unitTranslations = new Map<string, UnitTranslation>(
        [
            ['en', new UnitTranslation('volt', 'volts', 'V')],
            ['fr', new UnitTranslation('volt', 'volts', 'V')],
            ['de', new UnitTranslation('Volt', 'Volt', 'V')],
            ['ja', new UnitTranslation('ボルト', 'ボルト', 'V')],
            ['zh', new UnitTranslation('伏特', '伏特', 'V')]
        ]
    );

    // Need unitTranslations to be initialized before construction
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly instance = new VoltUnitScale();

    private constructor() {
        super();
    }

    protected override getUnitTranslations(): ReadonlyMap<
    string,
    UnitTranslation
    > {
        return VoltUnitScale.unitTranslations;
    }

    protected override getSupportedPrefixes(): readonly UnitPrefix[] {
        return metricPrefixes;
    }
}
