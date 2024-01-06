import { parameterizeNamedList } from '../../../../tests/parameterized';
import { ManuallyTranslatedScaledUnitFormat } from '../manually-translated-scaled-unit-format';
import { UnitPrefix } from '../unit-prefix';
import { UnitTranslation } from '../unit-translation';

describe('ManuallyTranslatedUnitFormatter', () => {
    const translations = new Map<string, UnitTranslation>([
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

    const baseUnitPrefix = new UnitPrefix(1, '');

    parameterizeNamedList(translationTestCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new ManuallyTranslatedScaledUnitFormat(
                value.locale,
                {},
                translations,
                baseUnitPrefix
            );
            expect(formatter.format(5)).toEqual(`5 ${value.appendedUnit}`);
        });
    });

    it('uses unit prefix and symbol whenever unit prefix is provided', () => {
        const formatter = new ManuallyTranslatedScaledUnitFormat(
            'en',
            {},
            translations,
            new UnitPrefix(2, '1.')
        );
        expect(formatter.format(5)).toEqual('5 1.en-abbrev');
    });

    it('uses given formatter options', () => {
        const formatter = new ManuallyTranslatedScaledUnitFormat(
            'en',
            { minimumFractionDigits: 5 },
            translations,
            baseUnitPrefix
        );
        expect(formatter.format(5)).toEqual('5.00000 en-plural');
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
            const formatter = new ManuallyTranslatedScaledUnitFormat(
                value.locale,
                {},
                translations,
                baseUnitPrefix
            );
            expect(formatter.format(value.toFormat)).toEqual(value.expected);
        });
    });
});
