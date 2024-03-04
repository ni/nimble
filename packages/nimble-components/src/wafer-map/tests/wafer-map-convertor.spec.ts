import { Field, List, Table, Utf8, vectorFromArray } from 'apache-arrow';
import { WaferMapConvertor } from '../modules/wafer-map-convertor';
import type { WaferMapDie } from '../types';
import { generateWaferData } from './data-generator';
import {
    goodValueGenerator,
    highlightedValueGenerator
} from './value-generator';
import {
    expectedTagsArray,
    expectedValuesArray,
    expectedRowIndexArray,
    expectedColIndexArray
} from '../../utilities/tests/wafer-sets';

describe('WaferMap Convertor', () => {
    let waferMapConvertor: WaferMapConvertor;
    const seed = 1;
    const waferMapDies: WaferMapDie[] = generateWaferData(
        2,
        goodValueGenerator(seed),
        highlightedValueGenerator(seed)
    );

    beforeEach(() => {
        waferMapConvertor = new WaferMapConvertor(waferMapDies);
    });

    it('should populate the wafer layers', () => {
        waferMapConvertor.populateLayers();
        expect(waferMapConvertor.colIndexLayer).toEqual(expectedColIndexArray);
        expect(waferMapConvertor.rowIndexLayer).toEqual(expectedRowIndexArray);
        expect(waferMapConvertor.valuesLayer).toEqual(
            expectedValuesArray.map(value => parseFloat(value.toFixed(2)))
        );
        expect(waferMapConvertor.tags).toEqual(expectedTagsArray);
    });

    it('should convert wafer map data to apache arrow table', () => {
        const table = waferMapConvertor.toApacheTable();

        const computedTable = new Table({
            colIndex: vectorFromArray(new Int32Array(expectedColIndexArray)),
            rowIndex: vectorFromArray(new Int32Array(expectedRowIndexArray)),
            value: vectorFromArray(new Float32Array(expectedValuesArray)),
            tags: vectorFromArray(
                expectedTagsArray,
                new List<Utf8>(new Field<Utf8>('', new Utf8()))
            )
        });

        expect(table.toString()).toEqual(computedTable.toString());
    });
});
