import { parameterizeNamedList } from '../../tests/parameterized';
import { DecimalFormatter } from '../decimal-formatter';
import { UnitScale } from '../unit-scale/unit-scale';
import { emptyUnitScale } from '../unit-scale/empty-unit-scale';

describe('DecimalFormatter', () => {
    const locales = ['en', 'de'] as const;
    const testCases = [
        {
            name: 'NEGATIVE_INFINITY renders as -∞',
            minDigits: 1,
            maxDigits: 1,
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: {
                en: '-∞',
                de: '-∞'
            }
        },
        {
            name: 'POSITIVE_INFINITY renders as ∞',
            minDigits: 1,
            maxDigits: 1,
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: {
                en: '∞',
                de: '∞'
            }
        },
        {
            name: 'NaN renders as NaN',
            minDigits: 1,
            maxDigits: 1,
            value: Number.NaN,
            expectedFormattedValue: {
                en: 'NaN',
                de: 'NaN'
            }
        },
        {
            name: '-0 renders without negative sign',
            minDigits: 2,
            maxDigits: 2,
            value: -0,
            expectedFormattedValue: {
                en: '0.00',
                de: '0,00'
            }
        },
        {
            name: 'does not round to -0',
            minDigits: 2,
            maxDigits: 2,
            value: -0.00001,
            expectedFormattedValue: {
                en: '0.00',
                de: '0,00'
            }
        },
        {
            name: '+0 renders without positive sign',
            minDigits: 2,
            maxDigits: 2,
            value: 0,
            expectedFormattedValue: {
                en: '0.00',
                de: '0,00'
            }
        },
        {
            name: 'limits to maxDigits decimals with rounding up',
            minDigits: 0,
            maxDigits: 7,
            value: 1.23456789,
            expectedFormattedValue: {
                en: '1.2345679',
                de: '1,2345679'
            }
        },
        {
            name: 'limits to maxDigits decimals with rounding down',
            minDigits: 0,
            maxDigits: 5,
            value: 10.001122,
            expectedFormattedValue: {
                en: '10.00112',
                de: '10,00112'
            }
        },
        {
            name: 'adds zeros to reach minDigits decimals',
            minDigits: 3,
            maxDigits: 5,
            value: 16,
            expectedFormattedValue: {
                en: '16.000',
                de: '16,000'
            }
        },
        {
            name: 'does not add zeros to reach maxDigits decimals',
            minDigits: 3,
            maxDigits: 5,
            value: -0.0123,
            expectedFormattedValue: {
                en: '-0.0123',
                de: '-0,0123'
            }
        },
        {
            name: 'uses grouping',
            minDigits: 3,
            maxDigits: 3,
            value: 123456.789,
            expectedFormattedValue: {
                en: '123,456.789',
                de: '123.456,789'
            }
        }
    ] as const;

    for (const locale of locales) {
        parameterizeNamedList(testCases, (spec, name, value) => {
            spec(`${name} with '${locale}' locale`, () => {
                const formatter = new DecimalFormatter(
                    locale,
                    value.minDigits,
                    value.maxDigits,
                    emptyUnitScale
                );
                expect(formatter.formatValue(value.value)).toEqual(
                    value.expectedFormattedValue[locale]
                );
            });
        });
    }

    describe('with unit', () => {
        class TestUnitScale extends UnitScale {
            public constructor() {
                super([0.001, 1, 2, 4].map(scaleFactor => ({
                    scaleFactor,
                    unitFormatterFactory: () => ({
                        format: (value: number) => `${value} x${scaleFactor}`
                    })
                })));
            }
        }

        const appendedLabelUnitTestCases = [
            {
                name: 'does not double-convert the value when a unit is specified',
                value: 3,
                expectedFormattedValue: '1.5 x2'
            },
            {
                name: 'does not zero-round until after scaling value',
                value: 0.001,
                expectedFormattedValue: '1 x0.001'
            },
            {
                name: 'does zero-rounding after scaling value',
                value: -0.000004,
                expectedFormattedValue: '0 x0.001'
            }
        ] as const;

        parameterizeNamedList(
            appendedLabelUnitTestCases,
            (spec, name, value) => {
                spec(name, () => {
                    const formatter = new DecimalFormatter(
                        'en',
                        2,
                        2,
                        new TestUnitScale()
                    );
                    expect(formatter.formatValue(value.value)).toEqual(
                        value.expectedFormattedValue
                    );
                });
            }
        );
    });
});
