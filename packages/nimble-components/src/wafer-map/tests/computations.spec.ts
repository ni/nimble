import type { WaferMap } from '..';
import { Computations } from '../modules/computations';
import { Margin, WaferMapQuadrant } from '../types';
import { getWaferMapDies } from './utilities';

describe('Wafermap Computations module', () => {
    let computationsModule: Computations;

    describe('with 100 square canvas', () => {
        const expectedMargin: Margin = {
            top: 4,
            right: 4,
            bottom: 4,
            left: 4
        };
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'dies' | 'quadrant' | 'canvasWidth' | 'canvasHeight'
            > = {
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topLeft,
                canvasWidth: 100,
                canvasHeight: 100
            };
            computationsModule = new Computations(waferMock as WaferMap);
        });

        it('should have expected square container', () => {
            expect(computationsModule.containerDimensions).toEqual({
                width: 92,
                height: 92
            });
        });

        it('should have expected die size', () => {
            const computedDimensions = {
                width: Math.ceil(computationsModule.dieDimensions.width),
                height: Math.ceil(computationsModule.dieDimensions.height)
            };
            expect(computedDimensions).toEqual({
                width: 19,
                height: 16
            });
        });

        it('should have expected radius', () => {
            expect(computationsModule.radius).toEqual(46);
        });

        it('should have expected margin', () => {
            expect(computationsModule.margin).toEqual(expectedMargin);
        });

        it('should have horizontal domain containing all column indexes', () => {
            expect(computationsModule.horizontalScale.domain()).toEqual([
                2, 3, 4, 5, 6
            ]);
        });
        it('should have vertical domain containing all row indexes, ', () => {
            expect(computationsModule.verticalScale.domain()).toEqual([
                1, 2, 3, 4, 5, 6
            ]);
        });
    });

    describe('with rectangular canvas', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'dies' | 'quadrant' | 'canvasWidth' | 'canvasHeight'
            > = {
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topLeft,
                canvasWidth: 200,
                canvasHeight: 100
            };
            computationsModule = new Computations(waferMock as WaferMap);
        });

        it('should have adjusted square container', () => {
            expect(computationsModule.containerDimensions).toEqual({
                width: 92,
                height: 92
            });
        });

        it('should have adjusted die size', () => {
            const computedDimensions = {
                width: Math.ceil(computationsModule.dieDimensions.width),
                height: Math.ceil(computationsModule.dieDimensions.height)
            };
            expect(computedDimensions).toEqual({
                width: 19,
                height: 16
            });
        });

        it('should have adjusted radius', () => {
            expect(computationsModule.radius).toEqual(46);
        });

        it('should have adjusted margin', () => {
            expect(computationsModule.margin).toEqual({
                top: 4,
                right: 54,
                bottom: 4,
                left: 54
            });
        });
    });

    describe('with top left origin quadrant', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'dies' | 'quadrant' | 'canvasWidth' | 'canvasHeight'
            > = {
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topLeft,
                canvasWidth: 100,
                canvasHeight: 100
            };
            computationsModule = new Computations(waferMock as WaferMap);
        });

        it('should have increasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([0, 92]);
        });

        it('should have increasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([0, 92]);
        });
    });

    describe('with top right origin quadrant', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'dies' | 'quadrant' | 'canvasWidth' | 'canvasHeight'
            > = {
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topRight,
                canvasWidth: 100,
                canvasHeight: 100
            };
            computationsModule = new Computations(waferMock as WaferMap);
        });

        it('should have decreasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([92, 0]);
        });

        it('should have increasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([0, 92]);
        });
    });

    describe('with bottom left origin quadrant', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'dies' | 'quadrant' | 'canvasWidth' | 'canvasHeight'
            > = {
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.bottomLeft,
                canvasWidth: 100,
                canvasHeight: 100
            };
            computationsModule = new Computations(waferMock as WaferMap);
        });

        it('should have increasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([0, 92]);
        });

        it('should have decreasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([92, 0]);
        });
    });

    describe('with bottom right origin quadrant', () => {
        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            'dies' | 'quadrant' | 'canvasWidth' | 'canvasHeight'
            > = {
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.bottomRight,
                canvasWidth: 100,
                canvasHeight: 100
            };
            computationsModule = new Computations(waferMock as WaferMap);
        });

        it('should have decreasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([92, 0]);
        });

        it('should have decreasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([92, 0]);
        });
    });
});
