import { ManuallyTranslatedUnitScale } from './base/manually-translated-unit-scale';
import { unitPrefixesMetric } from './base/unit-prefixes-metric';
import { UnitTranslation } from './base/unit-translation';

/**
 * Voltage unit scale
 */
class VoltUnitScale extends ManuallyTranslatedUnitScale {
    private static readonly unitTranslations = new Map<string, UnitTranslation>(
        [
            ['en', new UnitTranslation('volt', 'volts', 'V')],
            ['fr', new UnitTranslation('volt', 'volts', 'V')],
            ['de', new UnitTranslation('Volt', 'Volt', 'V')],
            ['ja', new UnitTranslation('ボルト', 'ボルト', 'V')],
            ['zh', new UnitTranslation('伏特', '伏特', 'V')]
        ]
    );

    public constructor() {
        super(VoltUnitScale.unitTranslations, unitPrefixesMetric);
    }
}

export const voltUnitScale = new VoltUnitScale();
