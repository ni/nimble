import { Mapping } from '../../../mapping/base';
import type { MappingKeyType } from '../types';

/**
 * Helper to share logic between the enum-text and icon column validators
 */
export class TableColumnEnumValidationHelper {
    public static invalidMappingKeyValueForType(
        keys: (string | boolean | number | undefined)[],
        keyType: MappingKeyType
    ): boolean {
        return keys.some(
            x => x !== undefined && Mapping.typeConvertKey(x, keyType) === null
        );
    }

    public static multipleDefaultMappings(mappings: Mapping[]): boolean {
        return mappings.filter(x => x.defaultMapping).length > 1;
    }

    public static unsupportedMappingType(
        mappings: Mapping[],
        allowedMappingTypes: readonly (typeof Mapping)[]
    ): boolean {
        return mappings.some(
            x => allowedMappingTypes.filter(y => x instanceof y).length === 0
        );
    }

    public static duplicateMappingKey(keys: unknown[]): boolean {
        return new Set(keys).size !== keys.length;
    }

    public static missingKeyValue(mappings: Mapping[]): boolean {
        return (
            mappings.filter(x => x.key === undefined && !x.defaultMapping)
                .length > 0
        );
    }
}
