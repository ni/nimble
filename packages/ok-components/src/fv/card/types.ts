export const FvCardAppearance = {
    outline: 'outline',
    block: 'block'
} as const;

export type FvCardAppearance =
    (typeof FvCardAppearance)[keyof typeof FvCardAppearance];

export const FvCardInteractionMode = {
    static: 'static',
    card: 'card'
} as const;

export type FvCardInteractionMode =
    (typeof FvCardInteractionMode)[keyof typeof FvCardInteractionMode];
