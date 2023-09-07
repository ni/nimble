import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { DecimalFormatter } from '../decimal-formatter';

describe('DecimalFormatter', () => {
    const locales = ['en', 'de'] as const;
    const testCases: readonly {
        name: string,
        decimalDigits: number,
        value: number,
        expectedFormattedValue: {
            en: string,
            de: string
        }
    }[] = [
        {
            name: 'NEGATIVE_INFINITY renders as -∞',
            decimalDigits: 1,
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: {
                en: '-∞',
                de: '-∞'
            }
        },
        {
            name: 'POSITIVE_INFINITY renders as ∞',
            decimalDigits: 1,
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: {
                en: '∞',
                de: '∞'
            }
        },
        {
            name: 'NaN renders as NaN',
            decimalDigits: 1,
            value: Number.NaN,
            expectedFormattedValue: {
                en: 'NaN',
                de: 'NaN'
            }
        },
        {
            name: '-0 renders without negative sign',
            decimalDigits: 2,
            value: -0,
            expectedFormattedValue: {
                en: '0.00',
                de: '0,00'
            }
        },
        {
            name: 'does not round to -0',
            decimalDigits: 2,
            value: -0.00001,
            expectedFormattedValue: {
                en: '0.00',
                de: '0,00'
            }
        },
        {
            name: '+0 renders without positive sign',
            decimalDigits: 2,
            value: 0,
            expectedFormattedValue: {
                en: '0.00',
                de: '0,00'
            }
        },
        {
            name: 'limits to "decimal-digits" decimals with rounding up',
            decimalDigits: 7,
            value: 1.23456789,
            expectedFormattedValue: {
                en: '1.2345679',
                de: '1,2345679'
            }
        },
        {
            name: 'limits to "decimal-digits" decimals with rounding down',
            decimalDigits: 5,
            value: 10.001122,
            expectedFormattedValue: {
                en: '10.00112',
                de: '10,00112'
            }
        },
        {
            name: 'adds zeros to reach "decimal-digits" decimals',
            decimalDigits: 3,
            value: 16,
            expectedFormattedValue: {
                en: '16.000',
                de: '16,000'
            }
        },
        {
            name: 'uses grouping',
            decimalDigits: 3,
            value: 123456.789,
            expectedFormattedValue: {
                en: '123,456.789',
                de: '123.456,789'
            }
        }
    ] as const;

    const focused: string[] = [];
    const disabled: string[] = [];
    for (const locale of locales) {
        for (const testCase of testCases) {
            const specType = getSpecTypeByNamedList(
                testCase,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `${testCase.name} with '${locale}' locale`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const formatter = new DecimalFormatter(
                        locale,
                        testCase.decimalDigits
                    );
                    const formattedValue = formatter.formatValue(
                        testCase.value
                    );
                    expect(formattedValue).toEqual(
                        testCase.expectedFormattedValue[locale]
                    );
                }
            );
        }
    }
});
