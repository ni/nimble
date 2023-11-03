import { ManuallyTranslatedUnitScaleFormatter } from '../../base/models/manually-translated-unit-scale-formatter';
import { UnitPrefix, metricPrefixes } from '../../base/models/unit-prefix';
import { UnitTranslation } from '../../base/models/unit-translation';

/**
 * Formatter for numbers with voltage units
 */
export class VoltUnitScaleFormatter extends ManuallyTranslatedUnitScaleFormatter {
    private static readonly unitTranslations = new Map<string, UnitTranslation>(
        [
            ['en', new UnitTranslation('volt', 'volts', 'V')],
            ['fr', new UnitTranslation('volt', 'volts', 'V')],
            ['de', new UnitTranslation('Volt', 'Volt', 'V')],
            ['ja', new UnitTranslation('ボルト', 'ボルト', 'V')],
            ['zh', new UnitTranslation('伏特', '伏特', 'V')]
        ]
    );

    protected override getUnitTranslations(): ReadonlyMap<
    string,
    UnitTranslation
    > {
        return VoltUnitScaleFormatter.unitTranslations;
    }

    protected override getSupportedPrefixes(): readonly UnitPrefix[] {
        return metricPrefixes;
    }
}
