import { ColumnValidator } from '../../base/models/column-validator';
import type { Mapping } from '../../../mapping/base';
import type { MappingKeyType } from '../types';
import { resolveKeyWithType } from './mapping-key-resolver';

export const enumBaseValidityFlagNames = [
    'invalidMappingKeyValueForType',
    'duplicateMappingKey',
    'missingKeyValue'
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
        configValidityKeys: ValidityFlagNames
    ) {
        super(configValidityKeys);
    }

    public validate(
        mappings: Mapping<unknown>[],
        keyType: MappingKeyType
    ): void {
        this.untrackAll();
        const keys = mappings.map(mapping => mapping.key);
        this.validateKeyValuesForType(keys, keyType);
        this.validateUniqueKeys(keys, keyType);
        this.validateNoMissingKeys(mappings);
    }

    private validateKeyValuesForType(
        keys: unknown[],
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

    private validateUniqueKeys(keys: unknown[], keyType: MappingKeyType): void {
        const typedKeys = keys.map(x => resolveKeyWithType(x, keyType));
        const invalid = new Set(typedKeys).size !== typedKeys.length;
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    private validateNoMissingKeys(mappings: Mapping<unknown>[]): void {
        const invalid = mappings.some(mapping => mapping.key === undefined);
        this.setConditionValue('missingKeyValue', invalid);
    }
}
