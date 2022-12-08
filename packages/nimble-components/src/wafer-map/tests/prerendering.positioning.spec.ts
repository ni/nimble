import { Prerendering } from '../modules/prerendering';
import { WaferMapColorsScaleMode } from '../types';
import { getLinearScale, getWaferMapDies } from './utilities';

describe('Prerendering module', () => {
    let prerenderingModule: Prerendering;

    describe('with die input and margin', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        const margin = { top: 20, right: 10, bottom: 0, left: 0 };

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                getLinearScale([0, 1], [0, 1]),
                getLinearScale([0, 1], [0, 1]),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
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

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                horizontalScale,
                verticalScale,
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
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

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                horizontalScale,
                verticalScale,
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
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
