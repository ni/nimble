export const FvSearchInputAppearance = {
    block: 'block',
    outline: 'outline',
    ghost: 'ghost',
    superGhost: 'super-ghost'
} as const;

export type FvSearchInputAppearance = (typeof FvSearchInputAppearance)[keyof typeof FvSearchInputAppearance];