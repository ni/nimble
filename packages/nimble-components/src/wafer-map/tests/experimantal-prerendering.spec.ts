import { Prerendering } from '../modules/experimental/prerendering';
import { WaferMapColorScaleMode } from '../types';
import {
    getDataManagerMock,
    defaultHorizontalScale,
    defaultVerticalScale,
    getWaferMapDies,
    getWaferMapMockPrerendering
} from './utilities';

describe('Wafermap Experimental Prerendering module', () => {
    let prerenderingModule: Prerendering;

    it('with die input and small die height should not have labelsFontSize larger than the die height', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        const dataManagerMock = getDataManagerMock(
            dieDimensions,
            margin,
            defaultHorizontalScale,
            defaultVerticalScale
        );
        const waferMock = getWaferMapMockPrerendering(
            getWaferMapDies(),
            { colors: [], values: [] },
            highlightedTags,
            WaferMapColorScaleMode.linear,
            dieLabelsHidden,
            dieLabelsSuffix,
            maxCharacters,
            dataManagerMock
        );
        prerenderingModule = new Prerendering(waferMock);
        prerenderingModule.update();

        expect(prerenderingModule.labelsFontSize).toBeLessThanOrEqual(
            dieDimensions.height
        );
    });

    it('with small width and one character at maximum should not have labelsFontSize larger than the die width', () => {
        const dieDimensions = { width: 1, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 1;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        const dataManagerMock = getDataManagerMock(
            dieDimensions,
            margin,
            defaultHorizontalScale,
            defaultVerticalScale
        );
        const waferMock = getWaferMapMockPrerendering(
            getWaferMapDies(),
            { colors: [], values: [] },
            highlightedTags,
            WaferMapColorScaleMode.linear,
            dieLabelsHidden,
            dieLabelsSuffix,
            maxCharacters,
            dataManagerMock
        );
        prerenderingModule = new Prerendering(waferMock);
        prerenderingModule.update();

        expect(prerenderingModule.labelsFontSize).toBeLessThan(
            dieDimensions.width
        );
    });

    describe('with linear color scale', () => {
        const colorScaleMode = WaferMapColorScaleMode.linear;

        it('and only one color value pair should have undefined color category', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedTags: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: ['red'], values: ['1'] },
                highlightedTags,
                colorScaleMode,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dataManagerMock
            );
            prerenderingModule = new Prerendering(waferMock);
            prerenderingModule.update();
            const expectedValues = Array(1).fill(undefined);

            const actualValues = prerenderingModule.colorScale.map(
                colorCategory => colorCategory.color
            );

            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and only one duplicated color value pair should have a single color category', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedTags: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                {
                    colors: ['red', 'red'],
                    values: ['1', '1']
                },
                highlightedTags,
                colorScaleMode,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dataManagerMock
            );
            prerenderingModule = new Prerendering(waferMock);
            prerenderingModule.update();

            const expectedValues = Array(1).fill('rgb(255, 0, 0)');
            const actualValues = prerenderingModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and color value pairs for the scale ends should have the colors equally distributed', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedTags: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                {
                    colors: ['black', 'red'],
                    values: ['1', '18']
                },
                highlightedTags,
                colorScaleMode,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dataManagerMock
            );
            prerenderingModule = new Prerendering(waferMock);
            prerenderingModule.update();
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies
                .sort((a, b) => +a.value - +b.value)
                .map(waferMapDie => {
                    return `rgb(${(+waferMapDie.value - 1) * 15}, 0, 0)`;
                });
            const actualValues = prerenderingModule.colorScale.map(
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
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedTags: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: ['red'], values: ['1'] },
                highlightedTags,
                colorScaleMode,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dataManagerMock
            );
            prerenderingModule = new Prerendering(waferMock);
            prerenderingModule.update();
            const expectedValues = Array(1).fill('red');
            const actualValues = prerenderingModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });

        it('and two colors should have two color categories', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedTags: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                {
                    colors: ['black', 'red'],
                    values: []
                },
                highlightedTags,
                colorScaleMode,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dataManagerMock
            );
            prerenderingModule = new Prerendering(waferMock);
            prerenderingModule.update();

            const expectedValues = ['black', 'red'];
            const actualValues = prerenderingModule.colorScale.map(
                colorCategory => colorCategory.color
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });
});
