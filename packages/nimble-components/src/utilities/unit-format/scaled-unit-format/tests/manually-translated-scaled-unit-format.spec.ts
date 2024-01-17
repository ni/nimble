import { parameterizeNamedList } from '../../../tests/parameterized';
import { ManuallyTranslatedScaledUnitFormat, UnitTranslation } from '../manually-translated-scaled-unit-format';

describe('ManuallyTranslatedScaledUnitFormat', () => {
    const unitTranslations = new Map<string, UnitTranslation>([
        ['en', new UnitTranslation('en-singular', 'en-plural', 'en-abbrev')],
        ['fr', new UnitTranslation('fr-singular', 'fr-plural', 'fr-abbrev')],
        [
            'fr-CA',
            new UnitTranslation(
                'fr-CA-singular',
                'fr-CA-plural',
                'fr-CA-abbrev'
            )
        ]
    ]);

    const translationTestCases = [
        {
            name: 'picks translations for given language even when region does not match',
            locale: 'fr-FR',
            appendedUnit: 'fr-plural'
        },
        {
            name: 'picks translations for given language and region when both match',
            locale: 'fr-CA',
            appendedUnit: 'fr-CA-plural'
        },
        {
            name: 'picks translations for given language and region even with other subtags and lowercase region',
            locale: 'fr-Latn-ca-u-hc-h12',
            appendedUnit: 'fr-CA-plural'
        },
        {
            name: 'picks translations for given language when no region given',
            locale: 'fr',
            appendedUnit: 'fr-plural'
        },
        {
            name: 'picks English translations for non-supported language',
            locale: 'ru',
            appendedUnit: 'en-plural'
        }
    ] as const;

    const scaledPrefixText = '';

    parameterizeNamedList(translationTestCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = ManuallyTranslatedScaledUnitFormat.createFactory({
                unitTranslations,
                scaledPrefixText
            })({
                locale: value.locale
            });
            expect(formatter.format(5)).toEqual(`5 ${value.appendedUnit}`);
        });
    });

    it('uses unit prefix and symbol whenever unit prefix is provided', () => {
        const formatter = ManuallyTranslatedScaledUnitFormat.createFactory({
            unitTranslations,
            scaledPrefixText: '1.'
        })({
            locale: 'en'
        });
        expect(formatter.format(5)).toEqual('5 1.en-abbrev');
    });

    it('uses given formatter options', () => {
        const formatter = ManuallyTranslatedScaledUnitFormat.createFactory({
            unitTranslations,
            scaledPrefixText
        })({
            locale: 'en',
            intlNumberFormatOptions: { minimumFractionDigits: 5 }
        });
        expect(formatter.format(5)).toEqual('5.00000 en-plural');
    });

    it('throws with incorrect unit translations', () => {
        const unitTranslationsMissingEn = new Map<string, UnitTranslation>([
            ['foo', new UnitTranslation('byte', 'bytes', 'B')]
        ]);
        expect(() => ManuallyTranslatedScaledUnitFormat.createFactory({
            unitTranslations: unitTranslationsMissingEn,
            scaledPrefixText
        })).toThrowError(
            /English translations/
        );
    });

    const pluralizationTestCases = [
        {
            name: '0 in French',
            locale: 'fr',
            toFormat: 0,
            expected: '0 fr-singular'
        },
        {
            name: '0.1 in French',
            locale: 'fr',
            toFormat: 0.1,
            expected: '0,1 fr-singular'
        },
        {
            name: '1 in French',
            locale: 'fr',
            toFormat: 1,
            expected: '1 fr-singular'
        },
        {
            name: '1.9 in French',
            locale: 'fr',
            toFormat: 1.9,
            expected: '1,9 fr-singular'
        },
        {
            name: '2 in French',
            locale: 'fr',
            toFormat: 2,
            expected: '2 fr-plural'
        },
        {
            name: '1000 in French',
            locale: 'fr',
            toFormat: 1000,
            expected: '1\u202f000 fr-plural'
        },
        {
            name: '0 in English',
            locale: 'en',
            toFormat: 0,
            expected: '0 en-plural'
        },
        {
            name: '0.1 in English',
            locale: 'en',
            toFormat: 0.1,
            expected: '0.1 en-plural'
        },
        {
            name: '1 in English',
            locale: 'en',
            toFormat: 1,
            expected: '1 en-singular'
        },
        {
            name: '1.9 in English',
            locale: 'en',
            toFormat: 1.9,
            expected: '1.9 en-plural'
        },
        {
            name: '2 in English',
            locale: 'en',
            toFormat: 2,
            expected: '2 en-plural'
        },
        {
            name: '1000 in English',
            locale: 'en',
            toFormat: 1000,
            expected: '1,000 en-plural'
        }
    ] as const;

    parameterizeNamedList(pluralizationTestCases, (spec, name, value) => {
        spec(`uses expected pluralization for ${name}`, () => {
            const formatter = ManuallyTranslatedScaledUnitFormat.createFactory({
                unitTranslations,
                scaledPrefixText
            })({
                locale: value.locale
            });
            expect(formatter.format(value.toFormat)).toEqual(value.expected);
        });
    });
});
