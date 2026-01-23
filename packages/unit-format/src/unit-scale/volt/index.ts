import { ScaledUnit } from '../../scaled-unit/index.js';
import { UnitScale } from '../index.js';
import { metricPrefixes } from '../utilities/metric-prefixes.js';
import {
    ScaledUnitFormatManuallyTranslated,
    type UnitTranslations,
    UnitTranslation
} from '../../scaled-unit-format/manually-translated/index.js';

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
class UnitScaleVolt extends UnitScale {
    public constructor() {
        super(
            metricPrefixes.map(
                ([scaleFactor, scaledPrefixText]) => new ScaledUnit(
                    scaleFactor,
                    ScaledUnitFormatManuallyTranslated.createFactory({
                        unitTranslations,
                        scaledPrefixText
                    })
                )
            )
        );
    }
}

export const unitScaleVolt = new UnitScaleVolt();
