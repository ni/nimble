import type { Mapping } from '../../../mapping/base';
import type { ColumnInternals } from '../../base/models/column-internals';
import {
    TableColumnEnumBaseValidator,
    enumBaseValidityFlagNames
} from '../../enum-base/models/table-column-enum-base-validator';

const enumTextValidityFlagNames = [...enumBaseValidityFlagNames] as const;

/**
 * Validator for TableColumnEnumText
 */
export class TableColumnEnumTextValidator extends TableColumnEnumBaseValidator<
    typeof enumTextValidityFlagNames
> {
    public constructor(
        columnInternals: ColumnInternals<unknown>,
        supportedMappingElements: readonly (typeof Mapping)[]
    ) {
        super(
            columnInternals,
            enumTextValidityFlagNames,
            supportedMappingElements
        );
    }
}
