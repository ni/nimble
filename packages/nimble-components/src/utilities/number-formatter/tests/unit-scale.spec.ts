import { parameterizeNamedList } from '../../tests/parameterized';
import { UnitScale } from '../unit-scale/unit-scale';

describe('UnitScale', () => {
    const milliScaledUnit = {
        scaleFactor: 10 ** -3,
        unitFormatterFactory: () => {
            return { format: () => '' };
        }
    } as const;
    const baseScaledUnit = {
        scaleFactor: 10 ** 0,
        unitFormatterFactory: () => {
            return { format: () => '' };
        }
    } as const;
    const kiloScaledUnit = {
        scaleFactor: 10 ** 3,
        unitFormatterFactory: () => {
            return { format: () => '' };
        }
    } as const;
    const megaScaledUnit = {
        scaleFactor: 10 ** 6,
        unitFormatterFactory: () => {
            return { format: () => '' };
        }
    } as const;
    const testCases = [
        {
            name: 'NEGATIVE_INFINITY uses base unit',
            value: Number.NEGATIVE_INFINITY,
            expectedUnit: baseScaledUnit
        },
        {
            name: 'POSITIVE_INFINITY uses base unit',
            value: Number.POSITIVE_INFINITY,
            expectedUnit: baseScaledUnit
        },
        {
            name: 'NaN uses base unit',
            value: Number.NaN,
            expectedUnit: baseScaledUnit
        },
        {
            name: '-0 uses base unit',
            value: -0,
            expectedUnit: baseScaledUnit
        },
        {
            name: '+0 uses base unit',
            value: 0,
            expectedUnit: baseScaledUnit
        },
        {
            name: 'smaller than smallest unit uses smallest unit to pick milli unit',
            value: 0.0001,
            expectedUnit: milliScaledUnit
        },
        {
            name: 'exactly smallest unit uses smallest unit to pick milli unit',
            value: 0.001,
            expectedUnit: milliScaledUnit
        },
        {
            name: '100 uses base unit',
            value: 100,
            expectedUnit: baseScaledUnit
        },
        {
            name: '500000 uses kilo unit',
            value: 500000,
            expectedUnit: kiloScaledUnit
        },
        {
            name: '1000000 uses mega unit',
            value: 1000000,
            expectedUnit: megaScaledUnit
        },
        {
            name: '5000000 uses mega unit',
            value: 5000000,
            expectedUnit: megaScaledUnit
        },
        {
            name: 'negative values uses magnitude to pick kilo unit',
            value: -20000,
            expectedUnit: kiloScaledUnit
        }
    ] as const;

    class TestUnitScale extends UnitScale {
        public constructor() {
            super([
                milliScaledUnit,
                baseScaledUnit,
                kiloScaledUnit,
                megaScaledUnit
            ]);
        }
    }

    parameterizeNamedList(testCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new TestUnitScale();
            const { scaledValue, scaledUnit } = formatter.scaleNumber(
                value.value
            );
            expect(scaledUnit).toEqual(value.expectedUnit);
            expect(scaledValue).toEqual(
                value.value / value.expectedUnit.scaleFactor
            );
        });
    });

    it('can return the base scaled unit', () => {
        expect(new TestUnitScale().baseScaledUnit).toBe(baseScaledUnit);
    });
});
