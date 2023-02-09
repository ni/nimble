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
            computationsModule = new Computations({
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topLeft,
                canvas: { width: 100, height: 100 }
            } as WaferMap);
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
                width: 16,
                height: 14
            });
        });

        it('should have expected radius', () => {
            expect(computationsModule.radius).toEqual(46);
        });

        it('should have expected margin', () => {
            expect(computationsModule.margin).toEqual(expectedMargin);
        });
    });

    describe('with rectangular canvas', () => {
        beforeEach(() => {
            computationsModule = new Computations({
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topLeft,
                canvas: { width: 200, height: 100 }
            } as WaferMap);
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
                width: 16,
                height: 14
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
            computationsModule = new Computations({
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topLeft,
                canvas: { width: 100, height: 100 }
            } as WaferMap);
        });

        it(
            'should have horizontal domain equal to the lowest column index, '
                + 'but one position higher than the highest column index ',
            () => {
                expect(computationsModule.horizontalScale.domain()).toEqual([
                    2, 7
                ]);
            }
        );

        it('should have increasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([0, 92]);
        });

        it(
            'should have vertical domain equal to the lowest row index, '
                + 'but one position higher than the highest row index ',
            () => {
                expect(computationsModule.verticalScale.domain()).toEqual([
                    1, 7
                ]);
            }
        );

        it('should have increasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([0, 92]);
        });
    });

    describe('with top right origin quadrant', () => {
        beforeEach(() => {
            computationsModule = new Computations({
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.topRight,
                canvas: { width: 100, height: 100 }
            } as WaferMap);
        });

        it(
            'should have horizontal domain equal to the highest column index, '
                + 'but one position lower than the lowest column index ',
            () => {
                expect(computationsModule.horizontalScale.domain()).toEqual([
                    1, 6
                ]);
            }
        );

        it('should have decreasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([92, 0]);
        });

        it(
            'should have vertical domain equal to the lowest row index, '
                + 'but one position higher than the highest row index ',
            () => {
                expect(computationsModule.verticalScale.domain()).toEqual([
                    1, 7
                ]);
            }
        );

        it('should have increasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([0, 92]);
        });
    });

    describe('with bottom left origin quadrant', () => {
        beforeEach(() => {
            computationsModule = new Computations({
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.bottomLeft,
                canvas: { width: 100, height: 100 }
            } as WaferMap);
        });

        it(
            'should have horizontal domain equal to the lowest column index, '
                + 'but one position higher than the highest column index ',
            () => {
                expect(computationsModule.horizontalScale.domain()).toEqual([
                    2, 7
                ]);
            }
        );

        it('should have increasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([0, 92]);
        });

        it(
            'should have vertical domain equal to the highest row index, '
                + 'but one position lower than the lowest row index ',
            () => {
                expect(computationsModule.verticalScale.domain()).toEqual([
                    0, 6
                ]);
            }
        );

        it('should have decreasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([92, 0]);
        });
    });

    describe('with bottom right origin quadrant', () => {
        beforeEach(() => {
            computationsModule = new Computations({
                dies: getWaferMapDies(),
                quadrant: WaferMapQuadrant.bottomRight,
                canvas: { width: 100, height: 100 }
            } as WaferMap);
        });

        it(
            'should have horizontal domain equal to the highest column index, '
                + 'but one position lower than the lowest column index ',
            () => {
                expect(computationsModule.horizontalScale.domain()).toEqual([
                    1, 6
                ]);
            }
        );

        it('should have decreasing horizontal range', () => {
            expect(computationsModule.horizontalScale.range()).toEqual([92, 0]);
        });

        it(
            'should have vertical domain equal to the highest row index, '
                + 'but one position lower than the lowest row index ',
            () => {
                expect(computationsModule.verticalScale.domain()).toEqual([
                    0, 6
                ]);
            }
        );

        it('should have decreasing vertical range', () => {
            expect(computationsModule.verticalScale.range()).toEqual([92, 0]);
        });
    });
});
