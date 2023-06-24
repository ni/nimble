import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';
import type { ColumnInternals } from '../../base/models/column-internals';
import { TableColumnEnumBaseValidator, enumBaseValidityFlagNames } from '../../enum-base/models/table-column-enum-base-validator';

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
        super(columnInternals, iconValidityFlagNames);
    }

    public validateIconNames(mappings: Mapping[]): void {
        const isMappingIcon = (mapping: Mapping): mapping is MappingIcon => mapping instanceof MappingIcon;
        const invalid = mappings
            .filter(isMappingIcon)
            .map(mappingIcon => mappingIcon.resolvedIcon)
            .some(resolvedIcon => resolvedIcon === undefined);
        this.setConditionValue('invalidIconName', invalid);
    }
}
