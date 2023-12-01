// import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
// import { ManuallyTranslatedScaledUnit } from '../manually-translated-scaled-unit';
// import { UnitTranslation } from '../unit-translation';

// describe('ManuallyTranslatedScaledUnit', () => {
//     it('has empty formatterOptions', () => {
//         const unit = new ManuallyTranslatedScaledUnit(
//             1,
//             new Map<string, UnitTranslation>()
//         );
//         expect(unit.formatterOptions).toEqual({});
//     });

//     it('has correct scaleFactor', () => {
//         const unit = new ManuallyTranslatedScaledUnit(
//             123,
//             new Map<string, UnitTranslation>()
//         );
//         expect(unit.scaleFactor).toEqual(123);
//     });

//     describe('appendUnitIfNeeded', () => {
//         const translations = new Map<string, UnitTranslation>([
//             [
//                 'en',
//                 new UnitTranslation('en-singular', 'en-plural', 'en-abbrev')
//             ],
//             [
//                 'fr',
//                 new UnitTranslation('fr-singular', 'fr-plural', 'fr-abbrev')
//             ],
//             [
//                 'fr-CA',
//                 new UnitTranslation(
//                     'fr-CA-singular',
//                     'fr-CA-plural',
//                     'fr-CA-abbrev'
//                 )
//             ]
//         ]);

//         const translationTestCases = [
//             {
//                 name: 'picks translations for given language even when region does not match',
//                 locale: 'fr-FR',
//                 appended: 'fr-plural'
//             },
//             {
//                 name: 'picks translations for given language and region when both match',
//                 locale: 'fr-CA',
//                 appended: 'fr-CA-plural'
//             },
//             {
//                 name: 'picks translations for given language and region even with other subtags and lowercase region',
//                 locale: 'fr-Latn-ca-u-hc-h12',
//                 appended: 'fr-CA-plural'
//             },
//             {
//                 name: 'picks translations for given language when no region given',
//                 locale: 'fr',
//                 appended: 'fr-plural'
//             },
//             {
//                 name: 'picks English translations for non-supported language',
//                 locale: 'ru',
//                 appended: 'en-plural'
//             }
//         ] as const;

//         parameterizeNamedList(translationTestCases, (spec, name, value) => {
//             spec(name, () => {
//                 const unit = new ManuallyTranslatedScaledUnit(1, translations);
//                 expect(
//                     unit.appendUnitIfNeeded(
//                         '5',
//                         5,
//                         value.locale,
//                         new Intl.PluralRules(value.locale)
//                     )
//                 ).toEqual(`5 ${value.appended}`);
//             });
//         });

//         it('uses unit prefix and symbol whenever unit prefix is provided', () => {
//             const unit = new ManuallyTranslatedScaledUnit(
//                 1,
//                 translations,
//                 '1.'
//             );
//             expect(
//                 unit.appendUnitIfNeeded(
//                     '5',
//                     5,
//                     'en',
//                     new Intl.PluralRules('en')
//                 )
//             ).toEqual('5 1.en-abbrev');
//         });

//         const pluralizationTestCases = [
//             {
//                 name: 'French',
//                 locale: 'fr',
//                 formattedString: '0',
//                 formattedNumber: 0,
//                 appended: 'fr-singular'
//             },
//             {
//                 name: 'French',
//                 locale: 'fr',
//                 formattedString: '0,1',
//                 formattedNumber: 0.1,
//                 appended: 'fr-singular'
//             },
//             {
//                 name: 'French',
//                 locale: 'fr',
//                 formattedString: '1',
//                 formattedNumber: 1,
//                 appended: 'fr-singular'
//             },
//             {
//                 name: 'French',
//                 locale: 'fr',
//                 formattedString: '1,9',
//                 formattedNumber: 1.9,
//                 appended: 'fr-singular'
//             },
//             {
//                 name: 'French',
//                 locale: 'fr',
//                 formattedString: '2',
//                 formattedNumber: 2,
//                 appended: 'fr-plural'
//             },
//             {
//                 name: 'French',
//                 locale: 'fr',
//                 formattedString: '1.000',
//                 formattedNumber: 1000,
//                 appended: 'fr-plural'
//             },
//             {
//                 name: 'English',
//                 locale: 'en',
//                 formattedString: '0',
//                 formattedNumber: 0,
//                 appended: 'en-plural'
//             },
//             {
//                 name: 'English',
//                 locale: 'en',
//                 formattedString: '0.1',
//                 formattedNumber: 0.1,
//                 appended: 'en-plural'
//             },
//             {
//                 name: 'English',
//                 locale: 'en',
//                 formattedString: '1',
//                 formattedNumber: 1,
//                 appended: 'en-singular'
//             },
//             {
//                 name: 'English',
//                 locale: 'en',
//                 formattedString: '1,9',
//                 formattedNumber: 1.9,
//                 appended: 'en-plural'
//             },
//             {
//                 name: 'English',
//                 locale: 'en',
//                 formattedString: '2',
//                 formattedNumber: 2,
//                 appended: 'en-plural'
//             },
//             {
//                 name: 'English',
//                 locale: 'en',
//                 formattedString: '1,000',
//                 formattedNumber: 1000,
//                 appended: 'en-plural'
//             }
//         ] as const;

//         parameterizeNamedList(pluralizationTestCases, (spec, name, value) => {
//             spec(
//                 `uses expected pluralization for ${value.formattedString} in ${name}`,
//                 () => {
//                     const unit = new ManuallyTranslatedScaledUnit(
//                         1,
//                         translations
//                     );
//                     expect(
//                         unit.appendUnitIfNeeded(
//                             value.formattedString,
//                             value.formattedNumber,
//                             value.locale,
//                             new Intl.PluralRules(value.locale)
//                         )
//                     ).toEqual(`${value.formattedString} ${value.appended}`);
//                 }
//             );
//         });
//     });
// });
