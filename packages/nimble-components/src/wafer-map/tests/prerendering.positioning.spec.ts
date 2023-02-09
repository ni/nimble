import type { WaferMap } from '..';
import { Prerendering } from '../modules/prerendering';
import { WaferMapColorScaleMode } from '../types';
import { getLinearScale, getWaferMapDies } from './utilities';

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
            prerenderingModule = new Prerendering(
                {
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
                } as WaferMap,
                getLinearScale([0, 1], [0, 1]),
                getLinearScale([0, 1], [0, 1]),
                dieDimensions,
                margin
            );
        });

        it('should have die positions offset from margins', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(x => {
                return {
                    x: x.x + margin.right,
                    y: x.y + margin.top
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
        const horizontalScale = getLinearScale();
        const verticalScale = getLinearScale([], []);
        const highlightedValues: string[] = [];

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                {
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
                } as WaferMap,
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
        const horizontalScale = getLinearScale([], []);
        const verticalScale = getLinearScale();
        const highlightedValues: string[] = [];

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                {
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
                } as WaferMap,
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
