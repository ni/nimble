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

    it('automatically includes base unit', () => {
        const unitScale = new TestManuallyTranslatedUnitScale();
        expect(unitScale.pickBestScaledUnit(0).scaleFactor).toEqual(1);
    });

    it('creates expected units from prefixes', () => {
        const unitScale = new TestManuallyTranslatedUnitScale();
        let unit = unitScale.pickBestScaledUnit(1000);
        expect(unit.scaleFactor).toEqual(1000);
        expect(unit.formatterOptions).toEqual({});
        const pluralRules = new Intl.PluralRules('en');
        expect(unit.appendUnitIfNeeded('1', 1, 'en', pluralRules)).toEqual(
            '1 kB'
        );
        unit = unitScale.pickBestScaledUnit(1000000);
        expect(unit.scaleFactor).toEqual(1000000);
        expect(unit.formatterOptions).toEqual({});
        expect(unit.appendUnitIfNeeded('1', 1, 'en', pluralRules)).toEqual(
            '1 MB'
        );
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
