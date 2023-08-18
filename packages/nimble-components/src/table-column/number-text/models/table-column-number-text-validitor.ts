import type { ColumnInternals } from '../../base/models/column-internals';
import { ColumnValidator } from '../../base/models/column-validator';
import { NumberTextFormat } from '../types';

const numberTextValidityFlagNames = ['invalidDecimalDigits'] as const;

// The maximum and minimum allowed configuration for 'maximumFractionDigits'
// and 'minimumFractionDigits' on the NumberFormat.
const minimumValidDecimalDigits = 0;
const maximumValidDecimalDigits = 20;

/**
 * Validator for TableColumnNumberText.
 */
export class TableColumnNumberTextValidator extends ColumnValidator<
    typeof numberTextValidityFlagNames
> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, numberTextValidityFlagNames);
    }

    public validateDecimalDigits(format: NumberTextFormat, decimalDigits: number | undefined): void {
        const shouldValidateDecimalDigitsValue = format === NumberTextFormat.decimal && typeof decimalDigits === 'number';
        const invalid = shouldValidateDecimalDigitsValue ? this.isInvalidDecimalDigitsValue(decimalDigits) : false;
        this.setConditionValue('invalidDecimalDigits', invalid);
    }

    private isInvalidDecimalDigitsValue(decimalDigits: number): boolean {
        return decimalDigits < minimumValidDecimalDigits || decimalDigits > maximumValidDecimalDigits;
    }
}
