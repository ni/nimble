import type { WaferMapDie } from '../types';
import type { IValueGenerator } from './value-generator';

const generateStringValue = (x:number, y:number, valueGenerator?: IValueGenerator):string =>{
    let value:number;
    if (valueGenerator !== undefined) value =  valueGenerator(x,y);
    else value = Math.random() * 100;
    return valueToString(value);
}

const valueToString = (value: number): string => {
    return value % 1 ? value.toFixed(2) : Math.trunc(value).toString();
};

export const generateWaferData = (
    numDies: number,
    valueGenerator?: IValueGenerator
): WaferMapDie[] => {
    const diesSet: WaferMapDie[] = [];

    if (numDies > 0) {
        // calculate the equivalent radius of a circle that would contain the <<<<numDies>>>> number of dies
        const radius = Math.ceil(Math.sqrt(numDies / Math.PI));
        const centerX = radius;
        const centerY = radius;

        // Generate dies values - start from the bottom and go up
        for (let i = centerY - radius; i < centerY + radius; i++) {
            let stringValue: string;

            // generate points left of centerX
            for (let j = centerX; (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)<= radius * radius; j--) {

                stringValue = generateStringValue(i,j, valueGenerator);
                diesSet.push({ x: i, y: j, value: stringValue });
            }
            // generate points right of centerX
            for (let j = centerX + 1; (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)<= radius * radius; j++) {
                stringValue = generateStringValue(i,j, valueGenerator);
                diesSet.push({ x: i, y: j, value: stringValue });
            }
        }
    }
    return diesSet;
};
