/* eslint-disable max-classes-per-file */
import { ManuallyTranslatedUnitScale } from '../manually-translated-unit-scale';
import { UnitPrefix } from '../unit-prefix';
import { UnitTranslation } from '../unit-translation';

describe('ManuallyTranslatedUnitScale', () => {
    class TestManuallyTranslatedUnitScale extends ManuallyTranslatedUnitScale {
        public constructor() {
            super(
                new Map([['en', new UnitTranslation('byte', 'bytes', 'B')]]),
                [
                    new UnitPrefix(1, ''),
                    new UnitPrefix(1000, 'k'),
                    new UnitPrefix(1000000, 'M')
                ]
            );
        }
    }

    it('automatically includes base unit', () => {
        const unitScale = new TestManuallyTranslatedUnitScale();

        expect(unitScale.baseScaledUnit).toBeDefined();
    });

    it('creates expected units from prefixes', () => {
        const unitScale = new TestManuallyTranslatedUnitScale();
        const units = unitScale.supportedScaledUnits;

        expect(units.length).toBe(3);
        expect(units[0]!.scaleFactor).toBe(1);
        expect(
            units[0]!
                .unitFormatterFactory('en', { minimumFractionDigits: 1 })
                .format(1)
        ).toEqual('1.0 byte');
        expect(units[1]!.scaleFactor).toBe(1000);
        expect(
            units[1]!
                .unitFormatterFactory('en', { minimumFractionDigits: 1 })
                .format(1)
        ).toEqual('1.0 kB');
        expect(units[2]!.scaleFactor).toBe(1000000);
        expect(
            units[2]!
                .unitFormatterFactory('en', { minimumFractionDigits: 1 })
                .format(1)
        ).toEqual('1.0 MB');
    });

    it('throws error if English translations not provided', () => {
        class BadManuallyTranslatedUnitScale extends ManuallyTranslatedUnitScale {
            public constructor() {
                super(
                    new Map([
                        ['foo', new UnitTranslation('byte', 'bytes', 'B')]
                    ]),
                    []
                );
            }
        }

        expect(() => new BadManuallyTranslatedUnitScale()).toThrowError(
            /English translations/
        );
    });
});
