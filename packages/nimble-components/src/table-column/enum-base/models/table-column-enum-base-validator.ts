import { nullableNumberConverter } from '@microsoft/fast-element';
import { ColumnValidator } from '../../base/models/column-validator';
import type { Mapping } from '../../../mapping/base';
import type { MappingKey } from '../../../mapping/base/types';
import type { MappingKeyType } from '../types';

export const enumBaseValidityFlagNames = [
    'invalidMappingKeyValueForType',
    'multipleDefaultMappings',
    'unsupportedMappingType',
    'duplicateMappingKey',
    'missingKeyValue'
] as const;

/**
 * Converts a Mapping key (which is a string when configured in HTML) to the
 * given keyType. The converted value can then be used to compare against
 * values in the table data.
 */
const typeConvertKey = (
    key: MappingKey | undefined,
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

/**
 * Validator for TableColumnEnumText
 */
export class TableColumnEnumBaseValidator<AdditionalFlagNames extends readonly string[]> extends ColumnValidator<
typeof enumBaseValidityFlagNames | AdditionalFlagNames
> {
    protected validateKeyValuesForType(
        keys: (MappingKey | undefined)[],
        keyType: MappingKeyType
    ): void {
        const invalid = keys.some(
            x => x !== undefined
                && typeConvertKey(x, keyType) === undefined
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    protected validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = mappings.filter(x => x.defaultMapping).length > 1;
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    protected validateMappingTypes(
        mappings: Mapping[],
        allowedMappingTypes: readonly (typeof Mapping)[]
    ): void {
        // const valid = mappings.every(mapping => allowedMappingTypes.some(allowedMapping => mapping instanceof allowedMapping));
        const valid = mappings.some(
            x => allowedMappingTypes.filter(y => x instanceof y).length === 0
        );
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    protected validateUniqueKeys(keys: (MappingKey | undefined)[]): void {
        const invalid = new Set(keys).size !== keys.length;
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    protected validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = mappings.filter(x => x.key === undefined && !x.defaultMapping).length > 0;
        this.setConditionValue('missingKeyValue', invalid);
    }
}
