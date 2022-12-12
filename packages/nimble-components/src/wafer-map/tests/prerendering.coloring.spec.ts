import { Prerendering } from '../modules/prerendering';
import { WaferMapColorsScaleMode } from '../types';
import { getLinearScale, getWaferMapDies } from './utilities';

describe('Prerendering module', () => {
    let prerenderingModule: Prerendering;
    const emptyDieColor = 'rgba(218,223,236,1)';
    const nanDieColor = 'rgba(122,122,122,1)';

    describe('with linear color scale', () => {
        const colorScaleMode = WaferMapColorsScaleMode.linear;

        describe('and only one color value pair', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];

            beforeEach(() => {
                prerenderingModule = new Prerendering(
                    getWaferMapDies(),
                    { colors: ['red'], values: ['1'] },
                    highlightedValues,
                    getLinearScale([], []),
                    getLinearScale([], []),
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters,
                    dieDimensions,
                    { top: 0, right: 0, bottom: 0, left: 0 }
                );
            });

            it('should have black fill style for all dies', () => {
                for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                    expect(dieRenderInfo.fillStyle).toEqual(emptyDieColor);
                }
            });
        });

        describe('and only one duplicated color value pair', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];

            beforeEach(() => {
                prerenderingModule = new Prerendering(
                    getWaferMapDies(),
                    { colors: ['red', 'red'], values: ['1', '1'] },
                    highlightedValues,
                    getLinearScale([], []),
                    getLinearScale([], []),
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters,
                    dieDimensions,
                    { top: 0, right: 0, bottom: 0, left: 0 }
                );
            });

            it('should have the same fill style for all dies', () => {
                for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                    expect(dieRenderInfo.fillStyle).toEqual('rgba(255,0,0,1)');
                }
            });
        });

        describe('and color value pairs for the scale ends', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];

            beforeEach(() => {
                prerenderingModule = new Prerendering(
                    getWaferMapDies(),
                    { colors: ['black', 'red'], values: ['1', '18'] },
                    highlightedValues,
                    getLinearScale([], []),
                    getLinearScale([], []),
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters,
                    dieDimensions,
                    { top: 0, right: 0, bottom: 0, left: 0 }
                );
            });

            it('should have the fill style equally distributed to dies', () => {
                const waferMapDies = getWaferMapDies();
                const expectedValues = waferMapDies.map(x => {
                    return {
                        fillStyle: `rgba(${(+x.value - 1) * 15},0,0,1)`
                    };
                });
                for (let i = 0; i < waferMapDies.length; i += 1) {
                    expect(
                        prerenderingModule.diesRenderInfo[i]!.fillStyle
                    ).toEqual(expectedValues[i]!.fillStyle);
                }
            });
        });
    });

    describe('with ordinal color scale', () => {
        const colorScaleMode = WaferMapColorsScaleMode.ordinal;

        describe('and only one color value pair', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];

            beforeEach(() => {
                prerenderingModule = new Prerendering(
                    getWaferMapDies(),
                    { colors: ['red'], values: ['1'] },
                    highlightedValues,
                    getLinearScale([], []),
                    getLinearScale([], []),
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters,
                    dieDimensions,
                    { top: 0, right: 0, bottom: 0, left: 0 }
                );
            });

            it('should have the same fill style for all dies', () => {
                for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                    expect(dieRenderInfo.fillStyle).toEqual('rgba(255,0,0,1)');
                }
            });
        });

        describe('and two colors', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];

            beforeEach(() => {
                prerenderingModule = new Prerendering(
                    getWaferMapDies(),
                    { colors: ['black', 'red'], values: [] },
                    highlightedValues,
                    getLinearScale([], []),
                    getLinearScale([], []),
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters,
                    dieDimensions,
                    { top: 0, right: 0, bottom: 0, left: 0 }
                );
            });

            it('should have alternating fill style for the dies', () => {
                const waferMapDies = getWaferMapDies();
                const expectedValues = waferMapDies.map(x => {
                    const fillStyle = +x.value % 2 === 1
                        ? 'rgba(0,0,0,1)'
                        : 'rgba(255,0,0,1)';
                    return {
                        fillStyle
                    };
                });
                for (let i = 0; i < waferMapDies.length; i += 1) {
                    expect(
                        prerenderingModule.diesRenderInfo[i]!.fillStyle
                    ).toEqual(expectedValues[i]!.fillStyle);
                }
            });
        });
    });

    describe('with non numeric values', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = true;
        const maxCharacters = 2;
        const highlightedValues: string[] = [];

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                [{ x: 0, y: 0, value: 'NaN' }],
                { colors: [], values: [] },
                highlightedValues,
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

        it('should have NaN color fill style', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.fillStyle).toEqual(nanDieColor);
            }
        });
    });

    describe('with undefined values', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = true;
        const maxCharacters = 2;
        const highlightedValues: string[] = [];

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                [{ x: 0, y: 0, value: undefined as unknown as string }],
                { colors: [], values: [] },
                highlightedValues,
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

        it('should have empty color fill style', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.fillStyle).toEqual(emptyDieColor);
            }
        });
    });

    describe('with a highlighted value', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = true;
        const maxCharacters = 2;
        const highlightedValue = '5';

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: ['red'], values: [] },
                [highlightedValue],
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.ordinal,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should have highlighted value with full opacity and the rest with expected opacity', () => {
            const waferMapDies = getWaferMapDies();
            const expectedValues = waferMapDies.map(x => {
                const opacity = x.value === highlightedValue ? 1 : 0.3;
                return {
                    fillStyle: `rgba(255,0,0,${opacity})`
                };
            });
            for (let i = 0; i < waferMapDies.length; i += 1) {
                expect(prerenderingModule.diesRenderInfo[i]!.fillStyle).toEqual(
                    expectedValues[i]!.fillStyle
                );
            }
        });
    });

    describe('without highlighted values', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = true;
        const maxCharacters = 2;
        const highlightedValues: string[] = [];

        beforeEach(() => {
            prerenderingModule = new Prerendering(
                getWaferMapDies(),
                { colors: ['red'], values: [] },
                highlightedValues,
                getLinearScale([], []),
                getLinearScale([], []),
                WaferMapColorsScaleMode.ordinal,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters,
                dieDimensions,
                { top: 0, right: 0, bottom: 0, left: 0 }
            );
        });

        it('should have all dies with full opacity', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.fillStyle).toEqual('rgba(255,0,0,1)');
            }
        });
    });
});
