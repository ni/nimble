import { tableFromArrays } from 'apache-arrow';
import { WaferMapConvertor } from '../modules/wafer-map-convertor';
import type { WaferMapDie } from '../types';
import { wafermapDieSets } from './sets';

describe('WaferMap Convertor', () => {
    let waferMapConvertor: WaferMapConvertor;
    const waferMapDies: WaferMapDie[] = wafermapDieSets[0] || [];

    beforeEach(() => {
        waferMapConvertor = new WaferMapConvertor(waferMapDies);
    });

    it('should return the maximum number of tags', () => {
        waferMapConvertor.computeMaximumNumberOfTags();
        const maxTags = Math.max(...waferMapDies.map((die: WaferMapDie) => die.tags?.length ?? 0));
        expect(waferMapConvertor.maxTags).toEqual(maxTags);
    });

    it('should populate the wafer layers', () => {
        waferMapConvertor.populateLayers();
        expect(waferMapConvertor.colIndexLayer).toEqual(waferMapDies.map(die => die.x));
        expect(waferMapConvertor.rowIndexLayer).toEqual(waferMapDies.map(die => die.y));
        expect(waferMapConvertor.valuesLayer).toEqual(waferMapDies.map(die => Number(die.value)));
        expect(waferMapConvertor.tags).toEqual(waferMapDies.map(die => die.tags ?? []));
    });

    it('should convert wafer map data to apache arrow table', () => {
        const table = waferMapConvertor.toApacheTable();

        const waferMapConvertorForTest = new WaferMapConvertor(waferMapDies);
        waferMapConvertorForTest.computeMaximumNumberOfTags();
        waferMapConvertorForTest.populateLayers();

        let arrays = {};

        arrays = {
            colIndex: new Int32Array(waferMapConvertorForTest.colIndexLayer),
            rowIndex: new Int32Array(waferMapConvertorForTest.rowIndexLayer),
            value: new Float32Array(waferMapConvertorForTest.valuesLayer),
        };

        for (let i = 0; i < waferMapConvertorForTest.maxTags; i++) {
            const tagValues = waferMapConvertorForTest.tags.map(tag => tag[i] ?? null);
            arrays = {
                ...arrays,
                [`tag${i}`]: tagValues,
            };
        }

        const computedTable = tableFromArrays(arrays);

        expect(table).toEqual(computedTable);
    });
});