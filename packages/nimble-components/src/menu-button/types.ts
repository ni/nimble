/**
 * Types of menu button appearance.
 * @public
 */
export { ButtonAppearance } from '../patterns/button/types';

/**
 * The options of where to position the menu relative to the menu button.
 */
export const MenuButtonPosition = {
    above: 'above',
    below: 'below',
    auto: 'auto'
} as const;
export type MenuButtonPosition =
    (typeof MenuButtonPosition)[keyof typeof MenuButtonPosition];
