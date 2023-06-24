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
            x => x !== undefined
                && resolveKeyWithType(x, keyType) === undefined
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    private validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = mappings.filter(x => x.defaultMapping).length > 1;
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    private validateMappingTypes(
        mappings: Mapping[],
        supportedMappingElements: readonly (typeof Mapping)[]
    ): void {
        // const valid = mappings.every(mapping => allowedMappingTypes.some(allowedMapping => mapping instanceof allowedMapping));
        const valid = mappings.some(
            x => supportedMappingElements.filter(y => x instanceof y).length === 0
        );
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private validateUniqueKeys(keys: (MappingKey | undefined)[]): void {
        const invalid = new Set(keys).size !== keys.length;
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    private validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = mappings.filter(x => x.key === undefined && !x.defaultMapping).length > 0;
        this.setConditionValue('missingKeyValue', invalid);
    }
}
