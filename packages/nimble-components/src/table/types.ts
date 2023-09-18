import type { TableColumn } from '../table-column/base';
import type { ValidityObject } from '../utilities/models/validator';

/**
 * TableFieldName describes the type associated with keys within
 * a table's records.
 */
export type TableFieldName = string;

/**
 * TableFieldValue describes the type associated with values within
 * a table's records.
 */
export type TableFieldValue = string | number | boolean | null | undefined;

/**
 * TableStringFieldValue describes the type associated with values within
 * a table's string records.
 */
export type TableStringFieldValue = string | null | undefined;

/**
 * TableBooleanFieldValue describes the type associated with values within
 * a table's boolean records.
 */
export type TableBooleanFieldValue = boolean | null | undefined;

/**
 * TableNumberFieldValue describes the type associated with values within
 * a table's number records.
 */
export type TableNumberFieldValue = number | null | undefined;

/**
 * TableRecord describes the data structure that backs a single row in a table.
 * It is made up of fields, which are key/value pairs that have a key of type
 * TableFieldName and a value of type TableFieldValue.
 */
export interface TableRecord {
    [key: TableFieldName]: TableFieldValue;
}

export type TableStringField<FieldName extends TableFieldName> = {
    [name in FieldName]: TableStringFieldValue;
};

export type TableBooleanField<FieldName extends TableFieldName> = {
    [name in FieldName]: TableBooleanFieldValue;
};

export type TableNumberField<FieldName extends TableFieldName> = {
    [name in FieldName]: TableNumberFieldValue;
};

export interface TableValidity extends ValidityObject {
    readonly duplicateRecordId: boolean;
    readonly missingRecordId: boolean;
    readonly invalidRecordId: boolean;
    readonly duplicateColumnId: boolean;
    readonly missingColumnId: boolean;
    readonly duplicateSortIndex: boolean;
    readonly duplicateGroupIndex: boolean;
    readonly idFieldNameNotConfigured: boolean;
    readonly invalidColumnConfiguration: boolean;
}

export interface TableActionMenuToggleEventDetail {
    newState: boolean;
    oldState: boolean;
    recordIds: string[];
    columnId?: string;
}

/**
 * The possible directions a table column can be sorted in.
 */
export const TableColumnSortDirection = {
    none: undefined,
    ascending: 'ascending',
    descending: 'descending'
} as const;
export type TableColumnSortDirection =
    (typeof TableColumnSortDirection)[keyof typeof TableColumnSortDirection];

/**
 * The selection modes of rows in the table.
 */
export const TableRowSelectionMode = {
    none: undefined,
    single: 'single',
    multiple: 'multiple'
} as const;
export type TableRowSelectionMode =
    (typeof TableRowSelectionMode)[keyof typeof TableRowSelectionMode];

/**
 * @internal
 *
 * The possible selection states that the table or a table row can be in.
 */
export const TableRowSelectionState = {
    notSelected: 'notSelected',
    selected: 'selected',
    partiallySelected: 'partiallySelected'
} as const;
export type TableRowSelectionState =
    (typeof TableRowSelectionState)[keyof typeof TableRowSelectionState];

/**
 * @internal
 *
 * Internal event detail type for a row's selection state changing
 */
export interface TableRowSelectionToggleEventDetail {
    oldState: boolean;
    newState: boolean;
}

/**
 * Event detail type for row selection events in the table.
 */
export interface TableRowSelectionEventDetail {
    selectedRecordIds: string[];
}

/**
 * Event detail type for interactive column configuration changes.
 *
 * The column-configuration-change event is emitted when a column's configuration
 * is modified programmatically, such as by clicking on the column's header to sort
 * the column. The items in the `columns` array are specified in the same order as
 * the columns are listed in the DOM.
 */
export interface TableColumnConfigurationChangeEventDetail {
    columns: TableColumnConfiguration[];
}

/**
 * A representation of the current configuration of a column within the table.
 */
export interface TableColumnConfiguration {
    columnId?: string;
    sortIndex?: number;
    sortDirection: TableColumnSortDirection;
    groupIndex?: number;
    hidden: boolean;
    fractionalWidth: number;
    pixelWidth?: number;
}

/**
 * @internal
 *
 * Internal representation of a row in the table
 */
export interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
    selectionState: TableRowSelectionState;
    isGrouped: boolean;
    groupRowValue?: unknown;
    isExpanded: boolean;
    nestingLevel?: number;
    leafItemCount?: number;
    groupColumn?: TableColumn;
}
