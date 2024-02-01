import type { WaferMapData, WaferMapDie } from '../types';
import type { IValueGenerator } from './value-generator';

// const valueToString = (value: number): string => {
//     return value % 1 ? value.toFixed(2) : Math.trunc(value).toString();
// };

const generateValue = (
    x: number,
    y: number,
    valueGenerator?: IValueGenerator
): number => {
    let value: number;
    if (valueGenerator !== undefined) {
        value = valueGenerator(x, y);
    } else {
        value = Math.random() * 100;
    }
    return value;
};

// const generateTagValue = (valueGenerator: IValueGenerator): string => {
//     let value: string;
//     if (valueGenerator !== undefined) {
//         value = String.fromCharCode(Math.ceil(valueGenerator()));
//     } else {
//         value = String.fromCharCode(Math.random() * 100);
//     }
//     return value;
// };

export const generateDieContent = (
    x: number,
    y: number,
    value: string,
    tags?: string[]
): WaferMapDie => {
    return {
        x,
        y,
        value,
        metadata: `Placeholder metadata value for Die x: ${x} y: ${y}`,
        tags
    };
};

export const generateWaferData = (
    numDies: number,
    valueGenerator?: IValueGenerator,
    _highlightedTagsGenerator?: IValueGenerator
): WaferMapData => {
    const diesMatrix: WaferMapData = {
        dieColIndexArray: Int32Array.from([]),
        rowLengthsArray: Int32Array.from([]),
        dieRowIndexLayer: Int32Array.from([]),
        dieValuesLayer: Int32Array.from([]),
        dieHighlightsLayer: Int8Array.from([])
    };

    if (numDies > 0) {
        // calculate the equivalent radius of a circle that would contain the <<<<numDies>>>> number of dies
        const radius = Math.ceil(Math.sqrt(numDies / Math.PI));
        const centerX = radius;
        const centerY = radius;
        const dieColIndexArray: number[] = [];
        const rowLengthsArray: number[] = [];
        const dieRowIndexLayer: number[] = [];
        const dieValuesLayer: number[] = [];

        // Generate dies values - start from the bottom and go up
        for (let i = centerY - radius; i <= centerY + radius; i++) {
            const values: number[] = [];
            const yIndexes: number[] = [];

            // generate points left of centerX
            for (
                let j = centerX;
                (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                <= radius * radius;
                j--
            ) {
                yIndexes.push(j);
                values.push(generateValue(i, j, valueGenerator));
            }
            yIndexes.reverse();
            values.reverse();
            // generate points right of centerX
            for (
                let j = centerX + 1;
                (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                <= radius * radius;
                j++
            ) {
                yIndexes.push(j);
                values.push(generateValue(i, j, valueGenerator));
            }
            dieColIndexArray.push(i);
            rowLengthsArray.push(values.length);
            dieRowIndexLayer.push(...yIndexes);
            dieValuesLayer.push(...values);
        }
        diesMatrix.dieColIndexArray = Int32Array.from(dieColIndexArray);
        diesMatrix.rowLengthsArray = Int32Array.from(rowLengthsArray);
        diesMatrix.dieRowIndexLayer = Int32Array.from(dieRowIndexLayer);
        diesMatrix.dieValuesLayer = Int32Array.from(dieValuesLayer);
    }
    return diesMatrix;
};
