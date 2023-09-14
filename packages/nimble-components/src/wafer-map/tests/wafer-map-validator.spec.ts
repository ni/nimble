import type { WaferMap } from '..';
import { WaferMapValidator } from '../modules/wafer-map-validator';

describe('Wafermap Validator module', () => {
    let waferMapValidator: WaferMapValidator;

    describe('with undefined grid dimensions', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'
            > = {
                gridMinX: undefined,
                gridMaxX: undefined,
                gridMinY: undefined,
                gridMaxY: undefined
            };
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with equal grid dimensions', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'
            > = {
                gridMinX: 0,
                gridMaxX: 0,
                gridMinY: 0,
                gridMaxY: 0
            };
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with positive grid dimensions', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'
            > = {
                gridMinX: 1,
                gridMaxX: 2,
                gridMinY: 1,
                gridMaxY: 2
            };
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with negative grid dimensions', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'
            > = {
                gridMinX: -2,
                gridMaxX: -1,
                gridMinY: -2,
                gridMaxY: -1
            };
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should be valid', () => {
            expect(waferMapValidator.isValid()).toBeTrue();
        });
    });

    describe('with one undefined grid dimension', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'
            > = {
                gridMinX: 0,
                gridMaxX: 0,
                gridMinY: 0,
                gridMaxY: undefined
            };
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should not be valid', () => {
            expect(waferMapValidator.isValid()).toBeFalse();
        });
    });

    describe('with impossible grid dimension', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'
            > = {
                gridMinX: 1,
                gridMaxX: -1,
                gridMinY: 1,
                gridMaxY: -1
            };
            waferMapValidator = new WaferMapValidator(waferMock as WaferMap);
            waferMapValidator.validateGridDimensions();
        });

        it('should not be valid', () => {
            expect(waferMapValidator.isValid()).toBeFalse();
        });
    });
});
