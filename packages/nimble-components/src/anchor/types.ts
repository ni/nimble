import { ButtonAppearance } from '../patterns/button/types';

/**
 * Predefined anchor appearance states
 * @public
 */
export const AnchorAppearance = {
    text: 'text',
    inlineText: 'inline-text',
    ...ButtonAppearance
} as const;
export type AnchorAppearance =
    typeof AnchorAppearance[keyof typeof AnchorAppearance];

/**
 * Predefined anchor appearance-variant states
 * @public
 */
export const AnchorAppearanceVariant = {
    default: undefined,
    prominent: 'prominent',
    primary: 'primary'
} as const;
export type AnchorAppearanceVariant =
    typeof AnchorAppearanceVariant[keyof typeof AnchorAppearanceVariant];
