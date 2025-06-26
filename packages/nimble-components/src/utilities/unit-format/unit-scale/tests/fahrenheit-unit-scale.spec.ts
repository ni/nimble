import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { fahrenheitUnitScale } from '../fahrenheit-unit-scale';

describe('FahrenheitUnitScale', () => {
    const testCases = [
        {
            name: '10 ** -1',
            number: 10 ** -1,
            formatted: ['0.1°F', '0,1\u202f°F', '0,1 °F', '0.1°F', '0.1°F']
        },
        {
            name: '1',
            number: 1,
            formatted: ['1°F', '1\u202f°F', '1 °F', '1°F', '1°F']
        },
        {
            name: '2',
            number: 2,
            formatted: ['2°F', '2\u202f°F', '2 °F', '2°F', '2°F']
        },
        {
            name: '10 ** 3',
            number: 10 ** 3,
            formatted: [
                '1,000°F',
                '1\u202f000\u202f°F',
                '1.000 °F',
                '1,000°F',
                '1,000°F'
            ]
        }
    ] as const;

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(`gets expected unit for ${name}`, () => {
            const { scaledValue, scaledUnit } = fahrenheitUnitScale.scaleNumber(
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
});
