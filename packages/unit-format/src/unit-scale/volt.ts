import { ScaledUnit } from '../scaled-unit/scaled-unit.js';
import { UnitScale } from './unit-scale.js';
import { metricPrefixes } from './utilities/metrix-prefixes.js';
import {
    ManuallyTranslatedScaledUnitFormat,
    type UnitTranslations,
    UnitTranslation
} from '../scaled-unit-format/manually-translated.js';

const unitTranslations: UnitTranslations = new Map([
    ['en', new UnitTranslation('volt', 'volts', 'V')],
    ['fr', new UnitTranslation('volt', 'volts', 'V')],
    ['de', new UnitTranslation('Volt', 'Volt', 'V')],
    ['ja', new UnitTranslation('ボルト', 'ボルト', 'V')],
    ['zh', new UnitTranslation('伏特', '伏特', 'V')]
]);

/**
 * Voltage unit scale
 */
class VoltUnitScale extends UnitScale {
    public constructor() {
        super(
            metricPrefixes.map(
                ([scaleFactor, scaledPrefixText]) => new ScaledUnit(
                    scaleFactor,
                    ManuallyTranslatedScaledUnitFormat.createFactory({
                        unitTranslations,
                        scaledPrefixText
                    })
                )
            )
        );
    }
}

export const voltUnitScale = new VoltUnitScale();
