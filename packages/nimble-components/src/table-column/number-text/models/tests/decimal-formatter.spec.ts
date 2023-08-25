import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { DecimalFormatter } from '../decimal-formatter';

describe('DecimalFormatter', () => {
    const testCases: readonly {
        name: string,
        decimalDigits: number,
        value: number,
        expectedFormattedValue: string
    }[] = [
        {
            name: 'NEGATIVE_INFINITY renders as -∞',
            decimalDigits: 1,
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: '-∞'
        },
        {
            name: 'POSITIVE_INFINITY renders as ∞',
            decimalDigits: 1,
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: '∞'
        },
        {
            name: 'NaN renders as NaN',
            decimalDigits: 1,
            value: Number.NaN,
            expectedFormattedValue: 'NaN'
        },
        {
            name: '-0 renders without negative sign',
            decimalDigits: 2,
            value: -0,
            expectedFormattedValue: '0.00'
        },
        {
            name: '+0 renders without positive sign',
            decimalDigits: 2,
            value: 0,
            expectedFormattedValue: '0.00'
        },
        {
            name: 'limits to "decimal-digits" decimals with rounding up',
            decimalDigits: 7,
            value: 1.23456789,
            expectedFormattedValue: '1.2345679'
        },
        {
            name: 'limits to "decimal-digits" decimals with rounding down',
            decimalDigits: 5,
            value: 10.001122,
            expectedFormattedValue: '10.00112'
        },
        {
            name: 'adds zeros to reach "decimal-digits" decimals',
            decimalDigits: 3,
            value: 16,
            expectedFormattedValue: '16.000'
        }
    ] as const;

    const focused: string[] = [];
    const disabled: string[] = [];
    for (const testCase of testCases) {
        const specType = getSpecTypeByNamedList(testCase, focused, disabled);
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        specType(
            `${testCase.name}`,
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            () => {
                const formatter = new DecimalFormatter(testCase.decimalDigits);
                const formattedValue = formatter.formatValue(testCase.value);
                expect(formattedValue).toEqual(testCase.expectedFormattedValue);
            }
        );
    }
});
