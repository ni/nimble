import { nullableNumberConverter } from '@microsoft/fast-element';
import type { Mapping } from '../../../mapping/base';

/**
 * Helper to share logic between the enum-text and icon column validators
 */
export class TableColumnEnumValidationHelper {
    public static invalidMappingKeyValueForType(
        keys: unknown[],
        keyType: string
    ): boolean {
        let invalid = false;
        if (keyType === 'number') {
            invalid = keys.some(
                x => x !== undefined
                    && nullableNumberConverter.fromView(x) === null
            );
        } else if (keyType === 'boolean') {
            // never invalid
        } else {
            invalid = keys.some(x => x === null);
        }

        return invalid;
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
