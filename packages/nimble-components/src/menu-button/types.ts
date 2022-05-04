/**
 * Types of menu button appearance.
 * @public
 */
export type { ButtonAppearanceAttribute } from '../patterns/button/types';
export { ButtonAppearance } from '../patterns/button/types';

export enum MenuButtonPosition {
    Above = 'above',
    Below = 'below',
    Auto = 'auto'
}
export type MenuButtonPositionAttribute = `${MenuButtonPosition}`;
