import { ManuallyTranslatedUnitScaleFormatter } from './manually-translated-unit-scale-formatter';
import { UnitPrefix } from './unit-prefix';
import { UnitTranslation } from './unit-translation';

/**
 * Formatter for numbers with byte units (1024-based)
 */
export class Byte1024ScaleFormatter extends ManuallyTranslatedUnitScaleFormatter {
    protected override getUnitTranslations(): Map<string, UnitTranslation> {
        const unitTranslations = new Map<string, UnitTranslation>();
        unitTranslations.set('en', new UnitTranslation('byte', 'bytes', 'B'));
        unitTranslations.set('fr', new UnitTranslation('octet', 'octets', 'o'));
        unitTranslations.set('de', new UnitTranslation('Byte', 'Byte', 'B'));
        unitTranslations.set(
            'ja',
            new UnitTranslation('バイト', 'バイト', 'B')
        );
        unitTranslations.set('zh', new UnitTranslation('字节', '字节', 'B'));
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
