import { Field, List, Table, Utf8, vectorFromArray, Float32, Int32 } from 'apache-arrow';
import { WaferMapConvertor } from '../modules/wafer-map-convertor';
import type { WaferMapDie } from '../types';
import { generateWaferData } from './data-generator';
import {
    goodValueGenerator,
    highlightedValueGenerator
} from './value-generator';
import {
    expectedTags,
    expectedValues,
    expectedRowIndex,
    expectedColIndex
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
        expect(waferMapConvertor.colIndex).toEqual(expectedColIndex);
        expect(waferMapConvertor.rowIndex).toEqual(expectedRowIndex);
        expect(waferMapConvertor.values).toEqual(
            expectedValues.map(value => parseFloat(value.toFixed(2)))
        );
        expect(waferMapConvertor.tags).toEqual(expectedTags);
    });

    it('should convert wafer map data and types to apache arrow table', () => {
        const table = waferMapConvertor.toApacheTable();

        const computedTable = new Table({
            colIndex: vectorFromArray(new Int32Array(expectedColIndex)),
            rowIndex: vectorFromArray(new Int32Array(expectedRowIndex)),
            value: vectorFromArray(new Float32Array(expectedValues)),
            tags: vectorFromArray(
                expectedTags,
                new List<Utf8>(new Field<Utf8>('', new Utf8()))
            )
        });

        expect(table).toEqual(computedTable);

        const columnNames = table.schema.fields.map(field => field.name);
        expect(columnNames).toEqual(['colIndex', 'rowIndex', 'value', 'tags']);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const columnTypes = table.schema.fields.map(field => field.type.toString() as string);
        const expectedTypes = [new Int32(), new Int32(), new Float32(), new List<Utf8>(new Field<Utf8>('', new Utf8()))].map(type => type.toString());
        expect(columnTypes).toEqual(expectedTypes);
    });
});