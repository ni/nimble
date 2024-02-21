import type { WaferMap } from '..';
import type { DataManager } from '../modules/data-manager';
import { Prerendering } from '../modules/prerendering';
import { WaferMapColorScaleMode } from '../types';
import {
    getDataManagerMock,
    defaultHorizontalScale,
    getScaleBand,
    defaultVerticalScale,
    getWaferMapDies,
    getWaferMapMockPrerendering
} from './utilities';

describe('Wafermap Prerendering module', () => {
    let prerenderingModule: Prerendering;

    describe('with die input and margin', () => {
        const highlightedTags: string[] = [];
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 20, right: 10, bottom: 0, left: 0 };

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

        it('should have die positions offset from margins', () => {
            const waferMapDies = getWaferMapDies();

            let expectedValues = waferMapDies.map(
                waferMapDie => waferMapDie.x + margin.right
            );
            let actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.x
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );

            expectedValues = waferMapDies.map(
                waferMapDie => waferMapDie.y + margin.top
            );
            actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.y
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });

    describe('with die input and horizontal scale', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const horizontalScale = getScaleBand(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [0, 100]
        );
        const highlightedTags: string[] = [];

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
                horizontalScale,
                defaultVerticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have die horizontal position scaled', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(
                waferMapDie => waferMapDie.x * 10
            );
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.x
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });

    describe('with die input and vertical scale', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const verticalScale = getScaleBand(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [0, 100]
        );
        const highlightedTags: string[] = [];

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
                verticalScale
            );
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have die horizontal position scaled', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(
                waferMapDie => waferMapDie.y * 10
            );
            const actualValues = prerenderingModule.diesRenderInfo.map(
                dieRenderInfo => dieRenderInfo.y
            );
            expect(actualValues).toEqual(
                jasmine.arrayWithExactContents(expectedValues)
            );
        });
    });
});
