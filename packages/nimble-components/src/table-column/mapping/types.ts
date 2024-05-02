/**
 * Width mode for the icon column
 */
export const TableColumnMappingWidthMode = {
    default: undefined,
    iconSize: 'icon-size'
} as const;
export type TableColumnMappingWidthMode =
    (typeof TableColumnMappingWidthMode)[keyof typeof TableColumnMappingWidthMode];
