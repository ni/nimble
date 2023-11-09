import { ManuallyTranslatedUnitScaleFormatter } from '../manually-translated-unit-scale-formatter';
import { UnitPrefix } from '../unit-prefix';
import { UnitTranslation } from '../unit-translation';

class TestManuallyTranslatedUnitScaleFormatter extends ManuallyTranslatedUnitScaleFormatter {
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
        translations.set(
            'fr-CA',
            new UnitTranslation(
                'fr-CA-singular',
                'fr-CA-plural',
                'fr-CA-abbrev'
            )
        );
        return translations;
    }

    protected override getSupportedPrefixes(): UnitPrefix[] {
        return [new UnitPrefix(5, '5.'), new UnitPrefix(10, '10.')];
    }
}

describe('ManuallyTranslatedUnitScaleFormatter', () => {
    it('formats for given language even when region does not match', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'fr-FR',
            {}
        );
        expect(formatter.formatValue(0).string).toEqual('0 fr-singular');
        expect(formatter.formatValue(1).string).toEqual('1 fr-singular');
        expect(formatter.formatValue(2).string).toEqual('2 fr-plural');
        expect(formatter.formatValue(5).string).toEqual('1 5.fr-abbrev');
        expect(formatter.formatValue(10).string).toEqual('1 10.fr-abbrev');
    });

    it('formats for given language and region when both match', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'fr-CA',
            {}
        );
        expect(formatter.formatValue(0).string).toEqual('0 fr-CA-singular');
    });

    it('formats for given language and region even with other subtags and lowercase region', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'fr-Latn-ca-u-hc-h12',
            {}
        );
        expect(formatter.formatValue(0).string).toEqual('0 fr-CA-singular');
    });

    it('formats for given language when no region given', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'fr',
            {}
        );
        expect(formatter.formatValue(0).string).toEqual('0 fr-singular');
    });

    it('formats with English units for non-supported language', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'ru',
            {}
        );
        expect(formatter.formatValue(0).string).toEqual('0 en-plural');
        expect(formatter.formatValue(1).string).toEqual('1 en-singular');
        expect(formatter.formatValue(2).string).toEqual('2 en-plural');
        expect(formatter.formatValue(5).string).toEqual('1 5.en-abbrev');
        expect(formatter.formatValue(10).string).toEqual('1 10.en-abbrev');
    });

    it('uses provided formatter options', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'en-UK',
            {
                minimumIntegerDigits: 3
            }
        );
        expect(formatter.formatValue(1).string).toEqual('001 en-singular');
    });
});
