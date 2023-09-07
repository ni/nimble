import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { RoundToIntegerFormatter } from '../round-to-integer-formatter';

describe('RoundToIntegerFormatter', () => {
    const locales = ['en', 'de'] as const;
    const testCases: readonly {
        name: string,
        value: number,
        expectedFormattedValue: {
            en: string,
            de: string
        }
    }[] = [
        {
            name: 'NEGATIVE_INFINITY renders as -∞',
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: {
                en: '-∞',
                de: '-∞'
            }
        },
        {
            name: 'POSITIVE_INFINITY renders as ∞',
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: {
                en: '∞',
                de: '∞'
            }
        },
        {
            name: 'NaN renders as NaN',
            value: Number.NaN,
            expectedFormattedValue: {
                en: 'NaN',
                de: 'NaN'
            }
        },
        {
            name: '-0 renders without negative sign',
            value: -0,
            expectedFormattedValue: {
                en: '0',
                de: '0'
            }
        },
        {
            name: '+0 renders without positive sign',
            value: 0,
            expectedFormattedValue: {
                en: '0',
                de: '0'
            }
        },
        {
            name: '-0.1 renders as 0 without negative sign',
            value: -0.1,
            expectedFormattedValue: {
                en: '0',
                de: '0'
            }
        },
        {
            name: 'rounds down positive numbers',
            value: 1.23,
            expectedFormattedValue: {
                en: '1',
                de: '1'
            }
        },
        {
            name: 'rounds up positive numbers',
            value: 1.76,
            expectedFormattedValue: {
                en: '2',
                de: '2'
            }
        },
        {
            name: 'rounds down negative numbers',
            value: -1.76,
            expectedFormattedValue: {
                en: '-2',
                de: '-2'
            }
        },
        {
            name: 'rounds up negative numbers',
            value: -1.23,
            expectedFormattedValue: {
                en: '-1',
                de: '-1'
            }
        },
        {
            name: 'shows more than 6 digits for positive numbers',
            value: 987654321,
            expectedFormattedValue: {
                en: '987,654,321',
                de: '987.654.321'
            }
        },
        {
            name: 'shows more than 6 digits for negative numbers',
            value: -123456789,
            expectedFormattedValue: {
                en: '-123,456,789',
                de: '-123.456.789'
            }
        },
        {
            name: 'MAX_SAFE_INTEGER + 1 renders as the exact value',
            value: Number.MAX_SAFE_INTEGER + 1,
            expectedFormattedValue: {
                en: '9,007,199,254,740,992',
                de: '9.007.199.254.740.992'
            }
        },
        {
            name: 'MAX_SAFE_INTEGER + 1.5  renders with rounding precision errors',
            value: Number.MAX_SAFE_INTEGER + 1.5,
            expectedFormattedValue: {
                en: '9,007,199,254,740,992',
                de: '9.007.199.254.740.992'
            }
        },
        {
            name: 'MIN_SAFE_INTEGER - 1 renders as the exact value',
            value: Number.MIN_SAFE_INTEGER - 1,
            expectedFormattedValue: {
                en: '-9,007,199,254,740,992',
                de: '-9.007.199.254.740.992'
            }
        },
        {
            name: 'MIN_SAFE_INTEGER - 1.5  renders with rounding precision errors',
            value: Number.MIN_SAFE_INTEGER - 1.5,
            expectedFormattedValue: {
                en: '-9,007,199,254,740,992',
                de: '-9.007.199.254.740.992'
            }
        }
    ] as const;

    const focused: string[] = [];
    const disabled: string[] = [];
    for (const locale of locales) {
        for (const testCase of testCases) {
            const specType = getSpecTypeByNamedList(testCase, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `${testCase.name} with '${locale}' locale`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const formatter = new RoundToIntegerFormatter(locale);
                    const formattedValue = formatter.formatValue(testCase.value);
                    expect(formattedValue).toEqual(testCase.expectedFormattedValue[locale]);
                }
            );
        }
    }
});
