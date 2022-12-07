export type TableDataValue =
    | string
    | number
    | boolean
    | Date
    | null
    | undefined;

export interface TableData {
    [key: string]: TableDataValue;
}
