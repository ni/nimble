import { Icon } from '../../../icon-base';
import { ColumnValidator } from '../../base/models/column-validator';
import { TableColumnMappingValidationHelper } from '../../mapping-base/models/column-validator';
import { mappingColumnValidityFlagNames } from '../../mapping/models/column-validator';
import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';

export const iconColumnValidityFlagNames = [
    ...mappingColumnValidityFlagNames,
    'invalidIconName'
] as const;

/**
 * Validator for TableColumnIcon
 */
export class TableColumnIconValidator extends ColumnValidator<
    typeof iconColumnValidityFlagNames
> {
    public validateKeyValuesForType(keys: unknown[], keyType: string): void {
        const invalid = TableColumnMappingValidationHelper.invalidMappingKeyValueForType(
            keys,
            keyType
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    public validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = TableColumnMappingValidationHelper.multipleDefaultMappings(
            mappings
        );
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    public validateMappingTypes(
        mappings: Mapping[],
        allowedMappingTypes: (typeof Mapping)[]
    ): void {
        const invalid = TableColumnMappingValidationHelper.unsupportedMappingType(
            mappings,
            allowedMappingTypes
        );
        this.setConditionValue('unsupportedMappingType', invalid);
    }

    public validateUniqueKeys(keys: unknown[]): void {
        const invalid = TableColumnMappingValidationHelper.duplicateMappingKey(keys);
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    public validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = TableColumnMappingValidationHelper.missingKeyValue(mappings);
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
