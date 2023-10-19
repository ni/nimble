import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ManuallyTranslatedUnitFamily } from '../manually-translated-unit-family';
import type { Unit } from '../unit-family';
import { UnitPrefix } from '../unit-prefix';
import { UnitTranslation } from '../unit-translation';

class TestManuallyTranslatedUnitFamily extends ManuallyTranslatedUnitFamily {
    protected override getUnitTranslations(): Map<string, UnitTranslation> {
        const translations = new Map<string, UnitTranslation>();
        translations.set(
            'en',
            new UnitTranslation('en-singular', 'en-plural', 'en-abbrev')
        );
        translations.set(
            'fr',
            new UnitTranslation('fr-singular', 'fr-plural', 'fr-abbrev')
        );
        return translations;
    }

    protected override getSupportedPrefixes(): UnitPrefix[] {
        return [new UnitPrefix(5, '5.'), new UnitPrefix(10, '10.')];
    }
}
const composedTestElement = TestManuallyTranslatedUnitFamily.compose({
    baseName: 'test-manually-translated-unit-family'
});

describe('ManuallyTranslatedUnitFamily', () => {
    let element: TestManuallyTranslatedUnitFamily;

    async function setup(): Promise<Fixture<TestManuallyTranslatedUnitFamily>> {
        return fixture(composedTestElement());
    }

    beforeEach(async () => {
        ({ element } = await setup());
    });

    const compareConversionFactor = (a: Unit, b: Unit): number => {
        return a.conversionFactor < b.conversionFactor ? -1 : 1;
    };

    it('returns expected units for (non-English) language', () => {
        const units = element
            .getSupportedUnits('fr-FR', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(3);
        expect(units[0]?.conversionFactor).toEqual(1);
        expect(units[0]?.format(10)).toEqual('10 fr-plural');
        expect(units[1]?.conversionFactor).toEqual(5);
        expect(units[1]?.format(10)).toEqual('10 5.fr-abbrev');
        expect(units[2]?.conversionFactor).toEqual(10);
        expect(units[2]?.format(10)).toEqual('10 10.fr-abbrev');
    });

    it('returns English units for non-supported language', () => {
        const units = element
            .getSupportedUnits('ru', {})
            .sort(compareConversionFactor);
        expect(units.length).toEqual(3);
        expect(units[0]?.conversionFactor).toEqual(1);
        expect(units[0]?.format(10)).toEqual('10 en-plural');
        expect(units[1]?.conversionFactor).toEqual(5);
        expect(units[1]?.format(10)).toEqual('10 5.en-abbrev');
        expect(units[2]?.conversionFactor).toEqual(10);
        expect(units[2]?.format(10)).toEqual('10 10.en-abbrev');
    });

    it('returns base unit that uses singular unit label for 0 in French', () => {
        const units = element
            .getSupportedUnits('fr-CA', {})
            .sort(compareConversionFactor);
        expect(units[0]?.format(0)).toEqual('0 fr-singular');
    });

    it('returns base unit that uses plural unit label for 0 in English', () => {
        const units = element
            .getSupportedUnits('en-US', {})
            .sort(compareConversionFactor);
        expect(units[0]?.format(0)).toEqual('0 en-plural');
    });

    it('returns base unit that uses singular unit label for 1 in English', () => {
        const units = element
            .getSupportedUnits('en-US', {})
            .sort(compareConversionFactor);
        expect(units[0]?.format(1)).toEqual('1 en-singular');
    });

    it('uses provided formatter options', () => {
        const units = element
            .getSupportedUnits('en-UK', {
                minimumIntegerDigits: 3
            })
            .sort(compareConversionFactor);
        expect(units[0]?.format(10)).toEqual('010 en-plural');
        expect(units[1]?.format(10)).toEqual('010 5.en-abbrev');
        expect(units[2]?.format(10)).toEqual('010 10.en-abbrev');
    });
});
