/**
 * Interface for buttons that support appearance variants.
 */
export interface SpinnerAppearancePattern {
    /**
     * The appearance variant the button should have.
     */
    appearance: SpinnerAppearance;
}

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