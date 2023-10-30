import type { ScaledUnit } from '../scaled-unit';
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { UnitScaleFormatter } from '../unit-scale-formatter';

describe('UnitScaleFormatter', () => {
    const testCases: readonly {
        name: string,
        value: number,
        expectedFormattedValue: string,
        expectedScaledValue: number
    }[] = [
        {
            name: 'NEGATIVE_INFINITY uses base unit',
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: '-Infinity x1',
            expectedScaledValue: Number.NEGATIVE_INFINITY
        },
        {
            name: 'POSITIVE_INFINITY uses base unit',
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: 'Infinity x1',
            expectedScaledValue: Number.POSITIVE_INFINITY
        },
        {
            name: 'NaN uses base unit',
            value: Number.NaN,
            expectedFormattedValue: 'NaN x1',
            expectedScaledValue: Number.NaN
        },
        {
            name: '-0 uses base unit',
            value: -0,
            expectedFormattedValue: '0 x1',
            expectedScaledValue: -0
        },
        {
            name: '+0 uses base unit',
            value: 0,
            expectedFormattedValue: '0 x1',
            expectedScaledValue: 0
        },
        {
            name: 'smaller than smallest unit uses smallest unit',
            value: 0.1,
            expectedFormattedValue: '0.2 x0.5',
            expectedScaledValue: 0.2
        },
        {
            name: 'exactly smallest unit uses smallest unit',
            value: 0.5,
            expectedFormattedValue: '1 x0.5',
            expectedScaledValue: 1
        },
        {
            name: '0.75 uses 0.5 unit',
            value: 0.75,
            expectedFormattedValue: '1.5 x0.5',
            expectedScaledValue: 1.5
        },
        {
            name: '3.5 uses 1 unit',
            value: 3.5,
            expectedFormattedValue: '3.5 x1',
            expectedScaledValue: 3.5
        },
        {
            name: '7.5 uses 5 unit',
            value: 7.5,
            expectedFormattedValue: '1.5 x5',
            expectedScaledValue: 1.5
        },
        {
            name: 'bigger than biggest unit uses biggest unit',
            value: 20,
            expectedFormattedValue: '2 x10',
            expectedScaledValue: 2
        },
        {
            name: 'negative values pick unit by magnitude',
            value: -20,
            expectedFormattedValue: '-2 x10',
            expectedScaledValue: -2
        }
    ] as const;

    class TestUnitScaleFormatter extends UnitScaleFormatter {
        private readonly units = [0.5, 1, 5, 10].map(scaleFactor => {
            return {
                scaleFactor,
                format: (value: number): string => {
                    return `${value} x${scaleFactor}`;
                }
            };
        });

        protected override getSupportedScaledUnits(): ScaledUnit[] {
            return this.units;
        }
    }

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`${name} (formatValue)`, () => {
            const formatter = new TestUnitScaleFormatter('', {});
            const formattedValue = formatter.formatValue(value.value);
            expect(formattedValue).toEqual(value.expectedFormattedValue);
        });
    });

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`${name} (getValueForBestUnit)`, () => {
            const formatter = new TestUnitScaleFormatter('', {});
            const scaledValue = formatter.getScaledNumber(value.value);
            expect(scaledValue).toEqual(value.expectedScaledValue);
        });
    });

    it('returns blank for null and undefined', () => {
        const formatter = new TestUnitScaleFormatter('', {});
        expect(formatter.formatValue(null)).toEqual('');
        expect(formatter.formatValue(undefined)).toEqual('');
    });
});
