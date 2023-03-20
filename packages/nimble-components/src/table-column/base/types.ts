import type { TableRecord } from '../../table/types';

/**
 * An object whose fields are defined by a particular TableColumn, which is used by the column's
 * cellTemplate implementation.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableCellRecord extends TableRecord {}

export interface TableCellState<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
> {
    cellRecord: TCellRecord;
    columnConfig: TColumnConfig;
    cellOffset: number;
}

/**
 * The possible operations to use when sorting a table column.
 */
export const TableColumnSortOperation = {
    /**
     * Performs a sort using `===`, `<`, and `>` operators
     */
    basic: 'basic',
    /**
     * Performs a locale-aware case-sensitive string sort on the columns.
     * Only use this sort operation if the field is of type `string | undefined | null`.
     */
    localeAwareCaseSensitive: 'localeAwareCaseSensitive'
} as const;
export type TableColumnSortOperation =
    (typeof TableColumnSortOperation)[keyof typeof TableColumnSortOperation];

export const defaultMinPixelWidth = 88;

export const defaultFractionalWidth = 1;
