import { ScaleLinear, scaleLinear } from 'd3-scale';
import type { WaferMapColorScale, WaferMapDie } from '../types';

export function getWaferMapDies(): WaferMapDie[] {
    return [
        { value: '1', x: 2, y: 3, tooltip: 'Placeholder tooltip value' },
        { value: '2', x: 2, y: 4, tooltip: 'Placeholder tooltip value' },
        { value: '3', x: 3, y: 2, tooltip: 'Placeholder tooltip value' },
        { value: '4', x: 3, y: 3, tooltip: 'Placeholder tooltip value' },
        { value: '5', x: 3, y: 4, tooltip: 'Placeholder tooltip value' },
        { value: '6', x: 3, y: 5, tooltip: 'Placeholder tooltip value' },
        { value: '7', x: 4, y: 1, tooltip: 'Placeholder tooltip value' },
        { value: '8', x: 4, y: 2, tooltip: 'Placeholder tooltip value' },
        { value: '9', x: 4, y: 3, tooltip: 'Placeholder tooltip value' },
        { value: '10', x: 4, y: 4, tooltip: 'Placeholder tooltip value' },
        { value: '11', x: 4, y: 5, tooltip: 'Placeholder tooltip value' },
        { value: '12', x: 4, y: 6, tooltip: 'Placeholder tooltip value' },
        { value: '13', x: 5, y: 2, tooltip: 'Placeholder tooltip value' },
        { value: '14', x: 5, y: 3, tooltip: 'Placeholder tooltip value' },
        { value: '15', x: 5, y: 4, tooltip: 'Placeholder tooltip value' },
        { value: '16', x: 5, y: 5, tooltip: 'Placeholder tooltip value' },
        { value: '17', x: 6, y: 3, tooltip: 'Placeholder tooltip value' },
        { value: '18', x: 6, y: 4, tooltip: 'Placeholder tooltip value' }
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

export function getColorScale(): WaferMapColorScale {
    return { colors: ['red', 'blue', 'green'], values: ['1', '2', '3'] };
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
