import { ColumnValidator } from '../../base/models/column-validator';
import type { ColumnInternals } from '../../base/models/column-internals';
import type { Mapping } from '../../../mapping/base';
import type { MappingKey } from '../../../mapping/base/types';
import type { MappingKeyType } from '../types';
import { resolveKeyWithType } from './mapping-key-resolver';

export const enumBaseValidityFlagNames = [
    'invalidMappingKeyValueForType',
    'unsupportedMappingType',
    'duplicateMappingKey',
    'missingKeyValue',
    'missingTextValue'
] as const;

/**
 * Validator for TableColumnEnumText. Implementations MUST include enumBaseValidityFlagNames in validity flag names set.
 */
export abstract class TableColumnEnumBaseValidator<
    ValidityFlagNames extends readonly string[]
> extends ColumnValidator<
    typeof enumBaseValidityFlagNames | ValidityFlagNames
    > {
    public constructor(
        columnInternals: ColumnInternals<unknown>,
        configValidityKeys: ValidityFlagNames,
        private readonly supportedMappingElements: readonly (typeof Mapping)[]
    ) {
        super(columnInternals, configValidityKeys);
    }

    public validate(mappings: Mapping[], keyType: MappingKeyType): void {
        this.untrackAll();
        const keys = mappings.map(mapping => mapping.key);
        this.validateKeyValuesForType(keys, keyType);
        this.validateMappingTypes(mappings);
        this.validateUniqueKeys(keys, keyType);
        this.validateNoMissingKeys(mappings);
        this.validateNoMissingText(mappings);
    }

    private validateKeyValuesForType(
        keys: (MappingKey | undefined)[],
        keyType: MappingKeyType
    ): void {
        // Ignore undefined keys, because validateNoMissingKeys covers that case.
        // We should only set 'invalidMappingKeyValueForType' when there is a key,
        // but it isn't appropriate for the type.
        const invalid = keys.some(
            key => key !== undefined
                && resolveKeyWithType(key, keyType) === undefined
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    private validateMappingTypes(mappings: Mapping[]): void {
        const valid = mappings.every(mapping => this.supportedMappingElements.some(
            mappingClass => mapping instanceof mappingClass
        ));
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private validateUniqueKeys(
        keys: (MappingKey | undefined)[],
        keyType: MappingKeyType
    ): void {
        const typedKeys = keys.map(x => resolveKeyWithType(x, keyType));
        const invalid = new Set(typedKeys).size !== typedKeys.length;
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    private validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = mappings.some(mapping => mapping.key === undefined);
        this.setConditionValue('missingKeyValue', invalid);
    }

    private validateNoMissingText(mappings: Mapping[]): void {
        const invalid = mappings.some(mapping => mapping.text === undefined);
        this.setConditionValue('missingTextValue', invalid);
    }
}
