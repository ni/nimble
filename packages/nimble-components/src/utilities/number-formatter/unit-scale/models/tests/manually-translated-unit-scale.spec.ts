/* eslint-disable max-classes-per-file */
import { ManuallyTranslatedUnitScale } from '../manually-translated-unit-scale';
import { UnitPrefix } from '../unit-prefix';
import { UnitTranslation } from '../unit-translation';

describe('ManuallyTranslatedUnitScale', () => {
    class TestManuallyTranslatedUnitScale extends ManuallyTranslatedUnitScale {
        protected override getUnitTranslations(): Map<string, UnitTranslation> {
            return new Map<string, UnitTranslation>([
                ['en', new UnitTranslation('byte', 'bytes', 'B')]
            ]);
        }

        protected override getSupportedPrefixes(): UnitPrefix[] {
            return [new UnitPrefix(1000, 'k'), new UnitPrefix(1000000, 'M')];
        }
    }

    const unitScale = new TestManuallyTranslatedUnitScale();

    it('automatically includes base unit', () => {
        expect(unitScale.baseScaledUnit).toBeDefined();
    });

    it('creates expected units from prefixes', () => {
        const units = unitScale.supportedScaledUnits.sort((a, b) => (a.scaleFactor < b.scaleFactor ? -1 : 1));
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

    class BadManuallyTranslatedUnitScale extends ManuallyTranslatedUnitScale {
        protected override getUnitTranslations(): Map<string, UnitTranslation> {
            return new Map<string, UnitTranslation>([
                ['foo', new UnitTranslation('byte', 'bytes', 'B')]
            ]);
        }

        protected override getSupportedPrefixes(): UnitPrefix[] {
            return [];
        }
    }

    it('throws error if English translations not provided', () => {
        expect(() => new BadManuallyTranslatedUnitScale()).toThrowError();
    });
});
