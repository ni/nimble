import { ColumnValidator } from '../../base/models/column-validator';
import { NumberTextFormat } from '../types';

const numberTextValidityFlagNames = [
    'invalidDecimalDigits',
    'invalidDecimalMaximumDigits',
    'decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits'
] as const;

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
    public constructor() {
        super(numberTextValidityFlagNames);
    }

    public validateDecimalDigits(
        format: NumberTextFormat,
        decimalDigits: number | undefined
    ): void {
        const shouldValidateDecimalDigitsValue = format === NumberTextFormat.decimal
            && typeof decimalDigits === 'number';
        const invalid = shouldValidateDecimalDigitsValue
            ? this.isInvalidDecimalDigitsValue(decimalDigits)
            : false;
        this.setConditionValue('invalidDecimalDigits', invalid);
    }

    public validateDecimalMaximumDigits(
        format: NumberTextFormat,
        decimalMaximumDigits: number | undefined
    ): void {
        const shouldValidateDecimalDigitsValue = format === NumberTextFormat.decimal
            && typeof decimalMaximumDigits === 'number';
        const invalid = shouldValidateDecimalDigitsValue
            ? this.isInvalidDecimalDigitsValue(decimalMaximumDigits)
            : false;
        this.setConditionValue('invalidDecimalMaximumDigits', invalid);
    }

    public validateNoMutuallyExclusiveProperties(
        format: NumberTextFormat,
        decimalDigits: number | undefined,
        decimalMaximumDigits: number | undefined
    ): void {
        const shouldValidateMutuallyExclusiveProperties = format === NumberTextFormat.decimal;
        const invalid = shouldValidateMutuallyExclusiveProperties
            ? typeof decimalDigits === 'number'
              && typeof decimalMaximumDigits === 'number'
            : false;
        this.setConditionValue(
            'decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits',
            invalid
        );
    }

    private isInvalidDecimalDigitsValue(decimalDigits: number): boolean {
        return (
            decimalDigits < minimumValidDecimalDigits
            || decimalDigits > maximumValidDecimalDigits
        );
    }
}
