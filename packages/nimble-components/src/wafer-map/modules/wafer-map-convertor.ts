import { Table, tableFromArrays } from 'apache-arrow';
import type { WaferMapDie } from '../types';

/**
 * This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConvertor {
    public toApacheTable(waferMapDies: WaferMapDie[]): Table {
        const colIndexLayer: number[] = [];
        const rowIndexLayer: number[] = [];
        const valuesLayer: number[] = [];
        const tags: string[][] = [];

        const maxTags: number = Math.max(...waferMapDies.map((die: WaferMapDie) => die.tags?.length ?? 0));

        waferMapDies.forEach((die, index) => {
            colIndexLayer.push(die.x);
            rowIndexLayer.push(die.y);
            valuesLayer.push(parseFloat(die.value));
            tags[index] = die.tags ?? [];
        });

        let arrays = {};

        arrays = {
            colIndex: new Int32Array(colIndexLayer),
            rowIndex: new Int32Array(rowIndexLayer),
            value: new Float32Array(valuesLayer),
        };

        for (let i = 0; i < maxTags; i++) {
            const tagValues = tags.map(tag => tag[i] ?? null);
            arrays = {
                ...arrays,
                [`tag${i}`]: tagValues,
            };
        }

        const table = tableFromArrays(arrays);

        // eslint-disable-next-line no-console
        console.table(table.data);

        return table;
    }
}