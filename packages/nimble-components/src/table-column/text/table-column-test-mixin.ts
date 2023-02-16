import type { FractionalWidthColumn } from '../extensions/fractional-width-column';
import { TableColumnTextBase } from './table-column-text-base';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextMixin extends FractionalWidthColumn {}
// eslint-disable-next-line jsdoc/require-jsdoc
export class TableColumnTextMixin extends TableColumnTextBase {}
