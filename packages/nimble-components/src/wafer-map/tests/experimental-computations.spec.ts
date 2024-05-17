import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Computations } from '../experimental/computations';
import { WaferMapColorScaleMode, WaferMapOriginLocation } from '../types';
import {
    getWaferMapMockComputationsExperimental,
    getWaferMapDies
} from './utilities';
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
            expect(waferMock.containerDimensions).toEqual({
                width: 92,
                height: 92
            });
        });

        it('should have expected die size', () => {
            const computedDimensions = {
                width: Math.ceil(waferMock.dieDimensions.width),
                height: Math.ceil(waferMock.dieDimensions.height)
            };
            expect(computedDimensions).toEqual({
                width: 19,
                height: 16
            });
        });

        it('should have expected margin', () => {
            expect(waferMock.margin).toEqual(expectedMargin);
        });

        it('should have horizontal domain containing min and max column indexes', () => {
            expect(waferMock.horizontalScale.domain()).toEqual([2, 7]);
        });
        it('should have vertical domain containing min and max  row indexes, ', () => {
            expect(waferMock.verticalScale.domain()).toEqual([1, 7]);
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
            expect(waferMock.containerDimensions).toEqual({
                width: 92,
                height: 92
            });
        });

        it('should have adjusted die size', () => {
            const computedDimensions = {
                width: Math.ceil(waferMock.dieDimensions.width),
                height: Math.ceil(waferMock.dieDimensions.height)
            };
            expect(computedDimensions).toEqual({
                width: 19,
                height: 16
            });
        });

        it('should have adjusted margin', () => {
            expect(waferMock.margin).toEqual({
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
                expect(waferMock.horizontalScale.range()).toEqual(
                    value.horizontalRange
                );
                expect(waferMock.verticalScale.range()).toEqual(
                    value.verticalRange
                );
            }
        );
    });

    it('with die input and small die height should not have labelsFontSize larger than the die height', () => {
        const dieDimensions = { width: 10, height: 1 };
        const maxCharacters = 2;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        waferMock = getWaferMapMockComputationsExperimental();
        waferMock.canvasWidth = 100;
        waferMock.canvasHeight = 100;
        waferMock.maxCharacters = maxCharacters;
        waferMock.dieDimensions = dieDimensions;
        waferMock.margin = margin;
        computationsModule = new Computations(waferMock);
        computationsModule.colorAndTextUpdate();

        expect(waferMock.labelsFontSize).toBeLessThanOrEqual(
            waferMock.dieDimensions.height
        );
    });

    it('with small width and one character at maximum should not have labelsFontSize larger than the die width', () => {
        const dieDimensions = { width: 1, height: 10 };
        const maxCharacters = 1;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        waferMock = getWaferMapMockComputationsExperimental();
        waferMock.maxCharacters = maxCharacters;
        waferMock.dieDimensions = dieDimensions;
        waferMock.margin = margin;
        computationsModule = new Computations(waferMock);
        computationsModule.colorAndTextUpdate();

        expect(waferMock.labelsFontSize).toBeLessThan(
            waferMock.dieDimensions.width
        );
    });

    describe('with linear color scale', () => {
        const colorScaleMode = WaferMapColorScaleMode.linear;

        it('and only one color value pair should have undefined color category', () => {
            const dieDimensions = { width: 10, height: 10 };
            const maxCharacters = 2;
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = { colors: ['red'], values: ['1'] };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = maxCharacters;
            waferMock.dieDimensions = dieDimensions;
            waferMock.margin = margin;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();
            const expectedValues = Array(1).fill(undefined);

            const actualValues = waferMock.workerColorScale.map(
                colorCategory => colorCategory.color
            );

            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and only one duplicated color value pair should have a single color category', () => {
            const dieDimensions = { width: 10, height: 10 };
            const maxCharacters = 2;
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = {
                colors: ['red', 'red'],
                values: ['1', '1']
            };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = maxCharacters;
            waferMock.dieDimensions = dieDimensions;
            waferMock.margin = margin;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();

            const expectedValues = Array(1).fill('rgb(255, 0, 0)');
            const actualValues = waferMock.workerColorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and color value pairs for the scale ends should have the colors equally distributed', () => {
            const dieDimensions = { width: 10, height: 10 };
            const maxCharacters = 2;
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = {
                colors: ['black', 'red'],
                values: ['1', '18']
            };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = maxCharacters;
            waferMock.dieDimensions = dieDimensions;
            waferMock.margin = margin;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies
                .sort((a, b) => +a.value - +b.value)
                .map(waferMapDie => {
                    return `rgb(${(+waferMapDie.value - 1) * 15}, 0, 0)`;
                });
            const actualValues = waferMock.workerColorScale.map(
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
            const dieDimensions = { width: 10, height: 10 };
            const maxCharacters = 2;
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = { colors: ['red'], values: ['1'] };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = maxCharacters;
            waferMock.dieDimensions = dieDimensions;
            waferMock.margin = margin;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();
            const expectedValues = Array(1).fill('red');
            const actualValues = waferMock.workerColorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and two colors should have two color categories', () => {
            const dieDimensions = { width: 10, height: 10 };
            const maxCharacters = 2;
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            waferMock = getWaferMapMockComputationsExperimental();
            waferMock.colorScale = {
                colors: ['black', 'red'],
                values: []
            };
            waferMock.colorScaleMode = colorScaleMode;
            waferMock.maxCharacters = maxCharacters;
            waferMock.dieDimensions = dieDimensions;
            waferMock.margin = margin;
            computationsModule = new Computations(waferMock);
            computationsModule.colorAndTextUpdate();

            const expectedValues = ['black', 'red'];
            const actualValues = waferMock.workerColorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });
});
