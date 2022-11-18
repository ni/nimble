import { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import { Data } from '../services/data.service';
import { Quadrant, WaferColorByOptions } from '../types';

function getDies(): WaferMapDie[] {
    return [
        { data: '1', x: 2, y: 3 },
        { data: '2', x: 2, y: 4 },
        { data: '3', x: 3, y: 2 },
        { data: '4', x: 3, y: 3 },
        { data: '5', x: 3, y: 4 },
        { data: '6', x: 3, y: 5 },
        { data: '7', x: 4, y: 1 },
        { data: '8', x: 4, y: 2 },
        { data: '9', x: 4, y: 3 },
        { data: '10', x: 4, y: 4 },
        { data: '11', x: 4, y: 5 },
        { data: '12', x: 4, y: 6 },
        { data: '13', x: 5, y: 2 },
        { data: '14', x: 5, y: 3 },
        { data: '15', x: 5, y: 4 },
        { data: '16', x: 5, y: 5 },
        { data: '16', x: 6, y: 3 },
        { data: '14', x: 6, y: 4 },
    ];
}

function getColorsScale(): WaferMapColorsScale {
    return new WaferMapColorsScale(['red', 'blue', 'green'], ['1', '2', '3']);
}

function getHighlightedValues(): string[] {
    return ['5', '10', '15'];
}

describe('Data service', () => {
    let service: Data;

    beforeEach(async () => {
        service = new Data(
            getDies(),
            WaferColorByOptions.floatValue,
            getColorsScale(),
            getHighlightedValues(),
            Quadrant.topLeft,
            true,
            2,
            20,
            20
        );
    });

    afterEach(async () => {
    });

    it('Data service should exist', () => {
        expect(service !== undefined);
    });
});
