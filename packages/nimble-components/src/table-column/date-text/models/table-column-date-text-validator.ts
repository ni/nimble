import type { ColumnInternals } from '../../base/models/column-internals';
import { ColumnValidator } from '../../base/models/column-validator';

const dateTextValidityFlagNames = ['invalidCustomOptionsCombination'] as const;

/**
 * Validator for TableColumnDateText.
 */
export class TableColumnDateTextValidator extends ColumnValidator<
    typeof dateTextValidityFlagNames
> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, dateTextValidityFlagNames);
    }

    public setCustomOptionsValidity(valid: boolean): void {
        this.setConditionValue('invalidCustomOptionsCombination', !valid);
    }
}
