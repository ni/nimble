import { ManuallyTranslatedUnitScaleFormatter } from '../../../table-column/number-text/models/manually-translated-unit-scale-formatter';
import {
    UnitPrefix,
    metricPrefixes
} from '../../../table-column/number-text/models/unit-prefix';
import { UnitTranslation } from '../../../table-column/number-text/models/unit-translation';

/**
 * Formatter for numbers with voltage units
 */
export class VoltUnitScaleFormatter extends ManuallyTranslatedUnitScaleFormatter {
    protected override getUnitTranslations(): Map<string, UnitTranslation> {
        const unitTranslations = new Map<string, UnitTranslation>();
        unitTranslations.set('en', new UnitTranslation('volt', 'volts', 'V'));
        unitTranslations.set('fr', new UnitTranslation('volt', 'volts', 'V'));
        unitTranslations.set('de', new UnitTranslation('Volt', 'Volt', 'V'));
        unitTranslations.set(
            'ja',
            new UnitTranslation('ボルト', 'ボルト', 'V')
        );
        unitTranslations.set('zh', new UnitTranslation('伏特', '伏特', 'V'));
        return unitTranslations;
    }

    protected override getSupportedPrefixes(): UnitPrefix[] {
        return metricPrefixes;
    }
}
