import type { WaferMap } from '..';
import type { DataManager } from '../modules/data-manager';
import { Prerendering } from '../modules/prerendering';
import { WaferMapColorScaleMode } from '../types';
import { getScaleBand, getWaferMapDies } from './utilities';

describe('Wafermap Prerendering module', () => {
    let prerenderingModule: Prerendering;
    const emptyDieColor = 'rgba(218,223,236,1)';
    const nanDieColor = 'rgba(122,122,122,1)';

    describe('with linear color scale', () => {
        const colorScaleMode = WaferMapColorScaleMode.linear;

        describe('and only one color value pair', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                    colorScale: { colors: ['red'], values: ['1'] },
                    highlightedValues,
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters
                };
                const dataManagerMock: Pick<
                DataManager,
                | 'horizontalScale'
                | 'verticalScale'
                | 'dieDimensions'
                | 'margin'
                > = {
                    horizontalScale: getScaleBand([], []),
                    verticalScale: getScaleBand([], []),
                    dieDimensions,
                    margin
                };
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
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
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                        colors: ['red', 'red'],
                        values: ['1', '1']
                    },
                    highlightedValues,
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters
                };
                const dataManagerMock: Pick<
                DataManager,
                | 'horizontalScale'
                | 'verticalScale'
                | 'dieDimensions'
                | 'margin'
                > = {
                    horizontalScale: getScaleBand([], []),
                    verticalScale: getScaleBand([], []),
                    dieDimensions,
                    margin
                };
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
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
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                        colors: ['black', 'red'],
                        values: ['1', '18']
                    },
                    highlightedValues,
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters
                };
                const dataManagerMock: Pick<
                DataManager,
                | 'horizontalScale'
                | 'verticalScale'
                | 'dieDimensions'
                | 'margin'
                > = {
                    horizontalScale: getScaleBand([], []),
                    verticalScale: getScaleBand([], []),
                    dieDimensions,
                    margin
                };
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
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
        const colorScaleMode = WaferMapColorScaleMode.ordinal;

        describe('and only one color value pair', () => {
            const dieDimensions = { width: 10, height: 10 };
            const dieLabelsSuffix = '';
            const dieLabelsHidden = true;
            const maxCharacters = 2;
            const highlightedValues: string[] = [];
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                    colorScale: { colors: ['red'], values: ['1'] },
                    highlightedValues,
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters
                };
                const dataManagerMock: Pick<
                DataManager,
                | 'horizontalScale'
                | 'verticalScale'
                | 'dieDimensions'
                | 'margin'
                > = {
                    horizontalScale: getScaleBand([], []),
                    verticalScale: getScaleBand([], []),
                    dieDimensions,
                    margin
                };
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
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
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                        colors: ['black', 'red'],
                        values: [] as string[]
                    },
                    highlightedValues,
                    colorScaleMode,
                    dieLabelsHidden,
                    dieLabelsSuffix,
                    maxCharacters
                };
                const dataManagerMock: Pick<
                DataManager,
                | 'horizontalScale'
                | 'verticalScale'
                | 'dieDimensions'
                | 'margin'
                > = {
                    horizontalScale: getScaleBand([], []),
                    verticalScale: getScaleBand([], []),
                    dieDimensions,
                    margin
                };
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
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
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                dies: [
                    {
                        x: 0,
                        y: 0,
                        value: 'NaN'
                    }
                ],
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
            const dataManagerMock: Pick<
            DataManager,
            'horizontalScale' | 'verticalScale' | 'dieDimensions' | 'margin'
            > = {
                horizontalScale: getScaleBand([], []),
                verticalScale: getScaleBand([], []),
                dieDimensions,
                margin
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
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
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                dies: [
                    {
                        x: 0,
                        y: 0,
                        value: undefined as unknown as string
                    }
                ],
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
            const dataManagerMock: Pick<
            DataManager,
            'horizontalScale' | 'verticalScale' | 'dieDimensions' | 'margin'
            > = {
                horizontalScale: getScaleBand([], []),
                verticalScale: getScaleBand([], []),
                dieDimensions,
                margin
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
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
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                colorScale: { colors: ['red'], values: [] as string[] },
                highlightedValues: [highlightedValue],
                colorScaleMode: WaferMapColorScaleMode.ordinal,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            };
            const dataManagerMock: Pick<
            DataManager,
            'horizontalScale' | 'verticalScale' | 'dieDimensions' | 'margin'
            > = {
                horizontalScale: getScaleBand([], []),
                verticalScale: getScaleBand([], []),
                dieDimensions,
                margin
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
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
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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
                colorScale: { colors: ['red'], values: [] as string[] },
                highlightedValues,
                colorScaleMode: WaferMapColorScaleMode.ordinal,
                dieLabelsHidden,
                dieLabelsSuffix,
                maxCharacters
            };
            const dataManagerMock: Pick<
            DataManager,
            'horizontalScale' | 'verticalScale' | 'dieDimensions' | 'margin'
            > = {
                horizontalScale: getScaleBand([], []),
                verticalScale: getScaleBand([], []),
                dieDimensions,
                margin
            };
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
        });

        it('should have all dies with full opacity', () => {
            for (const dieRenderInfo of prerenderingModule.diesRenderInfo) {
                expect(dieRenderInfo.fillStyle).toEqual('rgba(255,0,0,1)');
            }
        });
    });
});
