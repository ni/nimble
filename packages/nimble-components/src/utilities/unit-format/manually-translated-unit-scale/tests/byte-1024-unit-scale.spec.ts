import { parameterizeNamedList } from '../../../tests/parameterized';
import { byte1024UnitScale } from '../byte-1024-unit-scale';

describe('Byte1024UnitScale', () => {
    const testCases = [
        {
            name: '0',
            number: 0,
            formatted: ['0 bytes', '0 octet', '0 Byte', '0 バイト', '0 字节']
        },
        {
            name: '0.1',
            number: 0.1,
            formatted: [
                '0.1 bytes',
                '0,1 octet',
                '0,1 Byte',
                '0.1 バイト',
                '0.1 字节'
            ]
        },
        {
            name: '1',
            number: 1,
            formatted: ['1 byte', '1 octet', '1 Byte', '1 バイト', '1 字节']
        },
        {
            name: '1.5',
            number: 1.5,
            formatted: [
                '1.5 bytes',
                '1,5 octet',
                '1,5 Byte',
                '1.5 バイト',
                '1.5 字节'
            ]
        },
        {
            name: '2',
            number: 2,
            formatted: ['2 bytes', '2 octets', '2 Byte', '2 バイト', '2 字节']
        },
        {
            name: '1024',
            number: 1024,
            formatted: ['1 KiB', '1 Kio', '1 KiB', '1 KiB', '1 KiB']
        },
        {
            name: '1024 ** 2',
            number: 1024 ** 2,
            formatted: ['1 MiB', '1 Mio', '1 MiB', '1 MiB', '1 MiB']
        },
        {
            name: '1024 ** 3',
            number: 1024 ** 3,
            formatted: ['1 GiB', '1 Gio', '1 GiB', '1 GiB', '1 GiB']
        },
        {
            name: '1024 ** 4',
            number: 1024 ** 4,
            formatted: ['1 TiB', '1 Tio', '1 TiB', '1 TiB', '1 TiB']
        },
        {
            name: '1024 ** 5',
            number: 1024 ** 5,
            formatted: ['1 PiB', '1 Pio', '1 PiB', '1 PiB', '1 PiB']
        },
        {
            name: '1024 ** 6',
            number: 1024 ** 6,
            formatted: [
                '1,024 PiB',
                '1\u202f024 Pio',
                '1.024 PiB',
                '1,024 PiB',
                '1,024 PiB'
            ]
        }
    ] as const;

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`gets expected unit for ${name}`, () => {
            const { scaledValue, scaledUnit } = byte1024UnitScale.scaleNumber(
                value.number
            );
            expect(
                scaledUnit.scaledUnitFormatFactory({ locale: 'en' }).format(scaledValue)
            ).toEqual(value.formatted[0]);
            expect(
                scaledUnit.scaledUnitFormatFactory({ locale: 'fr' }).format(scaledValue)
            ).toEqual(value.formatted[1]);
            expect(
                scaledUnit.scaledUnitFormatFactory({ locale: 'de' }).format(scaledValue)
            ).toEqual(value.formatted[2]);
            expect(
                scaledUnit.scaledUnitFormatFactory({ locale: 'js' }).format(scaledValue)
            ).toEqual(value.formatted[3]);
            expect(
                scaledUnit.scaledUnitFormatFactory({ locale: 'zh' }).format(scaledValue)
            ).toEqual(value.formatted[4]);
        });
    });
});
