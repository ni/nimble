import { ManuallyTranslatedUnitScale } from './base/manually-translated-unit-scale';
import { UnitPrefix } from './base/unit-prefix';
import { UnitTranslation } from './base/unit-translation';

/**
 * Byte units (1024-based)
 */
class Byte1024UnitScale extends ManuallyTranslatedUnitScale {
    private static readonly unitTranslations: ReadonlyMap<
    string,
    UnitTranslation
    > = new Map([
            ['en', new UnitTranslation('byte', 'bytes', 'B')],
            ['fr', new UnitTranslation('octet', 'octets', 'o')],
            ['de', new UnitTranslation('Byte', 'Byte', 'B')],
            ['ja', new UnitTranslation('バイト', 'バイト', 'B')],
            ['zh', new UnitTranslation('字节', '字节', 'B')]
        ]);

    private static readonly unitPrefixes = [
        new UnitPrefix(1024 ** 0, ''),
        new UnitPrefix(1024 ** 1, 'Ki'),
        new UnitPrefix(1024 ** 2, 'Mi'),
        new UnitPrefix(1024 ** 3, 'Gi'),
        new UnitPrefix(1024 ** 4, 'Ti'),
        new UnitPrefix(1024 ** 5, 'Pi')
    ] as const;

    public constructor() {
        super(
            Byte1024UnitScale.unitTranslations,
            Byte1024UnitScale.unitPrefixes
        );
    }
}

export const byte1024UnitScale = new Byte1024UnitScale();
