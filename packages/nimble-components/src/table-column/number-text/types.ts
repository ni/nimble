/**
 * Formatting scheme for the number-text table column
 */
export const NumberTextFormat = {
    default: undefined,
    integer: 'integer'
} as const;
export type NumberTextFormat =
    (typeof NumberTextFormat)[keyof typeof NumberTextFormat];
