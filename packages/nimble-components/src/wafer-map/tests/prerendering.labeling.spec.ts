import type { WaferMap } from '..';
import type { DataManager } from '../modules/data-manager';
import { Prerendering } from '../modules/prerendering';
import { WaferMapColorScaleMode } from '../types';
import {
    getDataManagerMock,
    defaultHorizontalScale,
    defaultVerticalScale,
    getWaferMapDies,
    getWaferMapDiesAsFloats,
    getWaferMapDiesAsNaN,
    getWaferMapMockPrerendering
} from './utilities';

describe('Wafermap Prerendering module', () => {
    let prerenderingModule: Prerendering;

    describe('with die input and small die height', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have as many dies as provided', () => {
            expect(prerenderingModule.diesRenderInfo.length).toEqual(
                getWaferMapDies().length
            );
        });

        it('should not have labelsFontSize larger than the die height', () => {
            expect(prerenderingModule.labelsFontSize).toBeLessThanOrEqual(
                dieDimensions.height
            );
        });
    });

    describe('with small width and one character at maximum', () => {
        const dieDimensions = { width: 1, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 1;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should not have labelsFontSize larger than the die width', () => {
            expect(prerenderingModule.labelsFontSize).toBeLessThan(
                dieDimensions.width
            );
        });
    });

    describe('with die input, labels suffix and sufficient characters', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = false;
        const maxCharacters = 8;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have label suffix for each die', () => {
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.text
            );
            expect(actualValues).not.toHaveSize(0);
            for (const value of actualValues) {
                expect(value).toContain(dieLabelsSuffix);
            }
        });
    });

    describe('with die input, labels suffix and insufficient characters', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = false;
        const maxCharacters = 3;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should not have full label suffix for each die and end in ellipsis', () => {
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.text
            );
            expect(actualValues).not.toHaveSize(0);
            for (const value of actualValues) {
                expect(value).not.toContain(dieLabelsSuffix);
                expect(value).toContain('…');
            }
        });
    });

    describe('with die input and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have labels equal with values for each die', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(
                waferMapDie => waferMapDie.value
            );
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.text
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });

    describe('with NaN die input values and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 3;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDiesAsNaN(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have labels equal with values for each die', () => {
            const waferMapNaNDies = getWaferMapDiesAsNaN();
            const expectedValues = waferMapNaNDies.map(
                waferMapDie => waferMapDie.value
            );
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.text
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });

    describe('with floats die input and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 3;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDiesAsFloats(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it(
            'should have labels equal with values for each die, '
                + 'but limited by the maximum number of characters and a ellipsis',
            () => {
                const waferMapFloatDies = getWaferMapDiesAsFloats();
                const expectedValues = waferMapFloatDies.map(waferMapDie => {
                    return `${waferMapDie.value.substring(0, maxCharacters)}…`;
                });
                const actualValues = prerenderingModule.diesRenderInfo.map(
                    dieRenderInfo => dieRenderInfo.text
                );
                expect(actualValues).toEqual(
                    jasmine.arrayWithExactContents(expectedValues)
                );
            }
        );
    });

    describe('with die input, labels suffix but hidden label', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = true;
        const maxCharacters = 1;
        const highlightedTags: string[] = [];
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock = getWaferMapMockPrerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                highlightedTags,
                WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            );
            const dataManagerMock = getDataManagerMock(
                dieDimensions,
                margin,
                defaultHorizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have empty label for each die', () => {
            const expectedValues = Array(18).fill('');
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.text
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });
});
