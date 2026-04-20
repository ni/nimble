export const FvSearchInputAppearance = {
    block: 'block',
    outline: 'outline',
    underline: 'underline',
    frameless: 'frameless'
} as const;

export type FvSearchInputAppearance = (typeof FvSearchInputAppearance)[keyof typeof FvSearchInputAppearance];