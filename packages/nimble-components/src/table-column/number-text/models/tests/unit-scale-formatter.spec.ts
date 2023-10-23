import type { ScaledUnit } from '../scaled-unit';
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { UnitScaleFormatter } from '../unit-scale-formatter';

describe('UnitScaleFormatter', () => {
    const testCases: readonly {
        name: string,
        value: number,
        expectedFormattedValue: string,
        expectedConvertedValue: number
    }[] = [
        {
            name: 'NEGATIVE_INFINITY uses base unit',
            value: Number.NEGATIVE_INFINITY,
            expectedFormattedValue: '-Infinity x1',
            expectedConvertedValue: Number.NEGATIVE_INFINITY
        },
        {
            name: 'POSITIVE_INFINITY uses base unit',
            value: Number.POSITIVE_INFINITY,
            expectedFormattedValue: 'Infinity x1',
            expectedConvertedValue: Number.POSITIVE_INFINITY
        },
        {
            name: 'NaN uses base unit',
            value: Number.NaN,
            expectedFormattedValue: 'NaN x1',
            expectedConvertedValue: Number.NaN
        },
        {
            name: '-0 uses base unit',
            value: -0,
            expectedFormattedValue: '0 x1',
            expectedConvertedValue: -0
        },
        {
            name: '+0 uses base unit',
            value: 0,
            expectedFormattedValue: '0 x1',
            expectedConvertedValue: 0
        },
        {
            name: 'smaller than smallest unit uses smallest unit',
            value: 0.1,
            expectedFormattedValue: '0.2 x0.5',
            expectedConvertedValue: 0.2
        },
        {
            name: 'exactly smallest unit uses smallest unit',
            value: 0.5,
            expectedFormattedValue: '1 x0.5',
            expectedConvertedValue: 1
        },
        {
            name: '0.75 uses 0.5 unit',
            value: 0.75,
            expectedFormattedValue: '1.5 x0.5',
            expectedConvertedValue: 1.5
        },
        {
            name: '3.5 uses 1 unit',
            value: 3.5,
            expectedFormattedValue: '3.5 x1',
            expectedConvertedValue: 3.5
        },
        {
            name: '7.5 uses 5 unit',
            value: 7.5,
            expectedFormattedValue: '1.5 x5',
            expectedConvertedValue: 1.5
        },
        {
            name: 'bigger than biggest unit uses biggest unit',
            value: 20,
            expectedFormattedValue: '2 x10',
            expectedConvertedValue: 2
        },
        {
            name: 'negative values pick unit by magnitude',
            value: -20,
            expectedFormattedValue: '-2 x10',
            expectedConvertedValue: -2
        }
    ] as const;

    class TestUnitScaleFormatter extends UnitScaleFormatter {
        private readonly units = [0.5, 1, 5, 10].map(conversionFactor => {
            return {
                conversionFactor,
                format: (value: number): string => {
                    return `${value} x${conversionFactor}`;
                }
            };
        });

        protected override getSupportedUnits(): ScaledUnit[] {
            return this.units;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`${name} (formatValue)`, () => {
            const formatter = new TestUnitScaleFormatter('', {});
            const formattedValue = formatter.formatValue(value.value);
            expect(formattedValue).toEqual(value.expectedFormattedValue);
        });
    });

    // eslint-disable-next-line @typescript-eslint/no-loop-func
    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(`${name} (getValueForBestUnit)`, () => {
            const formatter = new TestUnitScaleFormatter('', {});
            const formattedValue = formatter.getValueForBestUnit(value.value);
            expect(formattedValue).toEqual(value.expectedConvertedValue);
        });
    });
});
