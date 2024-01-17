import { FormatDecimalPipe, FormatDecimalPipeUnitScale } from '../format-decimal.pipe';

describe('FormatDecimalPipe', () => {
    const testCases = [
        {
            name: 'default formatting is as expected',
            options: {},
            value: 100,
            expected: '100'
        },
        {
            name: 'honors the minimumFractionDigits value',
            options: {
                minimumFractionDigits: 1
            },
            value: 100,
            expected: '100.0'
        },
        {
            name: 'honors the maximumFractionDigits value',
            options: {
                maximumFractionDigits: 1
            },
            value: 100.1234,
            expected: '100.1'
        },
        {
            name: 'honors the unitScale value (bytes)',
            options: {
                unitScale: FormatDecimalPipeUnitScale.bytes
            },
            value: 3000,
            expected: '3 kB'
        },
        {
            name: 'honors the unitScale value (bytes1024)',
            options: {
                unitScale: FormatDecimalPipeUnitScale.bytes1024
            },
            value: 3000,
            expected: '2.9 KiB'
        },
        {
            name: 'honors the unitScale value (volts)',
            options: {
                unitScale: FormatDecimalPipeUnitScale.volts
            },
            value: 3000,
            expected: '3 kV'
        },
        {
            name: 'honors the locale value',
            options: {
                locale: 'de',
                unitScale: FormatDecimalPipeUnitScale.bytes
            },
            value: 300,
            expected: '300 Byte'
        },
        {
            name: 'defaults the maximumFractionDigits based on the minimumFractionDigits',
            options: {
                minimumFractionDigits: 5
            },
            value: 300.123456,
            expected: '300.12346'
        },
    ];

    testCases.forEach(test => {
        it(test.name, () => {
            const pipe = new FormatDecimalPipe(
                test.options.locale ?? 'en',
                {
                    minimumFractionDigits: test.options.minimumFractionDigits,
                    maximumFractionDigits: test.options.maximumFractionDigits,
                    unitScale: test.options.unitScale
                }
            );
            expect(pipe.transform(test.value)).toEqual(test.expected);
        });
    });
});
