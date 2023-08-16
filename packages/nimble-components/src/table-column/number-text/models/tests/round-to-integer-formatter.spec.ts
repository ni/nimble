import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { RoundToIntegerFormatter } from '../round-to-integer-formatter';

describe('RoundToIntegerFormatter', () => {
    let formatter: RoundToIntegerFormatter;

    beforeEach(() => {
        formatter = new RoundToIntegerFormatter();
    });

    const testCases: readonly {
        name: string,
        value: number,
        expectedFormattedValue: string
    }[] = [
        {
            name: 'NEGATIVE_INFINITY renders as -∞',
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: '-∞'
        },
        {
            name: 'POSITIVE_INFINITY renders as ∞',
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: '∞'
        },
        {
            name: 'NaN renders as NaN',
            value: Number.NaN,
            expectedFormattedValue: 'NaN'
        },
        {
            name: '-0 renders without negative sign',
            value: -0,
            expectedFormattedValue: '0'
        },
        {
            name: '+0 renders without positive sign',
            value: 0,
            expectedFormattedValue: '0'
        },
        {
            name: '-0.1 renders as 0 without negative sign',
            value: -0.1,
            expectedFormattedValue: '0'
        },
        {
            name: 'rounds down positive numbers',
            value: 1.23,
            expectedFormattedValue: '1'
        },
        {
            name: 'rounds up positive numbers',
            value: 1.76,
            expectedFormattedValue: '2'
        },
        {
            name: 'rounds down negative numbers',
            value: -1.76,
            expectedFormattedValue: '-2'
        },
        {
            name: 'rounds up negative numbers',
            value: -1.23,
            expectedFormattedValue: '-1'
        },
        {
            name: 'shows more than 6 digits for positive numbers',
            value: 987654321,
            expectedFormattedValue: '987,654,321'
        },
        {
            name: 'shows more than 6 digits for negative numbers',
            value: -123456789,
            expectedFormattedValue: '-123,456,789'
        },
        {
            name: 'MAX_SAFE_INTEGER + 1 renders as the exact value',
            value: Number.MAX_SAFE_INTEGER + 1,
            expectedFormattedValue: '9,007,199,254,740,992'
        },
        {
            name: 'MAX_SAFE_INTEGER + 1.5  renders with rounding precision errors',
            value: Number.MAX_SAFE_INTEGER + 1.5,
            expectedFormattedValue: '9,007,199,254,740,992'
        },
        {
            name: 'MIN_SAFE_INTEGER - 1 renders as the exact value',
            value: Number.MIN_SAFE_INTEGER - 1,
            expectedFormattedValue: '-9,007,199,254,740,992'
        },
        {
            name: 'MIN_SAFE_INTEGER - 1.5  renders with rounding precision errors',
            value: Number.MIN_SAFE_INTEGER - 1.5,
            expectedFormattedValue: '-9,007,199,254,740,992'
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
                const formattedValue = formatter.formatValue(testCase.value);
                expect(formattedValue).toEqual(testCase.expectedFormattedValue);
            }
        );
    }
});
