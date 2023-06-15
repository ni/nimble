/**
 * Number text table column format options
 * @public
 */
export const TableNumberTextFormat = {
    default: undefined,
    intl: 'custom'
} as const;
export type TableNumberTextFormat = (typeof TableNumberTextFormat)[keyof typeof TableNumberTextFormat];
