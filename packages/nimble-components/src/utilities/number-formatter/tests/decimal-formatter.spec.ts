// /* eslint-disable max-classes-per-file */
// import type { ScaledUnit } from '../scaled-unit';
// import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
// import { DecimalFormatter } from '../decimal-formatter';
// import { UnitScale } from '../unit-scale';

// describe('DecimalFormatter', () => {
//     const locales = ['en', 'de'] as const;
//     const testCases = [
//         {
//             name: 'NEGATIVE_INFINITY renders as -∞',
//             minDigits: 1,
//             maxDigits: 1,
//             value: Number.NEGATIVE_INFINITY,
//             expectedFormattedValue: {
//                 en: '-∞',
//                 de: '-∞'
//             }
//         },
//         {
//             name: 'POSITIVE_INFINITY renders as ∞',
//             minDigits: 1,
//             maxDigits: 1,
//             value: Number.POSITIVE_INFINITY,
//             expectedFormattedValue: {
//                 en: '∞',
//                 de: '∞'
//             }
//         },
//         {
//             name: 'NaN renders as NaN',
//             minDigits: 1,
//             maxDigits: 1,
//             value: Number.NaN,
//             expectedFormattedValue: {
//                 en: 'NaN',
//                 de: 'NaN'
//             }
//         },
//         {
//             name: '-0 renders without negative sign',
//             minDigits: 2,
//             maxDigits: 2,
//             value: -0,
//             expectedFormattedValue: {
//                 en: '0.00',
//                 de: '0,00'
//             }
//         },
//         {
//             name: 'does not round to -0',
//             minDigits: 2,
//             maxDigits: 2,
//             value: -0.00001,
//             expectedFormattedValue: {
//                 en: '0.00',
//                 de: '0,00'
//             }
//         },
//         {
//             name: '+0 renders without positive sign',
//             minDigits: 2,
//             maxDigits: 2,
//             value: 0,
//             expectedFormattedValue: {
//                 en: '0.00',
//                 de: '0,00'
//             }
//         },
//         {
//             name: 'limits to maxDigits decimals with rounding up',
//             minDigits: 0,
//             maxDigits: 7,
//             value: 1.23456789,
//             expectedFormattedValue: {
//                 en: '1.2345679',
//                 de: '1,2345679'
//             }
//         },
//         {
//             name: 'limits to maxDigits decimals with rounding down',
//             minDigits: 0,
//             maxDigits: 5,
//             value: 10.001122,
//             expectedFormattedValue: {
//                 en: '10.00112',
//                 de: '10,00112'
//             }
//         },
//         {
//             name: 'adds zeros to reach minDigits decimals',
//             minDigits: 3,
//             maxDigits: 5,
//             value: 16,
//             expectedFormattedValue: {
//                 en: '16.000',
//                 de: '16,000'
//             }
//         },
//         {
//             name: 'does not add zeros to reach maxDigits decimals',
//             minDigits: 3,
//             maxDigits: 5,
//             value: -0.0123,
//             expectedFormattedValue: {
//                 en: '-0.0123',
//                 de: '-0,0123'
//             }
//         },
//         {
//             name: 'uses grouping',
//             minDigits: 3,
//             maxDigits: 3,
//             value: 123456.789,
//             expectedFormattedValue: {
//                 en: '123,456.789',
//                 de: '123.456,789'
//             }
//         }
//     ] as const;

//     for (const locale of locales) {
//         parameterizeNamedList(testCases, (spec, name, value) => {
//             spec(`${name} with '${locale}' locale`, () => {
//                 const formatter = new DecimalFormatter(
//                     locale,
//                     value.minDigits,
//                     value.maxDigits
//                 );
//                 expect(formatter.formatValue(value.value)).toEqual(
//                     value.expectedFormattedValue[locale]
//                 );
//             });
//         });
//     }

//     describe('with unit', () => {
//         class TestAppendedLabelUnitScale extends UnitScale {
//             public override getSupportedScaledUnits(): ScaledUnit[] {
//                 return [0.001, 1, 2, 4].map(scaleFactor => {
//                     return {
//                         scaleFactor,
//                         formatterOptions: {},
//                         appendUnitIfNeeded: (formatted: string) => `${formatted} x${scaleFactor}`
//                     };
//                 });
//             }
//         }

//         const appendedLabelUnitTestCases = [
//             {
//                 name: 'does not double-convert the value when a unit is specified',
//                 minDigits: 2,
//                 maxDigits: 2,
//                 value: 3,
//                 expectedFormattedValue: '1.50 x2'
//             },
//             {
//                 name: 'checks for zero-rounding after scaling value',
//                 minDigits: 2,
//                 maxDigits: 2,
//                 value: 0.001,
//                 expectedFormattedValue: '1.00 x0.001'
//             }
//         ] as const;

//         parameterizeNamedList(
//             appendedLabelUnitTestCases,
//             (spec, name, value) => {
//                 spec(name, () => {
//                     const formatter = new DecimalFormatter(
//                         'en',
//                         value.minDigits,
//                         value.maxDigits,
//                         new TestAppendedLabelUnitScale()
//                     );
//                     expect(formatter.formatValue(value.value)).toEqual(
//                         value.expectedFormattedValue
//                     );
//                 });
//             }
//         );

//         class TestFormatterOptionsUnitScale extends UnitScale {
//             public override getSupportedScaledUnits(): ScaledUnit[] {
//                 return [
//                     {
//                         scaleFactor: 1,
//                         formatterOptions: {
//                             style: 'unit',
//                             unit: 'byte',
//                             unitDisplay: 'long'
//                         },
//                         appendUnitIfNeeded: (formatted: string) => formatted
//                     }
//                 ];
//             }
//         }

//         it('configures formatter with unit options', () => {
//             const formatter = new DecimalFormatter(
//                 'en',
//                 2,
//                 2,
//                 new TestFormatterOptionsUnitScale()
//             );
//             expect(formatter.formatValue(10)).toEqual('10.00 bytes');
//         });
//     });
// });
