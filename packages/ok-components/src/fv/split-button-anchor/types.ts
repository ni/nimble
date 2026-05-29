export const FvSplitButtonAnchorAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;

export type FvSplitButtonAnchorAppearance = (typeof FvSplitButtonAnchorAppearance)[keyof typeof FvSplitButtonAnchorAppearance];

export const FvSplitButtonAnchorAppearanceVariant = {
    default: 'default',
    primary: 'primary',
    accent: 'accent'
} as const;

export type FvSplitButtonAnchorAppearanceVariant = (typeof FvSplitButtonAnchorAppearanceVariant)[keyof typeof FvSplitButtonAnchorAppearanceVariant];