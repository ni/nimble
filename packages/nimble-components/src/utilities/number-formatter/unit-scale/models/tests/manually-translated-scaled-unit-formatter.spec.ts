import { parameterizeNamedList } from '../../../../tests/parameterized';
import { ManuallyTranslatedScaledUnitFormatter } from '../manually-translated-scaled-unit-formatter';
import { UnitTranslation } from '../unit-translation';

describe('ManuallyTranslatedScaledUnitFormatter', () => {
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

    parameterizeNamedList(translationTestCases, (spec, name, value) => {
        spec(name, () => {
            const formatter = new ManuallyTranslatedScaledUnitFormatter(
                value.locale,
                {},
                translations
            );
            expect(formatter.format(5)).toEqual(`5 ${value.appendedUnit}`);
        });
    });

    it('uses unit prefix and symbol whenever unit prefix is provided', () => {
        const formatter = new ManuallyTranslatedScaledUnitFormatter(
            'en',
            {},
            translations,
            '1.'
        );
        expect(formatter.format(5)).toEqual('5 1.en-abbrev');
    });

    it('uses given formatter options', () => {
        const formatter = new ManuallyTranslatedScaledUnitFormatter(
            'en',
            { minimumFractionDigits: 5 },
            translations
        );
        expect(formatter.format(5)).toEqual('5.00000 en-plural');
    });

    const pluralizationTestCases = [
        {
            name: 'French',
            locale: 'fr',
            formattedNumber: '0',
            toFormat: 0,
            appendedUnit: 'fr-singular'
        },
        {
            name: 'French',
            locale: 'fr',
            formattedNumber: '0,1',
            toFormat: 0.1,
            appendedUnit: 'fr-singular'
        },
        {
            name: 'French',
            locale: 'fr',
            formattedNumber: '1',
            toFormat: 1,
            appendedUnit: 'fr-singular'
        },
        {
            name: 'French',
            locale: 'fr',
            formattedNumber: '1,9',
            toFormat: 1.9,
            appendedUnit: 'fr-singular'
        },
        {
            name: 'French',
            locale: 'fr',
            formattedNumber: '2',
            toFormat: 2,
            appendedUnit: 'fr-plural'
        },
        {
            name: 'French',
            locale: 'fr',
            formattedNumber: '1\u202f000',
            toFormat: 1000,
            appendedUnit: 'fr-plural'
        },
        {
            name: 'English',
            locale: 'en',
            formattedNumber: '0',
            toFormat: 0,
            appendedUnit: 'en-plural'
        },
        {
            name: 'English',
            locale: 'en',
            formattedNumber: '0.1',
            toFormat: 0.1,
            appendedUnit: 'en-plural'
        },
        {
            name: 'English',
            locale: 'en',
            formattedNumber: '1',
            toFormat: 1,
            appendedUnit: 'en-singular'
        },
        {
            name: 'English',
            locale: 'en',
            formattedNumber: '1,9',
            toFormat: 1.9,
            appendedUnit: 'en-plural'
        },
        {
            name: 'English',
            locale: 'en',
            formattedNumber: '2',
            toFormat: 2,
            appendedUnit: 'en-plural'
        },
        {
            name: 'English',
            locale: 'en',
            formattedNumber: '1,000',
            toFormat: 1000,
            appendedUnit: 'en-plural'
        }
    ] as const;

    parameterizeNamedList(pluralizationTestCases, (spec, name, value) => {
        spec(
            `uses expected pluralization for ${value.formattedNumber} in ${name}`,
            () => {
                const formatter = new ManuallyTranslatedScaledUnitFormatter(
                    value.locale,
                    {},
                    translations
                );
                expect(formatter.format(value.toFormat)).toEqual(
                    `${value.formattedNumber} ${value.appendedUnit}`
                );
            }
        );
    });
});
