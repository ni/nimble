import { Table, Int32, Float32, tableFromArrays } from 'apache-arrow';
import type { WaferMapDie } from '../types';
import type { IValueGenerator } from './value-generator';

const valueToString = (value: number): string => {
    return value % 1 ? value.toFixed(2) : Math.trunc(value).toString();
};

const generateStringValue = (
    x: number,
    y: number,
    valueGenerator: IValueGenerator
): string => {
    let value: number;
    if (valueGenerator !== undefined) {
        value = valueGenerator(x, y);
    } else {
        value = Math.random() * 100;
    }
    return valueToString(value);
};
const generateFloatValue = (
    x: number,
    y: number,
    valueGenerator: IValueGenerator
): number => {
    let value: number;
    if (valueGenerator !== undefined) {
        value = valueGenerator(x, y);
    } else {
        value = Math.random() * 100;
    }
    return value;
};

const generateTagValue = (valueGenerator: IValueGenerator): string => {
    let value: string;
    if (valueGenerator !== undefined) {
        value = String.fromCharCode(Math.ceil(valueGenerator()));
    } else {
        value = String.fromCharCode(Math.random() * 100);
    }
    return value;
};

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
    valueGenerator: IValueGenerator,
    highlightedTagsGenerator: IValueGenerator
): WaferMapDie[] => {
    const diesSet: WaferMapDie[] = [];

    if (numDies > 0) {
        // calculate the equivalent radius of a circle that would contain the <<<<numDies>>>> number of dies
        const radius = Math.ceil(Math.sqrt(numDies / Math.PI));
        const centerX = radius;
        const centerY = radius;

        // Generate dies values - start from the bottom and go up
        for (let i = centerY - radius; i <= centerY + radius; i++) {
            let stringValue: string;

            // generate points left of centerX
            for (
                let j = centerX;
                (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                <= radius * radius;
                j--
            ) {
                stringValue = generateStringValue(i, j, valueGenerator);
                const randomLetter = generateTagValue(highlightedTagsGenerator);
                diesSet.push(
                    generateDieContent(i, j, stringValue, [randomLetter])
                );
            }
            // generate points right of centerX
            for (
                let j = centerX + 1;
                (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                <= radius * radius;
                j++
            ) {
                stringValue = generateStringValue(i, j, valueGenerator);
                const randomLetter = generateTagValue(highlightedTagsGenerator);
                diesSet.push(
                    generateDieContent(i, j, stringValue, [randomLetter])
                );
            }
        }
    }
    return diesSet;
};

export const generateWaferTableData = (
    numDies: number,
    valueGenerator: IValueGenerator
): Table<{
    colIndex: Int32,
    rowIndex: Int32,
    value: Float32
}> => {
    const colIndex = [];
    const rowIndex = [];
    const value = [];

    if (numDies > 0) {
        // calculate the equivalent radius of a circle that would contain the <<<<numDies>>>> number of dies
        const radius = Math.ceil(Math.sqrt(numDies / Math.PI));
        const centerX = radius;
        const centerY = radius;

        // Generate dies values - start from the bottom and go up
        for (let i = centerY - radius; i <= centerY + radius; i++) {
            let stringValue: number;

            // generate points left of centerX
            for (
                let j = centerX;
                (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                <= radius * radius;
                j--
            ) {
                stringValue = generateFloatValue(i, j, valueGenerator);
                colIndex.push(j);
                rowIndex.push(i);
                value.push(stringValue);
            }
            // generate points right of centerX
            for (
                let j = centerX + 1;
                (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                <= radius * radius;
                j++
            ) {
                stringValue = generateFloatValue(i, j, valueGenerator);
                colIndex.push(j);
                rowIndex.push(i);
                value.push(stringValue);
            }
        }
    }
    return tableFromArrays({
        colIndex: Int32Array.from(colIndex),
        rowIndex: Int32Array.from(rowIndex),
        value: Float32Array.from(value)
    });
};
