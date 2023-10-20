import { Unit, UnitFamily } from '../../../../units/base/unit-family';
import { unitNoneTag } from '../../../../units/none';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../../../utilities/tests/parameterized';
import { DecimalFormatter } from '../decimal-formatter';

describe('DecimalFormatter', () => {
    const locales = ['en', 'de'] as const;
    const testCases: readonly {
        name: string,
        minDigits: number,
        maxDigits: number,
        value: number,
        expectedFormattedValue: {
            en: string,
            de: string
        }
    }[] = [
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
                        document.createElement(unitNoneTag) as UnitFamily,
                        testCase.minDigits,
                        testCase.maxDigits
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
            public override getSupportedUnits(): Unit[] {
                return [1, 2, 4].map(conversionFactor => {
                    return {
                        conversionFactor,
                        format: x => {
                            return `${x} x${conversionFactor}`;
                        }
                    };
                });
            }
        }
        const composedTestElement = TestUnitFamily.compose({
            baseName: 'test-decimal-formatter-unit-family'
        });

        let element: TestUnitFamily;

        async function setup(): Promise<Fixture<TestUnitFamily>> {
            return fixture(composedTestElement());
        }

        beforeAll(async () => {
            ({ element } = await setup());
        });

        it('does not double-convert the value when a unit is specified', () => {
            const formatter = new DecimalFormatter('en', element, 2, 2);
            const formattedValue = formatter.formatValue(3);
            expect(formattedValue).toEqual('1.5 x2');
        });
    });
});
