import { parameterizeNamedList } from '../../../tests/parameterized';
import { voltUnitScale } from '../volt-unit-scale';

describe('VoltUnitScale', () => {
    const testCases = [
        {
            name: '10 ** -18',
            number: 10 ** -18,
            formatted: [
                '0.001 fV',
                '0,001 fV',
                '0,001 fV',
                '0.001 fV',
                '0.001 fV'
            ]
        },
        {
            name: '10 ** -15',
            number: 10 ** -15,
            formatted: ['1 fV', '1 fV', '1 fV', '1 fV', '1 fV']
        },
        {
            name: '10 ** -12',
            number: 10 ** -12,
            formatted: ['1 pV', '1 pV', '1 pV', '1 pV', '1 pV']
        },
        {
            name: '10 ** -9',
            number: 10 ** -9,
            formatted: ['1 nV', '1 nV', '1 nV', '1 nV', '1 nV']
        },
        {
            name: '10 ** -6',
            number: 10 ** -6,
            formatted: ['1 μV', '1 μV', '1 μV', '1 μV', '1 μV']
        },
        {
            name: '10 ** -3',
            number: 10 ** -3,
            formatted: ['1 mV', '1 mV', '1 mV', '1 mV', '1 mV']
        },
        {
            name: '10 ** -2',
            number: 10 ** -2,
            formatted: ['1 cV', '1 cV', '1 cV', '1 cV', '1 cV']
        },
        {
            name: '10 ** -1',
            number: 10 ** -1,
            formatted: ['1 dV', '1 dV', '1 dV', '1 dV', '1 dV']
        },
        {
            name: '1',
            number: 1,
            formatted: ['1 volt', '1 volt', '1 Volt', '1 ボルト', '1 伏特']
        },
        {
            name: '2',
            number: 2,
            formatted: ['2 volts', '2 volts', '2 Volt', '2 ボルト', '2 伏特']
        },
        {
            name: '10 ** 3',
            number: 10 ** 3,
            formatted: ['1 kV', '1 kV', '1 kV', '1 kV', '1 kV']
        },
        {
            name: '10 ** 6',
            number: 10 ** 6,
            formatted: ['1 MV', '1 MV', '1 MV', '1 MV', '1 MV']
        },
        {
            name: '10 ** 9',
            number: 10 ** 9,
            formatted: ['1 GV', '1 GV', '1 GV', '1 GV', '1 GV']
        },
        {
            name: '10 ** 12',
            number: 10 ** 12,
            formatted: ['1 TV', '1 TV', '1 TV', '1 TV', '1 TV']
        },
        {
            name: '10 ** 15',
            number: 10 ** 15,
            formatted: ['1 PV', '1 PV', '1 PV', '1 PV', '1 PV']
        },
        {
            name: '10 ** 18',
            number: 10 ** 18,
            formatted: ['1 EV', '1 EV', '1 EV', '1 EV', '1 EV']
        },
        {
            name: '10 ** 21',
            number: 10 ** 21,
            formatted: [
                '1,000 EV',
                '1\u202f000 EV',
                '1.000 EV',
                '1,000 EV',
                '1,000 EV'
            ]
        }
    ] as const;

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`gets expected unit for ${name}`, () => {
            const { scaledValue, scaledUnit } = voltUnitScale.scaleNumber(
                value.number
            );
            expect(
                scaledUnit
                    .scaledUnitFormatFactory({ locale: 'en' })
                    .format(scaledValue)
            ).toEqual(value.formatted[0]);
            expect(
                scaledUnit
                    .scaledUnitFormatFactory({ locale: 'fr' })
                    .format(scaledValue)
            ).toEqual(value.formatted[1]);
            expect(
                scaledUnit
                    .scaledUnitFormatFactory({ locale: 'de' })
                    .format(scaledValue)
            ).toEqual(value.formatted[2]);
            expect(
                scaledUnit
                    .scaledUnitFormatFactory({ locale: 'ja' })
                    .format(scaledValue)
            ).toEqual(value.formatted[3]);
            expect(
                scaledUnit
                    .scaledUnitFormatFactory({ locale: 'zh' })
                    .format(scaledValue)
            ).toEqual(value.formatted[4]);
        });
    });

    it('uses femtovolts unit instead of volts if number would round down to 0', () => {
        const { scaledValue, scaledUnit } = voltUnitScale.scaleNumber(
            10 ** -17
        );
        expect(
            scaledUnit
                .scaledUnitFormatFactory({
                    locale: 'en',
                    intlNumberFormatOptions: { maximumFractionDigits: 1 }
                })
                .format(scaledValue)
        ).toEqual('0 fV');
    });
});
