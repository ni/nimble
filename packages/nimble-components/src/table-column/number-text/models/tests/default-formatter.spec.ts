import { Unit, UnitFamily } from '../../../../units/base/unit-family';
import { unitFamilyNoneTag } from '../../../../units/none';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { DefaultFormatter } from '../default-formatter';

describe('DefaultFormatter', () => {
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
            name: 'without exponential notation limits to 6 digits with rounding decimals up',
            value: 1.23456789,
            expectedFormattedValue: {
                en: '1.23457',
                de: '1,23457'
            }
        },
        {
            name: 'without exponential notation limits to 6 digits with rounding decimals down',
            value: 10.001122,
            expectedFormattedValue: {
                en: '10.0011',
                de: '10,0011'
            }
        },
        {
            name: 'does not use exponential notation for -999,999',
            value: -999999,
            expectedFormattedValue: {
                en: '-999,999',
                de: '-999.999'
            }
        },
        {
            name: 'does not use exponential notation for -999,999.4999',
            value: -999999.4999,
            expectedFormattedValue: {
                en: '-999,999',
                de: '-999.999'
            }
        },
        {
            name: 'uses exponential notation for -999,999.5',
            value: -999999.5,
            expectedFormattedValue: {
                en: '-1E6',
                de: '-1E6'
            }
        },
        {
            name: 'uses exponential notation for -1,000,000',
            value: -1000000,
            expectedFormattedValue: {
                en: '-1E6',
                de: '-1E6'
            }
        },
        {
            name: 'does not use exponential notation for 999,999',
            value: 999999,
            expectedFormattedValue: {
                en: '999,999',
                de: '999.999'
            }
        },
        {
            name: 'does not use exponential notation for 999,999.4999',
            value: 999999.4999,
            expectedFormattedValue: {
                en: '999,999',
                de: '999.999'
            }
        },
        {
            name: 'uses exponential notation for 999,999.5',
            value: 999999.5,
            expectedFormattedValue: {
                en: '1E6',
                de: '1E6'
            }
        },
        {
            name: 'uses exponential notation for 1,000,000',
            value: 1000000,
            expectedFormattedValue: {
                en: '1E6',
                de: '1E6'
            }
        },
        {
            name: 'does not use exponential notation for 0.001',
            value: 0.001,
            expectedFormattedValue: {
                en: '0.001',
                de: '0,001'
            }
        },
        {
            name: 'does not use exponential notation for 0.000995',
            value: 0.000995,
            expectedFormattedValue: {
                en: '0.001',
                de: '0,001'
            }
        },
        {
            name: 'uses exponential notation for 0.000994',
            value: 0.000994,
            expectedFormattedValue: {
                en: '9.94E-4',
                de: '9,94E-4'
            }
        },
        {
            name: 'does not show more than 6 digits even if the rendered value has fewer than 6 significant digits',
            value: 0.0123456,
            expectedFormattedValue: {
                en: '0.01235',
                de: '0,01235'
            }
        },
        {
            name: 'does not show decimals for an integer value',
            value: 16,
            expectedFormattedValue: {
                en: '16',
                de: '16'
            }
        },
        {
            name: 'does not add extra decimals to reach 6 digits',
            value: -98.75,
            expectedFormattedValue: {
                en: '-98.75',
                de: '-98,75'
            }
        },
        {
            name: 'converts numbers with large magnitudes to exponential notation',
            value: -123456789.123456789,
            expectedFormattedValue: {
                en: '-1.23457E8',
                de: '-1,23457E8'
            }
        },
        {
            name: 'converts numbers with small magnitudes to exponential notation',
            value: 0.000000123456789,
            expectedFormattedValue: {
                en: '1.23457E-7',
                de: '1,23457E-7'
            }
        },
        {
            name: 'MAX_SAFE_INTEGER + 9999 renders as an exponential with most significant digits of MAX_SAFE_INTEGER',
            value: Number.MAX_SAFE_INTEGER + 9999,
            expectedFormattedValue: {
                en: '9.0072E15',
                de: '9,0072E15'
            }
        },
        {
            name: 'MIN_SAFE_INTEGER - 9999 renders as an exponential with most significant digits of MIN_SAFE_INTEGER',
            value: Number.MIN_SAFE_INTEGER - 9999,
            expectedFormattedValue: {
                en: '-9.0072E15',
                de: '-9,0072E15'
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
                    const formatter = new DefaultFormatter(
                        locale,
                        document.createElement(unitFamilyNoneTag) as UnitFamily
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

    describe('with unit', () => {
        class TestUnitFamily extends UnitFamily {
            public override getSupportedUnits(
                lang: string,
                formatterOptions: Intl.NumberFormatOptions
            ): Unit[] {
                const formatter = new Intl.NumberFormat(lang, formatterOptions);
                return [1, 100, 1000].map(conversionFactor => {
                    return {
                        conversionFactor,
                        format: x => {
                            return `${formatter.format(
                                x
                            )} x${conversionFactor}`;
                        }
                    };
                });
            }
        }
        const composedTestElement = TestUnitFamily.compose({
            baseName: 'test-default-formatter-unit-family'
        });

        let element: TestUnitFamily;

        async function setup(): Promise<Fixture<TestUnitFamily>> {
            return fixture(composedTestElement());
        }

        beforeAll(async () => {
            ({ element } = await setup());
        });

        it('does not double-convert the value when a unit is specified', () => {
            const formatter = new DefaultFormatter('en', element);
            const formattedValue = formatter.formatValue(130);
            expect(formattedValue).toEqual('1.3 x100');
        });

        it('uses unit-converted value when deciding whether to format in exponential notation', () => {
            const formatter = new DefaultFormatter('en', element);
            const formattedValue = formatter.formatValue(2000000);
            expect(formattedValue).toEqual('2,000 x1000');
        });

        it('always uses base unit if exponential notation is used', () => {
            const formatter = new DefaultFormatter('en', element);
            const formattedValue = formatter.formatValue(2000000000);
            expect(formattedValue).toEqual('2E9 x1'); // rather than '2E6 x1000'
        });
    });
});
