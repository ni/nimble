import { Prerendering } from '../modules/prerendering';
import { WaferMapColorsScaleMode, WaferMapDie } from '../types';
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
            const diesIterator = getWaferMapDies()[Symbol.iterator]();
            for (const renderDie of prerenderingModule.renderDies) {
                const waferDie = diesIterator.next().value as WaferMapDie;
                expect(renderDie.x).toEqual(waferDie.x + margin.right);
                expect(renderDie.y).toEqual(waferDie.y + margin.top);
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
            const diesIterator = getWaferMapDies()[Symbol.iterator]();
            for (const renderDie of prerenderingModule.renderDies) {
                const waferDie = diesIterator.next().value as WaferMapDie;
                expect(renderDie.x).toEqual(waferDie.x * 10);
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
            const diesIterator = getWaferMapDies()[Symbol.iterator]();
            for (const renderDie of prerenderingModule.renderDies) {
                const waferDie = diesIterator.next().value as WaferMapDie;
                expect(renderDie.y).toEqual(waferDie.y * 10);
            }
        });
    });
});
