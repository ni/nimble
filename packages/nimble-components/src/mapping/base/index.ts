import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingConfig } from '../../table-column/enum-base';

/**
 * An element to be given as content to a nimble-table-column-mapping or nimble-table-column-icon.
 * This is a base class from which other specific mapping types (e.g. MappingIcon, MappingText) are derived.
 */
export abstract class Mapping extends FoundationElement {
    @attr({ mode: 'fromView' })
    public key?: string | number | boolean;

    @attr({ attribute: 'default-mapping', mode: 'boolean' })
    public defaultMapping = false;

    public static typeConvertKey(
        key: string | boolean | number | undefined,
        keyType: 'string' | 'number' | 'boolean'
    ): string | boolean | number | null {
        if (keyType === 'number') {
            return nullableNumberConverter.fromView(key) as number;
        }
        if (keyType === 'boolean') {
            if (key === false || key === 'false') {
                return false;
            }
            if (key === true || key === 'true') {
                return true;
            }
            return null;
        }
        return key === undefined ? null : key.toString();
    }

    public abstract getConvertedKeyMapping(
        keyType: 'string' | 'number' | 'boolean'
    ): MappingConfig;
}
