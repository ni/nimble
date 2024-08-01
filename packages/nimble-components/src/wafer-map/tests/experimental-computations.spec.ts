import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { range } from 'd3-array';
import { Computations } from '../experimental/computations';
import { WaferMapColorScaleMode, WaferMapOriginLocation } from '../types';
import { getWaferMapMockComputationsExperimental } from './utilities';
import type { WaferMap } from '..';
import type { Margin } from '../workers/types';

describe('Wafermap Experimental Computations module', () => {
    let computationsModule: Computations;
    let waferMock: WaferMap;

    describe('with 100 square canvas', () => {
        const expectedMargin: Margin = {
            top: 4,
            right: 4,
            bottom: 4,
            left: 4
        };
        beforeEach(() => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.canvasWidth = 100;
            waferMock.canvasHeight = 100;
            computationsModule = new Computations(waferMock);
            computationsModule.componentResizeUpdate();
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

        it('should have horizontal domain containing min and max column Indices', () => {
            expect(computationsModule.horizontalScale.domain()).toEqual([2, 7]);
        });
        it('should have vertical domain containing min and max  row Indices, ', () => {
            expect(computationsModule.verticalScale.domain()).toEqual([1, 7]);
        });
    });

    describe('with rectangular canvas', () => {
        beforeEach(() => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.canvasWidth = 200;
            waferMock.canvasHeight = 100;
            computationsModule = new Computations(waferMock);
            computationsModule.componentResizeUpdate();
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
                waferMock = getWaferMapMockComputationsExperimental();
                waferMock.originLocation = value.name;
                waferMock.canvasWidth = 100;
                waferMock.canvasHeight = 100;
                computationsModule = new Computations(waferMock);
                computationsModule.componentResizeUpdate();
                expect(computationsModule.horizontalScale.range()).toEqual(
                    value.horizontalRange
                );
                expect(computationsModule.verticalScale.range()).toEqual(
                    value.verticalRange
                );
            }
        );
    });

    it('with die input and small die height should not have labelsFontSize larger than the die height', () => {
        waferMock = getWaferMapMockComputationsExperimental();
        waferMock.canvasWidth = 50;
        waferMock.canvasHeight = 41;
        waferMock.maxCharacters = 2;
        computationsModule = new Computations(waferMock);
        computationsModule.componentResizeUpdate();

        expect(computationsModule.labelsFontSize).toBeLessThanOrEqual(
            computationsModule.dieDimensions.height
        );
    });

    it('with small width and one character at maximum should not have labelsFontSize larger than the die width', () => {
        waferMock = getWaferMapMockComputationsExperimental();
        waferMock.maxCharacters = 1;
        waferMock.canvasWidth = 41;
        waferMock.canvasHeight = 50;
        computationsModule = new Computations(waferMock);
        computationsModule.componentResizeUpdate();

        expect(computationsModule.labelsFontSize).toBeLessThan(
            computationsModule.dieDimensions.width
        );
    });

    describe('with linear color scale', () => {
        const colorScaleMode = WaferMapColorScaleMode.linear;

        it('and only one color value pair should have undefined color category', () => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = { colors: ['red'], values: ['1'] };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = 2;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();
            const expectedValues = Array(1).fill(undefined);

            const actualValues = computationsModule.colorScale.map(
                colorCategory => colorCategory.color
            );

            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and only one duplicated color value pair should have a single color category', () => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = {
                colors: ['red', 'red'],
                values: ['1', '1']
            };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = 2;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();

            const expectedValues = Array(1).fill('rgb(255, 0, 0)');
            const actualValues = computationsModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and color value pairs for the scale ends should have the colors equally distributed', () => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = {
                colors: ['black', 'red'],
                values: ['0', '20']
            };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = 2;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();
            const expectedValues = range(0, 20)
                .concat(20)
                .map(value => {
                    return `rgb(${Math.round(value * 12.75)}, 0, 0)`;
                });
            const actualValues = computationsModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });

    describe('with ordinal color scale', () => {
        const colorScaleMode = WaferMapColorScaleMode.ordinal;

        it('and only one color value pair should have a single color category', () => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = { colors: ['red'], values: ['1'] };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = 2;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();
            const expectedValues = Array(1).fill('red');
            const actualValues = computationsModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and two colors should have two color categories', () => {
            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = {
                colors: ['black', 'red'],
                values: []
            };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = 2;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();

            const expectedValues = ['black', 'red'];
            const actualValues = computationsModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });
});
