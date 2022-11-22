import type { Computations } from '../modules/computations.module';
import { Margin, WaferMapQuadrant } from '../types';
import { getWaferMapDies } from './utilities';

describe('Computations module', () => {
    let computationsModule: Computations;

    describe('with 100 square canvas', () => {
        const defaultMargin: Margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        };
        beforeEach(async () => {
            computationsModule = new Computations(
                getWaferMapDies(),
                WaferMapQuadrant.topLeft,
                { width: 100, height: 100 }
            );
        });

        it('should have 60 square container', () => {
            expect(computationsModule.containerDimensions).toEqual({
                width: 60,
                height: 60
            });
        });

        it('should have 10:8.571428571428571 die', () => {
            expect(computationsModule.dieDimensions).toEqual({
                width: 10,
                height: 8.571428571428571
            });
        });

        it('should have 45 radius', () => {
            expect(computationsModule.radius).toEqual(45);
        });

        it('should have default margin', () => {
            expect(computationsModule.margin).toEqual(defaultMargin);
        });
    });

    describe('with 180 square canvas', () => {
        beforeEach(async () => {
            computationsModule = new Computations(
                getWaferMapDies(),
                WaferMapQuadrant.topLeft,
                { width: 180, height: 180 }
            );
        });

        it('should have adjusted 110 square container', () => {
            expect(computationsModule.containerDimensions).toEqual({
                width: 110,
                height: 110
            });
        });

        it('should have adjusted 18.333333333333332:15.714285714285714 die', () => {
            expect(computationsModule.dieDimensions).toEqual({
                width: 18.333333333333332,
                height: 15.714285714285714
            });
        });

        it('should have adjusted 82.5 radius', () => {
            expect(computationsModule.radius).toEqual(82.5);
        });

        it('should have adjusted margin', () => {
            expect(computationsModule.margin).toEqual({
                top: 35,
                right: 35,
                bottom: 35,
                left: 35
            });
        });
    });

    describe('with top left origin quadrant', () => {
        beforeEach(async () => {
            computationsModule = new Computations(
                getWaferMapDies(),
                WaferMapQuadrant.topLeft,
                { width: 100, height: 100 }
            );
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
            expect(computationsModule.horizontalScale.range()).toEqual([0, 60]);
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
            expect(computationsModule.verticalScale.range()).toEqual([0, 60]);
        });
    });

    describe('with top right origin quadrant', () => {
        beforeEach(async () => {
            computationsModule = new Computations(
                getWaferMapDies(),
                WaferMapQuadrant.topRight,
                { width: 100, height: 100 }
            );
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
            expect(computationsModule.horizontalScale.range()).toEqual([60, 0]);
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
            expect(computationsModule.verticalScale.range()).toEqual([0, 60]);
        });
    });

    describe('with bottom left origin quadrant', () => {
        beforeEach(async () => {
            computationsModule = new Computations(
                getWaferMapDies(),
                WaferMapQuadrant.bottomLeft,
                { width: 100, height: 100 }
            );
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
            expect(computationsModule.horizontalScale.range()).toEqual([0, 60]);
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
            expect(computationsModule.verticalScale.range()).toEqual([60, 0]);
        });
    });

    describe('with bottom right origin quadrant', () => {
        beforeEach(async () => {
            computationsModule = new Computations(
                getWaferMapDies(),
                WaferMapQuadrant.bottomRight,
                { width: 100, height: 100 }
            );
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
            expect(computationsModule.horizontalScale.range()).toEqual([60, 0]);
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
            expect(computationsModule.verticalScale.range()).toEqual([60, 0]);
        });
    });
});
