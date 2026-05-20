export const FvSplitButtonAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;

export type FvSplitButtonAppearance = (typeof FvSplitButtonAppearance)[keyof typeof FvSplitButtonAppearance];

export const FvSplitButtonAppearanceVariant = {
    default: 'default',
    primary: 'primary',
    accent: 'accent'
} as const;

export type FvSplitButtonAppearanceVariant = (typeof FvSplitButtonAppearanceVariant)[keyof typeof FvSplitButtonAppearanceVariant];