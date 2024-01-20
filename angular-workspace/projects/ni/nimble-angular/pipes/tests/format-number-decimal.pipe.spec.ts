import { FormatNumberDecimalPipe, byteUnitScale } from '../format-number-decimal.pipe';

describe('FormatNumberDecimalPipe', () => {
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
            name: 'honors the unitScale value',
            options: {
                unitScale: byteUnitScale
            },
            value: 3000,
            expected: '3 kB'
        },
        {
            name: 'honors the locale value',
            options: {
                locale: 'de',
                unitScale: byteUnitScale
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
            const pipe = new FormatNumberDecimalPipe(test.options.locale ?? 'en');
            expect(pipe.transform(test.value, {
                minimumFractionDigits: test.options.minimumFractionDigits,
                maximumFractionDigits: test.options.maximumFractionDigits,
                unitScale: test.options.unitScale
            })).toEqual(test.expected);
        });
    });

    it('handles change to minimumFractionDigits argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100)).toEqual('100');
        expect(pipe.transform(100, { minimumFractionDigits: 4 })).toEqual('100.0000');
    });

    it('handles change to maximumFractionDigits argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100.12345)).toEqual('100.1');
        expect(pipe.transform(100.12345, { maximumFractionDigits: 2 })).toEqual('100.12');
    });

    it('handles change to unitScale argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100)).toEqual('100');
        expect(pipe.transform(100, { unitScale: byteUnitScale })).toEqual('100 bytes');
    });

    it('handles changes to all arguments in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100.12345)).toEqual('100.1');
        expect(pipe.transform(100.12345, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
            unitScale: byteUnitScale
        })).toEqual('100.123 bytes');
    });

    it('reuses format object when same arguments are passed to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        const args = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
            unitScale: byteUnitScale
        };
        pipe.transform(1, args);
        const initialFormatter = pipe.decimalUnitFormat;
        pipe.transform(1, args);
        expect(pipe.decimalUnitFormat).toBe(initialFormatter);
    });
});
