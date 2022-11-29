import type { WaferMapDie, WaferMapColorsScale } from '../types';

export const highLightedValueSets = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [1, 5, 7, 15],
    [0, 2, 7, 10]
];

export const wafermapDieSets: WaferMapDie[][] = [
    [
        { x: 0, y: 0, value: 100 },
        { x: 0, y: 1, value: 50 },
        { x: 0, y: 2, value: 12 },
        { x: 0, y: 3, value: 99 },
        { x: 1, y: 0, value: 78 },
        { x: 1, y: 1, value: 88 },
        { x: 1, y: 2, value: 68 },
        { x: 1, y: 3, value: 99 },
        { x: 2, y: 0, value: 99 },
        { x: 2, y: 1, value: 80 },
        { x: 2, y: 2, value: 99 },
        { x: 2, y: 3, value: 100 },
        { x: 3, y: 0, value: 40 },
        { x: 3, y: 1, value: 10 },
        { x: 3, y: 2, value: 15 },
        { x: 3, y: 3, value: 30 }
    ],
    [
        { x: 0, y: 0, value: 16 },
        { x: 0, y: 1, value: 50 },
        { x: 0, y: 2, value: 13 },
        { x: 0, y: 3, value: 65 },
        { x: 1, y: 0, value: 78 },
        { x: 1, y: 1, value: 88 },
        { x: 1, y: 2, value: 99 },
        { x: 1, y: 3, value: 99 },
        { x: 2, y: 0, value: 99 },
        { x: 2, y: 1, value: 80 },
        { x: 2, y: 2, value: 99 },
        { x: 2, y: 3, value: 100 },
        { x: 3, y: 0, value: 70 },
        { x: 3, y: 1, value: 75 },
        { x: 3, y: 2, value: 70 },
        { x: 3, y: 3, value: 72 }
    ]
];

export const waferMapColorsScaleSets: WaferMapColorsScale[] = [
    {
        colors: ['red', 'orange', 'green'],
        values: [1, 50, 100]
    }
];
