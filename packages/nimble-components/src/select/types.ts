export const SelectAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;
export type SelectAppearance =
    typeof SelectAppearance[keyof typeof SelectAppearance];
