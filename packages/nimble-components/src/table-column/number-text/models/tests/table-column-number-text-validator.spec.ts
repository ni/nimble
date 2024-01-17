import { TableColumnNumberTextValidator } from '../table-column-number-text-validator';
import { NumberTextFormat } from '../../types';

describe('TableColumnNumberTextValidator', () => {
    let validator: TableColumnNumberTextValidator;

    beforeEach(() => {
        validator = new TableColumnNumberTextValidator();
    });

    it('is valid with valid "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 5);
        expect(validator.isValid()).toBeTrue();
        expect(validator.getValidity().invalidDecimalDigits).toBeFalse();
    });

    it('is valid with minimum "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 0);
        expect(validator.isValid()).toBeTrue();
        expect(validator.getValidity().invalidDecimalDigits).toBeFalse();
    });

    it('is valid with maximum "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 20);
        expect(validator.isValid()).toBeTrue();
        expect(validator.getValidity().invalidDecimalDigits).toBeFalse();
    });

    it('is invalid with negative "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, -1);
        expect(validator.isValid()).toBeFalse();
        expect(validator.getValidity().invalidDecimalDigits).toBeTrue();
    });

    it('is invalid with too large "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 21);
        expect(validator.isValid()).toBeFalse();
        expect(validator.getValidity().invalidDecimalDigits).toBeTrue();
    });

    it('is valid with invalid "decimal-digits" and non-"decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.default, -1);
        expect(validator.isValid()).toBeTrue();
        expect(validator.getValidity().invalidDecimalDigits).toBeFalse();
    });
});
