/**
 * Formatting scheme for the number-text table column
 */
export const NumberTextFormat = {
    default: undefined,
    integer: 'integer'
} as const;
export type NumberTextFormat =
    (typeof NumberTextFormat)[keyof typeof NumberTextFormat];

/**
 * @internal
 *
 * The number of digits to display in the number-text column when the format is `default`.
 * */
export const defaultNumberOfDigits = 6;

/**
 * @internal
 *
 * When the format is `default`, the lower magnitude cutoff for values the number-text column
 * before formatting them in exponential notation.
 * */
export const defaultExponentialLowerBound = 10 ** -defaultNumberOfDigits;

/**
 * @internal
 *
 * When the format is `default`, the upper magnitude cutoff for values the number-text column
 * before formatting them in exponential notation.
 * */
export const defaultExponentialUpperBound = 10 ** defaultNumberOfDigits;
