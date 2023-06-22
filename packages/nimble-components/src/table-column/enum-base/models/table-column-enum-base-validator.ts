import { ColumnValidator } from '../../base/models/column-validator';
import type { Mapping } from '../../../mapping/base';
import type { MappingKey } from '../../../mapping/base/types';
import type { MappingKeyType } from '../types';
import { resolveKeyWithType } from './mapping-key-resolver';

export const enumBaseValidityFlagNames = [
    'invalidMappingKeyValueForType',
    'multipleDefaultMappings',
    'unsupportedMappingType',
    'duplicateMappingKey',
    'missingKeyValue'
] as const;

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
                && resolveKeyWithType(x, keyType) === undefined
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
