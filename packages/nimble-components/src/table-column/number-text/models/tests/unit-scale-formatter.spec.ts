// eslint-disable-next-line max-classes-per-file
import type { ScaledUnit } from '../scaled-unit';
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { UnitScaleFormatter } from '../unit-scale-formatter';

describe('UnitScaleFormatter', () => {
    const testCases = [
        {
            name: 'NEGATIVE_INFINITY uses base unit',
            value: Number.NEGATIVE_INFINITY,
            formatterOptions: {},
            expectedFormattedValue: '-∞ x1',
            expectedScaledValue: Number.NEGATIVE_INFINITY
        },
        {
            name: 'POSITIVE_INFINITY uses base unit',
            value: Number.POSITIVE_INFINITY,
            formatterOptions: {},
            expectedFormattedValue: '∞ x1',
            expectedScaledValue: Number.POSITIVE_INFINITY
        },
        {
            name: 'NaN uses base unit',
            value: Number.NaN,
            formatterOptions: {},
            expectedFormattedValue: 'NaN x1',
            expectedScaledValue: Number.NaN
        },
        {
            name: '-0 uses base unit',
            value: -0,
            formatterOptions: {},
            expectedFormattedValue: '-0 x1',
            expectedScaledValue: -0
        },
        {
            name: '+0 uses base unit',
            value: 0,
            formatterOptions: {},
            expectedFormattedValue: '0 x1',
            expectedScaledValue: 0
        },
        {
            name: 'smaller than smallest unit uses smallest unit',
            value: 0.1,
            formatterOptions: {},
            expectedFormattedValue: '0.2 x0.5',
            expectedScaledValue: 0.2
        },
        {
            name: 'exactly smallest unit uses smallest unit',
            value: 0.5,
            formatterOptions: {},
            expectedFormattedValue: '1 x0.5',
            expectedScaledValue: 1
        },
        {
            name: '0.75 uses 0.5 unit',
            value: 0.75,
            formatterOptions: {},
            expectedFormattedValue: '1.5 x0.5',
            expectedScaledValue: 1.5
        },
        {
            name: '3.5 uses 1 unit',
            value: 3.5,
            formatterOptions: {},
            expectedFormattedValue: '3.5 x1',
            expectedScaledValue: 3.5
        },
        {
            name: '7.5 uses 5 unit',
            value: 7.5,
            formatterOptions: {},
            expectedFormattedValue: '1.5 x5',
            expectedScaledValue: 1.5
        },
        {
            name: 'bigger than biggest unit uses biggest unit',
            value: 20,
            formatterOptions: {},
            expectedFormattedValue: '2 x10',
            expectedScaledValue: 2
        },
        {
            name: 'negative values pick unit by magnitude',
            value: -20,
            formatterOptions: {},
            expectedFormattedValue: '-2 x10',
            expectedScaledValue: -2
        },
        {
            name: 'picks largest unit that can be rounded to based on max fraction digits (x10)',
            value: 9.5, // 0.95 x10
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '1 x10',
            expectedScaledValue: 0.95
        },
        {
            name: 'picks largest unit that can be rounded to based on max fraction digits (x5)',
            value: 9.4,
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '1.9 x5',
            expectedScaledValue: 1.8800000000000001
        },
        {
            name: 'uses base unit if rounding scaled unit would be 0',
            value: 0.02, // = 0.04 x0.5 (rounds to 0)
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '0 x1',
            expectedScaledValue: 0.02
        }
    ] as const;

    class TestUnitScaleFormatter extends UnitScaleFormatter {
        protected override getSupportedScaledUnits(
            locale: string,
            formatterOptions: Intl.NumberFormatOptions
        ): ScaledUnit[] {
            const formatter = new Intl.NumberFormat(locale, formatterOptions);
            return [0.5, 1, 5, 10].map(scaleFactor => {
                return {
                    scaleFactor,
                    format: x => {
                        return `${formatter.format(x)} x${scaleFactor}`;
                    }
                };
            });
        }
    }

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`${name} (formatValue)`, () => {
            const formatter = new TestUnitScaleFormatter(
                'en',
                value.formatterOptions
            );
            const formattedValue = formatter.formatValue(value.value);
            expect(formattedValue).toEqual(value.expectedFormattedValue);
        });
    });

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`${name} (getValueForBestUnit)`, () => {
            const formatter = new TestUnitScaleFormatter(
                'en',
                value.formatterOptions
            );
            const scaledValue = formatter.getScaledNumber(value.value);
            expect(scaledValue).toEqual(value.expectedScaledValue);
        });
    });

    it('returns blank for null and undefined', () => {
        const formatter = new TestUnitScaleFormatter('en', {});
        expect(formatter.formatValue(null)).toEqual('');
        expect(formatter.formatValue(undefined)).toEqual('');
    });
});
