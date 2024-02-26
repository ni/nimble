import { Table, Int32, Float32, tableFromArrays } from 'apache-arrow';
import type { WaferMapDie } from '../types';

/**
 *  This class is used to convert old wafer map data to new wafer map data
 */
export class WaferMapConvertor {
    public convertWaferMapDiesToTable(waferMapDies: WaferMapDie[]): Table<{
        colIndex: Int32,
        rowIndex: Int32,
        value: Float32
    }>[] {
        const dieColIndexLayer: number[] = [];
        const dieRowIndexLayer: number[] = [];
        const dieValuesLayer: number[] = [];

        waferMapDies.forEach(die => {
            dieColIndexLayer.push(die.x);
            dieRowIndexLayer.push(die.y);
            dieValuesLayer.push(parseFloat(die.value));
        });
        const table = tableFromArrays({
            colIndex: new Int32Array(dieColIndexLayer),
            rowIndex: new Int32Array(dieRowIndexLayer),
            value: new Float32Array(dieValuesLayer)
        });

        return [table];
    }
}