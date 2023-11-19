import type { Mapping } from '../../../mapping/base';
import { MappingText } from '../../../mapping/text';
import type { ColumnInternals } from '../../base/models/column-internals';
import {
    TableColumnEnumBaseValidator,
    enumBaseValidityFlagNames
} from '../../enum-base/models/table-column-enum-base-validator';
import type { MappingKeyType } from '../../enum-base/types';

const enumTextValidityFlagNames = [
    ...enumBaseValidityFlagNames,
    'unsupportedMappingType',
    'missingTextValue'
] as const;

/**
 * Validator for TableColumnEnumText
 */
export class TableColumnEnumTextValidator extends TableColumnEnumBaseValidator<
    typeof enumTextValidityFlagNames
> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, enumTextValidityFlagNames);
    }

    private static isSupportedMappingElement(
        mapping: Mapping<unknown>
    ): mapping is MappingText {
        return mapping instanceof MappingText;
    }

    public override validate(
        mappings: Mapping<unknown>[],
        keyType: MappingKeyType
    ): void {
        super.validate(mappings, keyType);
        this.validateMappingTypes(mappings);
        this.validateNoMissingText(mappings);
    }

    private validateNoMissingText(mappings: Mapping<unknown>[]): void {
        const invalid = mappings
            .filter(TableColumnEnumTextValidator.isSupportedMappingElement)
            .some(mapping => mapping.text === undefined);
        this.setConditionValue('missingTextValue', invalid);
    }

    private validateMappingTypes(mappings: Mapping<unknown>[]): void {
        const valid = mappings.every(
            TableColumnEnumTextValidator.isSupportedMappingElement
        );
        this.setConditionValue('unsupportedMappingType', !valid);
    }

    private static isSupportedMappingElement(
        mapping: Mapping<unknown>
    ): mapping is MappingText {
        return mapping instanceof MappingText;
    }

    public override validate(
        mappings: Mapping<unknown>[],
        keyType: MappingKeyType
    ): void {
        super.validate(mappings, keyType);
        this.validateNoMissingText(mappings);
    }

    private validateNoMissingText(mappings: Mapping<unknown>[]): void {
        const invalid = mappings
            .filter(TableColumnEnumTextValidator.isSupportedMappingElement)
            .some(mapping => mapping.text === undefined);
        this.setConditionValue('missingTextValue', invalid);
    }
}
