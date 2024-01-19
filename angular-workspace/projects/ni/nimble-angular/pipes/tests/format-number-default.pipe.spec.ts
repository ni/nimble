import { FormatNumberDefaultPipe, byteUnitScale } from '../format-number-default.pipe';

describe('FormatNumberDefaultPipe', () => {
    const testCases = [
        {
            name: 'default formatting is as expected',
            options: {},
            value: 1000000,
            expected: '1E6'
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
    ];

    testCases.forEach(test => {
        it(test.name, () => {
            const pipe = new FormatNumberDefaultPipe(test.options.locale ?? 'en');
            expect(pipe.transform(test.value, test.options.unitScale)).toEqual(test.expected);
        });
    });

    it('handles change to unitScale argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDefaultPipe('en');
        expect(pipe.transform(100)).toEqual('100');
        expect(pipe.transform(100, byteUnitScale)).toEqual('100 bytes');
    });

    it('reuses format object when same arguments are passed to transform()', () => {
        const pipe = new FormatNumberDefaultPipe('en');
        pipe.transform(1, byteUnitScale);
        const initialFormatter = pipe.defaultUnitFormat;
        pipe.transform(1, byteUnitScale);
        expect(pipe.defaultUnitFormat).toBe(initialFormatter);
    });
});
