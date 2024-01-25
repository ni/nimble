import type { WaferMapDie, WaferMapRow, WaferMapColorCategory } from '../types';

export const highlightedTagsSets: string[][] = [
    [],
    ['c'],
    [''],
    ['a', 'b', 'c']
];
export const wafermapDieMatrix: WaferMapRow[][] = [
    [
        {
            xIndex: 0,
            yIndexes: Int32Array.from([2]),
            values: Float32Array.from([14.24]),
        },
        {
            xIndex: 1,
            yIndexes: Int32Array.from([1, 2, 3]),
            values: Float32Array.from([44.63, 76.43, 67.93]),
        },
        {
            xIndex: 2,
            yIndexes: Int32Array.from([0, 1, 2, 3, 4]),
            values: Float32Array.from([26.49, 79.04, 72.71, 37.79, 37.79]),
        },
        {
            xIndex: 3,
            yIndexes: Int32Array.from([1, 2, 3]),
            values: Float32Array.from([98.50, 52.90, 20.83]),
        },
        {
            xIndex: 4,
            yIndexes: Int32Array.from([2]),
            values: Float32Array.from([62.80]),
        },
    ]
];

export const wafermapDieSets: WaferMapDie[][] = [
    [
        {
            x: 0,
            y: 2,
            value: '14.24',
            metadata: 'Placeholder metadata value for Die x: 0 y: 2',
            tags: ['a', 'b']
        },
        {
            x: 1,
            y: 2,
            value: '76.43',
            metadata: 'Placeholder metadata value for Die x: 1 y: 2',
            tags: ['b', 'c']
        },
        {
            x: 1,
            y: 1,
            value: '44.63',
            metadata: 'Placeholder metadata value for Die x: 1 y: 1',
            tags: ['g']
        },
        {
            x: 1,
            y: 3,
            value: '67.93',
            metadata: 'Placeholder metadata value for Die x: 1 y: 3',
            tags: ['a']
        },
        {
            x: 2,
            y: 2,
            value: '72.71',
            metadata: 'Placeholder metadata value for Die x: 2 y: 2',
            tags: ['h', 'e']
        },
        {
            x: 2,
            y: 1,
            value: '79.04',
            metadata: 'Placeholder metadata value for Die x: 2 y: 1',
            tags: ['b']
        },
        {
            x: 2,
            y: 0,
            value: '26.49',
            metadata: 'Placeholder metadata value for Die x: 2 y: 0',
            tags: ['c']
        },
        {
            x: 2,
            y: 3,
            value: '37.79',
            metadata: 'Placeholder metadata value for Die x: 2 y: 3'
        },
        {
            x: 2,
            y: 4,
            value: '59.82',
            metadata: 'Placeholder metadata value for Die x: 2 y: 4'
        },
        {
            x: 3,
            y: 2,
            value: '52.90',
            metadata: 'Placeholder metadata value for Die x: 3 y: 2'
        },
        {
            x: 3,
            y: 1,
            value: '98.50',
            metadata: 'Placeholder metadata value for Die x: 3 y: 1',
            tags: ['g']
        },
        {
            x: 3,
            y: 3,
            value: '20.83',
            metadata: 'Placeholder metadata value for Die x: 3 y: 3',
            tags: ['c']
        },
        {
            x: 4,
            y: 2,
            value: '62.80',
            metadata: 'Placeholder metadata value for Die x: 4 y: 2',
            tags: ['g']
        }
    ]
];

export const waferMapColorScaleSets: WaferMapColorCategory[][] = [
    [
        {
            color: 'red',
            startValue: 1,
            endValue: 33
        },
        {
            color: 'orange',
            startValue: 33,
            endValue: 66
        },
        {
            color: 'green',
            startValue: 66,
            endValue: 100
        }
    ]
];
