/**
 * The interface that buttons of various types implement. The properties in this interface
 * are leveraged by the shared button pattern css.
 */
export interface ButtonPattern {
    /**
     * The appearance the button should have.
     */
    appearance: ButtonAppearance;

    /**
     * Specify as 'true' to hide the text content of the button. The button will
     * become square, and the text content will be used as the label of the button
     * for accessibility purposes.
     */
    contentHidden: boolean;

    /**
     * Whether or not the button is disabled.
     */
    disabled: boolean;
}

/**
 * Types of button appearance.
 * @public
 */
export const ButtonAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;
export type ButtonAppearance =
    typeof ButtonAppearance[keyof typeof ButtonAppearance];
