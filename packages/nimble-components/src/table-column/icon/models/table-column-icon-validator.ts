import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';
import { MappingSpinner } from '../../../mapping/spinner';
import type { ColumnInternals } from '../../base/models/column-internals';
import {
    TableColumnEnumBaseValidator,
    enumBaseValidityFlagNames
} from '../../enum-base/models/table-column-enum-base-validator';
import type { MappingKeyType } from '../../enum-base/types';

const iconValidityFlagNames = [
    ...enumBaseValidityFlagNames,
    'invalidIconName'
] as const;

/**
 * Validator for TableColumnIcon
 */
export class TableColumnIconValidator extends TableColumnEnumBaseValidator<
    typeof iconValidityFlagNames
> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, iconValidityFlagNames, [
            MappingIcon,
            MappingSpinner
        ]);
    }

    public override validate(
        mappings: Mapping<unknown>[],
        keyType: MappingKeyType
    ): void {
        super.validate(mappings, keyType);
        this.validateIconNames(mappings);
    }

    private validateIconNames(mappings: Mapping<unknown>[]): void {
        const isMappingIcon = (
            mapping: Mapping<unknown>
        ): mapping is MappingIcon => mapping instanceof MappingIcon;
        const invalid = mappings
            .filter(isMappingIcon)
            .some(mappingIcon => mappingIcon.resolvedIcon === undefined);
        this.setConditionValue('invalidIconName', invalid);
    }
}
