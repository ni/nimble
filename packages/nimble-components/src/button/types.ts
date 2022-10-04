/**
 * Types of button appearance.
 * @public
 */
import type { Button } from '@microsoft/fast-foundation';

export { ButtonAppearance } from '../patterns/button/types';
export type ButtonType = Button['type'];

/**
 * Types of button appearance variants.
 * @public
 */
export const ButtonAppearanceVariant = {
    default: undefined,
    primary: 'primary'
} as const;
export type ButtonAppearanceVariant =
    typeof ButtonAppearanceVariant[keyof typeof ButtonAppearanceVariant];
