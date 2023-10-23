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
        return translations;
    }

    protected override getSupportedPrefixes(): UnitPrefix[] {
        return [new UnitPrefix(5, '5.'), new UnitPrefix(10, '10.')];
    }
}

describe('ManuallyTranslatedUnitScaleFormatter', () => {
    it('formats with expected units for (non-English) language', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'fr-FR',
            {}
        );
        expect(formatter.formatValue(0)).toEqual('0 fr-singular');
        expect(formatter.formatValue(1)).toEqual('1 fr-singular');
        expect(formatter.formatValue(2)).toEqual('2 fr-plural');
        expect(formatter.formatValue(5)).toEqual('1 5.fr-abbrev');
        expect(formatter.formatValue(10)).toEqual('1 10.fr-abbrev');
    });

    it('formats with English units for non-supported language', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'ru',
            {}
        );
        expect(formatter.formatValue(0)).toEqual('0 en-plural');
        expect(formatter.formatValue(1)).toEqual('1 en-singular');
        expect(formatter.formatValue(2)).toEqual('2 en-plural');
        expect(formatter.formatValue(5)).toEqual('1 5.en-abbrev');
        expect(formatter.formatValue(10)).toEqual('1 10.en-abbrev');
    });

    it('uses provided formatter options', () => {
        const formatter = new TestManuallyTranslatedUnitScaleFormatter(
            'en-UK',
            {
                minimumIntegerDigits: 3
            }
        );
        expect(formatter.formatValue(1)).toEqual('001 en-singular');
    });
});
