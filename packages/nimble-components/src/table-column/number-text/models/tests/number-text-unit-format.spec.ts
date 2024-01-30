import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { NumberTextFormat } from '../../types';
import { NumberTextUnitFormat } from '../number-text-unit-format';
import { byteUnitScale } from '../../../../utilities/unit-format/unit-scale/byte-unit-scale';
import type { UnitScale } from '../../../../utilities/unit-format/unit-scale/unit-scale';

describe('NumberTextUnitFormat', () => {
    const testCases: readonly {
        name: string,
        locale?: string,
        format: NumberTextFormat,
        decimalDigits?: number,
        decimalMaximumDigits?: number,
        unitScale?: UnitScale,
        number: number,
        expected: string
    }[] = [
        {
            name: 'honors locale',
            locale: 'de',
            format: NumberTextFormat.default,
            number: 1000,
            expected: '1.000'
        },
        {
            name: 'defaults to 2 decimal digits for decimal format',
            format: NumberTextFormat.decimal,
            number: 0,
            expected: '0.00'
        },
        {
            name: 'honors decimalDigits (in decimal format)',
            format: NumberTextFormat.decimal,
            decimalDigits: 5,
            number: 0,
            expected: '0.00000'
        },
        {
            name: 'truncates decimals when decimalMaximumDigits passed (in decimal format)',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: 4,
            number: 0.012345,
            expected: '0.0123'
        },
        {
            name: 'does not show extra zeros when decimalMaximumDigits passed (in decimal format)',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: 4,
            number: 0.01,
            expected: '0.01'
        },
        {
            name: 'honors unitScale in decimal format',
            format: NumberTextFormat.decimal,
            unitScale: byteUnitScale,
            number: 0.0123456,
            expected: '0.01 bytes'
        },
        {
            name: 'honors unitScale in default format',
            format: NumberTextFormat.default,
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
});
