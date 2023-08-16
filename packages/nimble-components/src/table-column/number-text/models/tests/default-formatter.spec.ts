import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { DefaultFormatter } from '../default-formatter';

describe('DefaultFormatter', () => {
    let formatter: DefaultFormatter;

    beforeEach(() => {
        formatter = new DefaultFormatter();
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
            name: 'without exponential notation limits to 6 digits with rounding decimals up',
            value: 1.23456789,
            expectedFormattedValue: '1.23457'
        },
        {
            name: 'without exponential notation limits to 6 digits with rounding decimals down',
            value: 10.001122,
            expectedFormattedValue: '10.0011'
        },
        {
            name: 'does not use exponential notation for -999,999',
            value: -999999,
            expectedFormattedValue: '-999,999'
        },
        {
            name: 'does not use exponential notation for -999,999.4999',
            value: -999999.4999,
            expectedFormattedValue: '-999,999'
        },
        {
            name: 'uses exponential notation for -999,999.5',
            value: -999999.5,
            expectedFormattedValue: '-1E6'
        },
        {
            name: 'uses exponential notation for -1,000,000',
            value: -1000000,
            expectedFormattedValue: '-1E6'
        },
        {
            name: 'does not use exponential notation for 999,999',
            value: 999999,
            expectedFormattedValue: '999,999'
        },
        {
            name: 'does not use exponential notation for 999,999.4999',
            value: 999999.4999,
            expectedFormattedValue: '999,999'
        },
        {
            name: 'uses exponential notation for 999,999.5',
            value: 999999.5,
            expectedFormattedValue: '1E6'
        },
        {
            name: 'uses exponential notation for 1,000,000',
            value: 1000000,
            expectedFormattedValue: '1E6'
        },
        {
            name: 'does not use exponential notation for 0.001',
            value: 0.001,
            expectedFormattedValue: '0.001'
        },
        {
            name: 'does not use exponential notation for 0.000995',
            value: 0.000995,
            expectedFormattedValue: '0.001'
        },
        {
            name: 'uses exponential notation for 0.000994',
            value: 0.000994,
            expectedFormattedValue: '9.94E-4'
        },
        {
            name: 'does not show more than 6 digits even if the rendered value has fewer than 6 significant digits',
            value: 0.0123456,
            expectedFormattedValue: '0.01235'
        },
        {
            name: 'does not show decimals for an integer value',
            value: 16,
            expectedFormattedValue: '16'
        },
        {
            name: 'does not add extra decimals to reach 6 digits',
            value: -98.75,
            expectedFormattedValue: '-98.75'
        },
        {
            name: 'converts numbers with large magnitudes to exponential notation',
            value: -123456789.123456789,
            expectedFormattedValue: '-1.23457E8'
        },
        {
            name: 'converts numbers with small magnitudes to exponential notation',
            value: 0.000000123456789,
            expectedFormattedValue: '1.23457E-7'
        },
        {
            name: 'MAX_SAFE_INTEGER + 9999 renders as an exponential with most significant digits of MAX_SAFE_INTEGER',
            value: Number.MAX_SAFE_INTEGER + 9999,
            expectedFormattedValue: '9.0072E15'
        },
        {
            name: 'MIN_SAFE_INTEGER - 9999 renders as an exponential with most significant digits of MIN_SAFE_INTEGER',
            value: Number.MIN_SAFE_INTEGER - 9999,
            expectedFormattedValue: '-9.0072E15'
        }
    ] as const;

    const focused: string[] = [];
    const disabled: string[] = [];
    for (const testCase of testCases) {
        const specType = getSpecTypeByNamedList(
            testCase,
            focused,
            disabled
        );
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