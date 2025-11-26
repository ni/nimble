import { TableColumnNumberTextValidator } from '../table-column-number-text-validator';
import { NumberTextFormat } from '../../types';
import { unitByteTag } from '../../../../unit/byte';

describe('TableColumnNumberTextValidator', () => {
    let validator: TableColumnNumberTextValidator;

    beforeEach(() => {
        validator = new TableColumnNumberTextValidator();
    });

    it('is valid with valid "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 5);
        expect(validator.isValid()).toBe(true);
        expect(validator.getValidity().invalidDecimalDigits).toBe(false);
    });

    it('is valid with minimum "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 0);
        expect(validator.isValid()).toBe(true);
        expect(validator.getValidity().invalidDecimalDigits).toBe(false);
    });

    it('is valid with maximum "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 20);
        expect(validator.isValid()).toBe(true);
        expect(validator.getValidity().invalidDecimalDigits).toBe(false);
    });

    it('is invalid with negative "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, -1);
        expect(validator.isValid()).toBe(false);
        expect(validator.getValidity().invalidDecimalDigits).toBe(true);
    });

    it('is invalid with too large "decimal-digits" and "decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.decimal, 21);
        expect(validator.isValid()).toBe(false);
        expect(validator.getValidity().invalidDecimalDigits).toBe(true);
    });

    it('is valid with invalid "decimal-digits" and non-"decimal" format', () => {
        validator.validateDecimalDigits(NumberTextFormat.default, -1);
        expect(validator.isValid()).toBe(true);
        expect(validator.getValidity().invalidDecimalDigits).toBe(false);
    });

    it('is valid with no units', () => {
        validator.validateAtMostOneUnit([]);
        expect(validator.isValid()).toBe(true);
        expect(validator.getValidity().moreThanOneUnitSpecified).toBe(false);
    });

    it('is valid with one unit', () => {
        validator.validateAtMostOneUnit([document.createElement(unitByteTag)]);
        expect(validator.isValid()).toBe(true);
        expect(validator.getValidity().moreThanOneUnitSpecified).toBe(false);
    });

    it('is invalid with more than one unit', () => {
        validator.validateAtMostOneUnit([
            document.createElement(unitByteTag),
            document.createElement(unitByteTag)
        ]);
        expect(validator.isValid()).toBe(false);
        expect(validator.getValidity().moreThanOneUnitSpecified).toBe(true);
    });
});
