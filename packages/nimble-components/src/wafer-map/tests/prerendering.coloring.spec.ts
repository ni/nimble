import type { WaferMap } from '..';
import type { DataManager } from '../modules/data-manager';
import { Prerendering } from '../modules/prerendering';
import { WaferMapColorScaleMode } from '../types';
import { getDataManagerMock, getWaferMapDies } from './utilities';

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
                const dataManagerMock = getDataManagerMock(
                    dieDimensions,
                    margin
                );
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
                );
                prerenderingModule.updateLabelsFontSize();
            });

            it('should have black fill style for all dies', () => {
                Object.entries(prerenderingModule.renderInfo).forEach(
                    ([fillStyle, _dies]) => {
                        expect(fillStyle).toEqual(emptyDieColor);
                    }
                );
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
                const dataManagerMock = getDataManagerMock(
                    dieDimensions,
                    margin
                );
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
                );
                prerenderingModule.updateLabelsFontSize();
            });

            it('should have the same fill style for all dies', () => {
                Object.entries(prerenderingModule.renderInfo).forEach(
                    ([fillStyle, _dies]) => {
                        expect(fillStyle).toEqual('rgba(255,0,0,1)');
                    }
                );
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
                const dataManagerMock = getDataManagerMock(
                    dieDimensions,
                    margin
                );
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
                );
                prerenderingModule.updateLabelsFontSize();
            });

            it('should have the fill style equally distributed to dies', () => {
                Object.entries(prerenderingModule.renderInfo).forEach(
                    ([_fillStyle, dies]) => {
                        expect(dies.length).toEqual(1);
                    }
                );
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
                const dataManagerMock = getDataManagerMock(
                    dieDimensions,
                    margin
                );
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
                );
                prerenderingModule.updateLabelsFontSize();
            });

            it('should have the same fill style for all dies', () => {
                Object.entries(prerenderingModule.renderInfo).forEach(
                    ([fillStyle, _dies]) => {
                        expect(fillStyle).toEqual('rgba(255,0,0,1)');
                    }
                );
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
                const dataManagerMock = getDataManagerMock(
                    dieDimensions,
                    margin
                );
                prerenderingModule = new Prerendering(
                    waferMock as WaferMap,
                    dataManagerMock as DataManager
                );
                prerenderingModule.updateLabelsFontSize();
            });

            it('should have alternating fill style for the dies', () => {
                Object.entries(prerenderingModule.renderInfo).forEach(
                    ([fillStyle, dies]) => {
                        if (fillStyle === 'rgba(0,0,0,1)') {
                            expect(dies.length).toEqual(getWaferMapDies().length / 2);
                        } else if (fillStyle === 'rgba(255,0,0,1)') {
                            expect(dies.length).toEqual(getWaferMapDies().length / 2);
                        }
                    }
                );
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
            const dataManagerMock = getDataManagerMock(dieDimensions, margin);
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have NaN color fill style', () => {
            Object.entries(prerenderingModule.renderInfo).forEach(
                ([fillStyle, _dies]) => {
                    expect(fillStyle).toEqual(nanDieColor);
                }
            );
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
            const dataManagerMock = getDataManagerMock(dieDimensions, margin);
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have empty color fill style', () => {
            Object.entries(prerenderingModule.renderInfo).forEach(
                ([fillStyle, _dies]) => {
                    expect(fillStyle).toEqual(emptyDieColor);
                }
            );
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
            const dataManagerMock = getDataManagerMock(dieDimensions, margin);
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have highlighted value with full opacity and the rest with expected opacity', () => {
            Object.entries(prerenderingModule.renderInfo).forEach(
                ([fillStyle, dies]) => {
                    if (fillStyle === 'rgba(255,0,0,1)') {
                        expect(dies.length).toEqual(1);
                    } else if (fillStyle === 'rgba(255,0,0,0.3)') {
                        expect(dies.length).toEqual(getWaferMapDies().length - 1);
                    }
                }
            );
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
            const dataManagerMock = getDataManagerMock(dieDimensions, margin);
            prerenderingModule = new Prerendering(
                waferMock as WaferMap,
                dataManagerMock as DataManager
            );
            prerenderingModule.updateLabelsFontSize();
        });

        it('should have all dies with full opacity', () => {
            Object.entries(prerenderingModule.renderInfo).forEach(
                ([fillStyle, _dies]) => {
                    expect(fillStyle).toEqual('rgba(255,0,0,1)');
                }
            );
        });
    });
});
