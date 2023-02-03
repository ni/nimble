import type { TableRecord, TableValidity } from '../types';
import { TableValidator } from './table-validator';

describe('TableValidator', () => {
    let validator: TableValidator<TableRecord>;

    beforeEach(() => {
        validator = new TableValidator();
    });

    function validateValidity(invalidKeys: (keyof TableValidity)[]): void {
        expect(validator.isValid()).toEqual(invalidKeys.length === 0);

        const validity = validator.getValidity();
        expect(validity.duplicateRecordId).toBe(invalidKeys.some(x => x === 'duplicateRecordId'));
        expect(validity.missingRecordId).toBe(invalidKeys.some(x => x === 'missingRecordId'));
        expect(validity.invalidRecordId).toBe(invalidKeys.some(x => x === 'invalidRecordId'));
        expect(validity.duplicateColumnId).toBe(invalidKeys.some(x => x === 'duplicateColumnId'));
        expect(validity.missingColumnId).toBe(invalidKeys.some(x => x === 'missingColumnId'));
    }

    describe('record ID validation', () => {
        it('setting valid field for ID is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeTrue();
            validateValidity([]);
        });

        it('setting `undefined` field for ID is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, undefined);
            expect(isValid).toBeTrue();
            validateValidity([]);
        });

        it('setting `null` field for ID is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, null);
            expect(isValid).toBeTrue();
            validateValidity([]);
        });

        it('setting data with duplicate IDs is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-1', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            validateValidity(['duplicateRecordId']);
        });

        it('setting data with invalid ID value type is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'numberField');
            expect(isValid).toBeFalse();
            validateValidity(['invalidRecordId']);
        });

        it('setting data with empty ID value is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: '', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeTrue();
            validateValidity([]);
        });

        it('setting data with undefined ID value is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: undefined, numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            validateValidity(['invalidRecordId']);
        });

        it('setting data with null ID value is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: undefined, numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            validateValidity(['invalidRecordId']);
        });

        it('setting data with missing IDs is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'missingField');
            expect(isValid).toBeFalse();
            validateValidity(['missingRecordId']);
        });

        it('multiple errors are reported during validation', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 },
                { stringField: 'value-1', numberField: 12 },
                { numberField: 12 },
                { stringField: true, numberField: 12 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            validateValidity(['missingRecordId', 'duplicateRecordId', 'invalidRecordId']);
        });

        it('setting ID field name to undefined makes configuration valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            let isValid = validator.validateRecordIds(data, 'missingField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();

            isValid = validator.validateRecordIds(data, undefined);
            expect(isValid).toBeTrue();
            expect(validator.isValid()).toBeTrue();
        });

        it('setting a valid ID field name makes an invalid configuration valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            let isValid = validator.validateRecordIds(data, 'missingField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();

            isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeTrue();
            expect(validator.isValid()).toBeTrue();
        });

        it('setting invalid ID field name makes a valid configuration invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            let isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeTrue();
            expect(validator.isValid()).toBeTrue();

            isValid = validator.validateRecordIds(data, 'missingField');
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

            const isValid = validator.validateRecordIds(data, '');
            expect(isValid).toBeTrue();
            validateValidity([]);
        });

        it('validation occurs when ID field name is an empty string', () => {
            const data = [
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { stringField: 'value-1', numberField: 10, '': 'empty-1' },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { stringField: 'value-2', numberField: 11, '': 'empty-1' }
            ];

            const isValid = validator.validateRecordIds(data, '');
            expect(isValid).toBeFalse();
            validateValidity(['duplicateRecordId']);
        });
    });

    describe('column ID validation', () => {
        const columnConfigurations: { columnIds: (string | undefined | null)[], invalidKeys: (keyof TableValidity)[], testDescription: string }[] = [
            { columnIds: [null, null, undefined, undefined], invalidKeys: [], testDescription: 'does not require column IDs' },
            { columnIds: [null, 'my-id', undefined, undefined], invalidKeys: ['missingColumnId'], testDescription: 'requires column IDs for all columns if a column ID is defined for at least one' },
            { columnIds: ['my-id-1', 'my-id-2', 'my-id-3'], invalidKeys: [], testDescription: 'unique defined IDs are valid' },
            { columnIds: ['my-id-1', 'my-id-2', 'my-id-2'], invalidKeys: ['duplicateColumnId'], testDescription: 'duplicate column IDs is invalid' },
            { columnIds: ['my-id-1', 'my-id-2', 'my-id-2', undefined], invalidKeys: ['missingColumnId', 'duplicateColumnId'], testDescription: 'reports multiple column ID validation errors' },
            { columnIds: ['my-id-1', 'my-id-2', ''], invalidKeys: [], testDescription: 'empty string is a valid column ID' },
            { columnIds: ['my-id-1', '', ''], invalidKeys: ['duplicateColumnId'], testDescription: 'detects duplicate empty string column IDs' },
            { columnIds: [null, undefined, ''], invalidKeys: ['missingColumnId'], testDescription: 'requires column IDs for all columns if one is set to empty string' },
        ];

        for (const columnConfiguration of columnConfigurations) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            it(columnConfiguration.testDescription, () => {
                const isValid = validator.validateColumnIds(columnConfiguration.columnIds);
                expect(isValid).toBe(columnConfiguration.invalidKeys.length === 0);
                validateValidity(columnConfiguration.invalidKeys);
            });
        }
    });

    describe('validation checks do not reset unrelated state', () => {
        it('invalid record IDs stay invalid when validating column IDs', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 },
                { stringField: 'value-1', numberField: 12 },
                { numberField: 12 },
                { stringField: true, numberField: 12 }
            ];

            const recordIdsAreValid = validator.validateRecordIds(data, 'stringField');
            expect(recordIdsAreValid).toBeFalse();
            validateValidity(['missingRecordId', 'duplicateRecordId', 'invalidRecordId']);

            const columnIdsAreValid = validator.validateColumnIds(['id-1', 'id-2', 'id-3']);
            expect(columnIdsAreValid).toBeTrue();
            validateValidity(['missingRecordId', 'duplicateRecordId', 'invalidRecordId']);
        });

        it('invalid column IDs stay invalid when validating record IDs', () => {
            const columnIdsAreValid = validator.validateColumnIds(['id-1', 'id-1', undefined]);
            expect(columnIdsAreValid).toBeFalse();
            validateValidity(['missingColumnId', 'duplicateColumnId']);

            const recordIdsAreValid = validator.validateRecordIds([], undefined);
            expect(recordIdsAreValid).toBeTrue();
            validateValidity(['missingColumnId', 'duplicateColumnId']);
        });
    });
});
