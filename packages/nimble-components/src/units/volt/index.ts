import { DesignSystem } from '@microsoft/fast-foundation';
import { ManuallyTranslatedUnitScale } from '../base/manually-translated-unit-scale';
import { metricPrefixes, type UnitPrefix } from '../base/unit-prefix';
import { UnitTranslation } from '../base/unit-translation';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-volt': UnitVolt;
    }
}

/**
 * Element representing units for volts
 */
export class UnitVolt extends ManuallyTranslatedUnitScale {
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

const nimbleUnitVolt = UnitVolt.compose({
    baseName: 'unit-volt',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitVolt());
export const unitVoltTag = DesignSystem.tagFor(UnitVolt);
