import type { TableRecord, TableValidity } from '../../types';
import { TableValidator } from '../table-validator';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';

describe('TableValidator', () => {
    let validator: TableValidator<TableRecord>;

    beforeEach(() => {
        validator = new TableValidator();
    });

    function getInvalidKeys(
        tableValidator: TableValidator<TableRecord>
    ): string[] {
        return Object.entries(tableValidator)
            .filter(([_, value]) => value)
            .map(([key, _]) => key);
    }

    describe('record ID validation', () => {
        it('setting valid field for ID is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeTrue();
            expect(validator.isValid()).toBeTrue();
            expect(getInvalidKeys(validator)).toEqual([]);
        });

        it('setting `undefined` field for ID is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, undefined);
            expect(isValid).toBeTrue();
            expect(validator.isValid()).toBeTrue();
            expect(getInvalidKeys(validator)).toEqual([]);
        });

        it('setting data with duplicate IDs is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-1', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['duplicateRecordId'])
            );
        });

        it('setting data with invalid ID value type is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'numberField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['invalidRecordId'])
            );
        });

        it('setting data with empty ID value is valid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: '', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeTrue();
            expect(validator.isValid()).toBeTrue();
            expect(getInvalidKeys(validator)).toEqual([]);
        });

        it('setting data with undefined ID value is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: undefined, numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['invalidRecordId'])
            );
        });

        it('setting data with null ID value is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: undefined, numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'stringField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['invalidRecordId'])
            );
        });

        it('setting data with missing IDs is invalid', () => {
            const data = [
                { stringField: 'value-1', numberField: 10 },
                { stringField: 'value-2', numberField: 11 }
            ];

            const isValid = validator.validateRecordIds(data, 'missingField');
            expect(isValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['missingRecordId'])
            );
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
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingRecordId',
                    'duplicateRecordId',
                    'invalidRecordId'
                ])
            );
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
            expect(validator.isValid()).toBeTrue();
            expect(getInvalidKeys(validator)).toEqual([]);
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
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['duplicateRecordId'])
            );
        });
    });

    describe('column ID validation', () => {
        const columnConfigurations: {
            columnIds: (string | undefined)[],
            isValid: boolean,
            invalidKeys: (keyof TableValidity)[],
            name: string
        }[] = [
            {
                columnIds: [undefined, ''],
                isValid: true,
                invalidKeys: [],
                name: 'does not require column IDs'
            },
            {
                columnIds: ['my-id', undefined, undefined],
                isValid: false,
                invalidKeys: ['missingColumnId'],
                name: 'requires column IDs for all columns if a column ID is defined for at least one'
            },
            {
                columnIds: ['my-id-1', 'my-id-2', 'my-id-3'],
                isValid: true,
                invalidKeys: [],
                name: 'unique defined IDs are valid'
            },
            {
                columnIds: ['my-id-1', 'my-id-2', 'my-id-2'],
                isValid: false,
                invalidKeys: ['duplicateColumnId'],
                name: 'duplicate column IDs is invalid'
            },
            {
                columnIds: ['my-id-1', 'my-id-2', 'my-id-2', undefined],
                isValid: false,
                invalidKeys: ['missingColumnId', 'duplicateColumnId'],
                name: 'reports multiple column ID validation errors'
            },
            {
                columnIds: ['my-id-1', ''],
                isValid: false,
                invalidKeys: ['missingColumnId'],
                name: 'does not allow empty string as a defined column ID'
            }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const columnConfiguration of columnConfigurations) {
            const specType = getSpecTypeByNamedList(
                columnConfiguration,
                focused,
                disabled
            );
            specType(columnConfiguration.name, () => {
                const tableValidator = new TableValidator();
                const isValid = tableValidator.validateColumnIds(
                    columnConfiguration.columnIds
                );

                expect(isValid).toBe(columnConfiguration.isValid);
                expect(tableValidator.isValid()).toBe(
                    columnConfiguration.invalidKeys.length === 0
                );
                expect(getInvalidKeys(tableValidator)).toEqual(
                    jasmine.arrayWithExactContents(
                        columnConfiguration.invalidKeys
                    )
                );
            });
        }
    });

    describe('column sort index validation', () => {
        const columnConfigurations: {
            sortIndices: number[],
            isValid: boolean,
            invalidKeys: (keyof TableValidity)[],
            name: string
        }[] = [
            {
                sortIndices: [1, 2, 3],
                isValid: true,
                invalidKeys: [],
                name: 'unique sort indices is valid'
            },
            {
                sortIndices: [1, 2, 2],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: 'duplicate sort indices is invalid'
            },
            {
                sortIndices: [],
                isValid: true,
                invalidKeys: [],
                name: 'sort indices are not required'
            },
            {
                sortIndices: [-Infinity, -Infinity],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: "duplicate '-Infinity' values are detected"
            },
            {
                sortIndices: [Infinity, Infinity],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: "duplicate 'Infinity' values are detected"
            },
            {
                sortIndices: [Math.PI, Math.PI],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: "duplicate 'Math.PI' values are detected"
            },
            {
                sortIndices: [NaN, NaN],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: "duplicate 'NaN' values are detected"
            },
            {
                sortIndices: [0, -0],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: "duplicate '0' and '-0' values are detected"
            },
            {
                sortIndices: [1.25, 1.25],
                isValid: false,
                invalidKeys: ['duplicateSortIndex'],
                name: 'duplicate decimal values are detected'
            },
            {
                sortIndices: [1.25, NaN, Math.PI, -0, Infinity, -Infinity, 1e6],
                isValid: true,
                invalidKeys: [],
                name: 'special numeric values are valid'
            }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const columnConfiguration of columnConfigurations) {
            const specType = getSpecTypeByNamedList(
                columnConfiguration,
                focused,
                disabled
            );
            specType(columnConfiguration.name, () => {
                const tableValidator = new TableValidator();
                const isValid = tableValidator.validateColumnSortIndices(
                    columnConfiguration.sortIndices
                );

                expect(isValid).toBe(columnConfiguration.isValid);
                expect(tableValidator.isValid()).toBe(
                    columnConfiguration.invalidKeys.length === 0
                );
                expect(getInvalidKeys(tableValidator)).toEqual(
                    jasmine.arrayWithExactContents(
                        columnConfiguration.invalidKeys
                    )
                );
            });
        }
    });

    describe('column group index validation', () => {
        const columnConfigurations: {
            groupIndices: number[],
            isValid: boolean,
            invalidKeys: (keyof TableValidity)[],
            name: string
        }[] = [
            {
                groupIndices: [1, 2, 3],
                isValid: true,
                invalidKeys: [],
                name: 'unique group indices is valid'
            },
            {
                groupIndices: [1, 2, 2],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: 'duplicate group indices is invalid'
            },
            {
                groupIndices: [],
                isValid: true,
                invalidKeys: [],
                name: 'group indices are not required'
            },
            {
                groupIndices: [-Infinity, -Infinity],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: "duplicate '-Infinity' values are detected"
            },
            {
                groupIndices: [Infinity, Infinity],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: "duplicate 'Infinity' values are detected"
            },
            {
                groupIndices: [Math.PI, Math.PI],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: "duplicate 'Math.PI' values are detected"
            },
            {
                groupIndices: [NaN, NaN],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: "duplicate 'NaN' values are detected"
            },
            {
                groupIndices: [0, -0],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: "duplicate '0' and '-0' values are detected"
            },
            {
                groupIndices: [1.25, 1.25],
                isValid: false,
                invalidKeys: ['duplicateGroupIndex'],
                name: 'duplicate decimal values are detected'
            },
            {
                groupIndices: [
                    1.25,
                    NaN,
                    Math.PI,
                    -0,
                    Infinity,
                    -Infinity,
                    1e6
                ],
                isValid: true,
                invalidKeys: [],
                name: 'special numeric values are valid'
            }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const columnConfiguration of columnConfigurations) {
            const specType = getSpecTypeByNamedList(
                columnConfiguration,
                focused,
                disabled
            );
            specType(columnConfiguration.name, () => {
                const tableValidator = new TableValidator();
                const isValid = tableValidator.validateColumnGroupIndices(
                    columnConfiguration.groupIndices
                );

                expect(isValid).toBe(columnConfiguration.isValid);
                expect(tableValidator.isValid()).toBe(
                    columnConfiguration.invalidKeys.length === 0
                );
                expect(getInvalidKeys(tableValidator)).toEqual(
                    jasmine.arrayWithExactContents(
                        columnConfiguration.invalidKeys
                    )
                );
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

            const recordIdsAreValid = validator.validateRecordIds(
                data,
                'stringField'
            );
            expect(recordIdsAreValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingRecordId',
                    'duplicateRecordId',
                    'invalidRecordId'
                ])
            );

            const columnIdsAreValid = validator.validateColumnIds([
                'id-1',
                'id-2',
                'id-3'
            ]);
            expect(columnIdsAreValid).toBeTrue();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingRecordId',
                    'duplicateRecordId',
                    'invalidRecordId'
                ])
            );
        });

        it('invalid column IDs stay invalid when validating record IDs', () => {
            const columnIdsAreValid = validator.validateColumnIds([
                'id-1',
                'id-1',
                undefined
            ]);
            expect(columnIdsAreValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingColumnId',
                    'duplicateColumnId'
                ])
            );

            const recordIdsAreValid = validator.validateRecordIds(
                [],
                undefined
            );
            expect(recordIdsAreValid).toBeTrue();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingColumnId',
                    'duplicateColumnId'
                ])
            );
        });

        it('invalid column IDs stay invalid when validating sort indices', () => {
            const columnIdsAreValid = validator.validateColumnIds([
                'id-1',
                'id-1',
                undefined
            ]);
            expect(columnIdsAreValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingColumnId',
                    'duplicateColumnId'
                ])
            );

            const sortIndicesAreValid = validator.validateColumnSortIndices([]);
            expect(sortIndicesAreValid).toBeTrue();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents([
                    'missingColumnId',
                    'duplicateColumnId'
                ])
            );
        });

        it('invalid sort indices stay invalid when validating column IDs', () => {
            const sortIndicesAreValid = validator.validateColumnSortIndices([
                1, 1, 1
            ]);
            expect(sortIndicesAreValid).toBeFalse();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['duplicateSortIndex'])
            );

            const columnIdsAreValid = validator.validateColumnIds([
                'id-1',
                'id-2',
                'id-3'
            ]);
            expect(columnIdsAreValid).toBeTrue();
            expect(validator.isValid()).toBeFalse();
            expect(getInvalidKeys(validator)).toEqual(
                jasmine.arrayWithExactContents(['duplicateSortIndex'])
            );
        });
    });
});
