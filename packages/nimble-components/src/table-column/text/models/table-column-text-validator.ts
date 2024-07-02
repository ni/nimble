import { ColumnValidator } from '../../base/models/column-validator';

export const columnTextValidityFlagNames = [
    'invalidCustomSortWithGrouping'
] as const;

/**
 * Validator class for the text table column.
 */
export class TableColumnTextValidator extends ColumnValidator<
    typeof columnTextValidityFlagNames
> {
    public constructor() {
        super(columnTextValidityFlagNames);
    }
}
