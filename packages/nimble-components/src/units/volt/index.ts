import { DesignSystem } from '@microsoft/fast-foundation';
import { ManuallyTranslatedUnitFamily } from '../base/manually-translated-unit-family';
import { metricPrefixes, type UnitPrefix } from '../base/unit-prefix';
import { UnitTranslation } from '../base/unit-translation';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-family-volt': UnitFamilyVolt;
    }
}

/**
 * Element representing units for volts
 */
export class UnitFamilyVolt extends ManuallyTranslatedUnitFamily {
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

const nimbleUnitFamilyVolt = UnitFamilyVolt.compose({
    baseName: 'unit-family-volt',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleUnitFamilyVolt());
export const unitFamilyVoltTag = DesignSystem.tagFor(UnitFamilyVolt);
