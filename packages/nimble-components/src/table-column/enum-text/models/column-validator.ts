import { ColumnValidator } from '../../base/models/column-validator';
import { TableColumnEnumValidationHelper } from '../../enum-base/models/column-validator';
import type { Mapping } from '../../../mapping/base';
import type {
    MappingKeyType,
    MappingKeyValue
} from '../../../mapping/base/types';

export const enumTextColumnValidityFlagNames = [
    'invalidMappingKeyValueForType',
    'multipleDefaultMappings',
    'unsupportedMappingType',
    'duplicateMappingKey',
    'missingKeyValue'
] as const;

/**
 * Validator for TableColumnEnumText
 */
export class TableColumnEnumTextValidator extends ColumnValidator<
    typeof enumTextColumnValidityFlagNames
> {
    public validateKeyValuesForType(
        keys: (MappingKeyValue | undefined)[],
        keyType: MappingKeyType
    ): void {
        const invalid = TableColumnEnumValidationHelper.invalidMappingKeyValueForType(
            keys,
            keyType
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    public validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = TableColumnEnumValidationHelper.multipleDefaultMappings(mappings);
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    public validateMappingTypes(
        mappings: Mapping[],
        allowedMappingTypes: readonly (typeof Mapping)[]
    ): void {
        const invalid = TableColumnEnumValidationHelper.unsupportedMappingType(
            mappings,
            allowedMappingTypes
        );
        this.setConditionValue('unsupportedMappingType', invalid);
    }

    public validateUniqueKeys(keys: (MappingKeyValue | null)[]): void {
        const invalid = TableColumnEnumValidationHelper.duplicateMappingKey(keys);
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    public validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = TableColumnEnumValidationHelper.missingKeyValue(mappings);
        this.setConditionValue('missingKeyValue', invalid);
    }
}
