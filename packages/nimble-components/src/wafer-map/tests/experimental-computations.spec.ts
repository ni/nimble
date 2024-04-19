import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Computations } from '../modules/experimental/computations';
import { Margin, WaferMapOriginLocation } from '../types';
import {
    getWaferMapMockComputationsExperimental,
    getWaferMapDiesTable
} from './utilities';

describe('Wafermap Experimental Computations module', () => {
    let computationsModule: Computations;

    describe('with 100 square canvas', () => {
        const expectedMargin: Margin = {
            top: 4,
            right: 4,
            bottom: 4,
            left: 4
        };
        beforeEach(() => {
            const waferMock = getWaferMapMockComputationsExperimental(
                getWaferMapDiesTable(),
                WaferMapOriginLocation.topLeft,
                100,
                100
            );
            computationsModule = new Computations(waferMock);
            computationsModule.update();
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

        it('should have expected margin', () => {
            expect(computationsModule.margin).toEqual(expectedMargin);
        });

        it('should have horizontal domain containing min and max column indexes', () => {
            expect(computationsModule.horizontalScale.domain()).toEqual([2, 7]);
        });
        it('should have vertical domain containing min and max  row indexes, ', () => {
            expect(computationsModule.verticalScale.domain()).toEqual([1, 7]);
        });
    });

    describe('with rectangular canvas', () => {
        beforeEach(() => {
            const waferMock = getWaferMapMockComputationsExperimental(
                getWaferMapDiesTable(),
                WaferMapOriginLocation.topLeft,
                200,
                100
            );
            computationsModule = new Computations(waferMock);
            computationsModule.update();
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

        it('should have adjusted margin', () => {
            expect(computationsModule.margin).toEqual({
                top: 4,
                right: 54,
                bottom: 4,
                left: 54
            });
        });
    });

    const testCases = [
        {
            name: WaferMapOriginLocation.topLeft,
            horizontalRange: [0, 92],
            verticalRange: [0, 92]
        },
        {
            name: WaferMapOriginLocation.topRight,
            horizontalRange: [92, 0],
            verticalRange: [0, 92]
        },
        {
            name: WaferMapOriginLocation.bottomLeft,
            horizontalRange: [0, 92],
            verticalRange: [92, 0]
        },
        {
            name: WaferMapOriginLocation.bottomRight,
            horizontalRange: [92, 0],
            verticalRange: [92, 0]
        }
    ] as const;

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(
            `with ${name} originLocation should have expected horizontal range and vertical range`,
            () => {
                const waferMock = getWaferMapMockComputationsExperimental(
                    getWaferMapDiesTable(),
                    value.name,
                    100,
                    100
                );
                computationsModule = new Computations(waferMock);
                computationsModule.update();
                expect(computationsModule.horizontalScale.range()).toEqual(
                    value.horizontalRange
                );
                expect(computationsModule.verticalScale.range()).toEqual(
                    value.verticalRange
                );
            }
        );
    });
});
