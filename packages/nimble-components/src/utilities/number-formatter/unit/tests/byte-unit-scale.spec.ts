// import { parameterizeNamedList } from '../../../../utilities/tests/parameterized';
// import { ByteUnitScale } from '../byte-unit-scale';

// describe('ByteUnitScale', () => {
//     const testCases = [
//         {
//             name: '0',
//             number: 0,
//             options: {
//                 style: 'unit',
//                 unit: 'byte',
//                 unitDisplay: 'long'
//             }
//         },
//         {
//             name: '1',
//             number: 1,
//             options: {
//                 style: 'unit',
//                 unit: 'byte',
//                 unitDisplay: 'long'
//             }
//         },
//         {
//             name: '2',
//             number: 2,
//             options: {
//                 style: 'unit',
//                 unit: 'byte',
//                 unitDisplay: 'long'
//             }
//         },
//         {
//             name: '10 ** 3',
//             number: 10 ** 3,
//             options: {
//                 style: 'unit',
//                 unit: 'kilobyte',
//                 unitDisplay: 'short'
//             }
//         },
//         {
//             name: '10 ** 6',
//             number: 10 ** 6,
//             options: {
//                 style: 'unit',
//                 unit: 'megabyte',
//                 unitDisplay: 'short'
//             }
//         },
//         {
//             name: '10 ** 9',
//             number: 10 ** 9,
//             options: {
//                 style: 'unit',
//                 unit: 'gigabyte',
//                 unitDisplay: 'short'
//             }
//         },
//         {
//             name: '10 ** 12',
//             number: 10 ** 12,
//             options: {
//                 style: 'unit',
//                 unit: 'terabyte',
//                 unitDisplay: 'short'
//             }
//         },
//         {
//             name: '10 ** 15',
//             number: 10 ** 15,
//             options: {
//                 style: 'unit',
//                 unit: 'petabyte',
//                 unitDisplay: 'short'
//             }
//         },
//         {
//             name: '10 ** 18',
//             number: 10 ** 18,
//             options: {
//                 style: 'unit',
//                 unit: 'petabyte',
//                 unitDisplay: 'short'
//             }
//         }
//     ] as const;

//     parameterizeNamedList(testCases, (spec, name, value) => {
//         spec(`gets expected unit for ${name}`, () => {
//             const unit = ByteUnitScale.instance.pickBestScaledUnit(
//                 value.number
//             );
//             expect(unit.formatterOptions).toEqual(value.options);
//             expect(
//                 unit.appendUnitIfNeeded(
//                     'formatted',
//                     1,
//                     'en',
//                     new Intl.PluralRules('en')
//                 )
//             ).toEqual('formatted');
//         });
//     });
// });
