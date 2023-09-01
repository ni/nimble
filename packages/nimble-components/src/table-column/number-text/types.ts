/**
 * Formatting scheme for the number-text table column
 */
export const NumberTextFormat = {
    default: undefined,
    roundToInteger: 'round-to-integer',
    decimal: 'decimal'
} as const;
export type NumberTextFormat =
    (typeof NumberTextFormat)[keyof typeof NumberTextFormat];

/**
 * The aligment of the value in the number-text table column.
 * The `default` alignment is determined by the column's `NumberTextFormat`.
 */
export const NumberTextAlignment = {
    default: undefined,
    left: 'left',
    right: 'right'
} as const;
export type NumberTextAlignment =
    (typeof NumberTextAlignment)[keyof typeof NumberTextAlignment];
