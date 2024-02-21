import { nullableNumberConverter } from '@microsoft/fast-element';
import type { MappingKey } from '../../../mapping/base/types';
import type { MappingKeyType } from '../types';

/**
 * Converts a Mapping key (which is a string when configured in HTML) to the
 * given keyType. The converted value can then be used to compare against
 * values in the table data.
 */
export const resolveKeyWithType = (
    key: unknown,
    keyType: MappingKeyType
): MappingKey | undefined => {
    if (keyType === 'number') {
        const converted = nullableNumberConverter.fromView(key) as
            | number
            | null;
        return converted === null ? undefined : converted;
    }
    if (keyType === 'boolean') {
        if (key === false || key === 'false') {
            return false;
        }
        if (key === true || key === 'true') {
            return true;
        }
        return undefined;
    }
    return key?.toString() ?? undefined;
};
