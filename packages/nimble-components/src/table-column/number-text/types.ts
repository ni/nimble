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
