// eslint-disable-next-line max-classes-per-file
import type { ScaledUnit } from '../scaled-unit';
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { UnitScaleFormatter } from '../unit-scale-formatter';
import { FormattedNumber } from '../formatted-number';
import { IntlNumberFormatFormattedNumber } from '../intl-number-format-formatted-number';

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
            name: '-0 uses base unit and formats without minus sign',
            value: -0,
            formatterOptions: {},
            expectedFormattedValue: '0 B'
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
            name: 'rounds 950 up to 1 kB with 1 max fraction digit',
            value: 950, // 0.95 kB
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '1 kB'
        },
        {
            name: 'does not round 949 to kB with 1 max fraction digit',
            value: 949, // 0.949 kB
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '949 B'
        },
        {
            name: 'rounds 999 to 1E0 kB in scientific notation with 2 max significant digits',
            value: 999,
            formatterOptions: {
                notation: 'scientific',
                maximumSignificantDigits: 2
            },
            expectedFormattedValue: '1E0 kB'
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
                    format: x => {
                        const formatted = new IntlNumberFormatFormattedNumber(
                            formatter.formatToParts(x)
                        );
                        return new FormattedNumber(
                            formatted.number,
                            `${formatted.string} ${item.unit}`
                        );
                    }
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
            const formattedValue = formatter.formatValue(value.value);
            expect(formattedValue.string).toEqual(value.expectedFormattedValue);
        });
    });

    const customScaleTestCases = [
        {
            name: 'picks largest unit that can be rounded to based on max fraction digits (x10)',
            value: 9.5, // 0.95 x10
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '1 x10'
        },
        {
            name: 'picks largest unit that can be rounded to based on max fraction digits (x5)',
            value: 9.4,
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '1.9 x5'
        },
        {
            name: 'uses base unit rather than smallest unit if would round to 0',
            value: 0.02, // = 0.04 x0.5 (rounds to 0)
            formatterOptions: { maximumFractionDigits: 1 },
            expectedFormattedValue: '0 x1'
        },
        {
            name: 'handles roundingMode that rounds up when picking unit',
            value: 1.9, // rounds to 2
            formatterOptions: {
                roundingMode: 'halfExpand',
                maximumFractionDigits: 0
            },
            expectedFormattedValue: '1 x2'
        },
        {
            // Firefox skipped, see: https://github.com/ni/nimble/issues/1075
            name: 'handles roundingMode that rounds down when picking unit #SkipFirefox',
            value: 1.9, // rounds to 1 instead of 2
            formatterOptions: {
                roundingMode: 'trunc',
                maximumFractionDigits: 0
            },
            expectedFormattedValue: '1 x1'
        },
        {
            // Firefox skipped, see: https://github.com/ni/nimble/issues/1075
            name: 'picks largest unit when roundingMode=expand and max fraction digits is 0 #SkipFirefox',
            value: 1, // 0.1 x10 rounds to 1 x10
            formatterOptions: {
                roundingMode: 'expand',
                maximumFractionDigits: 0
            },
            expectedFormattedValue: '1 x10'
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
                    format: x => {
                        const formatted = new IntlNumberFormatFormattedNumber(
                            formatter.formatToParts(x)
                        );
                        return new FormattedNumber(
                            formatted.number,
                            `${formatted.string} x${scaleFactor}`
                        );
                    }
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
            const formattedValue = formatter.formatValue(value.value);
            expect(formattedValue.string).toEqual(value.expectedFormattedValue);
        });
    });

    it('returns blank for null and undefined', () => {
        const formatter = new TestUnitScaleFormatter('en', {});
        expect(formatter.formatValue(null).string).toEqual('');
        expect(formatter.formatValue(undefined).string).toEqual('');
    });
});
