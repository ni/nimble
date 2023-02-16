import type { FractionalWidthColum } from '../extensions/fractional-width-column';
import { TableColumnTextBase } from './table-column-text-base';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextMixin extends FractionalWidthColum {}
// eslint-disable-next-line jsdoc/require-jsdoc
export class TableColumnTextMixin extends TableColumnTextBase {}
