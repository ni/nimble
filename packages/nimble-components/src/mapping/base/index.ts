import { attr, booleanConverter, nullableNumberConverter, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { ConvertedKeyMapping } from '../../table-column/enum-base';

/**
 * An element to be given as content to a nimble-table-column-mapping or nimble-table-column-icon.
 * This is a base class from which other specific mapping types (e.g. MappingIcon, MappingText) are derived.
 */
export abstract class Mapping extends FoundationElement {
    @attr({ mode: 'fromView' })
    public key?: string | number | boolean;

    @attr({ attribute: 'default-mapping', mode: 'boolean' })
    public defaultMapping = false;

    public abstract getConvertedKeyMapping(keyType: 'string' | 'number' | 'boolean'): ConvertedKeyMapping;

    protected typeConvertKey(key: string | boolean | number | undefined, keyType: 'string' | 'number' | 'boolean'): string | boolean | number | null {
        if (keyType === 'number') {
            return nullableNumberConverter.fromView(
                key
            ) as number;
        }
        if (keyType === 'boolean') {
            return key === undefined
                ? null
                : (booleanConverter.fromView(key) as boolean);
        }
        return key === undefined ? null : key.toString();
    }
}
