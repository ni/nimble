import type { WaferMap } from '..';
import { WaferMapValidator } from '../modules/wafer-map-validator';
import { getWaferMapMockValidator } from './utilities';

describe('Wafermap Validator module', () => {
    let waferMapValidator: WaferMapValidator;

    describe('with undefined grid dimensions', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockValidator(
                undefined,
                undefined,
                undefined,
                undefined
            );
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with equal grid dimensions', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockValidator(0, 0, 0, 0);
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with positive grid dimensions', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockValidator(1, 2, 1, 2);
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with negative grid dimensions', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockValidator(-2, -1, -2, -1);
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with one undefined grid dimension', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockValidator(0, 0, 0, undefined);
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should not be valid', () => {
            expect(waferMapValidator.isValid()).toBeFalse();
        });
    });

    describe('with impossible grid dimension', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockValidator(1, -1, 1, -1);
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should not be valid', () => {
            expect(waferMapValidator.isValid()).toBeFalse();
        });
    });
});
