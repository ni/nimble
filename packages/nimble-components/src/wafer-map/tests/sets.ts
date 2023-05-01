import type { WaferMapDie, WaferMapColorScale } from '../types';

export const highLightedValueSets = [
    [],
    ['14.24', '67.93', '26.49', '52.90'],
    ['76.43', '72.71', '37.79', '98.50'],
    ['44.63', '79.04', '59.82', '62.80']
];

export const wafermapDieSets: WaferMapDie[][] = [
    [
        {
            x: 0,
            y: 2,
            value: '14.24',
            metadata: 'Placeholder metadata value for Die x: 0 y: 2'
        },
        {
            x: 1,
            y: 2,
            value: '76.43',
            metadata: 'Placeholder metadata value for Die x: 1 y: 2'
        },
        {
            x: 1,
            y: 1,
            value: '44.63',
            metadata: 'Placeholder metadata value for Die x: 1 y: 1'
        },
        {
            x: 1,
            y: 3,
            value: '67.93',
            metadata: 'Placeholder metadata value for Die x: 1 y: 3'
        },
        {
            x: 2,
            y: 2,
            value: '72.71',
            metadata: 'Placeholder metadata value for Die x: 2 y: 2'
        },
        {
            x: 2,
            y: 1,
            value: '79.04',
            metadata: 'Placeholder metadata value for Die x: 2 y: 1'
        },
        {
            x: 2,
            y: 0,
            value: '26.49',
            metadata: 'Placeholder metadata value for Die x: 2 y: 0'
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
            metadata: 'Placeholder metadata value for Die x: 3 y: 1'
        },
        {
            x: 3,
            y: 3,
            value: '20.83',
            metadata: 'Placeholder metadata value for Die x: 3 y: 3'
        },
        {
            x: 4,
            y: 2,
            value: '62.80',
            metadata: 'Placeholder metadata value for Die x: 4 y: 2'
        }
    ]
];

export const waferMapColorScaleSets: WaferMapColorScale[] = [
    {
        colors: ['red', 'orange', 'green'],
        values: ['1', '50', '100']
    }
];
