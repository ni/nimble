import { ColumnValidator } from '../../base/models/column-validator';

const dateTextValidityFlagNames = ['invalidCustomOptionsCombination'] as const;

/**
 * Validator for TableColumnDateText.
 */
export class TableColumnDateTextValidator extends ColumnValidator<
    typeof dateTextValidityFlagNames
> {
    public constructor() {
        super(dateTextValidityFlagNames);
    }

    public setCustomOptionsValidity(valid: boolean): void {
        this.setConditionValue('invalidCustomOptionsCombination', !valid);
    }
}
