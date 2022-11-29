import { Prerendering } from '../modules/prerendering';
import { WaferMapColorsScaleMode } from '../types';
import {
    getLinearScale,
    getWaferMapDies,
    getWaferMapDiesAsFloats,
    getWaferMapDiesAsNaN
} from './utilities';

describe('Prerendering module', () => {
    let prerenderingModule: Prerendering;

    describe('with die input and small die height', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
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

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                [],
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
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

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should have label suffix for each die', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.text).toContain(dieLabelsSuffix);
            }
        });
    });

    describe('with die input, labels suffix and insufficient characters', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = false;
        const maxCharacters = 3;

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should not have full label suffix for each die and end in ellipsis', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.text).not.toContain(dieLabelsSuffix);
                expect(dieRenderInfo.text).toContain('…');
            }
        });
    });

    describe('with die input and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should have labels equal with values for each die', () => {
            const waferMapDies = getWaferMapDies();
            for (let i = 0; i < waferMapDies.length; i += 1) {
                expect(prerenderingModule.diesRenderInfo[i]!.text).toEqual(
                    waferMapDies[i]!.value
                );
            }
        });
    });

    describe('with NaN die input values and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 3;

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDiesAsNaN(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should have labels equal with values for each die', () => {
            const waferMapNaNDies = getWaferMapDiesAsNaN();
            for (let i = 0; i < waferMapNaNDies.length; i += 1) {
                expect(prerenderingModule.diesRenderInfo[i]!.text).toEqual(
                    waferMapNaNDies[i]!.value
                );
            }
        });
    });

    describe('with floats die input and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 3;

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDiesAsFloats(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it(
            'should have labels equal with values for each die, '
                + 'but limited by the maximum number of characters and a ellipsis',
            () => {
                const waferMapFloatDies = getWaferMapDiesAsFloats();
                const expectedValues = waferMapFloatDies.map(x => {
                    return {
                        text: `${x.value.substring(0, maxCharacters)}…`
                    };
                });
                for (let i = 0; i < waferMapFloatDies.length; i += 1) {
                    expect(prerenderingModule.diesRenderInfo[i]!.text).toEqual(
                        expectedValues[i]!.text
                    );
                }
            }
        );
    });

    describe('with die input, labels suffix but hidden label', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = true;
        const maxCharacters = 1;

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: [], values: [] },
                [],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.linear,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should have empty label for each die', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.text).toEqual('');
            }
        });
    });
});
