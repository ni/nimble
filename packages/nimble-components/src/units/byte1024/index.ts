import { DesignSystem } from '@microsoft/fast-foundation';
import { ManuallyTranslatedUnitFamily } from '../base/manually-translated-unit-family';
import { UnitPrefix } from '../base/unit-prefix';
import { UnitTranslation } from '../base/unit-translation';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-family-byte-1024': UnitFamilyByte1024;
    }
}

/**
 * TODO
 */
export class UnitFamilyByte1024 extends ManuallyTranslatedUnitFamily {
    protected override getUnitTranslations(): Map<string, UnitTranslation> {
        const unitTranslations = new Map<string, UnitTranslation>();
        unitTranslations.set('en', new UnitTranslation('byte', 'bytes', 'B'));
        unitTranslations.set('fr', new UnitTranslation('octet', 'octets', 'o'));
        unitTranslations.set('de', new UnitTranslation('Byte', 'Byte', 'V'));
        return unitTranslations;
    }

    protected override getSupportedPrefixes(): UnitPrefix[] {
        return [
            new UnitPrefix(1024, 'Ki'),
            new UnitPrefix(1024 ** 2, 'Mi'),
            new UnitPrefix(1024 ** 3, 'Gi'),
            new UnitPrefix(1024 ** 4, 'Ti'),
            new UnitPrefix(1024 ** 5, 'Pi')
        ];
    }
}

const nimbleUnitFamilyByte1024 = UnitFamilyByte1024.compose({
    baseName: 'unit-family-byte-1024',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleUnitFamilyByte1024());
export const unitFamilyByte1024Tag = DesignSystem.tagFor(UnitFamilyByte1024);
