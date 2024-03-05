import { Field, List, Table, Utf8, vectorFromArray } from 'apache-arrow';
import type { WaferMapDie, WaferMapLayerData } from '../types';

/**
 * This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConverter {
    public static toApacheTable(waferMapDies: WaferMapDie[]): Table {
        const layers = this.populateLayers(waferMapDies);

        const columnData = {
            colIndex: vectorFromArray(new Int32Array(layers.colIndex)),
            rowIndex: vectorFromArray(new Int32Array(layers.rowIndex)),
            value: vectorFromArray(new Float32Array(layers.values)),
            tags: vectorFromArray(
                layers.tags,
                new List<Utf8>(new Field<Utf8>('', new Utf8()))
            )
        };

        const table = new Table(columnData);

        return table;
    }

    public static populateLayers(
        waferMapDies: WaferMapDie[]
    ): WaferMapLayerData {
        const layers: WaferMapLayerData = {
            colIndex: [],
            rowIndex: [],
            values: [],
            tags: []
        };

        waferMapDies.forEach((die, index) => {
            layers.colIndex.push(die.x);
            layers.rowIndex.push(die.y);
            layers.values.push(parseFloat(die.value));
            layers.tags[index] = die.tags ?? [];
        });

        return layers;
    }
}
