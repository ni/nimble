import { Table, tableFromArrays } from 'apache-arrow';
import type { WaferMapDie } from '../types';

/**
 * This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConvertor {
    public convertWaferMapDiesToTable(waferMapDies: WaferMapDie[]): Table {
        const dieColIndexLayer: number[] = [];
        const dieRowIndexLayer: number[] = [];
        const dieValuesLayer: number[] = [];
        const metadataColumns: { [key: string]: (number | string | boolean)[] } = {};

        waferMapDies.forEach(die => {
            dieColIndexLayer.push(die.x);
            dieRowIndexLayer.push(die.y);
            dieValuesLayer.push(parseFloat(die.value));
            if (typeof die.metadata === 'object' && die.metadata !== null) {
                Object.entries(die.metadata).forEach(([key, value]) => {
                    if (!metadataColumns[key]) {
                        metadataColumns[key] = [];
                    }
                    // Ensure value is of type number | string | boolean before pushing
                    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                        metadataColumns[key]?.push(value);
                    }
                });
            }
        });

        // eslint-disable-next-line no-console
        console.log(waferMapDies);

        // eslint-disable-next-line no-console
        console.log(metadataColumns);

        // Construct the arrays for table creation
        const arrays = {
            colIndex: new Int32Array(dieColIndexLayer),
            rowIndex: new Int32Array(dieRowIndexLayer),
            value: new Float32Array(dieValuesLayer),
            ...metadataColumns
        };

        const table = tableFromArrays(arrays);

        return table;
    }
}
