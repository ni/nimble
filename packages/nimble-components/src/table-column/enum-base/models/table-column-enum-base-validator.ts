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
 * Validator for TableColumnEnumText. Implementations MUST include enumBaseValidityFlagNames in validity flag names set.
 */
export abstract class TableColumnEnumBaseValidator<ValidityFlagNames extends readonly string[]> extends ColumnValidator<
typeof enumBaseValidityFlagNames | ValidityFlagNames
> {
    public validate(supportedMappingElements: readonly (typeof Mapping)[], mappings: Mapping[], keyType: MappingKeyType): void {
        this.untrackAll();
        const keys = mappings.map(mapping => mapping.key);
        this.validateKeyValuesForType(keys, keyType);
        this.validateAtMostOneDefaultMapping(mappings);
        this.validateMappingTypes(mappings, supportedMappingElements);
        this.validateUniqueKeys(keys);
        this.validateNoMissingKeys(mappings);
    }

    private validateKeyValuesForType(
        keys: (MappingKey | undefined)[],
        keyType: MappingKeyType
    ): void {
        const invalid = keys.some(
            key => key !== undefined
                && resolveKeyWithType(key, keyType) === undefined
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    private validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = mappings.filter(mapping => mapping.defaultMapping).length > 1;
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    private validateMappingTypes(
        mappings: Mapping[],
        supportedMappingElements: readonly (typeof Mapping)[]
    ): void {
        const valid = mappings.every(mapping => supportedMappingElements.some(mappingClass => mapping instanceof mappingClass));
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private validateUniqueKeys(keys: (MappingKey | undefined)[]): void {
        const invalid = new Set(keys).size !== keys.length;
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    private validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = mappings.filter(mapping => mapping.key === undefined && !mapping.defaultMapping).length > 0;
        this.setConditionValue('missingKeyValue', invalid);
    }
}
