import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { NumberTextFormat } from '../../types';
import { NumberTextUnitFormat } from '../number-text-unit-format';
import { byteUnitScale } from '../../../../utilities/unit-format/unit-scale/byte-unit-scale';
import { byte1024UnitScale } from '../../../../utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { passthroughUnitScale } from '../../../../utilities/unit-format/unit-scale/passthrough-unit-scale';

describe('NumberTextUnitFormat', () => {
    const testCases = [
        {
            name: 'honors locale',
            locale: 'de',
            format: NumberTextFormat.default,
            decimalDigits: undefined,
            decimalMaximumDigits: undefined,
            unitScale: undefined,
            number: 1000,
            expected: '1.000'
        },
        {
            name: 'defaults to 2 decimal digits for decimal format',
            locale: undefined,
            format: NumberTextFormat.decimal,
            decimalDigits: undefined,
            decimalMaximumDigits: undefined,
            unitScale: undefined,
            number: 0,
            expected: '0.00'
        },
        {
            name: 'honors decimalDigits (in decimal format)',
            locale: undefined,
            format: NumberTextFormat.decimal,
            decimalDigits: 5,
            decimalMaximumDigits: undefined,
            unitScale: undefined,
            number: 0,
            expected: '0.00000'
        },
        {
            name: 'truncates decimals when decimalMaximumDigits passed (in decimal format)',
            locale: undefined,
            format: NumberTextFormat.decimal,
            decimalDigits: undefined,
            decimalMaximumDigits: 4,
            unitScale: undefined,
            number: 0.012345,
            expected: '0.0123'
        },
        {
            name: 'does not show extra zeros when decimalMaximumDigits passed (in decimal format)',
            locale: undefined,
            format: NumberTextFormat.decimal,
            decimalDigits: undefined,
            decimalMaximumDigits: 4,
            unitScale: undefined,
            number: 0.01,
            expected: '0.01'
        },
        {
            name: 'honors unitScale in decimal format',
            locale: undefined,
            format: NumberTextFormat.decimal,
            decimalDigits: undefined,
            decimalMaximumDigits: undefined,
            unitScale: byteUnitScale,
            number: 0.0123456,
            expected: '0.01 bytes'
        },
        {
            name: 'honors unitScale in default format',
            locale: undefined,
            format: NumberTextFormat.default,
            decimalDigits: undefined,
            decimalMaximumDigits: undefined,
            unitScale: byteUnitScale,
            number: 0.0123456,
            expected: '0.01235 bytes'
        }
    ] as const;
    parameterizeSpec(testCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new NumberTextUnitFormat(value.locale ?? 'en', {
                numberTextFormat: value.format,
                decimalDigits: value.decimalDigits,
                decimalMaximumDigits: value.decimalMaximumDigits,
                unitScale: value.unitScale
            });
            expect(formatter.format(value.number)).toEqual(value.expected);
        });
    });

    it('throws error when format=decimal and decimalDigits and decimalMaximumDigits both specified', () => {
        expect(() => {
            void new NumberTextUnitFormat('en', {
                numberTextFormat: NumberTextFormat.decimal,
                decimalDigits: 0,
                decimalMaximumDigits: 0
            });
        }).toThrowError(
            /decimalDigits and decimalMaximumDigits are mutually exclusive/g
        );
    });

    it('does not throw error when format=default and decimalDigits specified', () => {
        expect(() => {
            void new NumberTextUnitFormat('en', {
                numberTextFormat: NumberTextFormat.default,
                decimalDigits: 0
            });
        }).not.toThrow();
    });

    it('does not throw error when format=default and decimalMaximumDigits specified', () => {
        expect(() => {
            void new NumberTextUnitFormat('en', {
                numberTextFormat: NumberTextFormat.default,
                decimalMaximumDigits: 0
            });
        }).not.toThrow();
    });

    describe('optionsMatch', () => {
        const optionsMatchTestCases = [
            {
                name: 'with different numberTextFormat values',
                options1: { numberTextFormat: NumberTextFormat.default },
                options2: { numberTextFormat: NumberTextFormat.decimal },
                expected: false
            },
            {
                name: 'with same numberTextFormat values',
                options1: { numberTextFormat: NumberTextFormat.decimal },
                options2: { numberTextFormat: NumberTextFormat.decimal },
                expected: true
            },
            {
                name: 'with default-matching numberTextFormat values',
                options1: { numberTextFormat: NumberTextFormat.default },
                options2: {},
                expected: true
            },
            {
                name: 'with decimal format and different decimalDigits values',
                options1: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalDigits: 11
                },
                options2: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalDigits: 12
                },
                expected: false
            },
            {
                name: 'with decimal format and same decimalDigits values',
                options1: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalDigits: 11
                },
                options2: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalDigits: 11
                },
                expected: true
            },
            {
                name: 'with decimal format and default-matching decimalDigits values',
                options1: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalDigits: 2
                },
                options2: {
                    numberTextFormat: NumberTextFormat.decimal
                },
                expected: true
            },
            {
                name: 'resolves both sets of options when comparing',
                options1: {
                    numberTextFormat: NumberTextFormat.decimal
                },
                options2: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalDigits: 2
                },
                expected: true
            },
            {
                name: 'ignores decimalDigits when format is default',
                options1: {
                    numberTextFormat: NumberTextFormat.default,
                    decimalDigits: 11
                },
                options2: {
                    numberTextFormat: NumberTextFormat.default,
                    decimalDigits: 12
                },
                expected: true
            },
            {
                name: 'with decimal format and different decimalMaximumDigits values',
                options1: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalMaximumDigits: 11
                },
                options2: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalMaximumDigits: 12
                },
                expected: false
            },
            {
                name: 'with decimal format and same decimalMaximumDigits values',
                options1: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalMaximumDigits: 11
                },
                options2: {
                    numberTextFormat: NumberTextFormat.decimal,
                    decimalMaximumDigits: 11
                },
                expected: true
            },
            {
                name: 'ignores decimalMaximumDigits when format is default',
                options1: {
                    numberTextFormat: NumberTextFormat.default,
                    decimalMaximumDigits: 11
                },
                options2: {
                    numberTextFormat: NumberTextFormat.default,
                    decimalMaximumDigits: 12
                },
                expected: true
            },
            {
                name: 'with different unitScale values',
                options1: {
                    unitScale: byteUnitScale
                },
                options2: {
                    unitScale: byte1024UnitScale
                },
                expected: false
            },
            {
                name: 'with same unitScale values',
                options1: {
                    unitScale: byteUnitScale
                },
                options2: {
                    unitScale: byteUnitScale
                },
                expected: true
            },
            {
                name: 'defaults unitScale to passthroughUnitScale',
                options1: {
                    unitScale: passthroughUnitScale
                },
                options2: {},
                expected: true
            },
            {
                name: 'undefined options matches empty options',
                options1: undefined,
                options2: {},
                expected: true
            },
            {
                name: 'empty options matches undefined options',
                options1: {},
                options2: undefined,
                expected: true
            }
        ] as const;
        parameterizeSpec(optionsMatchTestCases, (spec, name, value) => {
            spec(name, () => {
                const format = new NumberTextUnitFormat('en', value.options1);
                expect(format.optionsMatch(value.options2)).toBe(
                    value.expected
                );
            });
        });
    });
});
