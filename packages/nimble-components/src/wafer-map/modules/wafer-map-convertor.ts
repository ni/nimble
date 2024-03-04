import { Field, List, Table, Utf8, vectorFromArray } from 'apache-arrow';
import type { WaferMapDie } from '../types';

/**
 * This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConvertor {
    public colIndexLayer: number[];
    public rowIndexLayer: number[];
    public valuesLayer: number[];
    public tags: string[][];
    private readonly waferMapDies: WaferMapDie[];

    public constructor(waferMapDies: WaferMapDie[]) {
        this.waferMapDies = waferMapDies;
        this.colIndexLayer = [];
        this.rowIndexLayer = [];
        this.valuesLayer = [];
        this.tags = [];
    }

    public toApacheTable(): Table {
        this.populateLayers();

        const columnData = {
            colIndex: vectorFromArray(new Int32Array(this.colIndexLayer)),
            rowIndex: vectorFromArray(new Int32Array(this.rowIndexLayer)),
            value: vectorFromArray(new Float32Array(this.valuesLayer)),
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
            this.colIndexLayer.push(die.x);
            this.rowIndexLayer.push(die.y);
            this.valuesLayer.push(parseFloat(die.value));
            this.tags[index] = die.tags ?? [];
        });
    }
}
