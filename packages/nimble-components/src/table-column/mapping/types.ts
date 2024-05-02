/**
 * Width mode for the mapping column
 */
export const TableColumnMappingWidthMode = {
    default: undefined,
    iconSize: 'icon-size'
} as const;
export type TableColumnMappingWidthMode =
    (typeof TableColumnMappingWidthMode)[keyof typeof TableColumnMappingWidthMode];
