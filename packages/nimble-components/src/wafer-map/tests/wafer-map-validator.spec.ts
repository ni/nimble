import { Table, tableFromArrays } from 'apache-arrow';
import { WaferMapValidator } from '../modules/wafer-map-validator';
import { getWaferMapMockValidator } from './utilities';

describe('Wafermap Validator module', () => {
    let waferMapValidator: WaferMapValidator;

    it('with undefined grid dimensions should be valid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateGridDimensions();

        expect(waferMapValidator.isValid()).toBeTrue();
    });

    it('with equal grid dimensions should be valid', () => {
        const waferMock = getWaferMapMockValidator(0, 0, 0, 0);
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateGridDimensions();

        expect(waferMapValidator.isValid()).toBeTrue();
    });

    it('with positive grid dimensions should be valid', () => {
        const waferMock = getWaferMapMockValidator(1, 2, 1, 2);
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateGridDimensions();

        expect(waferMapValidator.isValid()).toBeTrue();
    });

    it('with negative grid dimensions should be valid', () => {
        const waferMock = getWaferMapMockValidator(-2, -1, -2, -1);
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateGridDimensions();

        expect(waferMapValidator.isValid()).toBeTrue();
    });

    it('with one undefined grid dimension should not be valid', () => {
        const waferMock = getWaferMapMockValidator(0, 0, 0, undefined);
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateGridDimensions();

        expect(waferMapValidator.isValid()).toBeFalse();
    });

    it('with impossible grid dimension should not be valid', () => {
        const waferMock = getWaferMapMockValidator(1, -1, 1, -1);
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateGridDimensions();

        expect(waferMapValidator.getValidity()).toEqual({
            invalidGridDimensions: true,
            invalidDiesTableSchema: false
        });
        expect(waferMapValidator.isValid()).toBeFalse();
    });

    it('with undefined dies table should be valid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();
        expect(waferMapValidator.isValid()).toBeTrue();
    });

    it('with colIndex, rowIndex and value column as Int32, Int32 and Float64 dies table should be valid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            })
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();

        expect(waferMapValidator.isValid()).toBeTrue();
    });

    it('with colIndex, rowIndex and value column as Int32, Int32 and Float32 dies table should be invalid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float32Array.from([])
            })
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();

        expect(waferMapValidator.isValid()).toBeFalse();
    });

    it('with colIndex, rowIndex and value column as Int8, Int32 and Float64 dies table should be invalid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            tableFromArrays({
                colIndex: Int8Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Float64Array.from([])
            })
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();

        expect(waferMapValidator.isValid()).toBeFalse();
    });

    it('with colIndex, rowIndex and value column as Int32 dies table should be invalid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([]),
                value: Int32Array.from([])
            })
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();

        expect(waferMapValidator.isValid()).toBeFalse();
    });

    it('with no column dies table should be invalid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            new Table()
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();

        expect(waferMapValidator.isValid()).toBeFalse();
    });
    it('with just colIndex and rowIndex column dies table should be invalid', () => {
        const waferMock = getWaferMapMockValidator(
            undefined,
            undefined,
            undefined,
            undefined,
            tableFromArrays({
                colIndex: Int32Array.from([]),
                rowIndex: Int32Array.from([])
            })
        );
        waferMapValidator = new WaferMapValidator(waferMock);
        waferMapValidator.validateDiesTableSchema();

        expect(waferMapValidator.isValid()).toBeFalse();
    });
});
