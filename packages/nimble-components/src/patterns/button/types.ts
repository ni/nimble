/**
 * The interface that buttons of various types implement
 */
export interface IButton {
    appearance: ButtonAppearance;
    contentHidden: boolean;
    disabled: boolean;
}

/**
 * Types of button appearance.
 * @public
 */
export enum ButtonAppearance {
    Outline = 'outline',
    Ghost = 'ghost',
    Block = 'block'
}
export type ButtonAppearanceAttribute = `${ButtonAppearance}`;
