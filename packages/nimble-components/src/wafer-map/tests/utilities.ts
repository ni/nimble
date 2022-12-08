import { ScaleLinear, scaleLinear } from 'd3-scale';
import type { WaferMapColorsScale, WaferMapDie } from '../types';

export function getWaferMapDies(): WaferMapDie[] {
    return [
        { value: '1', x: 2, y: 3 },
        { value: '2', x: 2, y: 4 },
        { value: '3', x: 3, y: 2 },
        { value: '4', x: 3, y: 3 },
        { value: '5', x: 3, y: 4 },
        { value: '6', x: 3, y: 5 },
        { value: '7', x: 4, y: 1 },
        { value: '8', x: 4, y: 2 },
        { value: '9', x: 4, y: 3 },
        { value: '10', x: 4, y: 4 },
        { value: '11', x: 4, y: 5 },
        { value: '12', x: 4, y: 6 },
        { value: '13', x: 5, y: 2 },
        { value: '14', x: 5, y: 3 },
        { value: '15', x: 5, y: 4 },
        { value: '16', x: 5, y: 5 },
        { value: '17', x: 6, y: 3 },
        { value: '18', x: 6, y: 4 }
    ];
}

export function getWaferMapDiesAsFloats(): WaferMapDie[] {
    return getWaferMapDies().map(die => {
        die.value += '0.1111';
        return die;
    });
}

export function getWaferMapDiesAsNaN(): WaferMapDie[] {
    return getWaferMapDies().map(die => {
        die.value = 'NaN';
        return die;
    });
}

export function getColorsScale(): WaferMapColorsScale {
    return { colors: ['red', 'blue', 'green'], values: [1, 2, 3] };
}

export function getHighlightedValues(): string[] {
    return ['5', '10', '15'];
}

export function getLinearScale(
    domain: number[] = [0, 10],
    range: number[] = [0, 100]
): ScaleLinear<number, number> {
    return scaleLinear().domain(domain).range(range);
}
