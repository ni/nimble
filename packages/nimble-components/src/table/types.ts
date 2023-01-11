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

export type StringField<FieldName extends string> = {
    [name in FieldName]: string | null | undefined;
};

export interface TableCellState<
    TCellRecord extends TableRecord,
    TColumnConfig = unknown
> {
    data: TCellRecord;
    columnConfig: TColumnConfig;
}
