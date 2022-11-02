import type { ViewTemplate } from '@microsoft/fast-element';
import type { TableCell } from '../table-cell';

export interface TableColumn {
    columnDataKey: string;
    gridColumn?: string;
    title?: string;
    headerCellTemplate?: ViewTemplate;
    headerCellInternalFocusQueue?: boolean;
    cellTemplate?: ViewTemplate<TableCell, TableCell>;
    cellInternalFocusQueue?: boolean;
    isRowHeader?: boolean;
    showMenu?: boolean;
}
