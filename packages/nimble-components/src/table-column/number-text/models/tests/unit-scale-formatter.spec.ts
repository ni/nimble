// eslint-disable-next-line max-classes-per-file
import type { ScaledUnit } from '../scaled-unit';
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { UnitScaleFormatter } from '../unit-scale-formatter';

describe('UnitScaleFormatter', () => {
    const byteTestCases = [
        {
            name: 'NEGATIVE_INFINITY uses base unit',
            value: Number.NEGATIVE_INFINITY,
            formatterOptions: {},
            expectedFormattedValue: '-∞ B'
        },
        {
            name: 'POSITIVE_INFINITY uses base unit',
            value: Number.POSITIVE_INFINITY,
            formatterOptions: {},
            expectedFormattedValue: '∞ B'
        },
        {
            name: 'NaN uses base unit',
            value: Number.NaN,
            formatterOptions: {},
            expectedFormattedValue: 'NaN B'
        },
        {
            name: '-0 uses base unit',
            value: -0,
            formatterOptions: {},
            expectedFormattedValue: '-0 B'
        },
        {
            name: '+0 uses base unit',
            value: 0,
            formatterOptions: {},
            expectedFormattedValue: '0 B'
        },
        {
            name: 'smaller than smallest unit uses smallest unit',
            value: 0.1,
            formatterOptions: {},
            expectedFormattedValue: '0.1 B'
        },
        {
            name: 'exactly smallest unit uses smallest unit',
            value: 1,
            formatterOptions: {},
            expectedFormattedValue: '1 B'
        },
        {
            name: '100 uses B unit',
            value: 100,
            formatterOptions: {},
            expectedFormattedValue: '100 B'
        },
        {
            name: '500000 uses kB unit',
            value: 500000,
            formatterOptions: {},
            expectedFormattedValue: '500 kB'
        },
        {
            name: '1000000 uses MB unit',
            value: 1000000,
            formatterOptions: {},
            expectedFormattedValue: '1 MB'
        },
        {
            name: '5000000 uses MB unit',
            value: 5000000,
            formatterOptions: {},
            expectedFormattedValue: '5 MB'
        },
        {
            name: 'negative values pick unit by magnitude',
            value: -20000,
            formatterOptions: {},
            expectedFormattedValue: '-20 kB'
        },
        {
            name: 'does not round 999 up to 1 kB with 1 max fraction digit',
            value: 999,
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '999 B'
        },
        {
            name: 'rounds 999 to 1E3 B in scientific notation with 2 max significant digits',
            value: 999,
            formatterOptions: {
                notation: 'scientific',
                maximumSignificantDigits: 2
            },
            expectedFormattedValue: '1E3 B'
        }
    ] as const;

    class ByteUnitScaleFormatter extends UnitScaleFormatter {
        protected override getSupportedScaledUnits(
            locale: string,
            formatterOptions: Intl.NumberFormatOptions
        ): ScaledUnit[] {
            const formatter = new Intl.NumberFormat(locale, formatterOptions);
            return [
                { factor: 1, unit: 'B' },
                { factor: 10 ** 3, unit: 'kB' },
                { factor: 10 ** 6, unit: 'MB' }
            ].map(item => {
                return {
                    scaleFactor: item.factor,
                    format: x => `${formatter.format(x)} ${item.unit}`
                };
            });
        }
    }

    parameterizeNamedList(byteTestCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new ByteUnitScaleFormatter(
                'en',
                value.formatterOptions
            );
            expect(formatter.formatValue(value.value)).toEqual(
                value.expectedFormattedValue
            );
        });
    });

    const customScaleTestCases = [
        {
            name: 'picks largest unit, not taking rounding into account',
            value: 9.5, // 1.9 x5
            formatterOptions: { maximumFractionDigits: 0 },
            expectedFormattedValue: '2 x5'
        },
        {
            name: 'uses base unit instead of smallest unit for 0',
            value: 0,
            formatterOptions: {},
            expectedFormattedValue: '0 x1'
        },
        {
            name: 'uses smallest unit even if would round to 0',
            value: 0.02, // = 0.04 x0.5 (rounds to 0)
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '0 x0.5'
        }
    ] as const;

    class TestUnitScaleFormatter extends UnitScaleFormatter {
        protected override getSupportedScaledUnits(
            locale: string,
            formatterOptions: Intl.NumberFormatOptions
        ): ScaledUnit[] {
            const formatter = new Intl.NumberFormat(locale, formatterOptions);
            return [0.5, 1, 2, 5, 10].map(scaleFactor => {
                return {
                    scaleFactor,
                    format: x => `${formatter.format(x)} x${scaleFactor}`
                };
            });
        }
    }

    parameterizeNamedList(customScaleTestCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new TestUnitScaleFormatter(
                'en',
                value.formatterOptions
            );
            expect(formatter.formatValue(value.value)).toEqual(
                value.expectedFormattedValue
            );
        });
    });

    it('returns blank for null and undefined', () => {
        const formatter = new TestUnitScaleFormatter('en', {});
        expect(formatter.formatValue(null)).toEqual('');
        expect(formatter.formatValue(undefined)).toEqual('');
    });
});
