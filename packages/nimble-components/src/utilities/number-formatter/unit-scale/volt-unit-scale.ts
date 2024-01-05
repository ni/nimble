import { ManuallyTranslatedUnitScale } from './models/manually-translated-unit-scale';
import { metricUnitPrefixes } from './models/metric-unit-prefixes';
import { UnitTranslation } from './models/unit-translation';

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
        super(VoltUnitScale.unitTranslations, metricUnitPrefixes);
    }
}

export const voltUnitScale = new VoltUnitScale();
