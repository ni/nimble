// import { attr, nullableNumberConverter } from '@microsoft/fast-element';
// import type { TableColumn } from '../base';

// // Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
// type TableColumnWithPlaceholder = Pick<TableColumn>;
// // prettier-ignore
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type TableColumnWithPlaceholderConstructor = abstract new (...args: any[]) => TableColumnWithPlaceholder;

// // As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
// export function mixinColumnWithPlaceholderAPI<
//     TBase extends TableColumnWithPlaceholderConstructor
// >(base: TBase) {
//     /**
//      * The Mixin that provides a concrete column with the API to allow grouping
//      * by the values in that column.
//      */
//     abstract class ColumnWithPlaceholder extends base {
//         public placeholder?: string;
//     }
//     attr({ attribute: 'placeholder' })(
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//         ColumnWithPlaceholder.prototype,
//         'placeholder'
//     );

//     return ColumnWithPlaceholder;
// }
