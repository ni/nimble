import type { WaferMapDie } from '../types';
import type { IValueGenerator } from './ValueGenerator';

const valueToString = (value: number): string => { return value % 1 ? value.toFixed(2) : Math.trunc(value).toString(); };

export const generateWaferData = (numDies: number, valueGenerator?: IValueGenerator): WaferMapDie[] => {
    const diesSet: WaferMapDie[] = [];

    if (numDies > 0) {
        // calculate the equivalent radius of a circle that would contain the <<<<numDies>>>> number of dies
        const radius = Math.ceil(Math.sqrt(numDies / Math.PI));
        const centerX = radius;
        const centerY = radius;

        // Generate dies values
        for (let i = centerY - radius; i < centerY + radius; i++) {
            let value: number;
            let stringValue: string;

            for (let j = centerX; (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY) <= radius * radius; j--) {
                if (valueGenerator !== undefined) {
                    value = valueGenerator(i, j);
                } else value = (Math.random() * 100);

                stringValue = valueToString(value);

                diesSet.push({ x: i, y: j, value: stringValue });
            }
            for (let j = centerX + 1; (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY) <= radius * radius; j++) {
                if (valueGenerator !== undefined) {
                    value = valueGenerator(i, j);
                } else value = (Math.random() * 100);

                stringValue = valueToString(value);

                diesSet.push({ x: i, y: j, value: stringValue });
            }
        }
    }
    return diesSet;
};