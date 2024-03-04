import { Table, Uint32, Int32, Float32, tableFromArrays } from 'apache-arrow';
import type { WaferMapDie, WaferMapColorScale } from '../types';
import { generateWaferData } from './data-generator';
import { goodValueGenerator, highlightedValueGenerator } from './value-generator';

export const highlightedTagsSets: string[][] = [
    [],
    ['c'],
    [''],
    ['a', 'b', 'c']
];

export const wafermapDieSets: WaferMapDie[] = generateWaferData(
    2,
    goodValueGenerator(1),
    highlightedValueGenerator(1)
);

export const wafermapDiesTableSets: Table<{
    colIndex: Int32,
    rowIndex: Int32,
    value: Float32,
    tags: Uint32,
    metadata: never
}>[] = [
    tableFromArrays({
        colIndex: Int32Array.from([0, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4]),
        rowIndex: Int32Array.from([2, 2, 1, 3, 2, 1, 0, 3, 4, 2, 1, 3, 2]),
        value: Float32Array.from([
            14.24, 76.43, 44.63, 67.93, 72.71, 79.04, 26.49, 37.79, 59.82, 52.9,
            98.5, 20.83, 62.8
        ]),
        tags: Uint32Array.from([
            0b000011, // a, b
            0b000110, // b, c
            0b001000, // g
            0b000001, // a
            0b110000, // h, e
            0b000010, // b
            0b000100, // c
            0b000000,
            0b000000,
            0b000000,
            0b001000, // g
            0b000100, // c
            0b001000 // g
        ]),
        metadata: Array.from([
            'Placeholder metadata value for Die x: 0 y: 2',
            'Placeholder metadata value for Die x: 1 y: 2',
            'Placeholder metadata value for Die x: 1 y: 1',
            'Placeholder metadata value for Die x: 1 y: 3',
            'Placeholder metadata value for Die x: 2 y: 2',
            'Placeholder metadata value for Die x: 2 y: 1',
            'Placeholder metadata value for Die x: 2 y: 0',
            'Placeholder metadata value for Die x: 2 y: 3',
            'Placeholder metadata value for Die x: 2 y: 4',
            'Placeholder metadata value for Die x: 3 y: 2',
            'Placeholder metadata value for Die x: 3 y: 1',
            'Placeholder metadata value for Die x: 3 y: 3',
            'Placeholder metadata value for Die x: 4 y: 2'
        ]) as unknown[]
    })
];

export const waferMapColorScaleSets: WaferMapColorScale[] = [
    {
        colors: ['red', 'orange', 'green'],
        values: ['1', '50', '100']
    }
];
