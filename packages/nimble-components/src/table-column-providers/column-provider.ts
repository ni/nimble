import type { ViewTemplate } from '@microsoft/fast-element';
import type { TableCell } from '../table-cell';

export interface IColumnProvider {
    getColumnTemplate: () => ViewTemplate<unknown, TableCell>;
    columnId?: string;
    columnTitle?: string;
}