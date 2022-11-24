import { Prerendering } from '../modules/prerendering';
import { WaferMapColorsScaleMode, WaferMapDie } from '../types';
import { getLinearScale, getWaferMapDies } from './utilities';

describe('Prerendering module', () => {
    let prerenderingModule: Prerendering;

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

            it('should have undefined fill style for all dies', () => {
                for (const renderDie of prerenderingModule.renderDies) {
                    expect(renderDie.fillStyle).toBeUndefined();
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
                for (const renderDie of prerenderingModule.renderDies) {
                    expect(renderDie.fillStyle).toEqual('rgb(255, 0, 0)');
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
                const diesIterator = getWaferMapDies()[Symbol.iterator]();
                for (const renderDie of prerenderingModule.renderDies) {
                    expect(renderDie.fillStyle).toEqual(
                        `rgb(${
                            (+(diesIterator.next().value as WaferMapDie).value
                                - 1)
                            * 15
                        }, 0, 0)`
                    );
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
                for (const renderDie of prerenderingModule.renderDies) {
                    expect(renderDie.fillStyle).toEqual('red');
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
                const diesIterator = getWaferMapDies()[Symbol.iterator]();
                for (const renderDie of prerenderingModule.renderDies) {
                    expect(renderDie.fillStyle).toEqual(
                        +(diesIterator.next().value as WaferMapDie).value % 2
                            === 1
                            ? 'black'
                            : 'red'
                    );
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
        const nanDieColor = '#7a7a7a';

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
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.fillStyle).toEqual(nanDieColor);
            }
        });
    });

    describe('with undefined values', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = true;
        const maxCharacters = 2;
        const highlightedValues: string[] = [];
        const emptyDieColor = '#DADFEC';

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
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.fillStyle).toEqual(emptyDieColor);
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
                { colors: [], values: [] },
                [highlightedValue],
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

        it('should have highlighted value with 0 opacity and the rest with 0.3', () => {
            const diesIterator = getWaferMapDies()[Symbol.iterator]();
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.opacity).toEqual(
                    (diesIterator.next().value as WaferMapDie).value
                        === highlightedValue
                        ? 0
                        : 0.3
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

        it('should have all dies with 0 opacity', () => {
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.opacity).toEqual(0);
            }
        });
    });
});
