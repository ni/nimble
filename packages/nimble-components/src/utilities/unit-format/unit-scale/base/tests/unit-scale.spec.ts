/* eslint-disable max-classes-per-file */
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { ScaledUnit } from '../scaled-unit';
import { UnitScale } from '../unit-scale';
import type { ScaledUnitFormat } from '../scaled-unit-format';

describe('UnitScale', () => {
    const noopScaledUnitFormatFactory = (): ScaledUnitFormat => {
        throw Error('Formatter factory not used for scale lookup tests');
    };

    const milliScaledUnit = new ScaledUnit(
        10 ** -3,
        noopScaledUnitFormatFactory
    );
    const baseScaledUnit = new ScaledUnit(10 ** 0, noopScaledUnitFormatFactory);
    const kiloScaledUnit = new ScaledUnit(10 ** 3, noopScaledUnitFormatFactory);
    const megaScaledUnit = new ScaledUnit(10 ** 6, noopScaledUnitFormatFactory);

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

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(name, () => {
            const unitScale = new TestUnitScale();
            const { scaledValue, scaledUnit } = unitScale.scaleNumber(
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

    describe('with incorrect ScaledUnits', () => {
        it('out of order', () => {
            class TestOutOfOrderUnitScale extends UnitScale {
                public constructor() {
                    super([baseScaledUnit, milliScaledUnit]);
                }
            }
            expect(() => new TestOutOfOrderUnitScale()).toThrowError(
                /must have unique and ordered scale factors/
            );
        });

        it('duplicated', () => {
            class TestDuplicateUnitScale extends UnitScale {
                public constructor() {
                    super([milliScaledUnit, milliScaledUnit, baseScaledUnit]);
                }
            }
            expect(() => new TestDuplicateUnitScale()).toThrowError(
                /must have unique and ordered scale factors/
            );
        });

        it('missing base unit', () => {
            class TestNoBaseUnitScale extends UnitScale {
                public constructor() {
                    super([milliScaledUnit, kiloScaledUnit, megaScaledUnit]);
                }
            }
            expect(() => new TestNoBaseUnitScale()).toThrowError(
                /must include a base scaled unit/
            );
        });
    });
});
