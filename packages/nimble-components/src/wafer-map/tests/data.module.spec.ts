import { Data } from '../modules/data.module';
import { Quadrant } from '../types';
import { getColorsScale, getHighlightedValues, getWaferMapDies } from './utilities';

describe('Data service', () => {
    describe('when ordinal', () => {
        let categoricalService: Data;

        beforeEach(async () => {
            categoricalService = new Data(
                getWaferMapDies(),
                getColorsScale(),
                getHighlightedValues(),
                Quadrant.topLeft,
                false,
                true,
                '',
                2,
                { width: 20, height: 20 }
            );
        });

        it('should have an ordinal color scale', () => {
            expect(categoricalService.renderDies[0]?.fillStyle).toEqual('red');
            expect(categoricalService.renderDies[1]?.fillStyle).toEqual('blue');
            expect(categoricalService.renderDies[2]?.fillStyle).toEqual('green');
            expect(categoricalService.renderDies[3]?.fillStyle).toEqual('red');
            expect(categoricalService.renderDies[4]?.fillStyle).toEqual('blue');
            expect(categoricalService.renderDies[5]?.fillStyle).toEqual('green');
        });
    });

    describe('when continuous', () => {
        let accumulativeService: Data;

        beforeEach(async () => {
            accumulativeService = new Data(
                getWaferMapDies(),
                getColorsScale(),
                getHighlightedValues(),
                Quadrant.topLeft,
                true,
                true,
                '',
                2,
                { width: 20, height: 20 }
            );
        });

        it('should have an linear color scale', () => {
            expect(accumulativeService.renderDies[0]?.fillStyle).toEqual('rgb(255, 0, 0)');
            expect(accumulativeService.renderDies[1]?.fillStyle).toEqual('rgb(0, 0, 255)');
            expect(accumulativeService.renderDies[2]?.fillStyle).toEqual('rgb(0, 128, 0)');
        });
    });
});
