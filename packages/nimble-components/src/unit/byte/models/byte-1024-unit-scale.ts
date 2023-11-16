import { ManuallyTranslatedUnitScale } from '../../base/models/manually-translated-unit-scale';
import { UnitPrefix } from '../../base/models/unit-prefix';
import { UnitTranslation } from '../../base/models/unit-translation';

/**
 * Byte units (1024-based)
 */
export class Byte1024UnitScale extends ManuallyTranslatedUnitScale {
    private static readonly unitTranslations = new Map<string, UnitTranslation>(
        [
            ['en', new UnitTranslation('byte', 'bytes', 'B')],
            ['fr', new UnitTranslation('octet', 'octets', 'o')],
            ['de', new UnitTranslation('Byte', 'Byte', 'B')],
            ['ja', new UnitTranslation('バイト', 'バイト', 'B')],
            ['zh', new UnitTranslation('字节', '字节', 'B')]
        ]
    );

    private static readonly unitPrefixes = [
        new UnitPrefix(1024, 'Ki'),
        new UnitPrefix(1024 ** 2, 'Mi'),
        new UnitPrefix(1024 ** 3, 'Gi'),
        new UnitPrefix(1024 ** 4, 'Ti'),
        new UnitPrefix(1024 ** 5, 'Pi')
    ] as const;

    // Need unitTranslations and unitPrefixes to be initialized before construction
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly instance = new Byte1024UnitScale();

    private constructor() {
        super();
    }

    protected override getUnitTranslations(): ReadonlyMap<
    string,
    UnitTranslation
    > {
        return Byte1024UnitScale.unitTranslations;
    }

    protected override getSupportedPrefixes(): readonly UnitPrefix[] {
        return Byte1024UnitScale.unitPrefixes;
    }
}
