import type { ScaledUnit } from '../scaled-unit';
import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
import { UnitScale } from '../unit-scale';

describe('UnitScale', () => {
    const millibyteScaledUnit = {
        scaleFactor: 0.001,
        formatterOptions: {},
        appendUnitIfNeeded: () => ''
    };
    const byteScaledUnit = {
        scaleFactor: 1,
        formatterOptions: {},
        appendUnitIfNeeded: () => ''
    };
    const kilobyteScaledUnit = {
        scaleFactor: 10 ** 3,
        formatterOptions: {},
        appendUnitIfNeeded: () => ''
    };
    const megabyteScaledUnit = {
        scaleFactor: 10 ** 6,
        formatterOptions: {},
        appendUnitIfNeeded: () => ''
    };
    const byteTestCases = [
        {
            name: 'NEGATIVE_INFINITY uses base unit',
            value: Number.NEGATIVE_INFINITY,
            expectedUnit: byteScaledUnit
        },
        {
            name: 'POSITIVE_INFINITY uses base unit',
            value: Number.POSITIVE_INFINITY,
            expectedUnit: byteScaledUnit
        },
        {
            name: 'NaN uses base unit',
            value: Number.NaN,
            expectedUnit: byteScaledUnit
        },
        {
            name: '-0 uses base unit',
            value: -0,
            expectedUnit: byteScaledUnit
        },
        {
            name: '+0 uses base unit',
            value: 0,
            expectedUnit: byteScaledUnit
        },
        {
            name: 'smaller than smallest unit uses smallest unit',
            value: 0.0001,
            expectedUnit: millibyteScaledUnit
        },
        {
            name: 'exactly smallest unit uses smallest unit',
            value: 0.001,
            expectedUnit: millibyteScaledUnit
        },
        {
            name: '100 uses B unit',
            value: 100,
            expectedUnit: byteScaledUnit
        },
        {
            name: '500000 uses kB unit',
            value: 500000,
            expectedUnit: kilobyteScaledUnit
        },
        {
            name: '1000000 uses MB unit',
            value: 1000000,
            expectedUnit: megabyteScaledUnit
        },
        {
            name: '5000000 uses MB unit',
            value: 5000000,
            expectedUnit: megabyteScaledUnit
        },
        {
            name: 'negative values pick unit by magnitude',
            value: -20000,
            expectedUnit: kilobyteScaledUnit
        }
    ] as const;

    class ByteUnitScale extends UnitScale {
        protected override getSupportedScaledUnits(): ScaledUnit[] {
            return [
                millibyteScaledUnit,
                byteScaledUnit,
                kilobyteScaledUnit,
                megabyteScaledUnit
            ];
        }
    }

    parameterizeNamedList(byteTestCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new ByteUnitScale();
            expect(formatter.pickBestScaledUnit(value.value)).toEqual(
                value.expectedUnit
            );
        });
    });
});
