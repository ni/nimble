import { parameterizeNamedList } from '../../../tests/parameterized';
import { byteUnitScale } from '../byte-unit-scale';

describe('ByteUnitScale', () => {
    const testCases = [
        {
            name: '0',
            number: 0,
            formatted: '0 bytes'
        },
        {
            name: '1',
            number: 1,
            formatted: '1 byte'
        },
        {
            name: '2',
            number: 2,
            formatted: '2 bytes'
        },
        {
            name: '10 ** 3',
            number: 10 ** 3,
            formatted: '1 kB'
        },
        {
            name: '10 ** 6',
            number: 10 ** 6,
            formatted: '1 MB'
        },
        {
            name: '10 ** 9',
            number: 10 ** 9,
            formatted: '1 GB'
        },
        {
            name: '10 ** 12',
            number: 10 ** 12,
            formatted: '1 TB'
        },
        {
            name: '10 ** 15',
            number: 10 ** 15,
            formatted: '1 PB'
        },
        {
            name: '10 ** 18',
            number: 10 ** 18,
            formatted: '1,000 PB'
        }
    ] as const;

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`gets expected unit for ${name}`, () => {
            const { scaledValue, scaledUnit } = byteUnitScale.scaleNumber(
                value.number
            );
            expect(
                scaledUnit
                    .scaledUnitFormatFactory({ locale: 'en' })
                    .format(scaledValue)
            ).toEqual(value.formatted);
        });
    });
});
