export const SearchInputAppearance = {
    block: 'block',
    outline: 'outline',
    ghost: 'ghost',
    superGhost: 'super-ghost'
} as const;

export type SearchInputAppearance = (typeof SearchInputAppearance)[keyof typeof SearchInputAppearance];