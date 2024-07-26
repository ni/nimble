import { ScaledUnit } from '../scaled-unit/scaled-unit';
import { UnitScale } from './unit-scale';
import {
    ManuallyTranslatedScaledUnitFormat,
    UnitTranslations,
    UnitTranslation
} from '../scaled-unit-format/manually-translated-scaled-unit-format';

const unitTranslations: UnitTranslations = new Map([
    ['en', new UnitTranslation('byte', 'bytes', 'B')],
    ['fr', new UnitTranslation('octet', 'octets', 'o')],
    ['de', new UnitTranslation('Byte', 'Byte', 'B')],
    ['ja', new UnitTranslation('バイト', 'バイト', 'B')],
    ['zh', new UnitTranslation('字节', '字节', 'B')]
]);

const byte1024Prefixes = [
    [1024 ** 0, ''],
    [1024 ** 1, 'Ki'],
    [1024 ** 2, 'Mi'],
    [1024 ** 3, 'Gi'],
    [1024 ** 4, 'Ti'],
    [1024 ** 5, 'Pi']
] as const;

/**
 * Byte units (1024-based)
 */
class Byte1024UnitScale extends UnitScale {
    public constructor() {
        super(
            byte1024Prefixes.map(
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

export const byte1024UnitScale = new Byte1024UnitScale();
