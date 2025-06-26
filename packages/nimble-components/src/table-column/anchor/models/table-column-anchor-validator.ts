import { ColumnValidator } from '../../base/models/column-validator';

export const columnAnchorValidityFlagNames = [
    'invalidCustomSortWithGrouping'
] as const;

/**
 * Validator class for the anchor table column.
 */
export class TableColumnAnchorValidator extends ColumnValidator<
    typeof columnAnchorValidityFlagNames
> {
    public constructor() {
        super(columnAnchorValidityFlagNames);
    }
}
