import { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import { Data } from '../modules/data.module';
import { Quadrant } from '../types';

function getDies(): WaferMapDie[] {
    return [
        { value: 1, x: 2, y: 3 },
        { value: 2, x: 2, y: 4 },
        { value: 3, x: 3, y: 2 },
        { value: 4, x: 3, y: 3 },
        { value: 5, x: 3, y: 4 },
        { value: 6, x: 3, y: 5 },
        { value: 7, x: 4, y: 1 },
        { value: 8, x: 4, y: 2 },
        { value: 9, x: 4, y: 3 },
        { value: 10, x: 4, y: 4 },
        { value: 11, x: 4, y: 5 },
        { value: 12, x: 4, y: 6 },
        { value: 13, x: 5, y: 2 },
        { value: 14, x: 5, y: 3 },
        { value: 15, x: 5, y: 4 },
        { value: 16, x: 5, y: 5 },
        { value: 16, x: 6, y: 3 },
        { value: 14, x: 6, y: 4 },
    ];
}

function getColorsScale(): WaferMapColorsScale {
    return new WaferMapColorsScale(['red', 'blue', 'green'], [1, 2, 3]);
}

function getHighlightedValues(): number[] {
    return [5, 10, 15];
}

describe('Data service', () => {
    describe('when ordinal', () => {
        let categoricalService: Data;

        beforeEach(async () => {
            categoricalService = new Data(
                getDies(),
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

        fit('should have an ordinal color scale', () => {
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
            debugger;
            accumulativeService = new Data(
                getDies(),
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

        fit('should have an linear color scale', () => {
            expect(accumulativeService.renderDies[0]?.fillStyle).toEqual('rgb(255, 0, 0)');
            expect(accumulativeService.renderDies[1]?.fillStyle).toEqual('rgb(0, 0, 255)');
            expect(accumulativeService.renderDies[2]?.fillStyle).toEqual('rgb(0, 128, 0)');
        });
    });
});
