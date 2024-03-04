import { Field, List, Table, Utf8, vectorFromArray } from 'apache-arrow';
import type { WaferMapDie } from '../types';

/**
 * This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConvertor {
    public colIndex: number[];
    public rowIndex: number[];
    public values: number[];
    public tags: string[][];
    private readonly waferMapDies: WaferMapDie[];

    public constructor(waferMapDies: WaferMapDie[]) {
        this.waferMapDies = waferMapDies;
        this.colIndex = [];
        this.rowIndex = [];
        this.values = [];
        this.tags = [];
    }

    public toApacheTable(): Table {
        this.populateLayers();

        const columnData = {
            colIndex: vectorFromArray(new Int32Array(this.colIndex)),
            rowIndex: vectorFromArray(new Int32Array(this.rowIndex)),
            value: vectorFromArray(new Float32Array(this.values)),
            tags: vectorFromArray(
                this.tags,
                new List<Utf8>(new Field<Utf8>('', new Utf8()))
            )
        };

        const table = new Table(columnData);

        return table;
    }

    public populateLayers(): void {
        this.waferMapDies.forEach((die, index) => {
            this.colIndex.push(die.x);
            this.rowIndex.push(die.y);
            this.values.push(parseFloat(die.value));
            this.tags[index] = die.tags ?? [];
        });
    }
}
