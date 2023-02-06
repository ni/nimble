/**
 * Anchor appearance states
 * @public
 */
export const AnchorAppearance = {
    default: undefined,
    prominent: 'prominent'
} as const;
export type AnchorAppearance =
    typeof AnchorAppearance[keyof typeof AnchorAppearance];
