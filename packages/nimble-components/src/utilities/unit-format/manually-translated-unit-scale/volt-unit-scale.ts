import { ManuallyTranslatedUnitScale } from './base/manually-translated-unit-scale';
import { unitPrefixesMetric } from './base/unit-prefixes-metric';
import { UnitTranslation } from './base/unit-translation';

/**
 * Voltage unit scale
 */
class VoltUnitScale extends ManuallyTranslatedUnitScale {
    public constructor() {
        super(
            new Map([
                ['en', new UnitTranslation('volt', 'volts', 'V')],
                ['fr', new UnitTranslation('volt', 'volts', 'V')],
                ['de', new UnitTranslation('Volt', 'Volt', 'V')],
                ['ja', new UnitTranslation('ボルト', 'ボルト', 'V')],
                ['zh', new UnitTranslation('伏特', '伏特', 'V')]
            ]),
            unitPrefixesMetric
        );
    }
}

export const voltUnitScale = new VoltUnitScale();
