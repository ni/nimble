import { TableValidator } from './table-validator';

describe('TableValidator', () => {
    it('setting valid field for ID is valid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting `undefined` field for ID is valid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, undefined);
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting `null` field for ID is valid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, null);
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting data with duplicate IDs is invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-1', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeTrue();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting data with invalid ID value type is invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'numberField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeTrue();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting data with empty ID value is invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: '', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeTrue();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting data with undefined ID value is invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: undefined, numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeTrue();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting data with null ID value is invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: undefined, numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeTrue();
        expect(validity.missingRowId).toBeFalse();
    });

    it('setting data with missing IDs is invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'missingField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeTrue();
    });

    it('multiple errors are reported during validation', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 },
            { stringField: 'value-1', numberField: 12 },
            { numberField: 12 },
            { stringField: true, numberField: 12 }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeTrue();
        expect(validity.invalidRowId).toBeTrue();
        expect(validity.missingRowId).toBeTrue();
    });

    it('setting ID field name to undefined makes configuration valid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        let isValid = validator.validateDataIds(data, 'missingField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();

        isValid = validator.validateDataIds(data, undefined);
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();
    });

    it('setting a valid ID field name makes an invalid configuration valid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        let isValid = validator.validateDataIds(data, 'missingField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();

        isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();
    });

    it('setting invalid ID field name makes a valid configuration invalid', () => {
        const data = [
            { stringField: 'value-1', numberField: 10 },
            { stringField: 'value-2', numberField: 11 }
        ];
        const validator = new TableValidator();

        let isValid = validator.validateDataIds(data, 'stringField');
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();

        isValid = validator.validateDataIds(data, 'missingField');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
    });

    it('ID field name can be an empty string', () => {
        const data = [
            // eslint-disable-next-line @typescript-eslint/naming-convention
            { stringField: 'value-1', numberField: 10, '': 'empty-1' },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            { stringField: 'value-2', numberField: 11, '': 'empty-2' }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, '');
        expect(isValid).toBeTrue();
        expect(validator.isValid()).toBeTrue();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeFalse();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeFalse();
    });

    it('validation occurs when ID field name is an empty string', () => {
        const data = [
            // eslint-disable-next-line @typescript-eslint/naming-convention
            { stringField: 'value-1', numberField: 10, '': 'empty-1' },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            { stringField: 'value-2', numberField: 11, '': 'empty-1' }
        ];
        const validator = new TableValidator();

        const isValid = validator.validateDataIds(data, '');
        expect(isValid).toBeFalse();
        expect(validator.isValid()).toBeFalse();
        const validity = validator.getValidity();
        expect(validity.duplicateRowId).toBeTrue();
        expect(validity.invalidRowId).toBeFalse();
        expect(validity.missingRowId).toBeFalse();
    });
});
