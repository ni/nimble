/**
 * TableFieldName describes the type associated with keys within
 * a table's records.
 */
export type TableFieldName = string;

/**
 * TableFieldValue describes the type associated with values within
 * a table's records.
 */
export type TableFieldValue =
    | string
    | number
    | boolean
    | Date
    | null
    | undefined;

/**
 * TableRecord describes the data structure that backs a single row in a table.
 * It is made up of fields, which are key/value pairs that have a key of type
 * TableFieldName and a value of type TableFieldValue.
 */
export interface TableRecord {
    [key: TableFieldName]: TableFieldValue;
}

/** Represents a single row (element) in the Table's data  */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableDataRecord extends TableRecord {}

/**
 * An object whose fields are defined by a particular TableColumn, which is used by the column's
 * cellTemplate implementation.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableCellRecord extends TableRecord {}

export type TableStringField<FieldName extends TableFieldName> = {
    [name in FieldName]: string | null | undefined;
};

export interface TableCellState<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
> {
    cellRecord: TCellRecord;
    columnConfig: TColumnConfig;
}

export interface TableValidity {
    readonly duplicateRecordId: boolean;
    readonly missingRecordId: boolean;
    readonly invalidRecordId: boolean;
}

export interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
}
