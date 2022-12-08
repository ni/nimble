// TableDataValue describes the supported value types for values
// within the data given to a table.
export type TableDataValue =
    | string
    | number
    | boolean
    | Date
    | null
    | undefined;

// TableRowData describes the data structure for a single row in a table.
export interface TableRowData {
    [key: string]: TableDataValue;
}
