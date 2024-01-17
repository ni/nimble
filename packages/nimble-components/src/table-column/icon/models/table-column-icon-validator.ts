import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';
import { MappingSpinner } from '../../../mapping/spinner';
import {
    TableColumnEnumBaseValidator,
    enumBaseValidityFlagNames
} from '../../enum-base/models/table-column-enum-base-validator';
import type { MappingKeyType } from '../../enum-base/types';

const iconValidityFlagNames = [
    ...enumBaseValidityFlagNames,
    'unsupportedMappingType',
    'invalidIconName',
    'missingTextValue'
] as const;

/**
 * Validator for TableColumnIcon
 */
export class TableColumnIconValidator extends TableColumnEnumBaseValidator<
    typeof iconValidityFlagNames
> {
    public constructor() {
        super(iconValidityFlagNames);
    }

    private static isIconMappingElement(
        mapping: Mapping<unknown>
    ): mapping is MappingIcon {
        return mapping instanceof MappingIcon;
    }

    private static isSupportedMappingElement(
        mapping: Mapping<unknown>
    ): mapping is MappingIcon | MappingSpinner {
        return (
            mapping instanceof MappingIcon || mapping instanceof MappingSpinner
        );
    }

    public override validate(
        mappings: Mapping<unknown>[],
        keyType: MappingKeyType
    ): void {
        super.validate(mappings, keyType);
        this.validateMappingTypes(mappings);
        this.validateIconNames(mappings);
        this.validateNoMissingText(mappings);
    }

    private validateIconNames(mappings: Mapping<unknown>[]): void {
        const invalid = mappings
            .filter(TableColumnIconValidator.isIconMappingElement)
            .some(mappingIcon => mappingIcon.resolvedIcon === undefined);
        this.setConditionValue('invalidIconName', invalid);
    }

    private validateNoMissingText(mappings: Mapping<unknown>[]): void {
        const invalid = mappings
            .filter(TableColumnIconValidator.isSupportedMappingElement)
            .some(mapping => mapping.text === undefined);
        this.setConditionValue('missingTextValue', invalid);
    }

    private validateMappingTypes(mappings: Mapping<unknown>[]): void {
        const valid = mappings.every(
            TableColumnIconValidator.isSupportedMappingElement
        );
        this.setConditionValue('unsupportedMappingType', !valid);
    }
}
