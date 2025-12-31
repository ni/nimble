import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { UnitFormatDecimal } from '../decimal.js';
import { ScaledUnit } from '../scaled-unit/scaled-unit.js';
import { UnitScale } from '../unit-scale/unit-scale.js';
import { unitScalePassthrough } from '../unit-scale/passthrough.js';
import { ScaledUnitFormatTest } from './scaled-unit-format-test.js';

describe('UnitFormatDecimal', () => {
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

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(name, () => {
            const options = {
                minimumFractionDigits: value.minDigits,
                maximumFractionDigits: value.maxDigits,
                unitScale: unitScalePassthrough
            } as const;

            const formatterEn = new UnitFormatDecimal('en', options);
            expect(formatterEn.format(value.value)).toEqual(
                value.expectedFormattedValue.en
            );

            const formatterDe = new UnitFormatDecimal('de', options);
            expect(formatterDe.format(value.value)).toEqual(
                value.expectedFormattedValue.de
            );
        });
    });

    describe('with unit', () => {
        class TestUnitScale extends UnitScale {
            public constructor() {
                super([
                    new ScaledUnit(
                        0.001,
                        ScaledUnitFormatTest.createTestFactory(0.001)
                    ),
                    new ScaledUnit(
                        1,
                        ScaledUnitFormatTest.createTestFactory(1)
                    ),
                    new ScaledUnit(
                        2,
                        ScaledUnitFormatTest.createTestFactory(2)
                    ),
                    new ScaledUnit(4, ScaledUnitFormatTest.createTestFactory(4))
                ]);
            }
        }

        describe('and default values', () => {
            it('unconfigured', () => {
                const formatter = new UnitFormatDecimal('en');
                const resolvedOptions = formatter.resolvedOptions();
                expect(resolvedOptions.minimumFractionDigits).toBe(0);
                expect(resolvedOptions.maximumFractionDigits).toBe(3);
                expect(resolvedOptions.unitScale).toBe(unitScalePassthrough);
            });

            it('minimum configured less than default maximum', () => {
                const formatter = new UnitFormatDecimal('en', {
                    minimumFractionDigits: 1
                });
                const resolvedOptions = formatter.resolvedOptions();
                expect(resolvedOptions.minimumFractionDigits).toBe(1);
                expect(resolvedOptions.maximumFractionDigits).toBe(3);
                expect(resolvedOptions.unitScale).toBe(unitScalePassthrough);
            });

            it('minimum configured greater than default maximum', () => {
                const formatter = new UnitFormatDecimal('en', {
                    minimumFractionDigits: 10
                });
                const resolvedOptions = formatter.resolvedOptions();
                expect(resolvedOptions.minimumFractionDigits).toBe(10);
                expect(resolvedOptions.maximumFractionDigits).toBe(10);
                expect(resolvedOptions.unitScale).toBe(unitScalePassthrough);
            });

            it('all configured', () => {
                const unitScale = new TestUnitScale();
                const formatter = new UnitFormatDecimal('en', {
                    minimumFractionDigits: 10,
                    maximumFractionDigits: 20,
                    unitScale
                });
                const resolvedOptions = formatter.resolvedOptions();
                expect(resolvedOptions.minimumFractionDigits).toBe(10);
                expect(resolvedOptions.maximumFractionDigits).toBe(20);
                expect(resolvedOptions.unitScale).toBe(unitScale);
            });
        });

        const appendedLabelUnitTestCases = [
            {
                name: 'does not double-convert the value when a unit is specified',
                value: 3,
                expectedFormattedValue: '1.50 x2'
            },
            {
                name: 'does not zero-round before scaling value',
                value: 0.001,
                expectedFormattedValue: '1.00 x0.001'
            },
            {
                name: 'does zero-rounding after scaling value',
                value: -0.000004,
                expectedFormattedValue: '0.00 x0.001'
            }
        ] as const;
        parameterizeSpec(appendedLabelUnitTestCases, (spec, name, value) => {
            spec(name, () => {
                const formatter = new UnitFormatDecimal('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    unitScale: new TestUnitScale()
                });
                expect(formatter.format(value.value)).toEqual(
                    value.expectedFormattedValue
                );
            });
        });
    });
});
