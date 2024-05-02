import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';
import { MappingSpinner } from '../../../mapping/spinner';
import { MappingText } from '../../../mapping/text';
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
 * Validator for TableColumnMapping
 */
export class TableColumnMappingValidator extends TableColumnEnumBaseValidator<
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
    ): mapping is MappingIcon | MappingSpinner | MappingText {
        return (
            mapping instanceof MappingIcon
            || mapping instanceof MappingSpinner
            || mapping instanceof MappingText
        );
    }

    private static hasUnresolvedIcon(mappingIcon: MappingIcon): boolean {
        return (
            typeof mappingIcon.icon === 'string'
            && mappingIcon.resolvedIcon === undefined
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
            .filter(TableColumnMappingValidator.isIconMappingElement)
            .some(TableColumnMappingValidator.hasUnresolvedIcon);
        this.setConditionValue('invalidIconName', invalid);
    }

    private validateNoMissingText(mappings: Mapping<unknown>[]): void {
        const invalid = mappings
            .filter(TableColumnMappingValidator.isSupportedMappingElement)
            .some(mapping => mapping.text === undefined);
        this.setConditionValue('missingTextValue', invalid);
    }

    private validateMappingTypes(mappings: Mapping<unknown>[]): void {
        const valid = mappings.every(
            TableColumnMappingValidator.isSupportedMappingElement
        );
        this.setConditionValue('unsupportedMappingType', !valid);
    }
}
