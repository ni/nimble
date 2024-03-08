import type { TableRecord } from '../../table/types';
import type { ValidityObject } from '../../utilities/models/validator';

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
    cellRecord?: TCellRecord;
    columnConfig?: TColumnConfig;
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

export const columnIconSize = 16; // `iconSize` token
export const columnSpacing = 8; // `mediumPadding` token
const menuDropdownSize = 24; // `controlSlimHeight` token
const oneCharPlusEllipsisSize = 21;
export const defaultMinPixelWidth = columnSpacing
    + oneCharPlusEllipsisSize
    + columnSpacing
    + columnIconSize // sort icon
    + columnSpacing
    + columnIconSize // group icon
    + columnSpacing
    + menuDropdownSize
    + columnSpacing;

export const defaultFractionalWidth = 1;
