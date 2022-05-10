/**
 * Types of menu button appearance.
 * @public
 */
export { ButtonAppearance } from '../patterns/button/types';

/**
 * The options of where to position the menu relative to the menu button.
 */
export const MenuButtonPosition = {
    Above: 'above',
    Below: 'below',
    Auto: 'auto'
} as const;
export type MenuButtonPosition =
    typeof MenuButtonPosition[keyof typeof MenuButtonPosition];
