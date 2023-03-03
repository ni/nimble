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
 * TableRecord describes the data structure that backs a single row in a table.
 * It is made up of fields, which are key/value pairs that have a key of type
 * TableFieldName and a value of type TableFieldValue.
 */
export interface TableRecord {
    [key: TableFieldName]: TableFieldValue;
}

export type TableStringField<FieldName extends TableFieldName> = {
    [name in FieldName]: string | null | undefined;
};

export interface TableValidity {
    readonly duplicateRecordId: boolean;
    readonly missingRecordId: boolean;
    readonly invalidRecordId: boolean;
    readonly duplicateColumnId: boolean;
    readonly missingColumnId: boolean;
    readonly duplicateSortIndex: boolean;
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
