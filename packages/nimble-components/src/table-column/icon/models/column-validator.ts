import { Icon } from '../../../icon-base';
import { ColumnValidator } from '../../base/models/column-validator';
import { TableColumnEnumValidationHelper } from '../../enum-base/models/column-validator';
import { enumTextColumnValidityFlagNames } from '../../enum-text/models/column-validator';
import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';
import type { MappingKeyType } from '../../enum-base/types';

export const iconColumnValidityFlagNames = [
    ...enumTextColumnValidityFlagNames,
    'invalidIconName'
] as const;

/**
 * Validator for TableColumnIcon
 */
export class TableColumnIconValidator extends ColumnValidator<
    typeof iconColumnValidityFlagNames
> {
    public validateKeyValuesForType(
        keys: unknown[],
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

    public validateUniqueKeys(keys: unknown[]): void {
        const invalid = TableColumnEnumValidationHelper.duplicateMappingKey(keys);
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    public validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = TableColumnEnumValidationHelper.missingKeyValue(mappings);
        this.setConditionValue('missingKeyValue', invalid);
    }

    public validateIconNames(mappings: Mapping[]): void {
        const invalid = mappings
            .filter(x => x instanceof MappingIcon)
            .map(x => (x as MappingIcon).icon)
            .some(x => !x || !this.iconIsValid(x));
        this.setConditionValue('invalidIconName', invalid);
    }

    private iconIsValid(name: string): boolean {
        return document.createElement(name) instanceof Icon;
    }
}
