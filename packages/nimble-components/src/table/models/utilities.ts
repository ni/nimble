import type { TableColumn } from '../../table-column/base';

export function uniquifySlotNameForColumnId(uniqueColumnId: string, slotName: string): string {
    return `${uniqueColumnId}-${slotName}`;
}

export function uniquifySlotNameForColumn(column: TableColumn, slotName: string): string {
    return uniquifySlotNameForColumnId(column.columnInternals.uniqueId, slotName);
}