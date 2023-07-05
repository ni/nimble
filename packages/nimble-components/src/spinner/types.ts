/**
 * Types of spinner appearance.
 * @public
 */
export const SpinnerAppearance = {
    default: undefined,
    accent: 'accent'
} as const;
export type SpinnerAppearance =
    (typeof SpinnerAppearance)[keyof typeof SpinnerAppearance];
