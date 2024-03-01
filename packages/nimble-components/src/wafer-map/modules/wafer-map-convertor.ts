import { Table, tableFromArrays } from 'apache-arrow';
import type { WaferMapDie } from '../types';

/**
 * This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConvertor {
    public waferMapDies: WaferMapDie[];
    public colIndexLayer: number[];
    public rowIndexLayer: number[];
    public valuesLayer: number[];
    public tags: string[][];
    public maxTags: number;

    public constructor(waferMapDies: WaferMapDie[]) {
        this.waferMapDies = waferMapDies;
        this.colIndexLayer = [];
        this.rowIndexLayer = [];
        this.valuesLayer = [];
        this.tags = [];
        this.maxTags = 0;
    }

    public toApacheTable(): Table {
        this.computeMaximumNumberOfTags();
        this.populateLayers();

        let arrays = {};

        arrays = {
            colIndex: new Int32Array(this.colIndexLayer),
            rowIndex: new Int32Array(this.rowIndexLayer),
            value: new Float32Array(this.valuesLayer),
        };

        for (let i = 0; i < this.maxTags; i++) {
            const tagValues = this.tags.map(tag => tag[i] ?? null);
            arrays = {
                ...arrays,
                [`tag${i}`]: tagValues,
            };
        }

        const table = tableFromArrays(arrays);

        return table;
    }

    public computeMaximumNumberOfTags(): void {
        this.maxTags = Math.max(...this.waferMapDies.map((die: WaferMapDie) => die.tags?.length ?? 0));
    }

    public populateLayers(): void {
        this.waferMapDies.forEach((die, index) => {
            this.colIndexLayer.push(die.x);
            this.rowIndexLayer.push(die.y);
            this.valuesLayer.push(parseFloat(die.value));
            this.tags[index] = die.tags ?? [];
        });
    }
}