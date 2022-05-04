/**
 * Types of menu button appearance.
 * @public
 */
export type { ButtonAppearanceAttribute } from '../patterns/button/types';
export { ButtonAppearance } from '../patterns/button/types';

/**
 * The options of where to position the menu relative to the menu button.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MenuButtonMenuPosition = {
    above: 'above',
    below: 'below',
    auto: 'auto'
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MenuButtonMenuPosition =
    typeof MenuButtonMenuPosition[keyof typeof MenuButtonMenuPosition];
