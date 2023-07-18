import type { TableRecord, ValidityObject } from '../../table/types';

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
}

export interface TableColumnWithPlaceholderColumnConfig {
    placeholder: string;
}

/**
 * The event details for the 'delegated-event' CustomEvent
 */
export interface DelegatedEventEventDetails {
    originalEvent: Event;
    recordId: string;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnValidity extends ValidityObject {}

const groupIconSize = 16;
const sortIconSize = 16;
const spacing = 8;
const menuDropdownSize = 24;
const oneCharPlusEllipsisSize = 21;
export const defaultMinPixelWidth = spacing
    + oneCharPlusEllipsisSize
    + spacing
    + sortIconSize
    + spacing
    + groupIconSize
    + spacing
    + menuDropdownSize
    + spacing;

export const defaultFractionalWidth = 1;
