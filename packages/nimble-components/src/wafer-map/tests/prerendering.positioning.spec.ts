import type { WaferMap } from '..';
import { Prerendering } from '../modules/prerendering';
import { WaferMapColorScaleMode } from '../types';
import { getScaleBand, getWaferMapDies } from './utilities';

describe('Wafermap Prerendering module', () => {
    let prerenderingModule: Prerendering;

    describe('with die input and margin', () => {
        const highlightedValues: string[] = [];
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 20, right: 10, bottom: 0, left: 0 };

        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            | 'dies'
            | 'colorScale'
            | 'highlightedValues'
            | 'colorScaleMode'
            | 'dieLabelsHidden'
            | 'dieLabelsSuffix'
            | 'maxCharacters'
            > = {
                dies: getWaferMapDies(),
                colorScale: {
                    colors: [] as string[],
                    values: [] as string[]
                },
                highlightedValues,
                colorScaleMode: WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                getScaleBand([2, 3, 4, 5, 6], [2, 7]),
                getScaleBand([1, 2, 3, 4, 5, 6], [1, 7]),
                dieDimensions,
                margin
            );
        });

        it('should have die positions offset from margins', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(die => {
                return {
                    x: die.x + margin.right,
                    y: die.y + margin.top
                };
            });
            for (let i = 0; i < waferMapDies.length; i += 1) {
                expect(prerenderingModule.diesRenderInfo[i]!.x).toEqual(
                    expectedValues[i]!.x
                );
                expect(prerenderingModule.diesRenderInfo[i]!.y).toEqual(
                    expectedValues[i]!.y
                );
            }
        });
    });

    describe('with die input and horizontal scale', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const horizontalScale = getScaleBand();
        const verticalScale = getScaleBand([], []);
        const highlightedValues: string[] = [];

        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            | 'dies'
            | 'colorScale'
            | 'highlightedValues'
            | 'colorScaleMode'
            | 'dieLabelsHidden'
            | 'dieLabelsSuffix'
            | 'maxCharacters'
            > = {
                dies: getWaferMapDies(),
                colorScale: {
                    colors: [] as string[],
                    values: [] as string[]
                },
                highlightedValues,
                colorScaleMode: WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                horizontalScale,
                verticalScale,
                dieDimensions,
                margin
            );
        });

        it('should have die horizontal position scaled', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(x => {
                return {
                    x: x.x * 10
                };
            });
            for (let i = 0; i < waferMapDies.length; i += 1) {
                expect(prerenderingModule.diesRenderInfo[i]!.x).toEqual(
                    expectedValues[i]!.x
                );
            }
        });
    });

    describe('with die input and vertical scale', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const horizontalScale = getScaleBand([], []);
        const verticalScale = getScaleBand();
        const highlightedValues: string[] = [];

        beforeEach(() => {
            const waferMock: Pick<
            WaferMap,
            | 'dies'
            | 'colorScale'
            | 'highlightedValues'
            | 'colorScaleMode'
            | 'dieLabelsHidden'
            | 'dieLabelsSuffix'
            | 'maxCharacters'
            > = {
                dies: getWaferMapDies(),
                colorScale: {
                    colors: [] as string[],
                    values: [] as string[]
                },
                highlightedValues,
                colorScaleMode: WaferMapColorScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                horizontalScale,
                verticalScale,
                dieDimensions,
                margin
            );
        });

        it('should have die horizontal position scaled', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(x => {
                return {
                    y: x.y * 10
                };
            });
            for (let i = 0; i < waferMapDies.length; i += 1) {
                expect(prerenderingModule.diesRenderInfo[i]!.y).toEqual(
                    expectedValues[i]!.y
                );
            }
        });
    });
});
