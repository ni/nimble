import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingConfig, MappingKeyType, MappingKeyValue } from './types';

/**
 * An element to be given as content to a nimble-table-column-mapping or nimble-table-column-icon.
 * This is a base class from which other specific mapping types (e.g. MappingIcon, MappingText) are derived.
 */
export abstract class Mapping extends FoundationElement {
    @attr({ mode: 'fromView' })
    public key?: MappingKeyValue;

    @attr({ attribute: 'default-mapping', mode: 'boolean' })
    public defaultMapping = false;

    /**
     * Converts a Mapping key (which is a string when configured in HTML) to the
     * given keyType. The converted value can then be used to compare against
     * values in the table data.
     */
    public static typeConvertKey(
        key: MappingKeyValue | undefined,
        keyType: MappingKeyType
    ): MappingKeyValue | undefined {
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
    }

    public abstract getMappingConfig(keyType: MappingKeyType): MappingConfig;
}
