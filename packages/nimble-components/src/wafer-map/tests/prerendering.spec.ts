import { Prerendering } from '../modules/prerendering';
import { WaferMapColorsScaleMode, WaferMapDie } from '../types';
import { getColorsScale, getHighlightedValues, getLinearScale, getWaferMapDies, getWaferMapDiesAsFloats } from './utilities';

describe('Prerendering module', () => {
    let prerenderingModule: Prerendering;

    describe('with die input and small die height', () => {
        const dieDimensions = { width: 10, height: 1 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        beforeEach(async () => {
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
                { top: 20, right: 20, bottom: 20, left: 20 }
            );
        });

        it('should have as many dies as provided', () => {
            expect(prerenderingModule.renderDies.length).toEqual(getWaferMapDies().length);
        });

        it('should not have labelsFontSize larger than the die height', () => {
            expect(prerenderingModule.labelsFontSize).toBeLessThanOrEqual(dieDimensions.height);
        });
    });

    describe('with small width, no label suffix and 1 maximum characters', () => {
        const dieDimensions = { width: 1, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 1;
        beforeEach(async () => {
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
                { top: 20, right: 20, bottom: 20, left: 20 }
            );
        });

        it('should not have labelsFontSize larger than the die width', () => {
            expect(prerenderingModule.labelsFontSize).toBeLessThan(dieDimensions.width);
        });
    });

    describe('with die input and labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        beforeEach(async () => {
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
                { top: 20, right: 20, bottom: 20, left: 20 }
            );
        });

        it('should have label suffix for each die', () => {
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.text).toContain(dieLabelsSuffix);
            }
        });
    });

    describe('with die input and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 2;
        beforeEach(async () => {
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
                { top: 20, right: 20, bottom: 20, left: 20 }
            );
        });

        it('should have labels equal with values for each die', () => {
            const diesIterator = getWaferMapDies()[Symbol.iterator]();
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.text).toEqual((diesIterator.next().value as WaferMapDie).value.toString());
            }
        });
    });

    describe('with floats die input and no labels suffix', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = '';
        const dieLabelsHidden = false;
        const maxCharacters = 3;
        beforeEach(async () => {
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
                { top: 20, right: 20, bottom: 20, left: 20 }
            );
        });

        it('should have labels equal with values for each die, '
            + 'but limited by the maximum number of characters', () => {
            const diesIterator = getWaferMapDiesAsFloats()[Symbol.iterator]();
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.text).toEqual((diesIterator.next().value as WaferMapDie).value.toString().substring(0, maxCharacters));
            }
        });
    });

    describe('with die input, labels suffix but hidden label', () => {
        const dieDimensions = { width: 10, height: 10 };
        const dieLabelsSuffix = 'suffix';
        const dieLabelsHidden = true;
        const maxCharacters = 1;
        beforeEach(async () => {
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
                { top: 20, right: 20, bottom: 20, left: 20 }
            );
        });

        it('should have empty label for each die', () => {
            for (const renderDie of prerenderingModule.renderDies) {
                expect(renderDie.text).toEqual('');
            }
        });
    });
});